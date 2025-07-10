"use client"

import { useState, useEffect, useRef } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CContainer,
  CSpinner,
  CAlert,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilSchool, cilSearch, cilCheckCircle, cilWarning, cilPlus, cilPencil } from "@coreui/icons"
import { helpFetch } from "../../../api/helpFetch.js"

const api = helpFetch()

const InscripcionEscolar = () => {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const toasterRef = useRef()

  // Estados para datos
  const [registeredStudents, setRegisteredStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [sections, setSections] = useState([])
  const [teachers, setTeachers] = useState([])

  // Estados para formulario
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showInscriptionModal, setShowInscriptionModal] = useState(false)
  const [showTeacherModal, setShowTeacherModal] = useState(false)

  const [inscriptionForm, setInscriptionForm] = useState({
    studentCi: "",
    sectionID: "",
    brigadeTeacherDateID: null,
    repeater: false,
    chemiseSize: "",
    pantsSize: "",
    shoesSize: "",
    weight: "",
    stature: "",
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

  const [teacherForm, setTeacherForm] = useState({
    sectionId: "",
    teacherId: "",
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (inscriptionForm.gradeId) {
      loadSectionsByGrade(inscriptionForm.gradeId)
    }
  }, [inscriptionForm.gradeId])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando datos iniciales...")

      const [studentsResponse, gradesResponse, teachersResponse] = await Promise.all([
        api.get("/api/student/registered"),
        api.get("/api/matriculas/grades"),
        api.get("/api/matriculas/teachers"),
      ])

      if (!studentsResponse.error) {
        setRegisteredStudents(studentsResponse.students || [])
      }

      if (!gradesResponse.error) {
        setGrades(gradesResponse.grades || [])
      }

      if (!teachersResponse.error) {
        setTeachers(teachersResponse.teachers || [])
      }

      console.log("✅ Datos iniciales cargados")
    } catch (error) {
      console.error("❌ Error cargando datos iniciales:", error)
      showToast("Error al cargar los datos iniciales", "danger")
    } finally {
      setLoading(false)
    }
  }

  const loadSectionsByGrade = async (gradeId) => {
    try {
      console.log("🔄 Cargando secciones para grado:", gradeId)

      const response = await api.get(`/api/matriculas/sections/${gradeId}`)

      if (!response.error) {
        setSections(response.sections || [])
      }
    } catch (error) {
      console.error("❌ Error cargando secciones:", error)
      showToast("Error al cargar las secciones", "danger")
    }
  }

  const showToast = (message, color = "success") => {
    const toast = (
      <CToast autohide delay={3000}>
        <CToastHeader closeButton>
          <CIcon icon={color === "success" ? cilCheckCircle : cilWarning} className="me-2" />
          <strong className="me-auto">{color === "success" ? "Éxito" : "Error"}</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )

    if (toasterRef.current) {
      toasterRef.current.addToast(toast)
    }
  }

  const handleInscribeStudent = (student) => {
    setSelectedStudent(student)
    setInscriptionForm({
      studentCi: student.ci,
      sectionID: "",
      brigadeTeacherDateID: null,
      repeater: false,
      chemiseSize: "",
      pantsSize: "",
      shoesSize: "",
      weight: "",
      stature: "",
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
    setShowInscriptionModal(true)
  }

  const handleSubmitInscription = async () => {
    try {
      setSubmitting(true)
      console.log("📚 Creando inscripción:", inscriptionForm)

      const response = await api.post("/api/matriculas/inscription", {
        body: inscriptionForm,
      })

      if (!response.error) {
        showToast("Estudiante inscrito exitosamente")
        setShowInscriptionModal(false)
        loadInitialData() // Recargar datos
      } else {
        showToast(response.msg || "Error al inscribir el estudiante", "danger")
      }
    } catch (error) {
      console.error("❌ Error en inscripción:", error)
      showToast("Error al inscribir el estudiante", "danger")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssignTeacher = async () => {
    try {
      setSubmitting(true)
      console.log("👨‍🏫 Asignando docente:", teacherForm)

      const response = await api.post("/api/matriculas/assign-teacher", {
        body: teacherForm,
      })

      if (!response.error) {
        showToast("Docente asignado exitosamente")
        setShowTeacherModal(false)
        if (inscriptionForm.gradeId) {
          loadSectionsByGrade(inscriptionForm.gradeId)
        }
      } else {
        showToast(response.msg || "Error al asignar el docente", "danger")
      }
    } catch (error) {
      console.error("❌ Error asignando docente:", error)
      showToast("Error al asignar el docente", "danger")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredStudents = registeredStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.ci.includes(searchTerm),
  )

  if (loading) {
    return (
      <CContainer>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <CSpinner color="primary" size="lg" />
          <span className="ms-2">Cargando datos...</span>
        </div>
      </CContainer>
    )
  }

  return (
    <CContainer fluid>
      <CRow className="mb-4">
        <CCol>
          <h2 className="mb-3">
            <CIcon icon={cilSchool} className="me-2" />
            Inscripción Escolar
          </h2>
          <p className="text-muted">Asigne estudiantes registrados a grados y secciones</p>
        </CCol>
      </CRow>

      {/* Filtros */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Buscar estudiante por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol md={6} className="text-end">
          <CButton color="info" onClick={() => setShowTeacherModal(true)}>
            <CIcon icon={cilPencil} className="me-1" />
            Asignar Docentes
          </CButton>
        </CCol>
      </CRow>

      {/* Lista de Estudiantes Registrados */}
      <CCard>
        <CCardHeader>
          <h5 className="mb-0">Estudiantes Registrados</h5>
          <small className="text-muted">{filteredStudents.length} estudiante(s) disponible(s) para inscripción</small>
        </CCardHeader>
        <CCardBody>
          {filteredStudents.length === 0 ? (
            <CAlert color="info">No hay estudiantes registrados disponibles para inscripción.</CAlert>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Cédula</CTableHeaderCell>
                  <CTableHeaderCell>Nombres</CTableHeaderCell>
                  <CTableHeaderCell>Apellidos</CTableHeaderCell>
                  <CTableHeaderCell>Sexo</CTableHeaderCell>
                  <CTableHeaderCell>Representante</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredStudents.map((student) => (
                  <CTableRow key={student.ci}>
                    <CTableDataCell>
                      <strong>{student.ci}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{student.name}</CTableDataCell>
                    <CTableDataCell>{student.lastName}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={student.sex === "Masculino" ? "primary" : "danger"}>{student.sex}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {student.representative_name} {student.representative_lastName}
                      <br />
                      <small className="text-muted">{student.relationship}</small>
                    </CTableDataCell>
                    <CTableDataCell>{student.representative_phone}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="success" size="sm" onClick={() => handleInscribeStudent(student)}>
                        <CIcon icon={cilPlus} className="me-1" />
                        Inscribir
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de Inscripción */}
      <CModal visible={showInscriptionModal} onClose={() => setShowInscriptionModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Inscribir Estudiante</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedStudent && (
            <>
              <CAlert color="info">
                <strong>Estudiante:</strong> {selectedStudent.name} {selectedStudent.lastName} ({selectedStudent.ci})
              </CAlert>

              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Grado *</CFormLabel>
                  <CFormSelect
                    value={inscriptionForm.gradeId}
                    onChange={(e) =>
                      setInscriptionForm((prev) => ({ ...prev, gradeId: e.target.value, sectionId: "" }))
                    }
                  >
                    <option value="">Seleccione un grado</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Sección *</CFormLabel>
                  <CFormSelect
                    value={inscriptionForm.sectionID}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, sectionID: e.target.value }))}
                    disabled={!inscriptionForm.gradeId}
                  >
                    <option value="">Seleccione una sección</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        Sección {section.seccion}
                        {section.teacher_name && ` - ${section.teacher_name} ${section.teacher_lastName}`}
                        {` (${section.student_count} estudiantes)`}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="repeater"
                      checked={inscriptionForm.repeater}
                      onChange={(e) => setInscriptionForm((prev) => ({ ...prev, repeater: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="repeater">
                      Estudiante repitiente
                    </label>
                  </div>
                </CCol>

                {/* Información de Uniformes */}
                <CCol md={12} className="mb-3">
                  <h6 className="text-muted">Tallas de Uniforme</h6>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Talla de Camisa</CFormLabel>
                  <CFormSelect
                    value={inscriptionForm.chemiseSize}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, chemiseSize: e.target.value }))}
                  >
                    <option value="">Seleccione</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Talla de Pantalón</CFormLabel>
                  <CFormSelect
                    value={inscriptionForm.pantsSize}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, pantsSize: e.target.value }))}
                  >
                    <option value="">Seleccione</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </CFormSelect>
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Talla de Zapatos</CFormLabel>
                  <CFormInput
                    type="text"
                    value={inscriptionForm.shoesSize}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, shoesSize: e.target.value }))}
                    placeholder="Ej: 38, 39, 40"
                  />
                </CCol>

                {/* Información Física */}
                <CCol md={12} className="mb-3">
                  <h6 className="text-muted">Información Física y Médica</h6>
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Peso (kg)</CFormLabel>
                  <CFormInput
                    type="number"
                    step="0.1"
                    value={inscriptionForm.weight}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="Ej: 45.5"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Estatura (cm)</CFormLabel>
                  <CFormInput
                    type="number"
                    step="0.1"
                    value={inscriptionForm.stature}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, stature: e.target.value }))}
                    placeholder="Ej: 150.5"
                  />
                </CCol>

                <CCol md={12} className="mb-3">
                  <CFormLabel>Enfermedades o Condiciones Médicas</CFormLabel>
                  <CFormTextarea
                    rows={2}
                    value={inscriptionForm.diseases}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, diseases: e.target.value }))}
                    placeholder="Describa cualquier enfermedad o condición médica relevante"
                  />
                </CCol>

                <CCol md={12} className="mb-3">
                  <CFormLabel>Observaciones</CFormLabel>
                  <CFormTextarea
                    rows={2}
                    value={inscriptionForm.observation}
                    onChange={(e) => setInscriptionForm((prev) => ({ ...prev, observation: e.target.value }))}
                    placeholder="Observaciones adicionales"
                  />
                </CCol>

                {/* Documentos Requeridos */}
                <CCol md={12} className="mb-3">
                  <h6 className="text-muted">Documentos Requeridos</h6>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="birthCertificateCheck"
                      checked={inscriptionForm.birthCertificateCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, birthCertificateCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="birthCertificateCheck">
                      Partida de Nacimiento
                    </label>
                  </div>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="vaccinationCardCheck"
                      checked={inscriptionForm.vaccinationCardCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, vaccinationCardCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="vaccinationCardCheck">
                      Carnet de Vacunas
                    </label>
                  </div>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="studentPhotosCheck"
                      checked={inscriptionForm.studentPhotosCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, studentPhotosCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="studentPhotosCheck">
                      Fotos del Estudiante
                    </label>
                  </div>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="representativePhotosCheck"
                      checked={inscriptionForm.representativePhotosCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, representativePhotosCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="representativePhotosCheck">
                      Fotos del Representante
                    </label>
                  </div>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="representativeCopyIDCheck"
                      checked={inscriptionForm.representativeCopyIDCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, representativeCopyIDCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="representativeCopyIDCheck">
                      Copia de Cédula del Representante
                    </label>
                  </div>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="representativeRIFCheck"
                      checked={inscriptionForm.representativeRIFCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, representativeRIFCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="representativeRIFCheck">
                      RIF del Representante
                    </label>
                  </div>
                </CCol>

                <CCol md={6} className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autorizedCopyIDCheck"
                      checked={inscriptionForm.autorizedCopyIDCheck}
                      onChange={(e) =>
                        setInscriptionForm((prev) => ({ ...prev, autorizedCopyIDCheck: e.target.checked }))
                      }
                    />
                    <label className="form-check-label" htmlFor="autorizedCopyIDCheck">
                      Copia de Cédula Autorizada
                    </label>
                  </div>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowInscriptionModal(false)}>
            Cancelar
          </CButton>
          <CButton
            color="success"
            onClick={handleSubmitInscription}
            disabled={submitting || !inscriptionForm.gradeId || !inscriptionForm.sectionID}
          >
            {submitting ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Inscribiendo...
              </>
            ) : (
              <>
                <CIcon icon={cilCheckCircle} className="me-1" />
                Inscribir Estudiante
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Asignación de Docentes */}
      <CModal visible={showTeacherModal} onClose={() => setShowTeacherModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Asignar Docente a Sección</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6} className="mb-3">
              <CFormLabel>Grado</CFormLabel>
              <CFormSelect
                value={teacherForm.gradeId || ""}
                onChange={(e) => {
                  const gradeId = e.target.value
                  setTeacherForm((prev) => ({ ...prev, gradeId, sectionId: "" }))
                  if (gradeId) {
                    loadSectionsByGrade(gradeId)
                  }
                }}
              >
                <option value="">Seleccione un grado</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6} className="mb-3">
              <CFormLabel>Sección *</CFormLabel>
              <CFormSelect
                value={teacherForm.sectionId}
                onChange={(e) => setTeacherForm((prev) => ({ ...prev, sectionId: e.target.value }))}
                disabled={!teacherForm.gradeId}
              >
                <option value="">Seleccione una sección</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    Sección {section.seccion}
                    {section.teacher_name
                      ? ` - Actual: ${section.teacher_name} ${section.teacher_lastName}`
                      : " - Sin docente asignado"}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mb-3">
              <CFormLabel>Docente *</CFormLabel>
              <CFormSelect
                value={teacherForm.teacherId}
                onChange={(e) => setTeacherForm((prev) => ({ ...prev, teacherId: e.target.value }))}
              >
                <option value="">Seleccione un docente</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} {teacher.lastName} - {teacher.ci}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowTeacherModal(false)}>
            Cancelar
          </CButton>
          <CButton
            color="primary"
            onClick={handleAssignTeacher}
            disabled={submitting || !teacherForm.sectionId || !teacherForm.teacherId}
          >
            {submitting ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Asignando...
              </>
            ) : (
              <>
                <CIcon icon={cilCheckCircle} className="me-1" />
                Asignar Docente
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toast Container */}
      <CToaster ref={toasterRef} placement="top-end" />
    </CContainer>
  )
}

export default InscripcionEscolar
