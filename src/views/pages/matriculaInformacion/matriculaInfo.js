import { useState, useEffect } from 'react'
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CContainer,
  CSpinner,
  CAlert,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import { helpFetch } from '../../../api/helpFetch.js'

const api = helpFetch()

// ✅ Colocada antes de usarla
const adaptMatriculaData = (raw) => {
  return {
    ...raw,
    estudiante: {
      nombres: raw.student_name,
      apellidos: raw.student_lastName,
      cedula_escolar: raw.student_school_id,
      fecha_nacimiento: raw.student_birthday,
      lugar_nacimiento: raw.student_birthplace_name,
      sexo: raw.student_sex,
      edad: calcularEdad(raw.student_birthday),
      cantidad_hermanos: raw.student_sibling_count,
      vive_con_madre: raw.lives_with_mother,
      vive_con_padre: raw.lives_with_father,
      vive_con_ambos: raw.lives_with_both,
      vive_con_representante: raw.lives_with_representative,
    },
    grado: {
      nombre: raw.grade_name,
    },
    seccion: {
      nombre: raw.section_name,
      periodo: raw.period,
    },
    representante: {
      nombres: raw.representative_name,
      apellidos: raw.representative_lastName,
      cedula: raw.representative_ci,
      telefono_celular: raw.representative_phoneNumber,
      email: raw.representative_email,
      direccion_habitacion: raw.representative_address,
      lugar_trabajo: raw.representative_workplace,
      telefono_trabajo: raw.representative_work_phone,
    },
    fecha_inscripcion: raw.registrationDate,
    tipo_ingreso: raw.repeater ? 'Repitiente' : 'Nuevo ingreso',
    datos_fisicos: {
      peso: raw.weight,
      estatura: raw.stature,
      talla_camisa: raw.chemiseSize,
      talla_pantalon: raw.pantsSize,
      talla_zapato: raw.shoesSize,
      enfermedad: raw.diseases,
      tiene_hermanos: raw.student_sibling_count > 0,
      cuantos_hermanos: raw.student_sibling_count,
      grados_hermanos: raw.grados_hermanos,
      personas_autorizadas: raw.autorizedCopyIDCheck || null,
    },
    datos_familiares: {
      nombre_padre: raw.nombre_padre,
      cedula_padre: raw.cedula_padre,
      telefono_padre: raw.telefono_padre,
      nombre_madre: raw.nombre_madre,
      cedula_madre: raw.cedula_madre,
      telefono_madre: raw.telefono_madre,
      vive_con: raw.vive_con,
    },
    periodo_escolar: raw.period,
    plantel_procedencia: raw.plantel_procedencia,
  }
}

