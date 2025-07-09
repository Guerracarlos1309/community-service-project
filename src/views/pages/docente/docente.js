import react, { useEffect, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CModal,
  CTableDataCell,
  CButton,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CForm,
  CFormInput,
  CFormSelect,
  CModalFooter,
  CRow,
  CCol,
} from '@coreui/react'
import { helpFetch } from '../../../api/helpFetch.js'
import { array } from 'prop-types'
import { FALSE } from 'sass'

const api = helpFetch()

const Docente = () => {
  const [VisibleNewDocente, setVisibleNewDocente] = useState(false)
  const [VisibleEditDocente, setVisibleEditDocente] = useState(false)

  const [VisibleViewDocente, setVisibleViewDocente] = useState(false)
  const [docenteToView, setDocenteToView] = useState(null)

  const [docenteToDelete, setDocenteToDelete] = useState(null)
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = useState(false)

  const [data, setData] = useState([])

  useEffect(() => {
    fetchDocentes()
  }, [])

  useEffect(() => {}, [data])

  const fetchDocentes = async () => {
    try {
      const response = await api.get('/api/personal')

      if (!response.error) {
        setData(response.personal)
      } else {
        console.error('Error al obtener docentes:', response)
      }
    } catch (error) {
      console.error('Error en fetch:', error)
    }
  }

  const [newDocente, setNewDocente] = useState({
    name: '',
    lastName: '',
    idRole: '',
    telephoneNumber: '',
    ci: '',
    email: '',
    birthday: '',
    direction: '',
    parish: '',
  })

  const handleNewDocenteChange = (e) => {
    const { name, value } = e.target
    setNewDocente((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateDocente = async () => {
    if (
      !newDocente.name ||
      !newDocente.lastName ||
      !newDocente.email ||
      !newDocente.ci ||
      !newDocente.idRole ||
      !newDocente.telephoneNumber ||
      !newDocente.birthday ||
      !newDocente.direction ||
      !newDocente.parish
    ) {
      console.error('Por favor, complete todos los campos requeridos.')
      return
    }

    try {
      const response = await api.post('/api/personal/', {
        body: {
          name: newDocente.name,
          lastName: newDocente.lastName,
          idRole: parseInt(newDocente.idRole), // convertir a número
          telephoneNumber: newDocente.telephoneNumber.trim(),
          ci: newDocente.ci.trim(),
          email: newDocente.email.trim(),
          birthday: newDocente.birthday,
          direction: newDocente.direction.trim(),
          parish: newDocente.parish.trim(),
        },
      })
      console.log('Response:', response)
      if (response.error) {
        console.error('Error al crear docente:', response.msg || response)
        alert(response.msg || 'Ocurrió un error al crear el docente')
        return
      }

      console.log('Docente creado exitosamente:', response)

      setVisibleNewDocente(false)
      fetchDocentes()
      setNewDocente({
        name: '',
        lastName: '',
        idRole: '',
        telephoneNumber: '',
        ci: '',
        email: '',
        birthday: '',
        direction: '',
        parish: '',
      })
    } catch (error) {
      console.error('Error al crear docente:', error.msg || error)
      alert(error.msg || 'Ocurrió un error al crear el docente')
    }
  }

  const [parroquias, setParroquias] = useState([])
  const [cargos, setCargos] = useState([])
  const [docenteToEdit, setDocenteToEdit] = useState(null)

  const [editDocente, setEditDocente] = useState({
    name: '',
    lastName: '',
    email: '',
    ci: '',
    telephoneNumber: '',
    birthday: '',
    direction: '',
    parish: '',
    idRole: '',
  })

  useEffect(() => {
    if (docenteToEdit) {
      setEditDocente({
        name: docenteToEdit.name || '',
        lastName: docenteToEdit.lastName || '',
        email: docenteToEdit.email || '',
        ci: docenteToEdit.ci || '',
        telephoneNumber: docenteToEdit.telephoneNumber || '',
        birthday: docenteToEdit.birthday
          ? new Date(docenteToEdit.birthday).toISOString().split('T')[0]
          : '',
        direction: docenteToEdit.direction || '',
        parish: docenteToEdit.parish || '',
        idRole: docenteToEdit.idRole || '',
      })
    }
  }, [docenteToEdit])

  useEffect(() => {
    const loadData = async () => {
      const options = await getParroquias()

      setParroquias(options)
      const cargoOptions = await getCargos()
      setCargos(cargoOptions)
    }
    loadData()
  }, [])

  const getParroquias = async () => {
    try {
      const response = await api.get('/api/personal/utils/parroquias')
      console.log('Response parroquias:', response.parroquias)

      if (!response.error && Array.isArray(response.parroquias)) {
        return response.parroquias.map((parroquia) => ({
          label: parroquia.nombre,
          value: parroquia.id,
        }))
      } else {
        console.error('Error al obtener parroquias:', response)
        return []
      }
    } catch (error) {
      console.error('Error en fetch de parroquias:', error)
      return []
    }
  }

  const getCargos = async () => {
    try {
      const response = await api.get('/api/personal/utils/roles')
      console.log('RESPONSE CARGOS COMPLETO:', response)

      if (!response.error && Array.isArray(response.roles)) {
        return response.roles.map((r) => ({
          label: r.nombre,
          value: r.id,
        }))
      }

      console.error('Error en la respuesta de cargos:', response)
      return []
    } catch (error) {
      console.error('Error en fetch de cargos:', error)
      return []
    }
  }

  const handleUpdateDocente = async () => {
    console.log('Enviando PUT a:', `/api/personal/${docenteToEdit.id}`)
    console.log('Datos enviados:', editDocente)
    try {
      const response = await api.put(`/api/personal/${docenteToEdit.id}`, {
        body: {
          ...editDocente,
          idrole: parseInt(editDocente.idrole),
        },
      })

      if (response.error) {
        console.error('Error al actualizar docente:', response.msg || response)
        alert(response.msg || 'Error al actualizar')
        return
      }

      fetchDocentes()
      editClose()
      setDocenteToEdit(null)
    } catch (error) {
      console.error('Error en actualización:', error)
      alert('Error en la actualización')
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditDocente((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpen = () => {
    setVisibleNewDocente(true)
  }

  const handleClose = () => {
    setVisibleNewDocente(false)
  }

  const editOpen = () => {
    setVisibleEditDocente(true)
  }

  const editClose = () => {
    setVisibleEditDocente(false)
  }

  const viewOpen = (docente) => {
    setDocenteToView(docente)
    setVisibleViewDocente(true)
  }

  const viewClose = () => {
    setVisibleViewDocente(false)
    setDocenteToView(null)
  }

  const getParroquiaName = (parroquiaId) => {
    const parroquia = parroquias.find((p) => p.value === parroquiaId)
    return parroquia ? parroquia.label : 'No especificada'
  }

  const getCargoName = (cargoId) => {
    const cargo = cargos.find((c) => c.value === cargoId)
    return cargo ? cargo.label : 'No especificado'
  }

  const openDeleteConfirm = (docente) => {
    setDocenteToDelete(docente)
    setVisibleDeleteConfirm(true)
  }

  const closeDeleteConfirm = () => {
    setVisibleDeleteConfirm(false)
    setDocenteToDelete(null)
  }

  const deleteDocente = async () => {
    if (!docenteToDelete) return

    try {
      console.log('Deleting docente with id:', docenteToDelete.id)
      const response = await api.delet('/api/personal', docenteToDelete.id)

      if (!response.error) {
        fetchDocentes()
        closeDeleteConfirm()
      } else {
        console.error('Error eliminando docente:', response)
      }
    } catch (error) {
      console.error('Error en deleteDocente:', error)
    }
  }

  return (
    <div className="mp-4">
      <div className="mb-4 position-relative">
        <h2
          className="text-center position-relative pb-3"
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(to right, transparent, #4a4a4a, transparent) 1',
          }}
        >
          Docentes
        </h2>
      </div>

      <CButton color="info text-white" className="mb-3" onClick={handleOpen}>
        Crear docente
      </CButton>
      <CButton color="success text-white" className="mb-3 ms-2">
        Imprimir Lista docentes
      </CButton>

      <CCard>
        <CCardHeader className="bg-info text-white">
          <h4>Tabla de Docentes</h4>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                <CTableHeaderCell scope="col">Correo electronico</CTableHeaderCell>
                <CTableHeaderCell scope="col">Cedula</CTableHeaderCell>
                <CTableHeaderCell scope="col">Rol</CTableHeaderCell>
                <CTableHeaderCell scope="col">Función</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(data) &&
                data.map((docente) => {
                  return (
                    <CTableRow key={docente.id}>
                      <CTableDataCell>{docente.name}</CTableDataCell>
                      <CTableDataCell>{docente.lastName}</CTableDataCell>
                      <CTableDataCell>{docente.email}</CTableDataCell>
                      <CTableDataCell>{docente.ci}</CTableDataCell>
                      <CTableDataCell>
                        {cargos.find((cargo) => cargo.value === docente.idRole)?.label ||
                          'Desconocido'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color="warning"
                          className="me-2"
                          onClick={() => viewOpen(docente)}
                        >
                          Ver más
                        </CButton>
                        <CButton
                          size="sm"
                          color="info"
                          className="me-2"
                          onClick={() => {
                            setDocenteToEdit(docente)
                            editOpen()
                          }}
                        >
                          Editar
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => openDeleteConfirm(docente)}
                        >
                          Eliminar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal size="lg" visible={VisibleNewDocente} onClose={handleClose}>
        <CModalHeader className="bg-info text-white">
          <CModalTitle>Crear Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormInput
                  label="Nombre"
                  name="name"
                  className="mb-3"
                  type="text"
                  placeholder="Ingrese el nombre del docente"
                  value={newDocente.name}
                  onChange={handleNewDocenteChange}
                  required
                />
                <CFormInput
                  label="Apellido"
                  name="lastName"
                  className="mb-3"
                  type="text"
                  placeholder="Ingrese el apellido del docente"
                  value={newDocente.lastName}
                  onChange={handleNewDocenteChange}
                  required
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="email"
                  label="Email"
                  name="email"
                  className="mb-3"
                  placeholder="Ingrese el correo electronico"
                  value={newDocente.email}
                  onChange={handleNewDocenteChange}
                  required
                />
                <CFormInput
                  type="text"
                  label="Cedula"
                  name="ci"
                  className="mb-3"
                  placeholder="Ingrese la cedula de identidad con una V o E"
                  value={newDocente.ci}
                  onChange={handleNewDocenteChange}
                  required
                />
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormInput
                  type="text"
                  label="Numero de telefono"
                  name="telephoneNumber"
                  className="mb-3"
                  placeholder="Ingrese el numero de telefono"
                  value={newDocente.telephoneNumber}
                  onChange={handleNewDocenteChange}
                  required
                />
                <CFormInput
                  type="date"
                  label="Fecha de nacimiento"
                  name="birthday"
                  className="mb-3"
                  placeholder="Ingrese la fecha de nacimiento"
                  value={newDocente.birthday}
                  onChange={handleNewDocenteChange}
                  required
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="text"
                  label="Direccion"
                  name="direction"
                  className="mb-3"
                  placeholder="Ingrese la direccion del docente"
                  value={newDocente.direction}
                  onChange={handleNewDocenteChange}
                  required
                />
                <CFormSelect
                  label="Parroquia"
                  name="parish"
                  className="mb-3"
                  value={newDocente.parish}
                  onChange={handleNewDocenteChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {parroquias.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={5} xs={7} className="flex-grow-1 mb-3">
                <CFormSelect
                  label="Cargo"
                  name="idRole"
                  className="mb-3"
                  value={newDocente.idRole}
                  onChange={handleNewDocenteChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {cargos.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={handleClose}>
            Cerrar
          </CButton>
          <CButton color="success" className="text-white" onClick={handleCreateDocente}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal size="lg" visible={VisibleEditDocente} onClose={editClose}>
        <CModalHeader className="bg-info text-white">
          <CModalTitle>Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormInput
                  label="Nombre"
                  name="name"
                  className="mb-3"
                  value={editDocente.name}
                  onChange={(e) => handleEditChange(e)}
                />
                <CFormInput
                  label="Apellido"
                  name="lastName"
                  className="mb-3"
                  value={editDocente.lastName}
                  onChange={(e) => handleEditChange(e)}
                />
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormInput
                  type="email"
                  label="Email"
                  name="email"
                  className="mb-3"
                  value={editDocente.email}
                  onChange={(e) => handleEditChange(e)}
                />
                <CFormInput
                  type="Cedula"
                  label="Cedula"
                  name="ci"
                  className="mb-3"
                  value={editDocente.ci}
                  onChange={(e) => handleEditChange(e)}
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="text"
                  label="Numero de telefono"
                  name="telephoneNumber"
                  className="mb-3"
                  value={editDocente.telephoneNumber}
                  onChange={(e) => handleEditChange(e)}
                />
                <CFormInput
                  type="date"
                  label="Fecha de nacimiento"
                  name="birthday"
                  className="mb-3"
                  value={editDocente.birthday}
                  onChange={(e) => handleEditChange(e)}
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="text"
                  label="Direccion"
                  name="direction"
                  className="mb-3"
                  value={editDocente.direction}
                  onChange={(e) => handleEditChange(e)}
                />
                <CFormSelect
                  label="Parroquia"
                  name="parish"
                  className="mb-3"
                  value={editDocente.parish}
                  onChange={(e) => handleEditChange(e)}
                >
                  <option value="">Seleccione</option>
                  {parroquias.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={5} xs={7} className="flex-grow-1 mb-3">
                <CFormSelect
                  label="Cargo"
                  name="idRole"
                  className="mb-3"
                  value={editDocente.idRole}
                  onChange={(e) => handleEditChange(e)}
                  required
                >
                  <option value="">Seleccione</option>
                  {cargos.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={editClose}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleUpdateDocente}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal size="lg" visible={VisibleViewDocente} onClose={viewClose}>
        <CModalHeader className="bg-info text-white">
          <CModalTitle>Detalles del Docente</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {docenteToView && (
            <CForm>
              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormInput
                    label="Nombre"
                    className="mb-3"
                    value={docenteToView.name || 'No especificado'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <CFormInput
                    label="Apellido"
                    className="mb-3"
                    value={docenteToView.lastName || 'No especificado'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormInput
                    label="Email"
                    className="mb-3"
                    value={docenteToView.email || 'No especificado'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <CFormInput
                    label="Cédula"
                    className="mb-3"
                    value={docenteToView.ci || 'No especificado'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormInput
                    label="Número de teléfono"
                    className="mb-3"
                    value={docenteToView.telephoneNumber || 'No especificado'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <CFormInput
                    label="Fecha de nacimiento"
                    className="mb-3"
                    value={
                      docenteToView.birthday
                        ? new Date(docenteToView.birthday).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : ''
                    }
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormInput
                    label="Dirección"
                    className="mb-3"
                    value={docenteToView.direction || 'No especificado'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <CFormInput
                    label="Parroquia"
                    className="mb-3"
                    value={getParroquiaName(docenteToView.parish)}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormInput
                    label="Cargo"
                    className="mb-3"
                    value={getCargoName(docenteToView.idRole)}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </CCol>
              </CRow>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white">
            Imprimir
          </CButton>
          <CButton color="warning" className="text-white" onClick={viewClose}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visibleDeleteConfirm} onClose={closeDeleteConfirm}>
        <CModalHeader>
          <CModalTitle>Confirmar eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro que quieres eliminar al docente{' '}
          <strong>
            {docenteToDelete?.name} {docenteToDelete?.lastName}
          </strong>
          ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeDeleteConfirm}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={deleteDocente}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Docente
