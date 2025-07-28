"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilEducation, cilPlus, cilTrash } from "@coreui/icons"
import { helpFetch } from "../../../../api/helpFetch"

export default function ValidacionGrados({ student, tipoInscripcion, onHistoryCompleted, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [grades, setGrades] = useState([])
  const [academicPeriods, setAcademicPeriods] = useState([])
  const [availableGrades, setAvailableGrades] = useState([])
  const [studentEnrollmentHistory, setStudentEnrollmentHistory] = useState([])

  const [hasPreviousStudies, setHasPreviousStudies] = useState(null)
  const [academicHistory, setAcademicHistory] = useState([])
  const [currentHistory, setCurrentHistory] = useState({
    academicPeriodID: 0,
    gradeID: 0,
    institutionName: "",
    gradeAchieved: "A", // Cambiar de 0 a "A"
    isApproved: true,
  })

  const api = helpFetch()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Cargar grados disponibles
      const gradesData = await api.get("/api/matriculas/grades")
      if (gradesData && gradesData.ok) {
        setGrades(gradesData.grades)
        setAvailableGrades(gradesData.grades)
      }

      // Cargar períodos académicos
      const periodsData = await api.get("/api/matriculas/academic-periods")
      if (periodsData && periodsData.ok) {
        setAcademicPeriods(periodsData.periods)
      }

      // Para reintegro: obtener historial de enrollment del estudiante
      if (tipoInscripcion === "reintegro" && student) {
        try {
          // Obtener último registro académico para determinar grados disponibles
          const lastRecordData = await api.get(`/api/matriculas/history/last/${student.id}`)
          if (lastRecordData && lastRecordData.ok) {
            const maxGradeInInstitution = lastRecordData.record.gradeID

            // Filtrar grados disponibles (solo superiores al máximo cursado)
            const filteredGrades = gradesData.grades.filter((grade) => grade.id > maxGradeInInstitution)
            setAvailableGrades(filteredGrades)
          }
        } catch (err) {
          // Si no se encuentra historial, mostrar todos los grados
          setAvailableGrades(gradesData.grades)
        }
      }
    } catch (err) {
      setError("Error al cargar los datos iniciales")
    } finally {
      setLoading(false)
    }
  }

  const addHistoryRecord = () => {
    if (!currentHistory.gradeID || !currentHistory.institutionName || !currentHistory.academicPeriodID) {
      setError("Complete todos los campos del registro académico")
      return
    }

    setAcademicHistory((prev) => [...prev, { ...currentHistory }])
    setCurrentHistory({
      academicPeriodID: 0,
      gradeID: 0,
      institutionName: "",
      gradeAchieved: "A",
      isApproved: true,
    })
    setError(null)
  }

  const removeHistoryRecord = (index) => {
    setAcademicHistory((prev) => prev.filter((_, i) => i !== index))
  }

  const saveAcademicHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      // Guardar cada registro del historial académico
      for (const history of academicHistory) {
        const data = await api.post("/api/students/registry/academicHistory", {
          body: {
            studentID: student.id,
            ...history,
          },
        })

        if (!data || !data.ok) {
          throw new Error("Error al guardar el historial académico")
        }
      }

      setSuccess("Historial académico guardado exitosamente")
      setTimeout(() => {
        onHistoryCompleted(academicHistory.length > 0)
      }, 1500)
    } catch (err) {
      setError(err.msg || "Error al guardar el historial académico")
    } finally {
      setLoading(false)
    }
  }

  const handleContinueWithoutHistory = () => {
    onHistoryCompleted(false)
  }

  const getTitle = () => {
    switch (tipoInscripcion) {
      case "nuevo":
        return "Validación de Estudios Previos - Nuevo Ingreso"
      case "reintegro":
        return "Historial Académico - Reintegro"
      default:
        return "Validación de Estudios Previos"
    }
  }

  const getDescription = () => {
    switch (tipoInscripcion) {
      case "nuevo":
        return "¿El estudiante ha cursado años escolares anteriormente en otra institución?"
      case "reintegro":
        return "Registre los años escolares que cursó el estudiante fuera de la institución"
      default:
        return "Información sobre estudios previos"
    }
  }

  return (
    <div className="min-vh-100 bg-dark py-4">
      <CContainer>
        <div className="mb-4">
          <h2 className="text-center text-white">{getTitle()}</h2>
          <p className="text-center text-light">{getDescription()}</p>
        </div>

        {error && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}
        {success && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </CAlert>
        )}

        <CCard>
          <CCardHeader>
            <h4>
              <CIcon icon={cilEducation} className="me-2" />
              Estudiante: {student.name} {student.lastName}
            </h4>
          </CCardHeader>
          <CCardBody>
            {/* Para nuevo ingreso: pregunta si tiene estudios previos */}
            {tipoInscripcion === "nuevo" && hasPreviousStudies === null && (
              <div className="text-center">
                <h5 className="mb-4">{getDescription()}</h5>
                <div className="d-flex justify-content-center gap-3">
                  <CButton color="success" size="lg" onClick={() => setHasPreviousStudies(true)}>
                    Sí, tiene estudios previos
                  </CButton>
                  <CButton color="info" size="lg" onClick={() => setHasPreviousStudies(false)}>
                    No, no tiene estudios previos
                  </CButton>
                </div>
              </div>
            )}

            {/* Para nuevo ingreso sin estudios previos */}
            {tipoInscripcion === "nuevo" && hasPreviousStudies === false && (
              <div className="text-center">
                <CAlert color="info">
                  <h5>Sin Estudios Previos</h5>
                  <p>El estudiante no tiene estudios previos registrados. Puede continuar con la inscripción.</p>
                </CAlert>
                <div className="d-flex justify-content-between">
                  <CButton color="secondary" onClick={onBack}>
                    Volver
                  </CButton>
                  <CButton color="primary" onClick={handleContinueWithoutHistory}>
                    Continuar con la Inscripción
                  </CButton>
                </div>
              </div>
            )}

            {/* Para nuevo ingreso con estudios previos O para reintegro */}
            {((tipoInscripcion === "nuevo" && hasPreviousStudies === true) || tipoInscripcion === "reintegro") && (
              <>
                <CAlert color="warning">
                  <h5>Registrar Historial Académico</h5>
                  <p>
                    {tipoInscripcion === "reintegro"
                      ? "Complete la información de los años escolares cursados fuera de la institución."
                      : "Complete la información de los años escolares cursados anteriormente."}
                  </p>
                  {tipoInscripcion === "reintegro" && (
                    <small className="text-info">
                      <strong>Nota:</strong> Solo puede registrar grados superiores a los ya cursados en esta
                      institución.
                    </small>
                  )}
                </CAlert>

                <CCard className="mb-4">
                  <CCardHeader>
                    <h5>Agregar Registro Académico</h5>
                  </CCardHeader>
                  <CCardBody>
                    <CForm>
                      <CRow className="mb-3">
                        <CCol md={3}>
                          <CFormLabel>Período Académico</CFormLabel>
                          <CFormSelect
                            value={currentHistory.academicPeriodID}
                            onChange={(e) =>
                              setCurrentHistory((prev) => ({
                                ...prev,
                                academicPeriodID: Number.parseInt(e.target.value),
                              }))
                            }
                          >
                            <option value={0}>Seleccionar...</option>
                            {academicPeriods.map((period) => (
                              <option key={period.id} value={period.id}>
                                {period.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel>Grado Cursado</CFormLabel>
                          <CFormSelect
                            value={currentHistory.gradeID}
                            onChange={(e) =>
                              setCurrentHistory((prev) => ({
                                ...prev,
                                gradeID: Number.parseInt(e.target.value),
                              }))
                            }
                          >
                            <option value={0}>Seleccionar...</option>
                            {availableGrades.map((grade) => (
                              <option key={grade.id} value={grade.id}>
                                {grade.name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                        <CCol md={4}>
                          <CFormLabel>Institución</CFormLabel>
                          <CFormInput
                            value={currentHistory.institutionName}
                            onChange={(e) =>
                              setCurrentHistory((prev) => ({
                                ...prev,
                                institutionName: e.target.value,
                              }))
                            }
                            placeholder="Nombre de la institución"
                          />
                        </CCol>
                        <CCol md={2}>
                          <CFormLabel>Nota Final</CFormLabel>
                          <CFormSelect
                            value={currentHistory.gradeAchieved}
                            onChange={(e) =>
                              setCurrentHistory((prev) => ({
                                ...prev,
                                gradeAchieved: e.target.value,
                                isApproved: !["E", "F"].includes(e.target.value), // Auto-determinar aprobado
                              }))
                            }
                          >
                            <option value="A">A (Excelente)</option>
                            <option value="B">B (Muy Bueno)</option>
                            <option value="C">C (Bueno)</option>
                            <option value="D">D (Regular)</option>
                            <option value="E">E (Deficiente)</option>
                            <option value="F">F (Muy Deficiente)</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <small className="text-muted">
                            Estado: <strong>{currentHistory.isApproved ? "Aprobado" : "Reprobado"}</strong>
                            {!currentHistory.isApproved && " (Notas E y F son reprobatorias)"}
                          </small>
                        </CCol>
                        <CCol md={6} className="text-end">
                          <CButton color="success" onClick={addHistoryRecord}>
                            <CIcon icon={cilPlus} className="me-1" />
                            Agregar Registro
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>

                {academicHistory.length > 0 && (
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h5>Historial Académico Registrado</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CTable striped hover>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Período</CTableHeaderCell>
                            <CTableHeaderCell>Grado</CTableHeaderCell>
                            <CTableHeaderCell>Institución</CTableHeaderCell>
                            <CTableHeaderCell>Nota</CTableHeaderCell>
                            <CTableHeaderCell>Estado</CTableHeaderCell>
                            <CTableHeaderCell>Acciones</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {academicHistory.map((record, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>
                                {academicPeriods.find((p) => p.id === record.academicPeriodID)?.name}
                              </CTableDataCell>
                              <CTableDataCell>{grades.find((g) => g.id === record.gradeID)?.name}</CTableDataCell>
                              <CTableDataCell>{record.institutionName}</CTableDataCell>
                              <CTableDataCell>{record.gradeAchieved}</CTableDataCell>
                              <CTableDataCell>
                                <span className={`badge bg-${record.isApproved ? "success" : "danger"}`}>
                                  {record.isApproved ? "Aprobado" : "Reprobado"}
                                </span>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CButton color="danger" size="sm" onClick={() => removeHistoryRecord(index)}>
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                )}

                <div className="d-flex justify-content-between">
                  <CButton color="secondary" onClick={onBack}>
                    Volver
                  </CButton>
                  <div>
                    {tipoInscripcion === "nuevo" && (
                      <CButton color="warning" className="me-2" onClick={() => setHasPreviousStudies(null)}>
                        Cambiar Respuesta
                      </CButton>
                    )}
                    <CButton
                      color="primary"
                      onClick={saveAcademicHistory}
                      disabled={loading || academicHistory.length === 0}
                    >
                      {loading ? <CSpinner size="sm" /> : null}
                      {loading ? " Guardando..." : "Continuar con la Inscripción"}
                    </CButton>
                  </div>
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
