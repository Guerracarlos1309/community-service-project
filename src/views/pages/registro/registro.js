'use client'

import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CCardHeader,
  CFormCheck,
  CFormTextarea,
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
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
import { helpFetch } from '../../../api/helpFetch.js'

const api = helpFetch()

const RegistroEstudiantil = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para datos de la API
  const [grados, setGrados] = useState([])
  const [loadingGrados, setLoadingGrados] = useState(false)

  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    tipoIngreso: 'regular',
    grado: '',
    fechaInscripcion: new Date().toISOString().split('T')[0],
    plantelProcedencia: '',
    // Paso 2: Datos del estudiante
    cedulaEscolar: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    edad: '',
    sexo: '',
    lugarNacimiento: '',
    entidadFederal: '',
    municipio: '',
    parroquia: '',
    apreciacionCualitativa: 'no',
    repitiente: 'no',
    // Paso 3: Datos de los padres
    nombrePadre: '',
    cedulaPadre: '',
    telefonoPadre: '',
    nombreMadre: '',
    cedulaMadre: '',
    telefonoMadre: '',
    viveCon: 'ambos',
    // Paso 4: Datos del representante
    apellidosRepresentante: '',
    nombresRepresentante: '',
    cedulaRepresentante: '',
    edadRepresentante: '',
    fechaNacimientoRepresentante: '',
    estadoCivilRepresentante: '',
    nexoEstudiante: '',
    direccionHabitacion: '',
    telefonoCasa: '',
    telefonoCelular: '',
    profesion: '',
    lugarTrabajo: '',
    telefonoTrabajo: '',
    // Paso 5: Información del estudiante
    peso: '',
    estatura: '',
    tallaCamisa: '',
    tallaPantalon: '',
    tallaZapato: '',
    enfermedad: '',
    tieneHermanos: 'no',
    cuantosHermanos: '0',
    gradosHermanos: '',
    // Personas autorizadas
    personaAutorizada1: '',
    cedulaAutorizada1: '',
    parentescoAutorizada1: '',
    personaAutorizada2: '',
    cedulaAutorizada2: '',
    parentescoAutorizada2: '',
    // Paso 6: Requisitos
    actaNacimiento: false,
    tarjetaVacunas: false,
    fotosEstudiante: false,
    fotosRepresentante: false,
    copiaCedulaRepresentante: false,
    rifRepresentante: false,
    copiaCedulaAutorizados: false,
    observaciones: '',
  })

  // Cargar grados al montar el componente
  useEffect(() => {
    loadGrados()
  }, [])

  const loadGrados = async () => {
    try {
      setLoadingGrados(true)
      setError(null)
      console.log('🔄 Cargando grados...')
      const response = await api.get('/api/matriculas/utils/grados')
      if (!response.error) {
        setGrados(response.grados || [])
        console.log('✅ Grados cargados:', response.grados?.length || 0)
      } else {
        console.error('Error al obtener grados:', response)
        setError(response.msg || 'Error al cargar grados')
      }
    } catch (error) {
      console.error('❌ Error cargando grados:', error)
      setError(`Error al cargar grados: ${error.msg || error.message}`)
    } finally {
      setLoadingGrados(false)
    }
  }

  const validateForm = () => {
    // Validaciones básicas
    if (!formData.cedulaEscolar.trim()) {
      setError('La cédula escolar es requerida')
      return false
    }
    if (!formData.nombres.trim()) {
      setError('El nombre del estudiante es requerido')
      return false
    }
    if (!formData.apellidos.trim()) {
      setError('Los apellidos del estudiante son requeridos')
      return false
    }
    if (!formData.grado) {
      setError('Debe seleccionar un grado')
      return false
    }
    // Validaciones de medidas - MEJORADAS
    if (formData.peso && (isNaN(formData.peso) || Number.parseFloat(formData.peso) <= 0)) {
      setError('El peso debe ser un número válido mayor a 0')
      return false
    }
    if (
      formData.estatura &&
      (isNaN(formData.estatura) ||
        Number.parseFloat(formData.estatura) <= 0 ||
        Number.parseFloat(formData.estatura) > 3)
    ) {
      setError('La estatura debe ser un número válido entre 0 y 3 metros')
      return false
    }
    return true
  }

  // Función temporal para probar la API de matrículas
  const testMatriculasAPI = async () => {
    try {
      console.log('🧪 === TESTING API MATRICULAS ===')

      // Datos de prueba mínimos
      const testData = {
        studentData: {
          ci: 'V-12345678',
          name: 'Test',
          lastName: 'Student',
          birthday: '2010-01-01',
          sex: 'M',
        },
        registrationDate: new Date().toISOString().split('T')[0],
        entryType: 'nuevo',
        gradeID: 1,
        authorizedPersons: [],
      }

      console.log('📤 Enviando datos de prueba:', testData)

      const testResponse = await api.post('/api/matriculas', {
        body: testData,
      })

      console.log('📥 Respuesta de prueba:', testResponse)

      if (testResponse.error) {
        console.error('❌ Error en prueba:', testResponse.msg)
      } else {
        console.log('✅ Prueba exitosa')
      }
    } catch (error) {
      console.error('❌ Error en test:', error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)
      console.log('📝 Iniciando proceso de matrícula...')

      // Preparar datos para la matrícula - ESTRUCTURA CORREGIDA
      const matriculaData = {
        // El backend espera studentID, no studentData
        // Necesitamos crear el estudiante primero o enviar los datos de otra forma

        // OPCIÓN 1: Si el backend crea el estudiante automáticamente
        studentData: {
          ci: formData.cedulaEscolar,
          name: formData.nombres,
          lastName: formData.apellidos,
          birthday: formData.fechaNacimiento,
          age: formData.edad ? Number.parseInt(formData.edad) : null,
          sex: formData.sexo,
          placeBirth: formData.lugarNacimiento,
        },

        // Datos básicos de matrícula
        registrationDate: formData.fechaInscripcion,
        entryType: formData.tipoIngreso,
        previousSchool: formData.plantelProcedencia,
        gradeID: Number.parseInt(formData.grado),

        // TEMPORAL: sectionID como null o 1 por defecto hasta que se resuelva
        sectionID: 1, // O null, dependiendo de lo que acepte tu backend

        // Resto de datos...
        repeater: formData.repitiente === 'si',
        qualitativeAppreciation: formData.apreciacionCualitativa === 'si',
        federalEntity: formData.entidadFederal,
        municipality: formData.municipio,
        parish: formData.parroquia,

        // Medidas y salud - CORREGIR VALIDACIÓN DE ESTATURA
        chemiseSize: formData.tallaCamisa,
        pantsSize: formData.tallaPantalon,
        shoesSize: formData.tallaZapato,
        weight: formData.peso ? Number.parseFloat(formData.peso) : null,
        // Asegurar que la estatura esté en metros y sea válida
        stature: formData.estatura ? Math.min(Number.parseFloat(formData.estatura), 3.0) : null,
        diseases: formData.enfermedad,

        // Hermanos
        brothersInSchool: formData.tieneHermanos === 'si',
        brothersCount: Number.parseInt(formData.cuantosHermanos) || 0,
        brothersGrades: formData.gradosHermanos,

        // Documentos
        birthCertificateCheck: formData.actaNacimiento,
        vaccinationCardCheck: formData.tarjetaVacunas,
        studentPhotosCheck: formData.fotosEstudiante,
        representativePhotosCheck: formData.fotosRepresentante,
        representativeCopyIDCheck: formData.copiaCedulaRepresentante,
        rifRepresentativeCheck: formData.rifRepresentante,
        autorizedCopyIDCheck: formData.copiaCedulaAutorizados,

        // Observaciones
        observation: formData.observaciones,

        // Personas autorizadas
        authorizedPersons: [
          ...(formData.personaAutorizada1 && formData.cedulaAutorizada1
            ? [
                {
                  fullName: formData.personaAutorizada1,
                  ci: formData.cedulaAutorizada1,
                  relationship: formData.parentescoAutorizada1,
                },
              ]
            : []),
          ...(formData.personaAutorizada2 && formData.cedulaAutorizada2
            ? [
                {
                  fullName: formData.personaAutorizada2,
                  ci: formData.cedulaAutorizada2,
                  relationship: formData.parentescoAutorizada2,
                },
              ]
            : []),
        ],
      }

      console.log('📤 Enviando datos de matrícula:', matriculaData)
      console.log('🔍 Estructura detallada:')
      console.log('- studentData:', matriculaData.studentData)
      console.log('- gradeID:', matriculaData.gradeID)
      console.log('- authorizedPersons:', matriculaData.authorizedPersons)

      // Crear matrícula
      console.log('🌐 Enviando petición POST a /api/matriculas...')
      const response = await api.post('/api/matriculas', {
        body: matriculaData,
      })

      console.log('📥 Respuesta del servidor (completa):', JSON.stringify(response, null, 2))
      console.log('🔍 Análisis de respuesta:')
      console.log('- response.error:', response.error)
      console.log('- response.ok:', response.ok)
      console.log('- response.msg:', response.msg)
      console.log('- response.data:', response.data)
      console.log('- response.matricula:', response.matricula)
      console.log('- Todas las propiedades:', Object.keys(response))

      if (response.error) {
        console.error('❌ Error al crear matrícula:', response.msg || response)
        console.error('❌ Detalles del error:', response)
        setError(response.msg || 'Ocurrió un error al crear la matrícula')
        return
      }

      // Verificar si realmente se creó
      if (response.ok === false) {
        console.error('❌ Respuesta indica fallo:', response)

        // Manejar errores de validación específicos
        if (response.code === 'VALIDATION_ERROR' && response.errors) {
          const errorMessages = response.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(', ')
          setError(`Errores de validación: ${errorMessages}`)
        } else {
          setError(response.msg || 'Error desconocido al crear la matrícula')
        }
        return
      }

      console.log('✅ Matrícula creada exitosamente:', response)
      setSuccess('Matrícula creada exitosamente')

      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setSuccess(null)
        setStep(1)
        resetForm()
        setValidated(false)
      }, 3000)
    } catch (error) {
      console.error('❌ Error en el proceso de matrícula:', error)
      setError(`Error al procesar la matrícula: ${error.msg || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      tipoIngreso: 'regular',
      grado: '',
      fechaInscripcion: new Date().toISOString().split('T')[0],
      plantelProcedencia: '',
      cedulaEscolar: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      edad: '',
      sexo: '',
      lugarNacimiento: '',
      entidadFederal: '',
      municipio: '',
      parroquia: '',
      apreciacionCualitativa: 'no',
      repitiente: 'no',
      nombrePadre: '',
      cedulaPadre: '',
      telefonoPadre: '',
      nombreMadre: '',
      cedulaMadre: '',
      telefonoMadre: '',
      viveCon: 'ambos',
      apellidosRepresentante: '',
      nombresRepresentante: '',
      cedulaRepresentante: '',
      edadRepresentante: '',
      fechaNacimientoRepresentante: '',
      estadoCivilRepresentante: '',
      nexoEstudiante: '',
      direccionHabitacion: '',
      telefonoCasa: '',
      telefonoCelular: '',
      profesion: '',
      lugarTrabajo: '',
      telefonoTrabajo: '',
      peso: '',
      estatura: '',
      tallaCamisa: '',
      tallaPantalon: '',
      tallaZapato: '',
      enfermedad: '',
      tieneHermanos: 'no',
      cuantosHermanos: '0',
      gradosHermanos: '',
      personaAutorizada1: '',
      cedulaAutorizada1: '',
      parentescoAutorizada1: '',
      personaAutorizada2: '',
      cedulaAutorizada2: '',
      parentescoAutorizada2: '',
      actaNacimiento: false,
      tarjetaVacunas: false,
      fotosEstudiante: false,
      fotosRepresentante: false,
      copiaCedulaRepresentante: false,
      rifRepresentante: false,
      copiaCedulaAutorizados: false,
      observaciones: '',
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const nextStep = () => {
    setError(null) // Limpiar errores al avanzar
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setError(null) // Limpiar errores al retroceder
    setStep((prev) => prev - 1)
  }

  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  const schoolYear = `${currentYear}-${nextYear}`

  // Mostrar mensaje de éxito
  if (success && success.includes('exitosamente')) {
    return (
      <CAlert color="success" className="text-center">
        <h4>¡Matrícula guardada exitosamente!</h4>
        <p>La inscripción ha sido registrada correctamente en el sistema.</p>
        <CSpinner size="sm" className="me-2" />
        <span>Redirigiendo...</span>
      </CAlert>
    )
  }

  return (
    <div className="container py-4">
      {/* Alertas */}
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </CAlert>
      )}

      {success && !success.includes('exitosamente') && (
        <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
          <strong>Éxito:</strong> {success}
        </CAlert>
      )}

      {/* Paso 1: Información básica */}
      {step === 1 && (
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center bg-info text-white">
            <h4 className="mb-0">
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
            <CForm className="needs-validation" noValidate validated={validated}>
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
                      checked={formData.tipoIngreso === 'nuevo'}
                      onChange={handleChange}
                    />
                    <CFormCheck
                      inline
                      type="radio"
                      name="tipoIngreso"
                      id="ingresoRegular"
                      value="regular"
                      label="Regular"
                      checked={formData.tipoIngreso === 'regular'}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="grado">Grado</CFormLabel>
                  <CFormSelect
                    id="grado"
                    name="grado"
                    value={formData.grado}
                    onChange={handleChange}
                    required
                    disabled={loadingGrados}
                  >
                    <option value="">{loadingGrados ? 'Cargando...' : 'Seleccionar...'}</option>

                    {[...grados]
                      .sort((a, b) => a.id - b.id)
                      .map((grado) => (
                        <option key={grado.id} value={grado.id}>
                          {grado.name}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="fechaInscripcion">Fecha de Inscripción</CFormLabel>
                  <CFormInput
                    type="date"
                    id="fechaInscripcion"
                    name="fechaInscripcion"
                    value={formData.fechaInscripcion}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="plantelProcedencia">Plantel de Procedencia</CFormLabel>
                  <CFormInput
                    type="text"
                    id="plantelProcedencia"
                    name="plantelProcedencia"
                    value={formData.plantelProcedencia}
                    onChange={handleChange}
                    placeholder="Nombre del plantel anterior"
                  />
                </CCol>
              </CRow>

              <CCol xs={12} className="d-flex justify-content-end">
                <CButton color="info" onClick={nextStep}>
                  Siguiente
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      )}

      {/* Paso 2: Datos del estudiante */}
      {step === 2 && (
        <CCard className="mb-4">
          <CCardHeader className="bg-info text-white">
            <h5 className="mb-0">
              <CIcon icon={cilUser} className="me-2" />
              A. DATOS DEL ESTUDIANTE
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="cedulaEscolar">Cédula de Identidad o Escolar *</CFormLabel>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    id="cedulaEscolar"
                    name="cedulaEscolar"
                    value={formData.cedulaEscolar}
                    onChange={handleChange}
                    placeholder="Ej: V-11223344"
                    required
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CRow>
                  <CCol md={6}>
                    <CFormLabel htmlFor="apellidos">Apellidos</CFormLabel>
                    <CFormInput
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Apellidos del estudiante"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="nombres">Nombres</CFormLabel>
                    <CFormInput
                      type="text"
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
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
                <CFormInput
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="edad">Edad</CFormLabel>
                <CFormInput
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  min="3"
                  max="18"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="sexo">Sexo</CFormLabel>
                <CFormSelect
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
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
                  name="lugarNacimiento"
                  value={formData.lugarNacimiento}
                  onChange={handleChange}
                  placeholder="Ej: Hospital Central, San Cristóbal"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="entidadFederal">Entidad Federal</CFormLabel>
                <CFormInput
                  type="text"
                  id="entidadFederal"
                  name="entidadFederal"
                  value={formData.entidadFederal}
                  onChange={handleChange}
                  placeholder="Ej: Táchira"
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="municipio">Municipio</CFormLabel>
                <CFormInput
                  type="text"
                  id="municipio"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  placeholder="Ej: San Cristóbal"
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="parroquia">Parroquia</CFormLabel>
                <CFormInput
                  type="text"
                  id="parroquia"
                  name="parroquia"
                  value={formData.parroquia}
                  onChange={handleChange}
                  placeholder="Ej: Pedro María Morantes"
                />
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
                    checked={formData.apreciacionCualitativa === 'si'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="apreciacionCualitativa"
                    id="apreciacionNo"
                    value="no"
                    label="No"
                    checked={formData.apreciacionCualitativa === 'no'}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Repitiente</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="repitiente"
                    id="repitienteSi"
                    value="si"
                    label="Si"
                    checked={formData.repitiente === 'si'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="repitiente"
                    id="repitienteNo"
                    value="no"
                    label="No"
                    checked={formData.repitiente === 'no'}
                    onChange={handleChange}
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

      {/* Paso 3: Datos de los padres */}
      {step === 3 && (
        <CCard className="mb-4">
          <CCardHeader className="bg-info text-white">
            <h5 className="mb-0">
              <CIcon icon={cilPeople} className="me-2" />
              B. DATOS DE LOS PADRES
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={5}>
                <CFormLabel htmlFor="nombrePadre">Nombre del Padre</CFormLabel>
                <CFormInput
                  type="text"
                  id="nombrePadre"
                  name="nombrePadre"
                  value={formData.nombrePadre}
                  onChange={handleChange}
                  placeholder="Nombre completo del padre"
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaPadre">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaPadre"
                  name="cedulaPadre"
                  value={formData.cedulaPadre}
                  onChange={handleChange}
                  placeholder="Ej: V-12345678"
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="telefonoPadre">Teléfono</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    type="tel"
                    id="telefonoPadre"
                    name="telefonoPadre"
                    value={formData.telefonoPadre}
                    onChange={handleChange}
                    placeholder="Ej: 0414-1234567"
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={5}>
                <CFormLabel htmlFor="nombreMadre">Nombre de la Madre</CFormLabel>
                <CFormInput
                  type="text"
                  id="nombreMadre"
                  name="nombreMadre"
                  value={formData.nombreMadre}
                  onChange={handleChange}
                  placeholder="Nombre completo de la madre"
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaMadre">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaMadre"
                  name="cedulaMadre"
                  value={formData.cedulaMadre}
                  onChange={handleChange}
                  placeholder="Ej: V-12345678"
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="telefonoMadre">Teléfono</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    type="tel"
                    id="telefonoMadre"
                    name="telefonoMadre"
                    value={formData.telefonoMadre}
                    onChange={handleChange}
                    placeholder="Ej: 0414-1234567"
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Vive con</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="viveCon"
                    id="viveConPadre"
                    value="padre"
                    label="Padre"
                    checked={formData.viveCon === 'padre'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="viveCon"
                    id="viveConMadre"
                    value="madre"
                    label="Madre"
                    checked={formData.viveCon === 'madre'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="viveCon"
                    id="viveConAmbos"
                    value="ambos"
                    label="Ambos"
                    checked={formData.viveCon === 'ambos'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="viveCon"
                    id="viveConOtros"
                    value="otros"
                    label="Otros"
                    checked={formData.viveCon === 'otros'}
                    onChange={handleChange}
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

      {/* Paso 4: Datos del representante */}
      {step === 4 && (
        <CCard className="mb-4">
          <CCardHeader className="bg-info text-white">
            <h5 className="mb-0">
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
                  name="apellidosRepresentante"
                  value={formData.apellidosRepresentante}
                  onChange={handleChange}
                  placeholder="Apellidos del representante"
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="nombresRepresentante">Nombres</CFormLabel>
                <CFormInput
                  type="text"
                  id="nombresRepresentante"
                  name="nombresRepresentante"
                  value={formData.nombresRepresentante}
                  onChange={handleChange}
                  placeholder="Nombres del representante"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="cedulaRepresentante">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaRepresentante"
                  name="cedulaRepresentante"
                  value={formData.cedulaRepresentante}
                  onChange={handleChange}
                  placeholder="Ej: V-12345678"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="edadRepresentante">Edad</CFormLabel>
                <CFormInput
                  type="number"
                  id="edadRepresentante"
                  name="edadRepresentante"
                  value={formData.edadRepresentante}
                  onChange={handleChange}
                  min="18"
                  max="99"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="fechaNacimientoRepresentante">Fecha de Nacimiento</CFormLabel>
                <CFormInput
                  type="date"
                  id="fechaNacimientoRepresentante"
                  name="fechaNacimientoRepresentante"
                  value={formData.fechaNacimientoRepresentante}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="estadoCivilRepresentante">Estado Civil</CFormLabel>
                <CFormSelect
                  id="estadoCivilRepresentante"
                  name="estadoCivilRepresentante"
                  value={formData.estadoCivilRepresentante}
                  onChange={handleChange}
                  required
                >
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
                <CFormSelect
                  id="nexoEstudiante"
                  name="nexoEstudiante"
                  value={formData.nexoEstudiante}
                  onChange={handleChange}
                  required
                >
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
                    name="direccionHabitacion"
                    value={formData.direccionHabitacion}
                    onChange={handleChange}
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
                  <CFormInput
                    type="tel"
                    id="telefonoCasa"
                    name="telefonoCasa"
                    value={formData.telefonoCasa}
                    onChange={handleChange}
                    placeholder="Ej: 0276-1234567"
                  />
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
                    name="telefonoCelular"
                    value={formData.telefonoCelular}
                    onChange={handleChange}
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
                  name="profesion"
                  value={formData.profesion}
                  onChange={handleChange}
                  placeholder="Ej: Docente, Ingeniero, etc."
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="lugarTrabajo">Lugar de Trabajo</CFormLabel>
                <CFormInput
                  type="text"
                  id="lugarTrabajo"
                  name="lugarTrabajo"
                  value={formData.lugarTrabajo}
                  onChange={handleChange}
                  placeholder="Nombre de la empresa o institución"
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="telefonoTrabajo">Teléfono Trabajo</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    type="tel"
                    id="telefonoTrabajo"
                    name="telefonoTrabajo"
                    value={formData.telefonoTrabajo}
                    onChange={handleChange}
                    placeholder="Ej: 0276-1234567"
                  />
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

      {/* Paso 5: Información del estudiante */}
      {step === 5 && (
        <CCard className="mb-4">
          <CCardHeader className="bg-info text-white">
            <h5 className="mb-0">
              <CIcon icon={cilNotes} className="me-2" />
              D. INFORMACIÓN DEL ESTUDIANTE
            </h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={2}>
                <CFormLabel htmlFor="peso">Peso (Kg)</CFormLabel>
                <CFormInput
                  type="number"
                  id="peso"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="estatura">Estatura (m)</CFormLabel>
                <CFormInput
                  type="number"
                  id="estatura"
                  name="estatura"
                  value={formData.estatura}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="tallaCamisa">Talla Camisa</CFormLabel>
                <CFormSelect
                  id="tallaCamisa"
                  name="tallaCamisa"
                  value={formData.tallaCamisa}
                  onChange={handleChange}
                  required
                >
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
                <CFormSelect
                  id="tallaPantalon"
                  name="tallaPantalon"
                  value={formData.tallaPantalon}
                  onChange={handleChange}
                  required
                >
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
                <CFormSelect
                  id="tallaZapato"
                  name="tallaZapato"
                  value={formData.tallaZapato}
                  onChange={handleChange}
                  required
                >
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
                    name="enfermedad"
                    value={formData.enfermedad}
                    onChange={handleChange}
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
                    checked={formData.tieneHermanos === 'si'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="tieneHermanos"
                    id="tieneHermanosNo"
                    value="no"
                    label="No"
                    checked={formData.tieneHermanos === 'no'}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cuantosHermanos">Cuántos</CFormLabel>
                <CFormInput
                  type="number"
                  id="cuantosHermanos"
                  name="cuantosHermanos"
                  value={formData.cuantosHermanos}
                  onChange={handleChange}
                  min="0"
                  max="10"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="gradosHermanos">En cuáles Grados</CFormLabel>
                <CFormInput
                  type="text"
                  id="gradosHermanos"
                  name="gradosHermanos"
                  value={formData.gradosHermanos}
                  onChange={handleChange}
                  placeholder="Ej: 3° y 5° grado"
                />
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
                  name="personaAutorizada1"
                  value={formData.personaAutorizada1}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaAutorizada1">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaAutorizada1"
                  name="cedulaAutorizada1"
                  value={formData.cedulaAutorizada1}
                  onChange={handleChange}
                  placeholder="Ej: V-12345678"
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="parentescoAutorizada1">Parentesco</CFormLabel>
                <CFormInput
                  type="text"
                  id="parentescoAutorizada1"
                  name="parentescoAutorizada1"
                  value={formData.parentescoAutorizada1}
                  onChange={handleChange}
                  placeholder="Ej: Abuela, Tío, etc."
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="personaAutorizada2">Nombre y Apellido</CFormLabel>
                <CFormInput
                  type="text"
                  id="personaAutorizada2"
                  name="personaAutorizada2"
                  value={formData.personaAutorizada2}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="cedulaAutorizada2">Cédula</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaAutorizada2"
                  name="cedulaAutorizada2"
                  value={formData.cedulaAutorizada2}
                  onChange={handleChange}
                  placeholder="Ej: V-12345678"
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="parentescoAutorizada2">Parentesco</CFormLabel>
                <CFormInput
                  type="text"
                  id="parentescoAutorizada2"
                  name="parentescoAutorizada2"
                  value={formData.parentescoAutorizada2}
                  onChange={handleChange}
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

      {/* Paso 6: Requisitos y envío final */}
      {step === 6 && (
        <CCard className="mb-4">
          <CCardHeader className="bg-info text-white">
            <h5 className="mb-0">
              <CIcon icon={cilNotes} className="me-2" />
              E. REQUISITOS DE INSCRIPCIÓN ENTREGADOS
            </h5>
          </CCardHeader>
          <CCardBody>
            <CForm
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
              validated={validated}
            >
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
                            <CFormCheck
                              id="actaNacimiento"
                              name="actaNacimiento"
                              checked={formData.actaNacimiento}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center">
                            <CFormCheck
                              id="tarjetaVacunas"
                              name="tarjetaVacunas"
                              checked={formData.tarjetaVacunas}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center">
                            <CFormCheck
                              id="fotosEstudiante"
                              name="fotosEstudiante"
                              checked={formData.fotosEstudiante}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center">
                            <CFormCheck
                              id="fotosRepresentante"
                              name="fotosRepresentante"
                              checked={formData.fotosRepresentante}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center">
                            <CFormCheck
                              id="copiaCedulaRepresentante"
                              name="copiaCedulaRepresentante"
                              checked={formData.copiaCedulaRepresentante}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center">
                            <CFormCheck
                              id="rifRepresentante"
                              name="rifRepresentante"
                              checked={formData.rifRepresentante}
                              onChange={handleChange}
                            />
                          </td>
                          <td className="text-center">
                            <CFormCheck
                              id="copiaCedulaAutorizados"
                              name="copiaCedulaAutorizados"
                              checked={formData.copiaCedulaAutorizados}
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="observaciones">Observaciones</CFormLabel>
                  <CFormTextarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ingrese cualquier observación relevante..."
                  />
                </CCol>
              </CRow>

              <CCol xs={12} className="d-flex justify-content-between">
                <CButton color="warning" onClick={prevStep}>
                  Atrás
                </CButton>
                <CButton color="danger" type="button" onClick={resetForm}>
                  Cancelar
                </CButton>
                <CButton color="success" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
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

export default RegistroEstudiantil
