import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CFormSelect,
} from '@coreui/react'

const EnrollmentForm = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos del Estudiante
    cedulaEscolar: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    // Datos de los Padres
    nombrePadre: '',
    cedulaPadre: '',
    telefonoPadre: '',
    nombreMadre: '',
    cedulaMadre: '',
    telefonoMadre: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <div className="container py-4">
      <CCard>
        <CCardBody>
          {step === 1 && (
            <CForm className="row g-3">
              <CCardTitle>Datos del Estudiante</CCardTitle>
              <CCol md={6}>
                <CFormLabel>Cédula Escolar</CFormLabel>
                <CFormInput
                  name="cedulaEscolar"
                  value={formData.cedulaEscolar}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Nombres</CFormLabel>
                <CFormInput name="nombres" value={formData.nombres} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Apellidos</CFormLabel>
                <CFormInput name="apellidos" value={formData.apellidos} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Fecha de Nacimiento</CFormLabel>
                <CFormInput
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel>Sexo</CFormLabel>
                <CFormSelect>
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </CFormSelect>
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end">
                <CButton color="info " onClick={nextStep}>
                  Siguiente
                </CButton>
              </CCol>
            </CForm>
          )}

          {step === 2 && (
            <CForm className="row g-3">
              <CCardTitle>Datos de los Padres</CCardTitle>
              <CCol md={6}>
                <CFormLabel>Nombre del Padre</CFormLabel>
                <CFormInput
                  name="nombrePadre"
                  value={formData.nombrePadre}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Cédula del Padre</CFormLabel>
                <CFormInput
                  name="cedulaPadre"
                  value={formData.cedulaPadre}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Teléfono del Padre</CFormLabel>
                <CFormInput
                  name="telefonoPadre"
                  value={formData.telefonoPadre}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Nombre de la Madre</CFormLabel>
                <CFormInput
                  name="nombreMadre"
                  value={formData.nombreMadre}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Cédula de la Madre</CFormLabel>
                <CFormInput
                  name="cedulaMadre"
                  value={formData.cedulaMadre}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Teléfono de la Madre</CFormLabel>
                <CFormInput
                  name="telefonoMadre"
                  value={formData.telefonoMadre}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12} className="d-flex justify-content-between">
                <CButton color="warning" onClick={prevStep}>
                  Atrás
                </CButton>
                <CButton color="info" onClick={nextStep}>
                  Siguiente
                </CButton>
              </CCol>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default EnrollmentForm
