'use client'
import { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CButtonGroup,
  CBadge,
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilTrash, cilReload, cilPencil, cilUser, cilX } from '@coreui/icons'
import { helpFetch } from '../../../api/helpFetch.js'

const api = helpFetch()

const EstudianteList = () => {
  const [estudiantes, setEstudiantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrado, setSelectedGrado] = useState('')
  const [selectedSeccion, setSelectedSeccion] = useState('')
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([])

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [estudiantesPerPage] = useState(10)

  // Estados para modal
  const [showModal, setShowModal] = useState(false)
  const [selectedEstudiante, setSelectedEstudiante] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')

  // Estados para datos de utilidad
  const [grados, setGrados] = useState([])
  const [secciones, setSecciones] = useState([])

  // Función para asignar colores a los grados
  const getGradeColor = (gradeName) => {
    if (!gradeName) return 'secondary'

    const gradeColors = {
      '1er': 'primary',
      '2do': 'success',
      '3er': 'info',
      '4to': 'warning',
      '5to': 'danger',
      '6to': 'dark',
      Preescolar: 'warning',
      Inicial: 'light',
      Primer: 'primary',
      Segundo: 'success',
      Tercer: 'info',
      Cuarto: 'warning',
      Quinto: 'danger',
      Sexto: 'dark',
    }

    if (gradeColors[gradeName]) {
      return gradeColors[gradeName]
    }

    for (const [key, color] of Object.entries(gradeColors)) {
      if (gradeName.toLowerCase().includes(key.toLowerCase())) {
        return color
      }
    }

    return 'secondary'
  }

  // Función para obtener color del sexo
  const getSexColor = (sex) => {
    if (sex === 'Masculino' || sex === 'M') return 'primary'
    if (sex === 'Femenino' || sex === 'F') return 'danger'
    return 'secondary'
  }

  useEffect(() => {
    loadEstudiantes()
  }, [])

  useEffect(() => {
    loadUtilityData()
  }, [estudiantes])

  useEffect(() => {
    filterEstudiantes()
  }, [searchTerm, selectedGrado, selectedSeccion, estudiantes])

  const loadEstudiantes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Cargando estudiantes...')
      const response = await api.get('/api/students/list/all/')
      if (response.ok) {
        console.log('✅ Estudiantes cargados:', response.students)
        setEstudiantes(response.students || [])
      } else {
        console.error('❌ Error al cargar estudiantes:', response)
        setError(response.msg || 'Error al cargar estudiantes')
      }
    } catch (error) {
      console.error('❌ Error en loadEstudiantes:', error)
      setError('Error al cargar estudiantes')
    } finally {
      setLoading(false)
    }
  }

  const loadUtilityData = async () => {
    try {
      // Cargar grados únicos de los estudiantes
      const gradosUnicos = [...new Set(estudiantes.map((e) => e.grado || e.grade_name))].filter(
        Boolean,
      )
      setGrados(gradosUnicos)

      // Cargar secciones únicas de los estudiantes
      const seccionesUnicas = [
        ...new Set(estudiantes.map((e) => e.seccion || e.section_name)),
      ].filter(Boolean)
      setSecciones(seccionesUnicas)
    } catch (error) {
      console.error('❌ Error cargando datos de utilidad:', error)
    }
  }

  const filterEstudiantes = () => {
    let filtered = estudiantes

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (estudiante) =>
          estudiante.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          estudiante.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          estudiante.ci?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por grado
    if (selectedGrado) {
      filtered = filtered.filter(
        (estudiante) =>
          estudiante.grado === selectedGrado || estudiante.grade_name === selectedGrado,
      )
    }

    // Filtrar por sección
    if (selectedSeccion) {
      filtered = filtered.filter(
        (estudiante) =>
          estudiante.seccion === selectedSeccion || estudiante.section_name === selectedSeccion,
      )
    }

    setFilteredEstudiantes(filtered)
    setCurrentPage(1)
  }

  // Función para abrir modal con datos del estudiante
  const handleViewEstudiante = (estudiante) => {
    setSelectedEstudiante(estudiante)
    setActiveTab('personal')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedEstudiante(null)
    setActiveTab('personal')
  }

  const handleDeleteEstudiante = async (estudianteId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      return
    }

    try {
      setError(null)
      setSuccess(null)
      const response = await api.delet('/api/estudiantes', estudianteId)
      if (response.ok) {
        setSuccess('Estudiante eliminado exitosamente')
        await loadEstudiantes()
      } else {
        setError(response.msg || 'Error al eliminar estudiante')
      }
    } catch (error) {
      console.error('❌ Error eliminando estudiante:', error)
      setError('Error al eliminar estudiante')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-'
    const nacimiento = new Date(fechaNacimiento)
    const hoy = new Date()
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return `${edad} años`
  }

  // Calcular estudiantes para la página actual
  const indexOfLastEstudiante = currentPage * estudiantesPerPage
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage
  const currentEstudiantes = filteredEstudiantes.slice(
    indexOfFirstEstudiante,
    indexOfLastEstudiante,
  )
  const totalPages = Math.ceil(filteredEstudiantes.length / estudiantesPerPage)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner color="primary" size="sm" />
        <span className="ms-2">Cargando estudiantes...</span>
      </div>
    )
  }

  return (
    <>
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </CAlert>
      )}
      {success && (
        <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
          <strong>Éxito:</strong> {success}
        </CAlert>
      )}

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Gestión de Estudiantes</h5>
          <div className="d-flex gap-2">
            <CButton color="primary" variant="outline" onClick={loadEstudiantes}>
              <CIcon icon={cilReload} className="me-1" />
              Actualizar
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Filtros y búsqueda */}
          <CRow className="mb-3">
            <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por nombre, apellido o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol md={2}>
              <CFormSelect value={selectedGrado} onChange={(e) => setSelectedGrado(e.target.value)}>
                <option value="">Todos los grados</option>
                {grados.map((grado) => (
                  <option key={grado} value={grado}>
                    {grado}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect
                value={selectedSeccion}
                onChange={(e) => setSelectedSeccion(e.target.value)}
              >
                <option value="">Todas las secciones</option>
                {secciones.map((seccion) => (
                  <option key={seccion} value={seccion}>
                    {seccion}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4} className="text-end">
              <small className="text-muted">
                {currentEstudiantes.length} de {filteredEstudiantes.length} estudiantes
              </small>
            </CCol>
          </CRow>

          {/* Tabla de estudiantes */}
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Estudiante</CTableHeaderCell>
                <CTableHeaderCell>Cédula</CTableHeaderCell>
                <CTableHeaderCell>Edad</CTableHeaderCell>
                <CTableHeaderCell>Sexo</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentEstudiantes.length > 0 ? (
                currentEstudiantes.map((estudiante) => (
                  <CTableRow key={estudiante.id}>
                    <CTableDataCell>
                      <strong>
                        {estudiante.name} {estudiante.lastName}
                      </strong>
                    </CTableDataCell>
                    <CTableDataCell>{estudiante.ci || '-'}</CTableDataCell>
                    <CTableDataCell>{calcularEdad(estudiante.birthday)}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getSexColor(estudiante.sex)}>{estudiante.sex || '-'}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={estudiante.is_enrolled ? 'success' : 'secondary'}>
                        {estudiante.is_enrolled ? 'Inscrito' : 'No inscrito'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton
                          color="info"
                          variant="outline"
                          onClick={() => handleViewEstudiante(estudiante)}
                          title="Ver detalles completos"
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          Ver más
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => handleDeleteEstudiante(estudiante.id)}
                          title="Eliminar"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted">
                    {searchTerm || selectedGrado || selectedSeccion
                      ? 'No se encontraron estudiantes que coincidan con los filtros'
                      : 'No hay estudiantes registrados'}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <CPagination>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de detalles del estudiante */}
      <CModal size="xl" visible={showModal} onClose={handleCloseModal} backdrop="static">
        <CModalHeader>
          <CModalTitle>
            <div className="d-flex align-items-center">
              <CIcon icon={cilUser} className="me-2" />
              Detalles del Estudiante - {selectedEstudiante?.name} {selectedEstudiante?.lastName}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEstudiante && (
            <>
              {/* Header con información básica */}
              <div className="mb-4 p-3 bg-light rounded">
                <CRow>
                  <CCol md={3}>
                    <strong>ID:</strong> {selectedEstudiante.id}
                  </CCol>
                  <CCol md={3}>
                    <strong>Cédula:</strong> {selectedEstudiante.ci}
                  </CCol>
                  <CCol md={3}>
                    <strong>Edad:</strong> {calcularEdad(selectedEstudiante.birthday)}
                  </CCol>
                  <CCol md={3}>
                    <CBadge
                      color={selectedEstudiante.is_enrolled ? 'success' : 'secondary'}
                      size="lg"
                    >
                      {selectedEstudiante.is_enrolled ? 'Inscrito' : 'No inscrito'}
                    </CBadge>
                  </CCol>
                </CRow>
              </div>

              {/* Pestañas de información */}
              <CNav variant="tabs" role="tablist" className="mb-3">
                <CNavItem>
                  <CNavLink
                    href="#"
                    active={activeTab === 'personal'}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveTab('personal')
                    }}
                  >
                    Datos Personales
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="#"
                    active={activeTab === 'familiar'}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveTab('familiar')
                    }}
                  >
                    Datos Familiares
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="#"
                    active={activeTab === 'representante'}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveTab('representante')
                    }}
                  >
                    Representante
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="#"
                    active={activeTab === 'convivencia'}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveTab('convivencia')
                    }}
                  >
                    Convivencia
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent>
                {/* Datos Personales */}
                <CTabPane visible={activeTab === 'personal'}>
                  <CTable striped bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '30%' }}>Nombres</CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{selectedEstudiante.name}</strong>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Apellidos</CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{selectedEstudiante.lastName}</strong>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Cédula</CTableHeaderCell>
                        <CTableDataCell>{selectedEstudiante.ci}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Sexo</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color={getSexColor(selectedEstudiante.sex)}>
                            {selectedEstudiante.sex}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                        <CTableDataCell>{formatDate(selectedEstudiante.birthday)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Lugar de Nacimiento</CTableHeaderCell>
                        <CTableDataCell>{selectedEstudiante.placeBirth || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Cantidad de Hermanos</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedEstudiante.quantityBrothers || '0'}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Estado</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color="success">
                            {selectedEstudiante.status_description || 'Activo'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Fecha de Registro</CTableHeaderCell>
                        <CTableDataCell>{formatDate(selectedEstudiante.created_at)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Última Actualización</CTableHeaderCell>
                        <CTableDataCell>{formatDate(selectedEstudiante.updated_at)}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CTabPane>

                {/* Datos Familiares */}
                <CTabPane visible={activeTab === 'familiar'}>
                  <CTable striped bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '30%' }}>
                          Nombre de la Madre
                        </CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{selectedEstudiante.motherName || '-'}</strong>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Cédula de la Madre</CTableHeaderCell>
                        <CTableDataCell>{selectedEstudiante.motherCi || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Teléfono de la Madre</CTableHeaderCell>
                        <CTableDataCell>{selectedEstudiante.motherTelephone || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Nombre del Padre</CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{selectedEstudiante.fatherName || '-'}</strong>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Cédula del Padre</CTableHeaderCell>
                        <CTableDataCell>{selectedEstudiante.fatherCi || '-'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Teléfono del Padre</CTableHeaderCell>
                        <CTableDataCell>{selectedEstudiante.fatherTelephone || '-'}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CTabPane>

                {/* Representante */}
                <CTabPane visible={activeTab === 'representante'}>
                  <CTable striped bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '30%' }}>
                          ID del Representante
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {selectedEstudiante.representativeID || '-'}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Nombres del Representante</CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{selectedEstudiante.representative_name || '-'}</strong>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Apellidos del Representante</CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{selectedEstudiante.representative_lastName || '-'}</strong>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Teléfono del Representante</CTableHeaderCell>
                        <CTableDataCell>
                          {selectedEstudiante.representative_phone || '-'}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Rol del Representante</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color="info">
                            {selectedEstudiante.rolRopresentative || '-'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CTabPane>

                {/* Convivencia */}
                <CTabPane visible={activeTab === 'convivencia'}>
                  <CTable striped bordered>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '30%' }}>
                          Vive con la Madre
                        </CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color={selectedEstudiante.livesMother ? 'success' : 'secondary'}>
                            {selectedEstudiante.livesMother ? 'Sí' : 'No'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Vive con el Padre</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color={selectedEstudiante.livesFather ? 'success' : 'secondary'}>
                            {selectedEstudiante.livesFather ? 'Sí' : 'No'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Vive con Ambos Padres</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color={selectedEstudiante.livesBoth ? 'success' : 'secondary'}>
                            {selectedEstudiante.livesBoth ? 'Sí' : 'No'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Vive con Representante</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge
                            color={selectedEstudiante.livesRepresentative ? 'success' : 'secondary'}
                          >
                            {selectedEstudiante.livesRepresentative ? 'Sí' : 'No'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Situación de Convivencia</CTableHeaderCell>
                        <CTableDataCell>
                          <div className="p-2 bg-light rounded">
                            {selectedEstudiante.livesBoth && (
                              <CBadge color="success" className="me-2">
                                Ambos Padres
                              </CBadge>
                            )}
                            {selectedEstudiante.livesMother && !selectedEstudiante.livesBoth && (
                              <CBadge color="info" className="me-2">
                                Solo Madre
                              </CBadge>
                            )}
                            {selectedEstudiante.livesFather && !selectedEstudiante.livesBoth && (
                              <CBadge color="primary" className="me-2">
                                Solo Padre
                              </CBadge>
                            )}
                            {selectedEstudiante.livesRepresentative && (
                              <CBadge color="warning" className="me-2">
                                Con Representante
                              </CBadge>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CTabPane>
              </CTabContent>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            <CIcon icon={cilX} className="me-1" />
            Cerrar
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilPencil} className="me-1" />
            Editar Estudiante
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default EstudianteList
