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
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilSearch, cilUserPlus, cilPhone, cilHome } from "@coreui/icons"

export default function CrearAlumno({ tipoInscripcion, onStudentCreated, onBack }) {
  const [step, setStep] = useState(1) // 1: Buscar/Crear Representante, 2: Crear Estudiante
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Estados para representante
  const [representanteCi, setRepresentanteCi] = useState("")
  const [cedulaPrefix, setCedulaPrefix] = useState("V")
  const [representanteFound, setRepresentanteFound] = useState(null)
  const [representanteData, setRepresentanteData] = useState({
    ci: "",
    name: "",
    lastName: "",
    telephoneNumber: "",
    email: "",
    maritalStat: "",
    profesion: "",
    birthday: "",
    telephoneHouse: "",
    roomAdress: "",
    workPlace: "",
    jobNumber: "",
  })

  // Estados para estudiante
  const [studentData, setStudentData] = useState({
    ci: "",
    name: "",
    lastName: "",
    sex: "M",
    birthday: "",
    placeBirth: "",
    parishID: null,
    quantityBrothers: 0,
    representativeID: "",
    motherName: "",
    motherCi: "",
    motherTelephone: "",
    fatherName: "",
    fatherCi: "",
    fatherTelephone: "",
    livesMother: false,
    livesFather: false,
    livesBoth: true,
    livesRepresentative: false,
    rolRopresentative: "",
  })

  // Buscar representante por CI
  const buscarRepresentante = async () => {
    if (!representanteCi.trim()) {
      setError("Ingrese la cédula del representante")
      return
    }

    const fullCi = `${cedulaPrefix}-${representanteCi}`
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/representatives/${representanteCi}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRepresentanteFound(data.representative)
        setStudentData((prev) => ({ ...prev, representativeID: data.representative.ci }))
        setSuccess("Representante encontrado exitosamente")
      } else {
        setRepresentanteFound(null)
        setRepresentanteData((prev) => ({ ...prev, ci: fullCi }))
        setError("Representante no encontrado. Complete los datos para crear uno nuevo.")
      }
    } catch (err) {
      setError("Error al buscar el representante")
    } finally {
      setLoading(false)
    }
  }

  // Crear representante
  const crearRepresentante = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3001/api/representatives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(representanteData),
      })

      if (response.ok) {
        const data = await response.json()
        setRepresentanteFound(data.data)
        setStudentData((prev) => ({ ...prev, representativeID: data.data.ci }))
        setSuccess("Representante creado exitosamente")
        setStep(2)
      } else {
        const errorData = await response.json()
        setError(errorData.msg || "Error al crear el representante")
      }
    } catch (err) {
      setError("Error al crear el representante")
    } finally {
      setLoading(false)
    }
  }

  // Crear estudiante
  const crearEstudiante = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3001/api/students/registry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ student: studentData }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess("Estudiante creado exitosamente")
        onStudentCreated(data.student)
      } else {
        const errorData = await response.json()
        setError(errorData.msg || "Error al crear el estudiante")
      }
    } catch (err) {
      setError("Error al crear el estudiante")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer>
      <div className="mb-4">
        <h2 className="text-center">
          Crear Alumno -{" "}
          {tipoInscripcion === "nuevo"
            ? "Nuevo Ingreso"
            : tipoInscripcion === "reintegro"
              ? "Reintegro"
              : "Estudiante Regular"}
        </h2>
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

      {step === 1 && (
        <CCard>
          <CCardHeader>
            <h4>
              <CIcon icon={cilUser} className="me-2" />
              Paso 1: Buscar o Crear Representante
            </h4>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol md={8}>
                <CFormLabel>Cédula del Representante</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    value={cedulaPrefix}
                    onChange={(e) => setCedulaPrefix(e.target.value)}
                    style={{ maxWidth: "80px" }}
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                  </CFormSelect>
                  <CInputGroupText>-</CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="12345678"
                    value={representanteCi}
                    onChange={(e) => setRepresentanteCi(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={4} className="d-flex align-items-end">
                <CButton color="info" onClick={buscarRepresentante} disabled={loading} className="w-100">
                  {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
                  {loading ? " Buscando..." : " Buscar"}
                </CButton>
              </CCol>
            </CRow>

            {representanteFound && (
              <CAlert color="success">
                <h5>Representante Encontrado:</h5>
                <p>
                  <strong>Nombre:</strong> {representanteFound.name} {representanteFound.lastName}
                </p>
                <p>
                  <strong>Teléfono:</strong> {representanteFound.telephoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {representanteFound.email || "No registrado"}
                </p>
                <div className="mt-3">
                  <CButton color="success" onClick={() => setStep(2)}>
                    Continuar con este Representante
                  </CButton>
                </div>
              </CAlert>
            )}

            {!representanteFound && representanteData.ci && (
              <CCard className="mt-4">
                <CCardHeader>
                  <h5>Crear Nuevo Representante</h5>
                </CCardHeader>
                <CCardBody>
                  <CForm>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Nombres *</CFormLabel>
                        <CFormInput
                          value={representanteData.name}
                          onChange={(e) => setRepresentanteData((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Apellidos *</CFormLabel>
                        <CFormInput
                          value={representanteData.lastName}
                          onChange={(e) => setRepresentanteData((prev) => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Teléfono Celular *</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>
                          <CFormInput
                            value={representanteData.telephoneNumber}
                            onChange={(e) =>
                              setRepresentanteData((prev) => ({ ...prev, telephoneNumber: e.target.value }))
                            }
                            placeholder="0414-1234567"
                            required
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Email</CFormLabel>
                        <CFormInput
                          type="email"
                          value={representanteData.email}
                          onChange={(e) => setRepresentanteData((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Estado Civil</CFormLabel>
                        <CFormSelect
                          value={representanteData.maritalStat}
                          onChange={(e) => setRepresentanteData((prev) => ({ ...prev, maritalStat: e.target.value }))}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="soltero">Soltero(a)</option>
                          <option value="casado">Casado(a)</option>
                          <option value="divorciado">Divorciado(a)</option>
                          <option value="viudo">Viudo(a)</option>
                          <option value="concubinato">Concubinato</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Profesión</CFormLabel>
                        <CFormInput
                          value={representanteData.profesion}
                          onChange={(e) => setRepresentanteData((prev) => ({ ...prev, profesion: e.target.value }))}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel>Dirección de Habitación</CFormLabel>
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilHome} />
                          </CInputGroupText>
                          <CFormTextarea
                            value={representanteData.roomAdress}
                            onChange={(e) => setRepresentanteData((prev) => ({ ...prev, roomAdress: e.target.value }))}
                            rows={2}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <div className="d-flex justify-content-between">
                      <CButton color="secondary" onClick={onBack}>
                        Volver
                      </CButton>
                      <CButton
                        color="success"
                        onClick={crearRepresentante}
                        disabled={
                          loading ||
                          !representanteData.name ||
                          !representanteData.lastName ||
                          !representanteData.telephoneNumber
                        }
                      >
                        {loading ? <CSpinner size="sm" /> : <CIcon icon={cilUserPlus} />}
                        {loading ? " Creando..." : " Crear Representante"}
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            )}
          </CCardBody>
        </CCard>
      )}

      {step === 2 && (
        <CCard>
          <CCardHeader>
            <h4>
              <CIcon icon={cilUserPlus} className="me-2" />
              Paso 2: Datos del Estudiante
            </h4>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel>Cédula del Estudiante *</CFormLabel>
                  <CFormInput
                    value={studentData.ci}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, ci: e.target.value }))}
                    placeholder="V-12345678"
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Nombres *</CFormLabel>
                  <CFormInput
                    value={studentData.name}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Apellidos *</CFormLabel>
                  <CFormInput
                    value={studentData.lastName}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel>Sexo *</CFormLabel>
                  <CFormSelect
                    value={studentData.sex}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, sex: e.target.value }))}
                    required
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Fecha de Nacimiento *</CFormLabel>
                  <CFormInput
                    type="date"
                    value={studentData.birthday}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, birthday: e.target.value }))}
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Lugar de Nacimiento</CFormLabel>
                  <CFormInput
                    value={studentData.placeBirth}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, placeBirth: e.target.value }))}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Cantidad de Hermanos</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    value={studentData.quantityBrothers}
                    onChange={(e) =>
                      setStudentData((prev) => ({ ...prev, quantityBrothers: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Nombre de la Madre</CFormLabel>
                  <CFormInput
                    value={studentData.motherName}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, motherName: e.target.value }))}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Teléfono de la Madre</CFormLabel>
                  <CFormInput
                    value={studentData.motherTelephone}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, motherTelephone: e.target.value }))}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Nombre del Padre</CFormLabel>
                  <CFormInput
                    value={studentData.fatherName}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, fatherName: e.target.value }))}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Teléfono del Padre</CFormLabel>
                  <CFormInput
                    value={studentData.fatherTelephone}
                    onChange={(e) => setStudentData((prev) => ({ ...prev, fatherTelephone: e.target.value }))}
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-between">
                <CButton color="secondary" onClick={() => setStep(1)}>
                  Volver
                </CButton>
                <CButton
                  color="success"
                  onClick={crearEstudiante}
                  disabled={
                    loading || !studentData.ci || !studentData.name || !studentData.lastName || !studentData.birthday
                  }
                >
                  {loading ? <CSpinner size="sm" /> : <CIcon icon={cilUserPlus} />}
                  {loading ? " Creando..." : " Crear Estudiante"}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </CContainer>
  )
}
