import React from 'react'
import angular from '../../../assets/images/angular.jpg'
import rea from '../../../assets/images/react.jpg'
import vue from '../../../assets/images/vue.jpg'
import { CButton, CCard, CCardBody, CCardTitle, CCol, CRow } from '@coreui/react'

const brigada = () => {
  const brigadas = [
    { id: 1, nombre: 'Brigada de Primeros Auxilios', imagen: angular },
    { id: 2, nombre: 'Brigada Contra Incendios', imagen: angular },
    { id: 3, nombre: 'Brigada de Seguridad Escolar', imagen: vue },
    { id: 4, nombre: 'Brigada Ecológica', imagen: vue },
    { id: 5, nombre: 'Brigada de Limpieza', imagen: rea },
    { id: 6, nombre: 'Brigada de Deportes', imagen: rea },
    { id: 7, nombre: 'Brigada Cultural', imagen: rea },
    { id: 8, nombre: 'Brigada de Tecnología', imagen: angular },
  ]
  return (
    <div className="p-4">
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
          Brigadas
        </h2>
      </div>
      <div className="d-flex justify-content-end mb-4">
        <CButton color="primary">Añadir Brigada</CButton>
      </div>
      <CRow className="g-4">
        {brigadas.map((brigada) => (
          <CCol xs={12} sm={6} md={4} lg={3} key={brigada.id}>
            <CCard className="h-100">
              <CCardBody className="d-flex flex-column justify-content-between">
                <div>
                  <CCardTitle>{brigada.nombre}</CCardTitle>
                </div>
                <div>
                  <img
                    src={brigada.imagen}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <p className="text-muted">Descripción breve de la brigada.</p>
                </div>
                <div>
                  <div className="mt-3">
                    <CButton color="info" style={{ margin: 1 }}>
                      Ver más
                    </CButton>

                    <CButton color="danger" style={{ margin: 1 }}>
                      Eliminar
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  )
}

export default brigada