const calcularEdad = (fecha) => {
  if (!fecha) return null
  const nacimiento = new Date(fecha)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

const MatriculaInfo = ({ matriculaId }) => {
  const [activeTab, setActiveTab] = useState('datosGenerales')
  const [matriculaData, setMatriculaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para datos de utilidad
  const [grados, setGrados] = useState([])
  const [docenteGrados, setDocenteGrados] = useState([])

  useEffect(() => {
    if (matriculaId) {
      loadMatriculaData()
      loadUtilityData()
    }
  }, [matriculaId])

  const loadMatriculaData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get(`/api/matriculas/${matriculaId}`)

      if (response.ok) {
        const adaptada = adaptMatriculaData(response.matricula)
        setMatriculaData(adaptada)
      } else {
        setError(response.msg || 'Error al cargar los datos de la matrícula')
      }
    } catch (error) {
      console.error('❌ Error en loadMatriculaData:', error)
      setError('Error al cargar los datos de la matrícula')
    } finally {
      setLoading(false)
    }
  }

  const loadUtilityData = async () => {
    try {
      const [gradosResponse, docenteGradosResponse] = await Promise.all([
        api.get('/api/matriculas/utils/grados'),
        api.get('/api/matriculas/utils/docente-grados'),
      ])

      if (gradosResponse.ok) {
        setGrados(gradosResponse.grados || [])
      }

      if (docenteGradosResponse.ok) {
        setDocenteGrados(docenteGradosResponse.docente_grados || [])
      }
    } catch (error) {
      console.error('❌ Error cargando datos de utilidad:', error)
    }
  }

  const getGradoName = (gradoId) => {
    const grado = grados.find((g) => g.id === gradoId || g.id == gradoId)
    return grado ? grado.nombre : 'No especificado'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatPhone = (phone) => {
    if (!phone) return '-'
    return phone
  }

  if (loading) {
    return (
      <CContainer>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '400px' }}
        >
          <CSpinner color="primary" size="lg" />
          <span className="ms-2">Cargando información de matrícula...</span>
        </div>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">
          <strong>Error:</strong> {error}
        </CAlert>
      </CContainer>
    )
  }

  if (!matriculaData) {
    return (
      <CContainer>
        <CAlert color="warning">No se encontraron datos de matrícula.</CAlert>
      </CContainer>
    )
  }

  // Extraer datos del objeto matriculaData
  const {
    estudiante,
    grado,
    seccion,
    periodo_escolar,
    fecha_inscripcion,
    plantel_procedencia,
    tipo_ingreso,
    // Datos del estudiante
    representante,
    datos_fisicos,
    datos_familiares,
  } = matriculaData

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h2 className="mb-0 text-center">
            Detalle de Matrícula - {estudiante?.nombres} {estudiante?.apellidos}
          </h2>
        </CCardHeader>
        <CCardBody>
          <CNav variant="tabs" role="tablist" className="mb-4">
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === 'datosGenerales'}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('datosGenerales')
                }}
              >
                Datos Generales
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === 'datosPersonales'}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('datosPersonales')
                }}
              >
                Datos Personales
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === 'datosFamiliares'}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('datosFamiliares')
                }}
              >
                Datos Familiares
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === 'datosRepresentante'}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('datosRepresentante')
                }}
              >
                Representante
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === 'datosFisicos'}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('datosFisicos')
                }}
              >
                Datos Físicos
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            {/* Datos Generales */}
            <CTabPane visible={activeTab === 'datosGenerales'}>
              <CTable striped bordered hover>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40%' }}>Tipo de Ingreso</CTableHeaderCell>
                    <CTableDataCell>{tipo_ingreso || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Período Escolar</CTableHeaderCell>
                    <CTableDataCell>{periodo_escolar || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Grado</CTableHeaderCell>
                    <CTableDataCell>
                      {getGradoName(grado?.id) || grado?.nombre || '-'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Sección</CTableHeaderCell>
                    <CTableDataCell>{seccion?.nombre || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fecha de Inscripción</CTableHeaderCell>
                    <CTableDataCell>{formatDate(fecha_inscripcion)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Plantel de Procedencia</CTableHeaderCell>
                    <CTableDataCell>{plantel_procedencia || '-'}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Datos Personales */}
            <CTabPane visible={activeTab === 'datosPersonales'}>
              <CTable striped bordered hover>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40%' }}>Cédula Escolar</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.cedula_escolar || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Apellidos</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.apellidos || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Nombres</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.nombres || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                    <CTableDataCell>{formatDate(estudiante?.fecha_nacimiento)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Edad</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.edad || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.sexo || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Lugar de Nacimiento</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.lugar_nacimiento || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Entidad Federal</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.entidad_federal || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Municipio</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.municipio || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Parroquia</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.parroquia || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Apreciación Cualitativa</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color={estudiante?.apreciacion_cualitativa ? 'success' : 'secondary'}>
                        {estudiante?.apreciacion_cualitativa ? 'Sí' : 'No'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Repitiente</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color={estudiante?.repitiente ? 'warning' : 'success'}>
                        {estudiante?.repitiente ? 'Sí' : 'No'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Datos Familiares */}
            <CTabPane visible={activeTab === 'datosFamiliares'}>
              <CTable striped bordered hover>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40%' }}>Nombre del Padre</CTableHeaderCell>
                    <CTableDataCell>{datos_familiares?.nombre_padre || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Cédula del Padre</CTableHeaderCell>
                    <CTableDataCell>{datos_familiares?.cedula_padre || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Teléfono del Padre</CTableHeaderCell>
                    <CTableDataCell>{formatPhone(datos_familiares?.telefono_padre)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Nombre de la Madre</CTableHeaderCell>
                    <CTableDataCell>{datos_familiares?.nombre_madre || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Cédula de la Madre</CTableHeaderCell>
                    <CTableDataCell>{datos_familiares?.cedula_madre || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Teléfono de la Madre</CTableHeaderCell>
                    <CTableDataCell>{formatPhone(datos_familiares?.telefono_madre)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Vive con</CTableHeaderCell>
                    <CTableDataCell>{datos_familiares?.vive_con || '-'}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Datos del Representante */}
            <CTabPane visible={activeTab === 'datosRepresentante'}>
              <CTable striped bordered hover>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40%' }}>
                      Apellidos del Representante
                    </CTableHeaderCell>
                    <CTableDataCell>{representante?.apellidos || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Nombres del Representante</CTableHeaderCell>
                    <CTableDataCell>{representante?.nombres || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Cédula del Representante</CTableHeaderCell>
                    <CTableDataCell>{representante?.cedula || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Edad del Representante</CTableHeaderCell>
                    <CTableDataCell>{representante?.edad || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fecha de Nacimiento del Representante</CTableHeaderCell>
                    <CTableDataCell>{formatDate(representante?.fecha_nacimiento)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Estado Civil del Representante</CTableHeaderCell>
                    <CTableDataCell>{representante?.estado_civil || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Nexo con el Estudiante</CTableHeaderCell>
                    <CTableDataCell>{representante?.nexo_estudiante || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Dirección de Habitación</CTableHeaderCell>
                    <CTableDataCell>{representante?.direccion_habitacion || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Teléfono de Casa</CTableHeaderCell>
                    <CTableDataCell>{formatPhone(representante?.telefono_casa)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Teléfono Celular</CTableHeaderCell>
                    <CTableDataCell>{formatPhone(representante?.telefono_celular)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Profesión</CTableHeaderCell>
                    <CTableDataCell>{representante?.profesion || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Lugar de Trabajo</CTableHeaderCell>
                    <CTableDataCell>{representante?.lugar_trabajo || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Teléfono del Trabajo</CTableHeaderCell>
                    <CTableDataCell>{formatPhone(representante?.telefono_trabajo)}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CTabPane>

            {/* Datos Físicos */}
            <CTabPane visible={activeTab === 'datosFisicos'}>
              <CTable striped bordered hover>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40%' }}>Peso (Kg)</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.peso || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Estatura (m)</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.estatura || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Talla de Camisa</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.talla_camisa || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Talla de Pantalón</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.talla_pantalon || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Talla de Zapato</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.talla_zapato || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Enfermedad</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.enfermedad || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Tiene Hermanos</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color={datos_fisicos?.tiene_hermanos ? 'success' : 'secondary'}>
                        {datos_fisicos?.tiene_hermanos ? 'Sí' : 'No'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Cantidad de Hermanos</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.cuantos_hermanos || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Grados de Hermanos</CTableHeaderCell>
                    <CTableDataCell>{datos_fisicos?.grados_hermanos || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Personas Autorizadas</CTableHeaderCell>
                    <CTableDataCell>
                      {(() => {
                        try {
                          const personas = JSON.parse(datos_fisicos?.personas_autorizadas || '[]')
                          if (Array.isArray(personas)) {
                            return personas.length > 0 ? (
                              personas.map((persona, i) => (
                                <div key={i} className="mb-2">
                                  <strong>{persona.nombreApellido}</strong> — {persona.parentesco}
                                  <br />
                                  <small>Cédula: {persona.cedula}</small>
                                </div>
                              ))
                            ) : (
                              <span>-</span>
                            )
                          } else {
                            return <span>-</span>
                          }
                        } catch (error) {
                          console.error('❌ Error al parsear personas_autorizadas:', error)
                          return <span>-</span>
                        }
                      })()}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CTabPane>
          </CTabContent>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <CButton color="info">Imprimir</CButton>
            <CButton
              color="primary"
              onClick={() => {
                /* Función para editar */
              }}
            >
              Editar Matrícula
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default MatriculaInfo
