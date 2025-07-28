"use client"

import { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CBadge,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilSearch, cilUser, cilPhone, cilHome } from "@coreui/icons"
import { helpFetch } from "../../../../api/helpFetch"

export default function BuscarEstudiante({ tipoInscripcion, onStudentFound, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [studentCi, setStudentCi] = useState("")
  const [studentFound, setStudentFound] = useState(null)

  const api = helpFetch()

  const buscarEstudiante = async () => {
    if (!studentCi.trim()) {
      setError("Ingrese la cédula del estudiante")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const data = await api.get(`/api/students/${studentCi}`)

      if (data && data.ok) {
        setStudentFound(data.student)
        setSuccess("Estudiante encontrado exitosamente")
      } else {
        setStudentFound(null)
        setError("Estudiante no encontrado en el sistema")
      }
    } catch (err) {
      setStudentFound(null)
      setError("Estudiante no encontrado en el sistema")
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (studentFound) {
      onStudentFound(studentFound)
    }
  }

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "success" // Activo
      case 2:
        return "info" // Inscrito
      case 3:
        return "warning" // Suspendido
      case 4:
        return "danger" // Expulsado
      default:
        return "secondary"
    }
  }

  const getTipoTitle = () => {
    switch (tipoInscripcion) {
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
          <h2 className="text-center text-white">Buscar Estudiante - {getTipoTitle()}</h2>
          <p className="text-center text-light">
            {tipoInscripcion === "reintegro"
              ? "Busque al estudiante que desea reintegrar al sistema"
              : "Busque al estudiante regular para su inscripción"}
          </p>
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
              <CIcon icon={cilSearch} className="me-2" />
              Búsqueda de Estudiante
            </h4>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol md={8}>
                <CFormLabel>Cédula del Estudiante</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="V-12345678 o E-12345678"
                    value={studentCi}
                    onChange={(e) => setStudentCi(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && buscarEstudiante()}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={4} className="d-flex align-items-end">
                <CButton color="info" onClick={buscarEstudiante} disabled={loading} className="w-100">
                  {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
                  {loading ? " Buscando..." : " Buscar"}
                </CButton>
              </CCol>
            </CRow>

            {studentFound && (
              <CCard className="mt-4">
                <CCardHeader className="bg-success text-white">
                  <h5 className="mb-0">
                    <CIcon icon={cilUser} className="me-2" />
                    Estudiante Encontrado
                  </h5>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={6}>
                      <h6 className="text-primary">Datos Personales</h6>
                      <p>
                        <strong>Nombre Completo:</strong> {studentFound.name} {studentFound.lastName}
                      </p>
                      <p>
                        <strong>Cédula:</strong> {studentFound.ci}
                      </p>
                      <p>
                        <strong>Sexo:</strong> {studentFound.sex === "M" ? "Masculino" : "Femenino"}
                      </p>
                      <p>
                        <strong>Fecha de Nacimiento:</strong>{" "}
                        {new Date(studentFound.birthday).toLocaleDateString("es-VE")}
                      </p>
                      <p>
                        <strong>Lugar de Nacimiento:</strong> {studentFound.placeBirth || "No especificado"}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        <CBadge color={getStatusColor(studentFound.status_id)}>
                          {studentFound.status_description}
                        </CBadge>
                      </p>
                    </CCol>
                    <CCol md={6}>
                      <h6 className="text-primary">Información Familiar</h6>
                      <p>
                        <strong>Representante:</strong> {studentFound.representative_name}{" "}
                        {studentFound.representative_lastName}
                      </p>
                      <p>
                        <strong>Teléfono Representante:</strong> <CIcon icon={cilPhone} size="sm" className="me-1" />
                        {studentFound.representative_phone}
                      </p>
                      <p>
                        <strong>Email Representante:</strong> {studentFound.representative_email || "No registrado"}
                      </p>
                      <p>
                        <strong>Madre:</strong> {studentFound.motherName || "No especificado"}
                      </p>
                      <p>
                        <strong>Padre:</strong> {studentFound.fatherName || "No especificado"}
                      </p>
                      <p>
                        <strong>Cantidad de Hermanos:</strong> {studentFound.quantityBrothers || 0}
                      </p>
                    </CCol>
                  </CRow>

                  {studentFound.representative_address && (
                    <CRow className="mt-3">
                      <CCol md={12}>
                        <h6 className="text-primary">Dirección</h6>
                        <p>
                          <CIcon icon={cilHome} size="sm" className="me-1" />
                          {studentFound.representative_address}
                        </p>
                      </CCol>
                    </CRow>
                  )}

                  <div className="mt-4 d-flex justify-content-between">
                    <CButton color="secondary" onClick={onBack}>
                      Volver
                    </CButton>
                    <CButton
                      color="success"
                      size="lg"
                      onClick={handleContinue}
                      disabled={
                        tipoInscripcion === "regular" && studentFound.status_id === 1 // Solo estudiantes activos pueden inscribirse
                      }
                    >
                      {tipoInscripcion === "reintegro" ? "Continuar con Reintegro" : "Continuar con Inscripción"}
                    </CButton>
                  </div>

                  {tipoInscripcion === "regular" && studentFound.status_id === 1 && (
                    <CAlert color="warning" className="mt-3">
                      <strong>Atención:</strong> Este estudiante no está en estado activo para inscripción regular.
                      Estado actual: {studentFound.status_description}
                    </CAlert>
                  )}
                </CCardBody>
              </CCard>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
