"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
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
  CBadge,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilSchool, cilCheckCircle } from "@coreui/icons"
import { helpFetch } from "../../../../api/helpFetch"

export default function InscripcionPeriodo({
  student,
  tipoInscripcion,
  hasAcademicHistory,
  onInscriptionCompleted,
  onBack,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [currentPeriod, setCurrentPeriod] = useState(null)
  const [grades, setGrades] = useState([])
  const [suggestedGrade, setSuggestedGrade] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)

  // Datos completos de inscripción según el modelo
  const [inscriptionData, setInscriptionData] = useState({
    studentCi: student.ci,
    sectionID: 0,
    brigadeTeacherDateID: null,
    repeater: false,
    chemiseSize: "",
    pantsSize: "",
    shoesSize: "",
    weight: 0,
    stature: 0,
    diseases: "",
    observation: "",
    birthCertificateCheck: false,
    vaccinationCardCheck: false,
    studentPhotosCheck: false,
    representativePhotosCheck: false,
    representativeCopyIDCheck: false,
    representativeRIFCheck: false,
    autorizedCopyIDCheck: false,
  })

  const api = helpFetch()

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedGrade && currentPeriod) {
      loadSections(selectedGrade, currentPeriod.id)
    }
  }, [selectedGrade, currentPeriod])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Cargar período actual
      const periodData = await api.get("/api/matriculas/academic-periods/current")
      if (periodData && periodData.ok) {
        setCurrentPeriod(periodData.period)
      }

      // Cargar grados disponibles
      const gradesData = await api.get("/api/matriculas/grades")
      if (gradesData && gradesData.ok) {
        setGrades(gradesData.grades)
      }

      // Determinar grado y estado de repitiente automáticamente
      await determineGradeAndRepeaterStatus()
    } catch (err) {
      setError("Error al cargar los datos iniciales")
    } finally {
      setLoading(false)
    }
  }

  const determineGradeAndRepeaterStatus = async () => {
    try {
      const recordData = await api.get(`/api/matriculas/history/last/${student.id}`)

      if (recordData && recordData.ok) {
        const lastRecord = recordData.record
        const lastGrade = lastRecord.gradeAchieved
        const lastGradeId = lastRecord.gradeID

        // Determinar si es repitiente basado en la nota
        const isRepeater = ["E", "F"].includes(lastGrade)

        // Determinar el grado a inscribir
        const nextGradeId = isRepeater ? lastGradeId : lastGradeId + 1

        // Actualizar estados
        setSuggestedGrade(nextGradeId)
        setSelectedGrade(nextGradeId)
        setInscriptionData((prev) => ({
          ...prev,
          repeater: isRepeater,
        }))

        console.log(`Estudiante: ${student.name} ${student.lastName}`)
        console.log(`Última nota: ${lastGrade} en grado ${lastGradeId}`)
        console.log(`Próximo grado: ${nextGradeId}, Repitiente: ${isRepeater}`)
      } else {
        // Si no hay historial, es primer grado y no repitiente
        setSuggestedGrade(1)
        setSelectedGrade(1)
        setInscriptionData((prev) => ({
          ...prev,
          repeater: false,
        }))
      }
    } catch (err) {
      // Si no hay historial, es primer grado y no repitiente
      setSuggestedGrade(1)
      setSelectedGrade(1)
      setInscriptionData((prev) => ({
        ...prev,
        repeater: false,
      }))
    }
  }

  const loadSections = async (gradeId, periodId) => {
    try {
      const data = await api.get(`/api/matriculas/sections/${gradeId}?periodId=${periodId}`)
      if (data && data.ok) {
        setSections(data.sections)
      }
    } catch (err) {
      setError("Error al cargar las secciones")
    }
  }

  const handleInscription = async () => {
    if (!selectedSection) {
      setError("Debe seleccionar una sección")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await api.post("/api/matriculas/inscription", {
        body: {
          ...inscriptionData,
          sectionID: selectedSection,
        },
      })

      if (data && data.ok) {
        setSuccess("¡Inscripción realizada exitosamente!")
        setTimeout(() => {
          onInscriptionCompleted()
        }, 2000)
      } else {
        setError(data.msg || "Error al realizar la inscripción")
      }
    } catch (err) {
      setError(err.msg || "Error al realizar la inscripción")
    } finally {
      setLoading(false)
    }
  }

  const getSizeOptions = () => ["4", "6", "8", "10", "12", "14", "16", "S", "M", "L", "XL"]

  const getShoeSizeOptions = () => [
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
  ]

  const getTipoTitle = () => {
    switch (tipoInscripcion) {
      case "nuevo":
        return "Nuevo Ingreso"
      case "reintegro":
        return "Reintegro"
      case "regular":
        return "Estudiante Regular"
      default:
        return ""
    }
  }

  return (
    <div className="min-vh-100 bg-dark py-4">
      <CContainer>
        <div className="mb-4">
          <h2 className="text-center text-white">Inscripción en el Período Actual - {getTipoTitle()}</h2>
          <p className="text-center text-light">Período Académico: {currentPeriod?.name || "Cargando..."}</p>
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

        <CCard className="mb-4">
          <CCardHeader>
            <h4>
              <CIcon icon={cilSchool} className="me-2" />
              Estudiante: {student.name} {student.lastName}
            </h4>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Grado Asignado Automáticamente</CFormLabel>
                <CFormInput
                  value={selectedGrade ? grades.find((g) => g.id === selectedGrade)?.name || "" : ""}
                  disabled
                  className="bg-light"
                />
                <small className="text-muted">
                  {inscriptionData.repeater
                    ? "⚠️ Estudiante repitiente (nota anterior E o F)"
                    : "✅ Promoción al siguiente grado"}
                </small>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Sección</CFormLabel>
                <CFormSelect
                  value={selectedSection || ""}
                  onChange={(e) => setSelectedSection(Number.parseInt(e.target.value))}
                  disabled={!selectedGrade}
                >
                  <option value="">Seleccionar sección...</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      Sección {section.seccion} -{" "}
                      {section.teacher_name
                        ? `${section.teacher_name} ${section.teacher_lastName}`
                        : "Sin docente asignado"}
                      ({section.student_count} estudiantes)
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {sections.length > 0 && (
              <CTable striped hover className="mb-4">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sección</CTableHeaderCell>
                    <CTableHeaderCell>Docente</CTableHeaderCell>
                    <CTableHeaderCell>Estudiantes</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sections.map((section) => (
                    <CTableRow key={section.id} className={selectedSection === section.id ? "table-active" : ""}>
                      <CTableDataCell>
                        <strong>Sección {section.seccion}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {section.teacher_name ? (
                          `${section.teacher_name} ${section.teacher_lastName}`
                        ) : (
                          <span className="text-muted">Sin asignar</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={section.student_count > 25 ? "warning" : "info"}>
                          {section.student_count} estudiantes
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={section.student_count > 30 ? "danger" : "success"}>
                          {section.student_count > 30 ? "Llena" : "Disponible"}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <h5>Información Física del Estudiante</h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={2}>
                <CFormLabel>Peso (kg)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.1"
                  value={inscriptionData.weight}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      weight: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel>Estatura (m)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.01"
                  value={inscriptionData.stature}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      stature: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel>Talla Camisa</CFormLabel>
                <CFormSelect
                  value={inscriptionData.chemiseSize}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      chemiseSize: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar...</option>
                  {getSizeOptions().map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel>Talla Pantalón</CFormLabel>
                <CFormSelect
                  value={inscriptionData.pantsSize}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      pantsSize: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar...</option>
                  {getSizeOptions().map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel>Talla Zapato</CFormLabel>
                <CFormSelect
                  value={inscriptionData.shoesSize}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      shoesSize: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar...</option>
                  {getShoeSizeOptions().map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel>Estado Académico</CFormLabel>
                <CFormInput
                  value={inscriptionData.repeater ? "Repitiente" : "Regular"}
                  disabled
                  className={`bg-light text-${inscriptionData.repeater ? "warning" : "success"}`}
                />
                <small className="text-muted">Determinado automáticamente</small>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Enfermedades</CFormLabel>
                <CFormInput
                  value={inscriptionData.diseases}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      diseases: e.target.value,
                    }))
                  }
                  placeholder="Indique si padece alguna enfermedad"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Observaciones</CFormLabel>
                <CFormInput
                  value={inscriptionData.observation}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      observation: e.target.value,
                    }))
                  }
                  placeholder="Observaciones adicionales"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <h5>Requisitos de Inscripción</h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <CFormCheck
                  checked={inscriptionData.birthCertificateCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      birthCertificateCheck: e.target.checked,
                    }))
                  }
                  label="Acta de Nacimiento"
                  className="mb-2"
                />
                <CFormCheck
                  checked={inscriptionData.vaccinationCardCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      vaccinationCardCheck: e.target.checked,
                    }))
                  }
                  label="Tarjeta de Vacunas"
                  className="mb-2"
                />
                <CFormCheck
                  checked={inscriptionData.studentPhotosCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      studentPhotosCheck: e.target.checked,
                    }))
                  }
                  label="Fotos del Estudiante"
                  className="mb-2"
                />
                <CFormCheck
                  checked={inscriptionData.representativePhotosCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      representativePhotosCheck: e.target.checked,
                    }))
                  }
                  label="Fotos del Representante"
                  className="mb-2"
                />
              </CCol>
              <CCol md={6}>
                <CFormCheck
                  checked={inscriptionData.representativeCopyIDCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      representativeCopyIDCheck: e.target.checked,
                    }))
                  }
                  label="Copia de Cédula del Representante"
                  className="mb-2"
                />
                <CFormCheck
                  checked={inscriptionData.representativeRIFCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      representativeRIFCheck: e.target.checked,
                    }))
                  }
                  label="RIF del Representante"
                  className="mb-2"
                />
                <CFormCheck
                  checked={inscriptionData.autorizedCopyIDCheck}
                  onChange={(e) =>
                    setInscriptionData((prev) => ({
                      ...prev,
                      autorizedCopyIDCheck: e.target.checked,
                    }))
                  }
                  label="Copia de Cédula de Personas Autorizadas"
                  className="mb-2"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <div className="d-flex justify-content-between">
          <CButton color="secondary" onClick={onBack}>
            Volver
          </CButton>
          <CButton color="success" size="lg" onClick={handleInscription} disabled={loading || !selectedSection}>
            {loading ? <CSpinner size="sm" /> : <CIcon icon={cilCheckCircle} />}
            {loading ? " Procesando..." : " Completar Inscripción"}
          </CButton>
        </div>
      </CContainer>
    </div>
  )
}
