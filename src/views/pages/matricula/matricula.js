import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CBadge,
  CRow,
  CCol,
  CContainer,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const datosEstudiantes = {
  Preescolar: [
    { id: 1, nombre: 'Ana García', edad: 5 },
    { id: 2, nombre: 'Carlos Pérez', edad: 5 },
    { id: 3, nombre: 'Lucía Martínez', edad: 4 },
  ],
  '1er Grado': [
    { id: 4, nombre: 'Miguel Rodríguez', edad: 6 },
    { id: 5, nombre: 'Sofía López', edad: 6 },
    { id: 6, nombre: 'David Torres', edad: 7 },
  ],
  '2do Grado': [
    { id: 7, nombre: 'Julia Hernández', edad: 7 },
    { id: 8, nombre: 'Pablo Sánchez', edad: 8 },
    { id: 9, nombre: 'Valentina Díaz', edad: 7 },
  ],
  '3er Grado': [
    { id: 10, nombre: 'Mateo Gómez', edad: 8 },
    { id: 11, nombre: 'Camila Vargas', edad: 9 },
    { id: 12, nombre: 'Alejandro Ruiz', edad: 8 },
  ],
  '4to Grado': [
    { id: 13, nombre: 'Isabella Fernández', edad: 9 },
    { id: 14, nombre: 'Santiago Mendoza', edad: 10 },
    { id: 15, nombre: 'Valeria Castro', edad: 9 },
  ],
  '5to Grado': [
    { id: 16, nombre: 'Emilio Morales', edad: 10 },
    { id: 17, nombre: 'Renata Ortega', edad: 11 },
    { id: 18, nombre: 'Joaquín Núñez', edad: 10 },
  ],
  '6to Grado': [
    { id: 19, nombre: 'Emma Jiménez', edad: 11 },
    { id: 20, nombre: 'Daniel Gutiérrez', edad: 12 },
    { id: 21, nombre: 'Martina Romero', edad: 11 },
  ],
}

const matricula = () => {
  const [activeKey, setActiveKey] = useState(Object.keys(datosEstudiantes)[0])
  const [estudiantes, setEstudiantes] = useState([])
  const [totalEstudiantes, setTotalEstudiantes] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    setEstudiantes(datosEstudiantes[activeKey] || [])

    const total = Object.values(datosEstudiantes).reduce((sum, gradoEstudiantes) => {
      return sum + gradoEstudiantes.length
    }, 0)
    setTotalEstudiantes(total)
  }, [activeKey])

  return (
    <CContainer>
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
          Sistema de Matrícula Estudiantil
        </h2>
      </div>

      <CRow>
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader className="bg-primary text-white">
              <strong>Grados Académicos</strong>
              <CBadge color="light" className="text-dark float-end">
                {totalEstudiantes} estudiantes
              </CBadge>
            </CCardHeader>
            <CCardBody>
              <CNav variant="pills" className="flex-column" activeKey={activeKey}>
                {Object.keys(datosEstudiantes).map((grado) => (
                  <CNavItem key={grado}>
                    <CNavLink
                      href="javascript:void(0)"
                      active={activeKey === grado}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveKey(grado)
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {grado}
                      <CBadge color="info" shape="rounded-pill">
                        {datosEstudiantes[grado].length}
                      </CBadge>
                    </CNavLink>
                  </CNavItem>
                ))}
              </CNav>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={8}>
          <CCard>
            <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              {' '}
              <h4>Tabla de estudiantes Matriculados</h4>
              <CBadge color="light" className="text-dark float-end">
                {estudiantes.length} estudiantes
              </CBadge>
            </CCardHeader>
            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Edad</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Funcion</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {estudiantes.map((estudiante) => (
                    <CTableRow key={estudiante.id}>
                      <CTableHeaderCell scope="row">{estudiante.id}</CTableHeaderCell>
                      <CTableDataCell>{estudiante.nombre}</CTableDataCell>
                      <CTableDataCell>{estudiante.edad} años</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="warning"
                          className="me-2"
                          size="sm"
                          onClick={() => navigate(`/infoMatricula/${estudiante.id}`)}
                        >
                          Ver Más
                        </CButton>

                        <CButton color="danger" className="me-2" size="sm">
                          Eliminar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default matricula
