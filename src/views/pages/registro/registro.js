import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const registro = () => {
  const [visible, setVisible] = useState(false)

  const students = [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', career: 'Ingeniería' },
    { id: 2, name: 'María López', email: 'maria.lopez@example.com', career: 'Medicina' },
  ]

  return (
    <div>
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
          Registro estudiantil
        </h2>
      </div>
      <CCard>
        <CCardHeader
          style={{ backgroundColor: '#3D90D7' }}
          className="d-flex justify-content-between align-items-center"
        >
          <h4>Registro de Estudiantes</h4>
          <CButton color="primary" onClick={() => setVisible(true)}>
            Nuevo Estudiante
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Carrera</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {students.map((student) => (
                <CTableRow key={student.id}>
                  <CTableDataCell>{student.id}</CTableDataCell>
                  <CTableDataCell>{student.name}</CTableDataCell>
                  <CTableDataCell>{student.email}</CTableDataCell>
                  <CTableDataCell>{student.career}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <h5>Registrar Estudiante</h5>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              label="Nombre Completo"
              placeholder="Ingresa el nombre"
              className="mb-3"
            />
            <CFormInput
              type="email"
              label="Correo Electrónico"
              placeholder="Ingresa el correo"
              className="mb-3"
            />
            <CFormInput
              type="text"
              label="Carrera"
              placeholder="Ingresa la carrera"
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="primary">Guardar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default registro
