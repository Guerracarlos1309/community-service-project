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
  CCardHeader,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CCardFooter,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilPeople,
  cilPhone,
  cilHome,
  cilNotes,
  cilMedicalCross,
  cilSave,
} from '@coreui/icons'

const registroEstudiantil = () => {
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

  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  const schoolYear = `${currentYear}-${nextYear}`

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    setLoading(true)

    // Simulación de envío de datos
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      // Resetear el formulario después de 3 segundos
      setTimeout(() => {
        setSuccess(false)
        form.reset()
        setValidated(false)
      }, 3000)
    }, 2000)
  }

  return (
    <div className="container py-4">
      {step === 1 && (
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h4>
              <CIcon icon={cilUser} className="me-2" />
              FICHA DE INSCRIPCION ESCOLAR {schoolYear}
            </h4>
            <div>
              <img
                src="/src/assets/brand/logojgm.png"
                alt="Logo Escuela"
                style={{ height: '40px', marginRight: '10px' }}
              />
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CRow className="mb-4">
                <CCol md={3}>
                  <CFormLabel>Tipo de Ingreso</CFormLabel>
                  <div>
                    <CFormCheck
                      inline
                      type="radio"
                      name="tipoIngreso"
                      id="ingresoNuevo"
                      value="nuevo"
                      label="Nuevo Ingreso"
                    />
                    <CFormCheck
                      inline
                      type="radio"
                      name="tipoIngreso"
                      id="ingresoRegular"
                      value="regular"
                      label="Regular"
                      defaultChecked
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Nivel</CFormLabel>
                  <div>
                    <CFormCheck
                      inline
                      type="radio"
                      name="nivel"
                      id="nivelPreescolar"
                      value="preescolar"
                      label="Preescolar"
                    />
                    <CFormCheck
                      inline
                      type="radio"
                      name="nivel"
                      id="nivelPrimaria"
                      value="primaria"
                      label="Primaria"
                      defaultChecked
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="grado">Grado</CFormLabel>
                  <CFormSelect id="grado" required>
                    <option value="">Seleccionar...</option>
                    <option value="1">1°er Grado</option>
                    <option value="2">2°do Grado</option>
                    <option value="3">3°er Grado</option>
                    <option value="4">4°to Grado</option>
                    <option value="5">5°to Grado</option>
                    <option value="6">6°to Grado</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="seccion">Sección</CFormLabel>
                  <CFormSelect id="seccion" required>
                    <option value="">Seleccionar...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel required htmlFor="fechaInscripcion">
                    Fecha de Inscripción
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    id="fechaInscripcion"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel required htmlFor="plantelProcedencia">
                    Plantel de Procedencia
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="plantelProcedencia"
                    placeholder="Nombre del plantel anterior"
                  />
                </CCol>
              </CRow>

              <CCol xs={12} className="d-flex justify-content-end">
                <CButton color="info " onClick={nextStep}>
                  Siguiente
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      )}

      {step === 2 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <CIcon icon={cilUser} className="me-2" />
              A. DATOS DEL ESTUDIANTE
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="cedulaEscolar">Cédula de Identidad o Escolar</CFormLabel>
                <CFormInput type="text" id="cedulaEscolar" placeholder="Ej: V-11223344" required />
              </CCol>
              <CCol md={6}>
                <CRow>
                  <CCol md={6}>
                    <CFormLabel htmlFor="apellidos">Apellidos</CFormLabel>
                    <CFormInput
                      type="text"
                      id="apellidos"
                      placeholder="Apellidos del estudiante"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="nombres">Nombres</CFormLabel>
                    <CFormInput
                      type="text"
                      id="nombres"
                      placeholder="Nombres del estudiante"
                      required
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}>
                <CFormLabel htmlFor="fechaNacimiento">Fecha de Nacimiento</CFormLabel>
                <CFormInput type="date" id="fechaNacimiento" required />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="edad">Edad</CFormLabel>
                <CFormInput type="number" id="edad" min="3" max="18" required />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="sexo">Sexo</CFormLabel>
                <CFormSelect id="sexo" required>
                  <option value="">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </CFormSelect>
              </CCol>
              <CCol md={5}>
                <CFormLabel htmlFor="lugarNacimiento">Lugar de Nacimiento</CFormLabel>
                <CFormInput
                  type="text"
                  id="lugarNacimiento"
                  placeholder="Ej: Hospital Central, San Cristóbal"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="entidadFederal">Entidad Federal</CFormLabel>
                <CFormInput type="text" id="entidadFederal" placeholder="Ej: Táchira" required />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="municipio">Municipio</CFormLabel>
                <CFormInput type="text" id="municipio" placeholder="Ej: San Cristóbal" required />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="parroquia">Parroquia</CFormLabel>
                <CFormInput type="text" id="parroquia" placeholder="Ej: Pedro María Morantes" />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Apreciación Cualitativa Año Anterior</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="apreciacionCualitativa"
                    id="apreciacionSi"
                    value="si"
                    label="Si"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="apreciacionCualitativa"
                    id="apreciacionNo"
                    value="no"
                    label="No"
                    defaultChecked
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="repitiente">Repitiente</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="repitiente"
                    id="repitienteSi"
                    value="si"
                    label="Si"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="repitiente"
                    id="repitienteNo"
                    value="no"
                    label="No"
                    defaultChecked
                  />
                </div>
              </CCol>
            </CRow>

            <CCol xs={12} className="d-flex justify-content-between">
              <CButton color="warning" onClick={prevStep}>
                Atrás
              </CButton>
              <CButton color="info" onClick={nextStep}>
                Siguiente
              </CButton>
            </CCol>
          </CCardBody>
        </CCard>
      )}

      {step === 3 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <CIcon icon={cilPeople} className="me-2" />
              B. DATOS DE LOS PADRES
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={5}>
                <CFormLabel htmlFor="nombrePadre">Nombre del Padre</CFormLabel>
                <CFormInput type="text" id="nombrePadre" placeholder="Nombre completo del padre" />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaPadre">Cédula</CFormLabel>
                <CFormInput type="text" id="cedulaPadre" placeholder="Ej: V-12345678" />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="telefonoPadre">Teléfono</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput type="tel" id="telefonoPadre" placeholder="Ej: 0414-1234567" />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={5}>
                <CFormLabel htmlFor="nombreMadre">Nombre de la Madre</CFormLabel>
                <CFormInput
                  type="text"
                  id="nombreMadre"
                  placeholder="Nombre completo de la madre"
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaMadre">Cédula</CFormLabel>
                <CFormInput type="text" id="cedulaMadre" placeholder="Ej: V-12345678" />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="telefonoMadre">Teléfono</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput type="tel" id="telefonoMadre" placeholder="Ej: 0414-1234567" />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Vive con</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="checkbox"
                    name="viveCon"
                    id="viveConPadre"
                    value="padre"
                    label="Padre"
                  />
                  <CFormCheck
                    inline
                    type="checkbox"
                    name="viveCon"
                    id="viveConMadre"
                    value="madre"
                    label="Madre"
                  />
                  <CFormCheck
                    inline
                    type="checkbox"
                    name="viveCon"
                    id="viveConAmbos"
                    value="ambos"
                    label="Ambos"
                    defaultChecked
                  />
                  <CFormCheck
                    inline
                    type="checkbox"
                    name="viveCon"
                    id="viveConOtros"
                    value="otros"
                    label="Otros"
                  />
                </div>
              </CCol>
            </CRow>

            <CCol xs={12} className="d-flex justify-content-between">
              <CButton color="warning" onClick={prevStep}>
                Atrás
              </CButton>
              <CButton color="info" onClick={nextStep}>
                Siguiente
              </CButton>
            </CCol>
          </CCardBody>
        </CCard>
      )}

      {step === 4 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <CIcon icon={cilPeople} className="me-2" />
              C. DATOS DEL REPRESENTANTE
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="apellidosRepresentante">Apellidos</CFormLabel>
                <CFormInput
                  type="text"
                  id="apellidosRepresentante"
                  placeholder="Apellidos del representante"
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="nombresRepresentante">Nombres</CFormLabel>
                <CFormInput
                  type="text"
                  id="nombresRepresentante"
                  placeholder="Nombres del representante"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="cedulaRepresentante">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaRepresentante"
                  placeholder="Ej: V-12345678"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="edadRepresentante">Edad</CFormLabel>
                <CFormInput type="number" id="edadRepresentante" min="18" max="99" required />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="fechaNacimientoRepresentante">Fecha de Nacimiento</CFormLabel>
                <CFormInput type="date" id="fechaNacimientoRepresentante" required />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="estadoCivilRepresentante">Estado Civil</CFormLabel>
                <CFormSelect id="estadoCivilRepresentante" required>
                  <option value="">Seleccionar...</option>
                  <option value="soltero">Soltero(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viudo">Viudo(a)</option>
                  <option value="concubinato">Concubinato</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="nexoEstudiante">Parentesco con el Estudiante</CFormLabel>
                <CFormSelect id="nexoEstudiante" required>
                  <option value="">Seleccionar...</option>
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="abuelo">Abuelo(a)</option>
                  <option value="tio">Tío(a)</option>
                  <option value="hermano">Hermano(a)</option>
                  <option value="otro">Otro</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="direccionHabitacion">Dirección de Habitación</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    id="direccionHabitacion"
                    placeholder="Dirección completa"
                    required
                  />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="telefonoCasa">Teléfono Casa</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput type="tel" id="telefonoCasa" placeholder="Ej: 0276-1234567" />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="telefonoCelular">Teléfono Celular</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    type="tel"
                    id="telefonoCelular"
                    placeholder="Ej: 0414-1234567"
                    required
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="profesion">Profesión</CFormLabel>
                <CFormInput
                  type="text"
                  id="profesion"
                  placeholder="Ej: Docente, Ingeniero, etc."
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="lugarTrabajo">Lugar de Trabajo</CFormLabel>
                <CFormInput
                  type="text"
                  id="lugarTrabajo"
                  placeholder="Nombre de la empresa o institución"
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="telefonoTrabajo">Teléfono Trabajo</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput type="tel" id="telefonoTrabajo" placeholder="Ej: 0276-1234567" />
                </CInputGroup>
              </CCol>
            </CRow>

            <CCol xs={12} className="d-flex justify-content-between">
              <CButton color="warning" onClick={prevStep}>
                Atrás
              </CButton>
              <CButton color="info" onClick={nextStep}>
                Siguiente
              </CButton>
            </CCol>
          </CCardBody>
        </CCard>
      )}

      {step === 5 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <CIcon icon={cilNotes} className="me-2" />
              D. INFORMACIÓN DEL ESTUDIANTE
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={2}>
                <CFormLabel htmlFor="peso">Peso (Kg)</CFormLabel>
                <CFormInput type="number" id="peso" step="0.01" required />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="estatura">Estatura (m)</CFormLabel>
                <CFormInput type="number" id="estatura" step="0.01" required />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="tallaCamisa">Talla Camisa</CFormLabel>
                <CFormSelect id="tallaCamisa" required>
                  <option value="">Seleccionar...</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="tallaPantalon">Talla Pantalón</CFormLabel>
                <CFormSelect id="tallaPantalon" required>
                  <option value="">Seleccionar...</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="tallaZapato">Talla Zapato</CFormLabel>
                <CFormSelect id="tallaZapato" required>
                  <option value="">Seleccionar...</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                  <option value="32">32</option>
                  <option value="33">33</option>
                  <option value="34">34</option>
                  <option value="35">35</option>
                  <option value="36">36</option>
                  <option value="37">37</option>
                  <option value="38">38</option>
                  <option value="39">39</option>
                  <option value="40">40</option>
                  <option value="41">41</option>
                  <option value="42">42</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="enfermedad">Enfermedad que padece</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilMedicalCross} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    id="enfermedad"
                    placeholder="Indique si padece alguna enfermedad"
                  />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CFormLabel>Tiene hermanos estudiando en la escuela</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="tieneHermanos"
                    id="tieneHermanosSi"
                    value="si"
                    label="Si"
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="tieneHermanos"
                    id="tieneHermanosNo"
                    value="no"
                    label="No"
                    defaultChecked
                  />
                </div>
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cuantosHermanos">Cuántos</CFormLabel>
                <CFormInput type="number" id="cuantosHermanos" min="0" max="10" defaultValue="0" />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="gradosHermanos">En cuáles Grados</CFormLabel>
                <CFormInput type="text" id="gradosHermanos" placeholder="Ej: 3° y 5° grado" />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Personas autorizadas para retirar al niño de la escuela</CFormLabel>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="personaAutorizada1">Nombre y Apellido</CFormLabel>
                <CFormInput
                  type="text"
                  id="personaAutorizada1"
                  placeholder="Nombre completo"
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaAutorizada1">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaAutorizada1"
                  placeholder="Ej: V-12345678"
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="parentescoAutorizada1">Parentesco</CFormLabel>
                <CFormInput
                  type="text"
                  id="parentescoAutorizada1"
                  placeholder="Ej: Abuela, Tío, etc."
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="personaAutorizada2">Nombre y Apellido</CFormLabel>
                <CFormInput type="text" id="personaAutorizada2" placeholder="Nombre completo" />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaAutorizada2">Cédula</CFormLabel>
                <CFormInput type="text" id="cedulaAutorizada2" placeholder="Ej: V-12345678" />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="parentescoAutorizada2">Parentesco</CFormLabel>
                <CFormInput
                  type="text"
                  id="parentescoAutorizada2"
                  placeholder="Ej: Abuela, Tío, etc."
                />
              </CCol>
            </CRow>

            <CCol xs={12} className="d-flex justify-content-between">
              <CButton color="warning" onClick={prevStep}>
                Atrás
              </CButton>
              <CButton color="info" onClick={nextStep}>
                Siguiente
              </CButton>
            </CCol>
          </CCardBody>
        </CCard>
      )}

      {step === 6 && (
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <CIcon icon={cilNotes} className="me-2" />
              E. REQUISITOS DE INSCRIPCIÓN ENTREGADOS
            </h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={12}>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Acta de Nacimiento</th>
                          <th>Tarjeta de Vacunas</th>
                          <th>Fotos del Estudiante</th>
                          <th>Fotos del Representante</th>
                          <th>Copia de la Cédula de Identidad del Representante</th>
                          <th>RIF del Representante</th>
                          <th>Copia de la Cédula de Identidad de Personas Autorizadas</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">
                            <CFormCheck id="actaNacimiento" />
                          </td>
                          <td className="text-center">
                            <CFormCheck id="tarjetaVacunas" />
                          </td>
                          <td className="text-center">
                            <CFormCheck id="fotosEstudiante" />
                          </td>
                          <td className="text-center">
                            <CFormCheck id="fotosRepresentante" />
                          </td>
                          <td className="text-center">
                            <CFormCheck id="copiaCedulaRepresentante" />
                          </td>
                          <td className="text-center">
                            <CFormCheck id="rifRepresentante" />
                          </td>
                          <td className="text-center">
                            <CFormCheck id="copiaCedulaAutorizados" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCol>
              </CRow>

              <CCardHeader>
                <h5>
                  <CIcon icon={cilNotes} className="me-2" />
                  Observaciones
                </h5>
              </CCardHeader>
              <CCardBody>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormTextarea
                      id="observaciones"
                      rows={3}
                      placeholder="Ingrese cualquier observación relevante..."
                    />
                  </CCol>
                </CRow>
              </CCardBody>

              <CCol xs={12} className="d-flex justify-content-between">
                <CButton color="warning" onClick={prevStep}>
                  Atrás
                </CButton>
                <CButton color="danger" type="button">
                  Cancelar
                </CButton>
                <CButton color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Guardar Inscripción
                    </>
                  )}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default registroEstudiantil
