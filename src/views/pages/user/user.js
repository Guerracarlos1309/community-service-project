import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CFormSelect,
  CModalFooter,
  CCardGroup,
} from '@coreui/react'
import { helpFetch } from '../../../api/helpFetch.js'

const api = helpFetch()

const user = () => {
  const [visible, setVisible] = useState(false)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [saveEdit, setSaveEdit] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null)
  const [editForm, setEditForm] = useState({
    email: '',
    username: '',
    permisos_id: '',
  })

  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    security_word: '',
    respuesta_de_seguridad: '',
    permiso_id: '',
  })

  const handleOpen = () => {
    setVisible(true)
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpenConfirm = () => {
    setVisibleConfirm(true)
    setVisible(false)
  }
  const handleCloseConfirm = () => {
    setVisibleConfirm(false)
  }

  const handleClose = () => {
    setVisible(false)
  }

  const openDeleteConfirm = (user) => {
    setUserToDelete(user)
    setVisibleDeleteConfirm(true)
  }

  const closeDeleteConfirm = () => {
    setVisibleDeleteConfirm(false)
    setUserToDelete(null)
  }

  const [data, setData] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {}, [data])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/list')

      if (!response.error) {
        setData(response.users)
      } else {
        console.error('Error fetching users:', response)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        email: selectedUser.email,
        username: selectedUser.username,
        permiso_id: selectedUser.permiso_id.toString(),
      })
    }
  }, [selectedUser])

  const deleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await api.delet('/api/users', userToDelete.id)

      if (!response.error) {
        fetchUsers()
        closeDeleteConfirm()
      } else {
        console.error('Error eliminando usuario:', response)
      }
    } catch (error) {
      console.error('Error en deleteUser:', error)
    }
  }

  const handleCreateUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (
      !newUser.email ||
      !newUser.username ||
      !newUser.password ||
      !newUser.security_word ||
      !newUser.respuesta_de_seguridad ||
      !newUser.permiso_id
    ) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      const response = await api.post('/api/users/register', {
        body: {
          email: newUser.email,
          username: newUser.username,
          password: newUser.password,
          security_word: newUser.security_word,
          respuesta_de_seguridad: newUser.respuesta_de_seguridad,
          permiso_id: Number(newUser.permiso_id),
        },
      })

      if (!response.error) {
        setVisibleConfirm(false)
        setVisible(false)
        fetchUsers()
        setNewUser({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          security_word: '',
          respuesta_de_seguridad: '',
          permiso_id: '',
        })
      } else {
        console.error('Error creando usuario:', response)
      }
    } catch (error) {
      console.error('Error en handleCreateUser:', error)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 position-relative">
        <h2
          className="text-center position-relative pb-3"
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '#4a4a4a}}',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(to right, transparent, #4a4a4a, transparent) 1',
          }}
        >
          Usuarios
        </h2>
      </div>

      <CButton color="info text-white" className="mb-3" onClick={handleOpen}>
        Crear Usuario
      </CButton>

      <CCard>
        <CCardHeader className="bg-info text-white">
          <h4>Tabla de Usuarios</h4>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Usuario</CTableHeaderCell>
                <CTableHeaderCell scope="col">Correo electronico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Permiso</CTableHeaderCell>
                <CTableHeaderCell scope="col">Función</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((user) => (
                <CTableRow key={user.id}>
                  <CTableDataCell>{user.id}</CTableDataCell>
                  <CTableDataCell>{user.username}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.permiso_id}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="danger"
                      className="text-white"
                      onClick={() => openDeleteConfirm(user)}
                    >
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>Crear Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="email"
              label="Email"
              name="email"
              className="mb-3"
              placeholder="Ingrese su correo electrónico"
              value={newUser.email}
              onChange={handleNewUserChange}
            />
            <CFormInput
              type="text"
              label="Usuario"
              name="username"
              className="mb-3"
              placeholder="Ingrese su nombre de usuario"
              value={newUser.username}
              onChange={handleNewUserChange}
            />
            <CFormInput
              type="password"
              label="Contraseña"
              name="password"
              className="mb-3"
              placeholder="Ingrese su contraseña"
              value={newUser.password}
              onChange={handleNewUserChange}
            />
            <CFormInput
              type="password"
              label="Confirmar Contraseña"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              className="mb-3"
              value={newUser.confirmPassword}
              onChange={handleNewUserChange}
            />
            <CFormInput
              type="security_word"
              label="Pregunta de seguridad"
              name="security_word"
              placeholder="Ingrese su pregunta de seguridad"
              className="mb-3"
              value={newUser.security_word}
              onChange={handleNewUserChange}
            />
            <CFormInput
              type="respuesta_de_seguridad"
              label="Respuesta de seguridad"
              name="respuesta_de_seguridad"
              placeholder="Ingrese su respuesta de seguridad"
              className="mb-3"
              value={newUser.respuesta_de_seguridad}
              onChange={handleNewUserChange}
            />

            <CFormSelect
              label="Rol"
              name="permiso_id"
              className="mb-3"
              placeholder="Seleccione un rol"
              options={[
                { label: 'Seleccione un rol', value: '' },
                { label: 'Administrador', value: '1' },
                { label: 'Usuario', value: '2' },
              ]}
              value={newUser.permiso_id}
              onChange={handleNewUserChange}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={handleClose}>
            Cerrar
          </CButton>
          <CButton color="success" className="text-white" onClick={handleOpenConfirm}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visibleConfirm} onClose={handleClose}>
        <CModalHeader>
          <CModalTitle>¿Guardar nuevo usuario?</CModalTitle>
        </CModalHeader>
        <CModalBody>Añadir nuevo usuario</CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={handleCloseConfirm}>
            Cerrar
          </CButton>
          <CButton color="success" className="text-white" onClick={handleCreateUser}>
            Guardar cambios
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visibleDeleteConfirm} onClose={closeDeleteConfirm}>
        <CModalHeader>
          <CModalTitle>Confirmar eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro que quieres eliminar al usuario <strong>{userToDelete?.username}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeDeleteConfirm}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={deleteUser}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default user
