'use client'

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

// Función para calcular edad
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

// Función para adaptar datos de matrícula
const adaptMatriculaData = (raw) => {
  return {
    ...raw,
    estudiante: {
      nombres: raw.student_name,
      apellidos: raw.student_lastName,
      cedula_escolar: raw.student_school_id || raw.student_ci,
      fecha_nacimiento: raw.student_birthday,
      lugar_nacimiento: raw.student_birthPlace,
      sexo: raw.student_sex,
      edad: calcularEdad(raw.student_birthday),
      cantidad_hermanos: raw.student_sibling_count,
      vive_con_madre: raw.lives_with_mother,
      vive_con_padre: raw.lives_with_father,
      vive_con_ambos: raw.lives_with_both,
      vive_con_representante: raw.lives_with_representative,
      direccion: raw.student_address,
    },
    grado: {
      id: raw.grade_id,
      nombre: raw.grade_name,
    },
    seccion: {
      id: raw.section_id,
      nombre: raw.section_name,
      periodo: raw.period,
    },
    representante: {
      nombres: raw.representative_name,
      apellidos: raw.representative_lastName,
      cedula: raw.representative_ci,
      telefono_celular: raw.representative_phone,
      email: raw.representative_email,
      direccion_habitacion: raw.representative_address,
      lugar_trabajo: raw.representative_workplace,
      telefono_trabajo: raw.representative_work_phone,
      profesion: raw.representative_profesion,
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
    observaciones: raw.observation,
    docente: {
      nombre: raw.teacher_name,
      apellido: raw.teacher_lastName,
    },
  }
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

      console.log('🔄 Cargando datos de matrícula:', matriculaId)

      const response = await api.get(`/api/matriculas/inscription/${matriculaId}`)

      console.log('📥 Respuesta API:', response)

      if (!response.error && response.matricula) {
        const adaptada = adaptMatriculaData(response.matricula)
        console.log('✅ Datos adaptados:', adaptada)
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

      if (!gradosResponse.error) {
        setGrados(gradosResponse.grados || [])
      }

      if (!docenteGradosResponse.error) {
        setDocenteGrados(docenteGradosResponse.docente_grados || [])
      }
    } catch (error) {
      console.error('❌ Error cargando datos de utilidad:', error)
    }
  }

  const getGradoName = (gradoId) => {
    const grado = grados.find((g) => g.id === gradoId || g.id == gradoId)
    return grado ? grado.name : 'No especificado'
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
    representante,
    datos_fisicos,
    datos_familiares,
    observaciones,
    docente,
  } = matriculaData

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h2 className="mb-0 text-center">
            Detalle de Matrícula - {estudiante?.nombres} {estudiante?.apellidos}
          </h2>
          <div className="text-center mt-2">
            <CBadge color="info" size="lg">
              {grado?.nombre} - {seccion?.nombre}
            </CBadge>
            <CBadge color="secondary" className="ms-2">
              {periodo_escolar}
            </CBadge>
          </div>
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
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === 'observaciones'}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab('observaciones')
                }}
              >
                Observaciones
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
                    <CTableDataCell>
                      <CBadge color={tipo_ingreso === 'Repitiente' ? 'warning' : 'success'}>
                        {tipo_ingreso || '-'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Período Escolar</CTableHeaderCell>
                    <CTableDataCell>{periodo_escolar || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Grado</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color="primary">{grado?.nombre || '-'}</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Sección</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color="secondary">{seccion?.nombre || '-'}</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Docente</CTableHeaderCell>
                    <CTableDataCell>
                      {docente?.nombre && docente?.apellido
                        ? `${docente.nombre} ${docente.apellido}`
                        : 'No asignado'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fecha de Inscripción</CTableHeaderCell>
                    <CTableDataCell>{formatDate(fecha_inscripcion)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Plantel de Procedencia</CTableHeaderCell>
                    <CTableDataCell>{plantel_procedencia || 'No especificado'}</CTableDataCell>
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
                    <CTableDataCell>
                      <strong>{estudiante?.apellidos || '-'}</strong>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Nombres</CTableHeaderCell>
                    <CTableDataCell>
                      <strong>{estudiante?.nombres || '-'}</strong>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                    <CTableDataCell>{formatDate(estudiante?.fecha_nacimiento)}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Edad</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color="info">
                        {estudiante?.edad ? `${estudiante.edad} años` : '-'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color={estudiante?.sexo === 'Masculino' ? 'primary' : 'danger'}>
                        {estudiante?.sexo || '-'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Lugar de Nacimiento</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.lugar_nacimiento || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Dirección</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.direccion || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Cantidad de Hermanos</CTableHeaderCell>
                    <CTableDataCell>{estudiante?.cantidad_hermanos || '0'}</CTableDataCell>
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
                    <CTableDataCell>
                      <CBadge color="info">
                        {datos_familiares?.vive_con || 'No especificado'}
                      </CBadge>
                    </CTableDataCell>
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
                    <CTableDataCell>
                      <strong>{representante?.apellidos || '-'}</strong>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Nombres del Representante</CTableHeaderCell>
                    <CTableDataCell>
                      <strong>{representante?.nombres || '-'}</strong>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Cédula del Representante</CTableHeaderCell>
                    <CTableDataCell>{representante?.cedula || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableDataCell>{representante?.email || '-'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Dirección de Habitación</CTableHeaderCell>
                    <CTableDataCell>{representante?.direccion_habitacion || '-'}</CTableDataCell>
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
                    <CTableDataCell>{datos_fisicos?.enfermedad || 'Ninguna'}</CTableDataCell>
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
                    <CTableDataCell>{datos_fisicos?.cuantos_hermanos || '0'}</CTableDataCell>
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
                          if (Array.isArray(personas) && personas.length > 0) {
                            return personas.map((persona, i) => (
                              <div key={i} className="mb-2">
                                <strong>{persona.nombreApellido}</strong> — {persona.parentesco}
                                <br />
                                <small>Cédula: {persona.cedula}</small>
                              </div>
                            ))
                          } else {
                            return <span>No hay personas autorizadas registradas</span>
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

            {/* Observaciones */}
            <CTabPane visible={activeTab === 'observaciones'}>
              <CTable striped bordered hover>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '40%' }}>
                      Observaciones Generales
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {observaciones ? (
                        <div className="p-3 bg-light rounded">{observaciones}</div>
                      ) : (
                        <em className="text-muted">Sin observaciones registradas</em>
                      )}
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
                console.log('Editar matrícula:', matriculaId)
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
