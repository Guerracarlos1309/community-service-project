'use client'
import { useEffect, useState } from 'react'
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
  CSpinner,
  CAlert,
} from '@coreui/react'
import { helpFetch } from '../../../api/helpFetch.js'
import { number } from 'prop-types'

const api = helpFetch()

const Docente = () => {
  const [VisibleNewDocente, setVisibleNewDocente] = useState(false)
  const [VisibleEditDocente, setVisibleEditDocente] = useState(false)
  const [VisibleViewDocente, setVisibleViewDocente] = useState(false)
  const [docenteToView, setDocenteToView] = useState(null)
  const [docenteToDelete, setDocenteToDelete] = useState(null)
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = useState(false)
  const [data, setData] = useState([])

  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingPersonalPdf, setDownloadingPersonalPdf] = useState({})

  // Estados para parroquias y cargos
  const [parroquias, setParroquias] = useState([])
  const [cargos, setCargos] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)

  // CARGAR TODO AL INICIO Y ESPERAR A QUE TERMINE
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoadingData(true)
        setError(null)

        console.log('🔄 Iniciando carga de todos los datos...')

        // Cargar parroquias y cargos PRIMERO
        const [parroquiasData, cargosData] = await Promise.all([getParroquias(), getCargos()])

        console.log('📍 Parroquias obtenidas:', parroquiasData)
        console.log('👔 Cargos obtenidos:', cargosData)

        setParroquias(parroquiasData)
        setCargos(cargosData)

        // LUEGO cargar docentes
        await fetchDocentes()

        console.log('✅ Todos los datos cargados correctamente')
      } catch (error) {
        console.error('❌ Error cargando datos:', error)
        setError('Error al cargar los datos iniciales')
      } finally {
        setLoadingData(false)
      }
    }

    loadAllData()
  }, [])

  const fetchDocentes = async () => {
    try {
      console.log('🔄 Cargando docentes...')
      const response = await api.get('/api/personal')

      if (!response.error) {
        console.log('✅ Docentes cargados:', response.personal)
        setData(response.personal)
      } else {
        console.error('❌ Error al obtener docentes:', response)
        setError('Error al cargar docentes')
      }
    } catch (error) {
      console.error('❌ Error en fetch docentes:', error)
      setError('Error al cargar docentes')
    }
  }

  const getParroquias = async () => {
    try {
      console.log('🔄 Obteniendo parroquias...')
      const response = await api.get('/api/personal/utils/parroquias')

      console.log('📍 Response RAW de parroquias:', response)

      if (!response.error && response.parroquias) {
        console.log('📍 Array de parroquias recibido:', response.parroquias)

        if (Array.isArray(response.parroquias)) {
          const parroquiasFormateadas = response.parroquias.map((parroquia, index) => {
            console.log(`📍 Procesando parroquia ${index}:`, parroquia)
            return {
              label: parroquia.nombre,
              value: parroquia.id,
              // Mantener datos originales para debugging
              original: parroquia,
            }
          })

          console.log('✅ Parroquias formateadas:', parroquiasFormateadas)
          setParroquias(parroquiasFormateadas)
          return parroquiasFormateadas
        } else {
          console.error('❌ response.parroquias no es un array:', typeof response.parroquias)
          setParroquias([])
          return []
        }
      } else {
        console.error('❌ Error en respuesta de parroquias:', response)
        setParroquias([])
        return []
      }
    } catch (error) {
      console.error('❌ Error obteniendo parroquias:', error)
      setParroquias([])
      return []
    }
  }

  const getCargos = async () => {
    try {
      console.log('🔄 Obteniendo cargos...')
      const response = await api.get('/api/personal/utils/roles')

      console.log('👔 Response completo de cargos:', response)

      if (!response.error && Array.isArray(response.roles)) {
        const cargosFormateados = response.roles.map((cargo) => {
          console.log('👔 Procesando cargo:', cargo)
          return {
            label: cargo.nombre,
            value: cargo.id,
            raw: cargo,
          }
        })

        console.log('✅ Cargos formateados:', cargosFormateados)
        return cargosFormateados
      } else {
        console.error('❌ Error en respuesta de cargos:', response)
        return []
      }
    } catch (error) {
      console.error('❌ Error obteniendo cargos:', error)
      return []
    }
  }

  const getParroquiaName = (parroquiaId) => {
    if (parroquiaId === undefined || parroquiaId === null || parroquiaId === '') {
      return 'No especificada'
    }

    if (!parroquias || parroquias.length === 0) {
      return 'Cargando...'
    }

    const parroquiaEncontrada = parroquias.find((p) => String(p.value) === String(parroquiaId))

    return parroquiaEncontrada ? parroquiaEncontrada.label : `ID: ${parroquiaId}`
  }

  // FUNCIÓN MEJORADA PARA OBTENER NOMBRE DE CARGO
  const getCargoName = (cargoId) => {
    console.log('🔍 === DEBUGGING CARGO ===')
    console.log('🔍 ID recibido:', cargoId)
    console.log('🔍 Tipo del ID:', typeof cargoId)
    console.log('🔍 Cargos disponibles:', cargos)

    if (!cargoId && cargoId !== 0) {
      console.log('❌ No hay ID de cargo')
      return 'No especificado'
    }

    if (!cargos || cargos.length === 0) {
      console.log('❌ No hay cargos cargados')
      return 'Cargando...'
    }

    // Buscar de múltiples formas
    const cargoEncontrado =
      cargos.find((c) => c.value === cargoId) ||
      cargos.find((c) => c.value == cargoId) ||
      cargos.find((c) => String(c.value) === String(cargoId)) ||
      cargos.find((c) => Number(c.value) === Number(cargoId))

    console.log('✅ Cargo encontrado:', cargoEncontrado)
    console.log('🔍 === FIN DEBUGGING CARGO ===')

    return cargoEncontrado ? cargoEncontrado.label : `No encontrado (ID: ${cargoId})`
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
    console.log(`📝 Cambiando ${name}:`, value)
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
      alert('Por favor, complete todos los campos requeridos.')
      return
    }

    try {
      console.log('📤 === CREANDO DOCENTE ===')
      console.log('📤 Datos del formulario:', newDocente)

      const dataToSend = {
        name: newDocente.name.trim(),
        lastName: newDocente.lastName.trim(),
        idRole: Number(newDocente.idRole),
        telephoneNumber: newDocente.telephoneNumber.trim(),
        ci: newDocente.ci.trim(),
        email: newDocente.email.trim(),
        birthday: newDocente.birthday,
        direction: newDocente.direction.trim(),
        parish: Number(newDocente.parish),
      }

      console.log('📤 Datos a enviar:', dataToSend)
      console.log('📤 Tipo de parish:', typeof dataToSend.parish)

      const response = await api.post('/api/personal/', {
        body: dataToSend,
      })

      console.log('📥 Response del servidor:', response)

      if (response.error) {
        console.error('❌ Error del servidor:', response.msg || response)

        return
      }

      console.log('✅ Docente creado exitosamente')

      setVisibleNewDocente(false)
      await fetchDocentes()
      resetNewDocenteForm()
    } catch (error) {
      console.error('❌ Error creando docente:', error)
    }
  }

  const resetNewDocenteForm = () => {
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
  }

  const viewOpen = (docente) => {
    // Verificar si la parroquia existe en el array
    const parroquiaExiste = parroquias.find(
      (p) =>
        p.value === docente.parish ||
        p.value == docente.parish ||
        String(p.value) === String(docente.parish) ||
        String(p.value) === String(docente.parish),
    )

    console.log('👁️ ¿Parroquia existe en array?', !!parroquiaExiste)
    if (parroquiaExiste) {
      console.log('👁️ Parroquia encontrada:', parroquiaExiste)
    }

    setDocenteToView(docente)
    setVisibleViewDocente(true)
  }

  const viewClose = () => {
    setVisibleViewDocente(false)
    setDocenteToView(null)
  }

  // Resto de funciones...
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

  const handleUpdateDocente = async () => {
    try {
      const response = await api.put(`/api/personal/${docenteToEdit.id}`, {
        body: {
          ...editDocente,
          idRole: Number(editDocente.idRole),
          parish: Number(newDocente.parish),
        },
      })
      if (response.error) {
        return
      }

      fetchDocentes()
      setVisibleEditDocente(false)
      setDocenteToEdit(null)
    } catch (error) {
      console.error('Error en actualización:', error)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditDocente((prev) => ({
      ...prev,
      [name]: value,
    }))
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
      const response = await api.delet('/api/personal', docenteToDelete.id)
      if (!response.error) {
        fetchDocentes()
        closeDeleteConfirm()
      } else {
      }
    } catch (error) {
      console.error('Error en deleteDocente:', error)
    }
  }

  // MOSTRAR LOADING MIENTRAS SE CARGAN LOS DATOS
  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Cargando datos iniciales...</span>
      </div>
    )
  }

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.downloadFile('/api/pdf/personal/teachers/list') // <- tu endpoint
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Listado_Docentes.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error descargando PDF:', error)
    }
  }

  const handleDownloadDocentePdf = async (id, nombre) => {
    try {
      const blob = await api.downloadFile(`/api/pdf/personal/teacher/${id}/details`)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Docente_${docenteToView.name}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error descargando PDF del docente:', error)
    }
  }

  return (
    <div className="mp-4">
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </CAlert>
      )}

      <div className="mb-4 position-relative">
        <h2
          className="text-center position-relative pb-3"
          style={{
            fontFamily: 'Arial, sans-serif',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(to right, transparent, #4a4a4a, transparent) 1',
          }}
        >
          Docentes
        </h2>
      </div>

      <CButton color="info text-white" className="mb-3" onClick={() => setVisibleNewDocente(true)}>
        Crear docente
      </CButton>
      <CButton color="success text-white" className="mb-3 ms-2" onClick={handleDownloadPdf}>
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
                data.map((docente) => (
                  <CTableRow key={docente.id}>
                    <CTableDataCell>{docente.name}</CTableDataCell>
                    <CTableDataCell>{docente.lastName}</CTableDataCell>
                    <CTableDataCell>{docente.email}</CTableDataCell>
                    <CTableDataCell>{docente.ci}</CTableDataCell>
                    <CTableDataCell>{getCargoName(docente.idRole)}</CTableDataCell>
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
                          setVisibleEditDocente(true)
                        }}
                      >
                        Editar
                      </CButton>
                      <CButton size="sm" color="danger" onClick={() => openDeleteConfirm(docente)}>
                        Eliminar
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para crear docente */}
      <CModal size="lg" visible={VisibleNewDocente} onClose={() => setVisibleNewDocente(false)}>
        <CModalHeader className="bg-info text-white">
          <CModalTitle>Crear Docente</CModalTitle>
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
                  value={Number(newDocente.parish)}
                  onChange={handleNewDocenteChange}
                  required
                >
                  <option value="0">Seleccione</option>
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
          <CButton
            color="danger"
            className="text-white"
            onClick={() => setVisibleNewDocente(false)}
          >
            Cerrar
          </CButton>
          <CButton color="success" className="text-white" onClick={handleCreateDocente}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para editar docente */}
      <CModal size="lg" visible={VisibleEditDocente} onClose={() => setVisibleEditDocente(false)}>
        <CModalHeader className="bg-info text-white">
          <CModalTitle>Editar Docente</CModalTitle>
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
                  onChange={handleEditChange}
                />
                <CFormInput
                  label="Apellido"
                  name="lastName"
                  className="mb-3"
                  value={editDocente.lastName}
                  onChange={handleEditChange}
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="email"
                  label="Email"
                  name="email"
                  className="mb-3"
                  value={editDocente.email}
                  onChange={handleEditChange}
                />
                <CFormInput
                  type="text"
                  label="Cedula"
                  name="ci"
                  className="mb-3"
                  value={editDocente.ci}
                  onChange={handleEditChange}
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="text"
                  label="Numero de telefono"
                  name="telephoneNumber"
                  className="mb-3"
                  value={editDocente.telephoneNumber}
                  onChange={handleEditChange}
                />
                <CFormInput
                  type="date"
                  label="Fecha de nacimiento"
                  name="birthday"
                  className="mb-3"
                  value={editDocente.birthday}
                  onChange={handleEditChange}
                />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormInput
                  type="text"
                  label="Direccion"
                  name="direction"
                  className="mb-3"
                  value={editDocente.direction}
                  onChange={handleEditChange}
                />
                <CFormSelect
                  label="Parroquia"
                  name="parish"
                  className="mb-3"
                  value={editDocente.parish}
                  onChange={handleEditChange}
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
                  onChange={handleEditChange}
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
          <CButton color="secondary" onClick={() => setVisibleEditDocente(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleUpdateDocente}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para ver docente - CON DEBUGGING MEJORADO */}
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
                        : 'No especificado'
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
          <CButton
            color="success"
            className="text-white"
            onClick={() => handleDownloadDocentePdf(docenteToView.id, docenteToView.lastname)}
          >
            {' '}
            Imprimir
          </CButton>
          <CButton color="warning" className="text-white" onClick={viewClose}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para confirmar eliminación */}
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
