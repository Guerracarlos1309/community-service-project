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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPencil, cilTrash, cilReload, cilPlus } from '@coreui/icons'
import { helpFetch } from '../../../api/helpFetch.js'
import MatriculaInfo from '../../pages/matriculaInformacion/matriculaInfo.js'

const api = helpFetch()

const MatriculaList = () => {
  const [matriculas, setMatriculas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriodo, setSelectedPeriodo] = useState('')
  const [filteredMatriculas, setFilteredMatriculas] = useState([])

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [matriculasPerPage] = useState(10)

  // Estados para modales
  const [selectedMatricula, setSelectedMatricula] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Estados para datos de utilidad
  const [periodos, setPeriodos] = useState([])

  useEffect(() => {
    loadMatriculas()
    loadPeriodos()
  }, [])

  useEffect(() => {
    filterMatriculas()
  }, [searchTerm, selectedPeriodo, matriculas])

  const loadMatriculas = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Cargando matrículas...')

      const response = await api.get('/api/matriculas')

      if (response.ok) {
        console.log('✅ Matrículas cargadas:', response.matriculas)
        setMatriculas(response.matriculas || [])
      } else {
        console.error('❌ Error al cargar matrículas:', response)
        setError(response.msg || 'Error al cargar matrículas')
      }
    } catch (error) {
      console.error('❌ Error en loadMatriculas:', error)
      setError('Error al cargar matrículas')
    } finally {
      setLoading(false)
    }
  }

  const loadPeriodos = async () => {
    try {
      const periodosUnicos = [...new Set(matriculas.map((m) => m.period))].filter(Boolean)
      setPeriodos(periodosUnicos)
    } catch (error) {
      console.error('❌ Error cargando períodos:', error)
    }
  }

  const filterMatriculas = () => {
    let filtered = matriculas

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (matricula) =>
          matricula.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matricula.estudent_lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matricula.estudent_school_id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por período
    if (selectedPeriodo) {
      filtered = filtered.filter((matricula) => matricula.period === selectedPeriodo)
    }

    setFilteredMatriculas(filtered)
    setCurrentPage(1)
  }

  const handleViewMatricula = (matricula) => {
    setSelectedMatricula(matricula)
    setShowDetailModal(true)
  }

  const handleDeleteMatricula = async (matriculaId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta matrícula?')) {
      return
    }

    try {
      setError(null)
      setSuccess(null)

      const response = await api.delet('/api/matriculas', matriculaId)

      if (response.ok) {
        setSuccess('Matrícula eliminada exitosamente')
        await loadMatriculas()
      } else {
        setError(response.msg || 'Error al eliminar matrícula')
      }
    } catch (error) {
      console.error('❌ Error eliminando matrícula:', error)
      setError('Error al eliminar matrícula')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  // Calcular matrículas para la página actual
  const indexOfLastMatricula = currentPage * matriculasPerPage
  const indexOfFirstMatricula = indexOfLastMatricula - matriculasPerPage
  const currentMatriculas = filteredMatriculas.slice(indexOfFirstMatricula, indexOfLastMatricula)
  const totalPages = Math.ceil(filteredMatriculas.length / matriculasPerPage)

  if (showDetailModal && selectedMatricula) {
    return (
      <div>
        <CButton
          color="secondary"
          className="mb-3"
          onClick={() => {
            setShowDetailModal(false)
            setSelectedMatricula(null)
          }}
        >
          ← Volver a la lista
        </CButton>
        <MatriculaInfo matriculaId={selectedMatricula.id} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Cargando matrículas...</span>
      </div>
    )
  }

  const getGradeColor = (gradeName) => {
    const colorsByGrade = {
      'Primer Grado': 'primary',
      'Segundo Grado': 'success',
      'Tercer Grado': 'warning',
      'Cuarto Grado': 'danger',
      'Quinto Grado': 'info',
      'Sexto Grado': 'dark',
    }

    return colorsByGrade[gradeName] || 'secondary'
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
        <CCardHeader className="d-flex justify-content-between align-items-center bg-info text-white">
          <h5 className="mb-0">Gestión de Matrículas</h5>
          <div className="d-flex gap-2">
            <CButton color="info" onClick={loadMatriculas}>
              <CIcon icon={cilReload} className="me-1" />
              Actualizar
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Filtros y búsqueda */}
          <CRow className="mb-3">
            <CCol md={6}>
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
            <CCol md={4}>
              <CFormSelect
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
              >
                <option value="">Todos los períodos</option>
                {periodos.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2} className="text-end">
              <small className="text-muted">
                {currentMatriculas.length} de {filteredMatriculas.length} matrículas
              </small>
            </CCol>
          </CRow>

          {/* Tabla de matrículas */}
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Estudiante</CTableHeaderCell>
                <CTableHeaderCell>Cédula Escolar</CTableHeaderCell>
                <CTableHeaderCell>Grado</CTableHeaderCell>
                <CTableHeaderCell>Sección</CTableHeaderCell>
                <CTableHeaderCell>Período</CTableHeaderCell>
                <CTableHeaderCell>Fecha Inscripción</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentMatriculas.length > 0 ? (
                currentMatriculas.map((matricula) => (
                  <CTableRow key={matricula.id}>
                    <CTableDataCell>
                      <strong>
                        {matricula.student_name} {matricula.student_lastName}
                      </strong>
                    </CTableDataCell>
                    <CTableDataCell>{matricula.student_school_id || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getGradeColor(matricula.grade_name)}>
                        {matricula.grade_name || '-'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{matricula.section_name || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{matricula.period}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{formatDate(matricula.registrationDate)}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton
                          color="info"
                          variant="outline"
                          onClick={() => handleViewMatricula(matricula)}
                          title="Ver detalles"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => handleDeleteMatricula(matricula.id)}
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
                  <CTableDataCell colSpan={7} className="text-center text-muted">
                    {searchTerm || selectedPeriodo
                      ? 'No se encontraron matrículas que coincidan con los filtros'
                      : 'No hay matrículas registradas'}
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
    </>
  )
}

export default MatriculaList
