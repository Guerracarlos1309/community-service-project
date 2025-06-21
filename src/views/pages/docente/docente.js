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

const api = helpFetch()

const Docente = () => {
  const [VisibleNewDocente, setVisibleNewDocente] = useState(false)
  const [VisibleEditDocente, setVisibleEditDocente] = useState(false)

  const [data, setData] = useState([])

  useEffect(() => {
    fetchDocentes()
  }, [])

  useEffect(() => {}, [data])

  const fetchDocentes = async () => {
    try {
      const response = await api.get('/api/personal')
      console.log('Respuesta API:', response)
      if (!response.error) {
        setData(response.personal)
      } else {
        console.error('Error al obtener docentes:', response)
      }
    } catch (error) {
      console.error('Error en fetch:', error)
    }
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
                  console.log('Docente:', docente)
                  return (
                    <CTableRow key={docente.id}>
                      <CTableDataCell>{docente.nombre}</CTableDataCell>
                      <CTableDataCell>{docente.apellido}</CTableDataCell>
                      <CTableDataCell>{docente.email}</CTableDataCell>
                      <CTableDataCell>{docente.cedula}</CTableDataCell>
                      <CTableDataCell>{docente.idrole}</CTableDataCell>
                      <CTableDataCell>
                        <CButton size="sm" color="warning" className="me-2">
                          Ver más
                        </CButton>
                        <CButton size="sm" color="info" className="me-2" onClick={editOpen}>
                          Editar
                        </CButton>
                        <CButton size="sm" color="danger">
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
        <CModalHeader>
          <CModalTitle>Crear Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormInput label="Nombre" name="name" className="mb-3" />
                <CFormInput label="Apellido" name="Apellido" className="mb-3" />
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormInput type="email" label="Email" name="email" className="mb-3" />
                <CFormInput type="Cedula" label="Cedula" name="cedula" className="mb-3" />
              </CCol>
              <CCol md={5} xs={7} className="flex-grow-1 mb-3">
                <CFormSelect
                  label="Cargo"
                  name="cargo"
                  className="mb-3"
                  options={[
                    { label: 'Seleccione', value: '' },
                    { label: 'Docente', value: 'docente' },
                    { label: 'Personal Apoyo', value: 'personalApoyo' },
                  ]}
                />
              </CCol>
              <CCol md={5} xs={7} className="flex-grow-1 mb-3">
                <CFormSelect
                  label="Rol"
                  name="role"
                  className="mb-3"
                  options={[
                    { label: 'Seleccione', value: '' },
                    { label: 'Educacion Inicial', value: 'educacionInicial' },
                    { label: '1er Grado', value: '1erGrado' },
                    { label: '2do Grado', value: '2doGrado' },
                    { label: '3er Grado', value: '3erGrado' },
                    { label: '4to Grado', value: '4toGrado' },
                    { label: '5to Grado', value: '5toGrado' },
                    { label: '6to Grado', value: '6toGrado' },
                    { label: 'Computación', value: 'computacion' },
                    { label: 'Biblioteca', value: 'biblioteca' },
                  ]}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={handleClose}>
            Cerrar
          </CButton>
          <CButton color="success" className="text-white">
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal size="lg" visible={VisibleEditDocente} onClose={editClose}>
        <CModalHeader>
          <CModalTitle>Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormInput label="Nombre" name="name" className="mb-3" />
                <CFormInput label="Apellido" name="Apellido" className="mb-3" />
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormInput type="email" label="Email" name="email" className="mb-3" />
                <CFormInput type="Cedula" label="Cedula" name="cedula" className="mb-3" />
              </CCol>
              <CCol md={5} xs={7} className="flex-grow-1 mb-3">
                <CFormSelect
                  label="Cargo"
                  name="cargo"
                  className="mb-3"
                  options={[
                    { label: 'Seleccione', value: '' },
                    { label: 'Docente', value: 'docente' },
                    { label: 'Personal Apoyo', value: 'personalApoyo' },
                  ]}
                />
              </CCol>
              <CCol md={5} xs={7} className="flex-grow-1 mb-3">
                <CFormSelect
                  label="Rol"
                  name="role"
                  className="mb-3"
                  options={[
                    { label: 'Seleccione', value: '' },
                    { label: 'Educacion Inicial', value: 'educacionInicial' },
                    { label: '1er Grado', value: '1erGrado' },
                    { label: '2do Grado', value: '2doGrado' },
                    { label: '3er Grado', value: '3erGrado' },
                    { label: '4to Grado', value: '4toGrado' },
                    { label: '5to Grado', value: '5toGrado' },
                    { label: '6to Grado', value: '6toGrado' },
                    { label: 'Computación', value: 'computacion' },
                    { label: 'Biblioteca', value: 'biblioteca' },
                  ]}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={editClose}>
            Cerrar
          </CButton>
          <CButton color="primary">Guardar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Docente
