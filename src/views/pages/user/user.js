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

const user = () => {
  const [visible, setVisible] = useState(false)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [saveEdit, setSaveEdit] = useState(false)

  const handleOpen = () => {
    setVisible(true)
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

  const openEdit = () => {
    setVisibleEdit(true)
  }

  const closeEdit = () => {
    setVisibleEdit(false)
  }

  const saveEditOpen = () => {
    setSaveEdit(true)
    setVisibleEdit(false)
  }
  const saveEditClose = () => {
    setSaveEdit(false)
  }

  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Administrador' },
    { id: 2, name: 'Ana García', email: 'ana@example.com', role: 'Usuario' },
  ]

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
                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                <CTableHeaderCell scope="col">Correo electronico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
                <CTableHeaderCell scope="col">Función</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user) => (
                <CTableRow key={user.id}>
                  <CTableDataCell>{user.id}</CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="info" className="me-2 text-white" onClick={openEdit}>
                      Editar
                    </CButton>
                    <CButton size="sm" color="danger" className="text-white">
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
              label="Nombre"
              name="name"
              className="mb-3"
              placeholder="Ingrese el nombre"
            />
            <CFormInput
              label="Apellido"
              name="apellido"
              className="mb-3"
              placeholder="Ingrese el Apellido"
            />
            <CFormInput type="email" label="Email" name="email" className="mb-3" />
            <CFormSelect
              label="Rol"
              name="role"
              className="mb-3"
              options={[
                { label: 'Usuario', value: 'Usuario' },
                { label: 'Administrador', value: 'Administrador' },
              ]}
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
          <CButton color="success" className="text-white" onClick={handleCloseConfirm}>
            Guardar cambios
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visibleEdit}>
        <CModalHeader>
          <CModalTitle>Editar usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="nombre"
              label="Nombre"
              placeholder="Ingrese el nombre del usuario"
              className="mb-3"
            />
            <CFormInput
              type="text"
              id="apellido"
              label="Apellido"
              placeholder="Ingrese el apellido del usuario"
              className="mb-3"
            />
            <CFormInput
              type="text"
              id="cedula"
              label="Cedula"
              placeholder="Ingrese el documento de identidad"
              className="mb-3"
            />
            <CFormSelect
              aria-label="DefaultSelect"
              className="mb-3"
              label="Cargo"
              options={[
                { label: 'Selecciona el cargo: ' },
                { label: 'Administrador', value: '1' },
                { label: 'Usuario', value: '2' },
              ]}
            />
            <CFormInput
              type="text"
              id="telefono"
              label="Numero telefonico"
              placeholder="Ingrese el numero telefonico"
              className="mb-3"
            />
            <CFormInput
              type="email"
              id="email"
              label="Correo electronico"
              placeholder="Ingrese el correo electronico"
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={closeEdit}>
            Cerrar
          </CButton>
          <CButton color="success" className="text-white" onClick={saveEditOpen}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={saveEdit}>
        <CModalHeader>
          <CModalTitle>Actualizacion exitosa</CModalTitle>
        </CModalHeader>
        <CModalBody> Usuario actualizado correctamente</CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={saveEditClose}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default user
