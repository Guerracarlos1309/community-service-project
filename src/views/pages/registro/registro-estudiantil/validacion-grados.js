"use client"

import { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
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

export default function ValidacionGrados({ student, tipoInscripcion, onHistoryCompleted, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [hasPreviousStudies, setHasPreviousStudies] = useState(null)
  const [academicHistory, setAcademicHistory] = useState([])
  const [currentHistory, setCurrentHistory] = useState({
    academicPeriodID: 0,
    gradeID: 0,
    institutionName: "",
    gradeAchieved: 0,
    isApproved: true,
  })

  // Datos simulados de grados y períodos (en producción vendrían del backend)
  const grades = [
    { id: 1, name: "Preescolar" },
    { id: 2, name: "1er Grado" },
    { id: 3, name: "2do Grado" },
    { id: 4, name: "3er Grado" },
    { id: 5, name: "4to Grado" },
    { id: 6, name: "5to Grado" },
    { id: 7, name: "6to Grado" },
  ]

  const academicPeriods = [
    { id: 1, name: "2020-2021" },
    { id: 2, name: "2021-2022" },
    { id: 3, name: "2022-2023" },
    { id: 4, name: "2023-2024" },
    { id: 5, name: "2024-2025" },
  ]

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
      gradeAchieved: 0,
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
        const response = await fetch("http://3001/api/students/registry/academicHistory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            studentID: student.id,
            ...history,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al guardar el historial académico")
        }
      }

      setSuccess("Historial académico guardado exitosamente")
      setTimeout(() => {
        onHistoryCompleted(academicHistory.length > 0)
      }, 1500)
    } catch (err) {
      setError("Error al guardar el historial académico")
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
        return "Validación de Estudios Previos - Reintegro"
      case "regular":
        return "Validación de Estudios Previos - Estudiante Regular"
      default:
        return "Validación de Estudios Previos"
    }
  }

  const getDescription = () => {
    switch (tipoInscripcion) {
      case "nuevo":
        return "¿El estudiante ha cursado años escolares anteriormente en otra institución?"
      case "reintegro":
        return "Registre los años escolares que cursó el estudiante antes de su reintegro"
      case "regular":
        return "Verifique si hay años escolares adicionales que registrar para este estudiante"
      default:
        return "Información sobre estudios previos"
    }
  }

  return (
    <CContainer>
      <div className="mb-4">
        <h2 className="text-center">{getTitle()}</h2>
        <p className="text-center text-muted">{getDescription()}</p>
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
          {hasPreviousStudies === null && (
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

          {hasPreviousStudies === false && (
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

          {hasPreviousStudies === true && (
            <>
              <CAlert color="warning">
                <h5>Registrar Historial Académico</h5>
                <p>Complete la información de los años escolares cursados anteriormente.</p>
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
                          {grades.map((grade) => (
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
                        <CFormInput
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          value={currentHistory.gradeAchieved}
                          onChange={(e) =>
                            setCurrentHistory((prev) => ({
                              ...prev,
                              gradeAchieved: Number.parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormCheck
                          checked={currentHistory.isApproved}
                          onChange={(e) =>
                            setCurrentHistory((prev) => ({
                              ...prev,
                              isApproved: e.target.checked,
                            }))
                          }
                          label="Año Aprobado"
                        />
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
                  <CButton color="warning" className="me-2" onClick={() => setHasPreviousStudies(null)}>
                    Cambiar Respuesta
                  </CButton>
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
  )
}
