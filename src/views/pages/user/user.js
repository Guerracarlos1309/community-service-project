'use client'
import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CButtonGroup,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CSpinner,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilUserPlus,
  cilTrash,
  cilLockLocked,
  cilLockUnlocked,
  cilSearch,
  cilReload,
} from '@coreui/icons'
import { helpFetch } from '../../../api/helpFetch'

const UserManagement = () => {
  // Estados principales
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Estados para formularios
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    permiso_id: '',
    security_word: '',
    respuesta_de_seguridad: '',
    personal_id: '',
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Instancia de API
  const api = helpFetch()

  // Cargar usuarios al montar
  useEffect(() => {
    loadUsers()
  }, [])

  // Filtrar usuarios cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
    setCurrentPage(1) // Reset a la primera página
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Cargando lista de usuarios...')

      const response = await api.get('/api/users/list')

      if (response.ok) {
        setUsers(response.users)
        console.log('✅ Usuarios cargados:', response.users.length)
      } else {
        throw new Error(response.msg || 'Error al cargar usuarios')
      }
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error)
      setError(`Error al cargar usuarios: ${error.msg || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const validateUserForm = () => {
    const errors = {}

    if (!userForm.username.trim()) {
      errors.username = 'El nombre de usuario es requerido'
    }

    if (userForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = 'Formato de email inválido'
    }

    if (!userForm.password && !selectedUser) {
      errors.password = 'La contraseña es requerida'
    } else if (userForm.password && userForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!userForm.permiso_id) {
      errors.permiso_id = 'Debe seleccionar un permiso'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateUser = async () => {
    try {
      if (!validateUserForm()) return

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log('👤 Creando nuevo usuario...')

      const { confirmPassword, ...userData } = userForm

      const response = await api.post('/api/users/register', {
        body: userData,
      })

      if (response.ok) {
        setSuccess('Usuario creado exitosamente')
        setShowCreateModal(false)
        resetForm()
        await loadUsers()
        console.log('✅ Usuario creado')
      } else {
        throw new Error(response.msg || 'Error al crear usuario')
      }
    } catch (error) {
      console.error('❌ Error creando usuario:', error)
      setError(`Error al crear usuario: ${error.msg || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setError(null)
      setSuccess(null)

      const endpoint = currentStatus
        ? `/api/users/deactivate/${userId}`
        : `/api/users/activate/${userId}`
      const action = currentStatus ? 'desactivar' : 'activar'

      console.log(`🔄 ${action} usuario...`)

      const response = await api.put(endpoint)

      if (response.ok) {
        setSuccess(`Usuario ${action}do exitosamente`)
        await loadUsers()
        console.log(`✅ Usuario ${action}do`)
      } else {
        throw new Error(response.msg || `Error al ${action} usuario`)
      }
    } catch (error) {
      console.error(`❌ Error al cambiar estado del usuario:`, error)
      setError(`Error al cambiar estado del usuario: ${error.msg || error.message}`)
    }
  }

  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) return

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log('🗑️ Eliminando usuario...')

      const response = await api.delet(`/api/users/${selectedUser.id}`)

      if (response.ok) {
        setSuccess('Usuario eliminado exitosamente')
        setShowDeleteModal(false)
        setSelectedUser(null)
        await loadUsers()
        console.log('✅ Usuario eliminado')
      } else {
        throw new Error(response.msg || 'Error al eliminar usuario')
      }
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error)
      setError(`Error al eliminar usuario: ${error.msg || error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      permiso_id: '',
      security_word: '',
      respuesta_de_seguridad: '',
      personal_id: '',
    })
    setFormErrors({})
  }

  const openCreateModal = () => {
    resetForm()
    setSelectedUser(null)
    setShowCreateModal(true)
  }

  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  // Calcular usuarios para la página actual
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Cargando usuarios...</span>
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
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Gestión de Usuarios
          </h5>
          <div className="d-flex gap-2">
            <CButton color="info" onClick={loadUsers}>
              <CIcon icon={cilReload} className="me-1" />
              Actualizar
            </CButton>
            <CButton color="primary" onClick={openCreateModal}>
              <CIcon icon={cilUserPlus} className="me-1" />
              Nuevo Usuario
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Barra de búsqueda */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por nombre, email o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6} className="text-end">
              <small className="text-muted">
                Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
              </small>
            </CCol>
          </CRow>

          {/* Tabla de usuarios */}
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Usuario</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Nombre Completo</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Último Acceso</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>
                      <strong>{user.username}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{user.email || 'Sin email'}</CTableDataCell>
                    <CTableDataCell>{user.nombre_completo || 'Usuario Externo'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{user.rol_nombre || 'Sin rol'}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={user.is_active ? 'success' : 'danger'}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <small className="text-muted">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton
                          color={user.is_active ? 'warning' : 'success'}
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          title={user.is_active ? 'Desactivar' : 'Activar'}
                        >
                          <CIcon icon={user.is_active ? cilLockLocked : cilLockUnlocked} />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => openDeleteModal(user)}
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
                    {searchTerm
                      ? 'No se encontraron usuarios que coincidan con la búsqueda'
                      : 'No hay usuarios'}
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
                  style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Anterior
                </CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Siguiente
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal para crear usuario */}
      <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Crear Nuevo Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Nombre de Usuario *</CFormLabel>
                  <CFormInput
                    value={userForm.username}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value }))}
                    invalid={!!formErrors.username}
                  />
                  {formErrors.username && (
                    <div className="invalid-feedback">{formErrors.username}</div>
                  )}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                    invalid={!!formErrors.email}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Contraseña *</CFormLabel>
                  <CFormInput
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                    invalid={!!formErrors.password}
                  />
                  {formErrors.password && (
                    <div className="invalid-feedback">{formErrors.password}</div>
                  )}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Confirmar Contraseña *</CFormLabel>
                  <CFormInput
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    invalid={!!formErrors.confirmPassword}
                  />
                  {formErrors.confirmPassword && (
                    <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                  )}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Nivel de Permisos *</CFormLabel>
                  <CFormSelect
                    value={userForm.permiso_id}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, permiso_id: e.target.value }))
                    }
                    invalid={!!formErrors.permiso_id}
                  >
                    <option value="">Seleccionar permiso...</option>
                    <option value="1">Acceso Total</option>
                    <option value="2">Gestión Académica</option>
                    <option value="3">Gestión Personal</option>
                    <option value="4">Consulta Básica</option>
                  </CFormSelect>
                  {formErrors.permiso_id && (
                    <div className="invalid-feedback">{formErrors.permiso_id}</div>
                  )}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>ID Personal (Opcional)</CFormLabel>
                  <CFormInput
                    type="number"
                    value={userForm.personal_id}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, personal_id: e.target.value }))
                    }
                    placeholder="ID del personal asociado"
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Palabra de Seguridad</CFormLabel>
                  <CFormInput
                    value={userForm.security_word}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, security_word: e.target.value }))
                    }
                    placeholder="Ej: ¿Cuál es tu color favorito?"
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Respuesta de Seguridad</CFormLabel>
                  <CFormInput
                    value={userForm.respuesta_de_seguridad}
                    onChange={(e) =>
                      setUserForm((prev) => ({ ...prev, respuesta_de_seguridad: e.target.value }))
                    }
                    placeholder="Respuesta a la palabra de seguridad"
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleCreateUser} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Creando...
              </>
            ) : (
              'Crear Usuario'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para confirmar eliminación */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            ¿Está seguro de que desea eliminar el usuario <strong>{selectedUser?.username}</strong>?
          </p>
          <CAlert color="warning">
            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
          </CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDeleteUser} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Eliminando...
              </>
            ) : (
              'Eliminar Usuario'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserManagement
