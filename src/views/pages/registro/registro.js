"use client"

import { useState, useEffect, useRef } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CContainer,
  CSpinner,
  CAlert,
  CProgress,
  CBadge,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilPeople,
  cilSchool,
  cilCheckCircle,
  cilWarning,
  cilArrowRight,
  cilArrowLeft,
  cilSave,
} from "@coreui/icons"
import { helpFetch } from "../../../api/helpFetch.js"

const api = helpFetch()

const RegistroEstudiantil = () => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Estados para datos auxiliares
  const [grados, setGrados] = useState([])
  const [secciones, setSecciones] = useState([])
  const [docentes, setDocentes] = useState([])

  // Toast system
  const toasterRef = useRef()

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Información Académica
    grade_id: "",
    section_id: "",
    teacher_id: "",
    repeater: false,
    school_year: new Date().getFullYear(),

    // Paso 2: Información del Estudiante
    student_ci: "",
    student_name: "",
    student_lastName: "",
    student_birthday: "",
    student_sex: "",
    student_birthPlace: "",
    student_address: "",

    // Paso 3: Información del Representante
    representative_ci: "",
    representative_name: "",
    representative_lastName: "",
    representative_phone: "",
    representative_email: "",
    representative_address: "",
    representative_relationship: "",
    representative_occupation: "",

    // Paso 4: Información Médica
    medical_allergies: "",
    medical_conditions: "",
    medical_medications: "",
    medical_emergency_contact: "",
    medical_emergency_phone: "",

    // Paso 5: Información Adicional
    previous_school: "",
    previous_grade: "",
    transportation: "",
    lunch_program: false,

    // Paso 6: Observaciones
    observations: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando datos iniciales...")

      const [gradosResponse, seccionesResponse, docentesResponse] = await Promise.all([
        api.get("/api/matriculas/utils/grados"),
        api.get("/api/matriculas/utils/secciones"),
        api.get("/api/personal/teachers"),
      ])

      console.log("📥 Respuestas:", { gradosResponse, seccionesResponse, docentesResponse })

      if (!gradosResponse.error) {
        setGrados(gradosResponse.grados || [])
      }

      if (!seccionesResponse.error) {
        setSecciones(seccionesResponse.secciones || [])
      }

      if (!docentesResponse.error) {
        setDocentes(docentesResponse.teachers || [])
      }

      console.log("✅ Datos iniciales cargados")
    } catch (error) {
      console.error("❌ Error cargando datos iniciales:", error)
      showToast("Error al cargar los datos iniciales", "danger")
    } finally {
      setLoading(false)
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.grade_id) newErrors.grade_id = "El grado es requerido"
        if (!formData.section_id) newErrors.section_id = "La sección es requerida"
        if (!formData.teacher_id) newErrors.teacher_id = "El docente es requerido"
        break

      case 2:
        if (!formData.student_ci) newErrors.student_ci = "La cédula es requerida"
        if (!formData.student_name) newErrors.student_name = "El nombre es requerido"
        if (!formData.student_lastName) newErrors.student_lastName = "El apellido es requerido"
        if (!formData.student_birthday) newErrors.student_birthday = "La fecha de nacimiento es requerida"
        if (!formData.student_sex) newErrors.student_sex = "El sexo es requerido"
        if (!formData.student_birthPlace) newErrors.student_birthPlace = "El lugar de nacimiento es requerido"
        if (!formData.student_address) newErrors.student_address = "La dirección es requerida"
        break

      case 3:
        if (!formData.representative_ci) newErrors.representative_ci = "La cédula del representante es requerida"
        if (!formData.representative_name) newErrors.representative_name = "El nombre del representante es requerido"
        if (!formData.representative_lastName)
          newErrors.representative_lastName = "El apellido del representante es requerido"
        if (!formData.representative_phone) newErrors.representative_phone = "El teléfono es requerido"
        if (!formData.representative_address) newErrors.representative_address = "La dirección es requerida"
        if (!formData.representative_relationship) newErrors.representative_relationship = "El parentesco es requerido"
        break

      case 4:
        // Campos opcionales, solo validar formato si están llenos
        if (
          formData.medical_emergency_phone &&
          !/^\d{10,}$/.test(formData.medical_emergency_phone.replace(/\D/g, ""))
        ) {
          newErrors.medical_emergency_phone = "Formato de teléfono inválido"
        }
        break

      case 5:
        // Campos opcionales
        break

      case 6:
        // Observaciones opcionales
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(6)) return

    try {
      setSubmitting(true)
      console.log("📝 Enviando formulario de registro:", formData)

      const response = await api.post("/api/matriculas", {
        body: formData,
      })

      console.log("📥 Respuesta registro:", response)

      if (!response.error) {
        showToast("Estudiante registrado exitosamente")

        // Resetear formulario después de un delay
        setTimeout(() => {
          setFormData({
            grade_id: "",
            section_id: "",
            teacher_id: "",
            repeater: false,
            school_year: new Date().getFullYear(),
            student_ci: "",
            student_name: "",
            student_lastName: "",
            student_birthday: "",
            student_sex: "",
            student_birthPlace: "",
            student_address: "",
            representative_ci: "",
            representative_name: "",
            representative_lastName: "",
            representative_phone: "",
            representative_email: "",
            representative_address: "",
            representative_relationship: "",
            representative_occupation: "",
            medical_allergies: "",
            medical_conditions: "",
            medical_medications: "",
            medical_emergency_contact: "",
            medical_emergency_phone: "",
            previous_school: "",
            previous_grade: "",
            transportation: "",
            lunch_program: false,
            observations: "",
          })
          setCurrentStep(1)
          setErrors({})
        }, 2000)
      } else {
        showToast(response.msg || "Error al registrar el estudiante", "danger")
      }
    } catch (error) {
      console.error("❌ Error en registro:", error)
      showToast("Error al registrar el estudiante", "danger")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CCard>
            <CCardHeader className="bg-primary text-white">
              <h5 className="mb-0">
                <CIcon icon={cilSchool} className="me-2" />
                Paso 1: Información Académica
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Grado *</CFormLabel>
                  <CFormSelect
                    value={formData.grade_id}
                    onChange={(e) => handleInputChange("grade_id", e.target.value)}
                    invalid={!!errors.grade_id}
                  >
                    <option value="">Seleccione un grado</option>
                    {grados.map((grado) => (
                      <option key={grado.id} value={grado.id}>
                        {grado.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.grade_id && <div className="invalid-feedback d-block">{errors.grade_id}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Sección *</CFormLabel>
                  <CFormSelect
                    value={formData.section_id}
                    onChange={(e) => handleInputChange("section_id", e.target.value)}
                    invalid={!!errors.section_id}
                  >
                    <option value="">Seleccione una sección</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </CFormSelect>
                  {errors.section_id && <div className="invalid-feedback d-block">{errors.section_id}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Docente *</CFormLabel>
                  <CFormSelect
                    value={formData.teacher_id}
                    onChange={(e) => handleInputChange("teacher_id", e.target.value)}
                    invalid={!!errors.teacher_id}
                  >
                    <option value="">Seleccione un docente</option>
                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.name} {docente.lastName}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.teacher_id && <div className="invalid-feedback d-block">{errors.teacher_id}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Año Escolar</CFormLabel>
                  <CFormInput
                    type="number"
                    value={formData.school_year}
                    onChange={(e) => handleInputChange("school_year", Number.parseInt(e.target.value))}
                    min="2020"
                    max="2030"
                  />
                </CCol>

                <CCol md={12} className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="repeater"
                      checked={formData.repeater}
                      onChange={(e) => handleInputChange("repeater", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="repeater">
                      Estudiante repitiente
                    </label>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )

      case 2:
        return (
          <CCard>
            <CCardHeader className="bg-success text-white">
              <h5 className="mb-0">
                <CIcon icon={cilUser} className="me-2" />
                Paso 2: Información del Estudiante
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Cédula de Identidad *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.student_ci}
                    onChange={(e) => handleInputChange("student_ci", e.target.value)}
                    placeholder="Ej: V-12345678"
                    invalid={!!errors.student_ci}
                  />
                  {errors.student_ci && <div className="invalid-feedback">{errors.student_ci}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Nombres *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.student_name}
                    onChange={(e) => handleInputChange("student_name", e.target.value)}
                    placeholder="Nombres del estudiante"
                    invalid={!!errors.student_name}
                  />
                  {errors.student_name && <div className="invalid-feedback">{errors.student_name}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Apellidos *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.student_lastName}
                    onChange={(e) => handleInputChange("student_lastName", e.target.value)}
                    placeholder="Apellidos del estudiante"
                    invalid={!!errors.student_lastName}
                  />
                  {errors.student_lastName && <div className="invalid-feedback">{errors.student_lastName}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Fecha de Nacimiento *</CFormLabel>
                  <CFormInput
                    type="date"
                    value={formData.student_birthday}
                    onChange={(e) => handleInputChange("student_birthday", e.target.value)}
                    invalid={!!errors.student_birthday}
                  />
                  {errors.student_birthday && <div className="invalid-feedback">{errors.student_birthday}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Sexo *</CFormLabel>
                  <CFormSelect
                    value={formData.student_sex}
                    onChange={(e) => handleInputChange("student_sex", e.target.value)}
                    invalid={!!errors.student_sex}
                  >
                    <option value="">Seleccione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </CFormSelect>
                  {errors.student_sex && <div className="invalid-feedback">{errors.student_sex}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Lugar de Nacimiento *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.student_birthPlace}
                    onChange={(e) => handleInputChange("student_birthPlace", e.target.value)}
                    placeholder="Ciudad, Estado"
                    invalid={!!errors.student_birthPlace}
                  />
                  {errors.student_birthPlace && <div className="invalid-feedback">{errors.student_birthPlace}</div>}
                </CCol>

                <CCol md={12} className="mb-3">
                  <CFormLabel>Dirección de Habitación *</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formData.student_address}
                    onChange={(e) => handleInputChange("student_address", e.target.value)}
                    placeholder="Dirección completa del estudiante"
                    invalid={!!errors.student_address}
                  />
                  {errors.student_address && <div className="invalid-feedback">{errors.student_address}</div>}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )

      case 3:
        return (
          <CCard>
            <CCardHeader className="bg-info text-white">
              <h5 className="mb-0">
                <CIcon icon={cilPeople} className="me-2" />
                Paso 3: Información del Representante
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Cédula de Identidad *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.representative_ci}
                    onChange={(e) => handleInputChange("representative_ci", e.target.value)}
                    placeholder="Ej: V-12345678"
                    invalid={!!errors.representative_ci}
                  />
                  {errors.representative_ci && <div className="invalid-feedback">{errors.representative_ci}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Nombres *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.representative_name}
                    onChange={(e) => handleInputChange("representative_name", e.target.value)}
                    placeholder="Nombres del representante"
                    invalid={!!errors.representative_name}
                  />
                  {errors.representative_name && <div className="invalid-feedback">{errors.representative_name}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Apellidos *</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.representative_lastName}
                    onChange={(e) => handleInputChange("representative_lastName", e.target.value)}
                    placeholder="Apellidos del representante"
                    invalid={!!errors.representative_lastName}
                  />
                  {errors.representative_lastName && (
                    <div className="invalid-feedback">{errors.representative_lastName}</div>
                  )}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Teléfono *</CFormLabel>
                  <CFormInput
                    type="tel"
                    value={formData.representative_phone}
                    onChange={(e) => handleInputChange("representative_phone", e.target.value)}
                    placeholder="Ej: 0414-1234567"
                    invalid={!!errors.representative_phone}
                  />
                  {errors.representative_phone && <div className="invalid-feedback">{errors.representative_phone}</div>}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    value={formData.representative_email}
                    onChange={(e) => handleInputChange("representative_email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Parentesco *</CFormLabel>
                  <CFormSelect
                    value={formData.representative_relationship}
                    onChange={(e) => handleInputChange("representative_relationship", e.target.value)}
                    invalid={!!errors.representative_relationship}
                  >
                    <option value="">Seleccione</option>
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Tío/a">Tío/a</option>
                    <option value="Hermano/a">Hermano/a</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Otro">Otro</option>
                  </CFormSelect>
                  {errors.representative_relationship && (
                    <div className="invalid-feedback">{errors.representative_relationship}</div>
                  )}
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Ocupación</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.representative_occupation}
                    onChange={(e) => handleInputChange("representative_occupation", e.target.value)}
                    placeholder="Ocupación del representante"
                  />
                </CCol>

                <CCol md={12} className="mb-3">
                  <CFormLabel>Dirección de Habitación *</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formData.representative_address}
                    onChange={(e) => handleInputChange("representative_address", e.target.value)}
                    placeholder="Dirección completa del representante"
                    invalid={!!errors.representative_address}
                  />
                  {errors.representative_address && (
                    <div className="invalid-feedback">{errors.representative_address}</div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )

      case 4:
        return (
          <CCard>
            <CCardHeader className="bg-warning text-dark">
              <h5 className="mb-0">Paso 4: Información Médica</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Alergias</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formData.medical_allergies}
                    onChange={(e) => handleInputChange("medical_allergies", e.target.value)}
                    placeholder="Describa las alergias conocidas"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Condiciones Médicas</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formData.medical_conditions}
                    onChange={(e) => handleInputChange("medical_conditions", e.target.value)}
                    placeholder="Describa condiciones médicas relevantes"
                  />
                </CCol>

                <CCol md={12} className="mb-3">
                  <CFormLabel>Medicamentos</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formData.medical_medications}
                    onChange={(e) => handleInputChange("medical_medications", e.target.value)}
                    placeholder="Medicamentos que toma regularmente"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Contacto de Emergencia</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.medical_emergency_contact}
                    onChange={(e) => handleInputChange("medical_emergency_contact", e.target.value)}
                    placeholder="Nombre del contacto de emergencia"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Teléfono de Emergencia</CFormLabel>
                  <CFormInput
                    type="tel"
                    value={formData.medical_emergency_phone}
                    onChange={(e) => handleInputChange("medical_emergency_phone", e.target.value)}
                    placeholder="Teléfono de emergencia"
                    invalid={!!errors.medical_emergency_phone}
                  />
                  {errors.medical_emergency_phone && (
                    <div className="invalid-feedback">{errors.medical_emergency_phone}</div>
                  )}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )

      case 5:
        return (
          <CCard>
            <CCardHeader className="bg-secondary text-white">
              <h5 className="mb-0">Paso 5: Información Adicional</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Institución Anterior</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.previous_school}
                    onChange={(e) => handleInputChange("previous_school", e.target.value)}
                    placeholder="Nombre de la institución anterior"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Grado Anterior</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.previous_grade}
                    onChange={(e) => handleInputChange("previous_grade", e.target.value)}
                    placeholder="Último grado cursado"
                  />
                </CCol>

                <CCol md={6} className="mb-3">
                  <CFormLabel>Transporte</CFormLabel>
                  <CFormSelect
                    value={formData.transportation}
                    onChange={(e) => handleInputChange("transportation", e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    <option value="Propio">Propio</option>
                    <option value="Transporte Escolar">Transporte Escolar</option>
                    <option value="Transporte Público">Transporte Público</option>
                    <option value="Caminando">Caminando</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mb-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="lunch_program"
                      checked={formData.lunch_program}
                      onChange={(e) => handleInputChange("lunch_program", e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="lunch_program">
                      Participa en el programa de alimentación
                    </label>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )

      case 6:
        return (
          <CCard>
            <CCardHeader className="bg-dark text-white">
              <h5 className="mb-0">Paso 6: Observaciones y Confirmación</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={12} className="mb-4">
                  <CFormLabel>Observaciones</CFormLabel>
                  <CFormTextarea
                    rows={4}
                    value={formData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                    placeholder="Observaciones adicionales sobre el estudiante..."
                  />
                </CCol>

                <CCol md={12}>
                  <CAlert color="info">
                    <h6>Resumen del Registro:</h6>
                    <ul className="mb-0">
                      <li>
                        <strong>Estudiante:</strong> {formData.student_name} {formData.student_lastName}
                      </li>
                      <li>
                        <strong>Cédula:</strong> {formData.student_ci}
                      </li>
                      <li>
                        <strong>Grado:</strong>{" "}
                        {grados.find((g) => g.id == formData.grade_id)?.name || "No seleccionado"}
                      </li>
                      <li>
                        <strong>Sección:</strong> {formData.section_id || "No seleccionada"}
                      </li>
                      <li>
                        <strong>Representante:</strong> {formData.representative_name}{" "}
                        {formData.representative_lastName}
                      </li>
                      <li>
                        <strong>Teléfono:</strong> {formData.representative_phone}
                      </li>
                    </ul>
                  </CAlert>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <CContainer>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <CSpinner color="primary" size="lg" />
          <span className="ms-2">Cargando formulario...</span>
        </div>
      </CContainer>
    )
  }

  return (
    <CContainer fluid>
      <CRow className="mb-4">
        <CCol>
          <h2 className="mb-3">Registro de Estudiante</h2>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span>Progreso del Registro</span>
              <span>{Math.round((currentStep / 6) * 100)}%</span>
            </div>
            <CProgress value={(currentStep / 6) * 100} color="primary" />
          </div>

          {/* Step Indicators */}
          <div className="d-flex justify-content-between mb-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="text-center">
                <CBadge
                  color={currentStep >= step ? "primary" : "secondary"}
                  className="rounded-circle p-2 mb-1"
                  style={{ width: "30px", height: "30px" }}
                >
                  {step}
                </CBadge>
                <div className="small">
                  {step === 1 && "Académica"}
                  {step === 2 && "Estudiante"}
                  {step === 3 && "Representante"}
                  {step === 4 && "Médica"}
                  {step === 5 && "Adicional"}
                  {step === 6 && "Confirmación"}
                </div>
              </div>
            ))}
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <CButton color="secondary" onClick={prevStep} disabled={currentStep === 1}>
              <CIcon icon={cilArrowLeft} className="me-1" />
              Anterior
            </CButton>

            {currentStep < 6 ? (
              <CButton color="primary" onClick={nextStep}>
                Siguiente
                <CIcon icon={cilArrowRight} className="ms-1" />
              </CButton>
            ) : (
              <CButton color="success" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-1" />
                    Registrar Estudiante
                  </>
                )}
              </CButton>
            )}
          </div>
        </CCol>
      </CRow>

      {/* Toast Container */}
      <CToaster ref={toasterRef} placement="top-end" />
    </CContainer>
  )
}

export default RegistroEstudiantil
