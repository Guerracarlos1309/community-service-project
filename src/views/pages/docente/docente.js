import react, { useState } from 'react'
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

const Docente = () => {
  const [VisibleNewDocente, setVisibleNewDocente] = useState(false)

  const docentes = [
    {
      id: 1,
      nombre: 'Juan Daniel',
      apellido: 'Guevara chacon',
      email: 'JuanGuevara@gmail.com',
      telefono: '04241542452',
      telefonoResidencia: '04241542452',
      cargo: 'Docente de Educacion Inicial',
      cedula: '31419488',
    },
    {
      id: 2,
      nombre: 'Pedro Gustavo',
      apellido: 'Guevara abreu',
      email: 'PedroGuevara@gmail.com',
      telefono: '04247842454',
      telefonoResidencia: '04247842454',
      cargo: 'Docente 2do Grado',
      cedula: '31419488',
    },
    {
      id: 3,
      nombre: 'Luis Daniel',
      apellido: 'Guevara lozada',
      email: 'LuisGuevara@gmail.com',
      telefono: '04247842454',
      telefonoResidencia: '04247842454',
      cargo: 'Docente 3er grado',
      cedula: '31419488',
    },
  ]

  const handleOpen = () => {
    setVisibleNewDocente(true)
  }

  const handleClose = () => {
    setVisibleNewDocente(false)
  }

  return (
    <div className="mp-4">
      <div className="mb-4 position-relative">
        <h2
          className="text-center position-relative pb-3"
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '#4a4a4a',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(to right, transparent, #4a4a4a, transparent) 1',
          }}
        >
          Docentes
        </h2>
      </div>

      <CButton color="warning" className="mb-3" onClick={handleOpen}>
        Crear docente
      </CButton>

      <CCard>
        <CCardHeader style={{ backgroundColor: '#3D90D7' }}>
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
                <CTableHeaderCell scope="col">Cargo</CTableHeaderCell>
                <CTableHeaderCell scope="col">Función</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {docentes.map((docente) => (
                <CTableRow key={docente.id}>
                  <CTableDataCell>{docente.nombre}</CTableDataCell>
                  <CTableDataCell>{docente.apellido}</CTableDataCell>
                  <CTableDataCell>{docente.email}</CTableDataCell>
                  <CTableDataCell>{docente.cedula}</CTableDataCell>
                  <CTableDataCell>{docente.cargo}</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="info" className="me-2">
                      Editar
                    </CButton>
                    <CButton size="sm" color="danger">
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
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
          <CButton color="secondary" onClick={handleClose}>
            Cerrar
          </CButton>
          <CButton color="primary">Guardar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Docente
