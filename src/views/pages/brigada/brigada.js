import { useState } from 'react'
import React from 'react'
import angular from '../../../assets/images/angular.jpg'
import rea from '../../../assets/images/react.jpg'
import vue from '../../../assets/images/vue.jpg'
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CModal,
  CRow,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CCardImage,
  CModalFooter,
} from '@coreui/react'

const brigada = () => {
  const [visibleNewBrigade, setVisibleNewBrigade] = useState(false)
  const [visibleViewMore, setVisibleViewMore] = useState(false)
  const [selectedBrigada, setSelectedBrigada] = useState(null)

  const brigadas = [
    {
      id: 1,
      nombre: 'Brigada de Primeros Auxilios',
      imagen: angular,
      estudiantes: 20,
      actividades: ['1', '2'],
    },
    {
      id: 2,
      nombre: 'Brigada Contra Incendios',
      imagen: angular,
      estudiantes: 15,
      actividades: ['1', '2'],
    },
    {
      id: 3,
      nombre: 'Brigada de Seguridad Escolar',
      imagen: vue,
      estudiantes: 25,
      actividades: ['1', '2'],
    },
    { id: 4, nombre: 'Brigada Ecológica', imagen: vue, estudiantes: 30, actividades: ['1', '2'] },
    { id: 5, nombre: 'Brigada de Limpieza', imagen: rea, estudiantes: 18, actividades: ['1', '2'] },
    { id: 6, nombre: 'Brigada de Deportes', imagen: rea, estudiantes: 22, actividades: ['1', '2'] },
    { id: 7, nombre: 'Brigada Cultural', imagen: rea, estudiantes: 10, actividades: ['1', '2'] },
    {
      id: 8,
      nombre: 'Brigada de Tecnología',
      imagen: angular,
      estudiantes: 12,
      actividades: ['1', '2'],
    },
  ]

  const openNewBrigadeModal = () => {
    setVisibleNewBrigade(true)
  }

  const handleCloseModal = () => {
    setVisibleNewBrigade(false)
  }

  const openViewMoreModal = (brigada) => {
    setVisibleViewMore(true)
    setSelectedBrigada(brigada)
  }
  const handleCloseViewMoreModal = () => {
    setVisibleViewMore(false)
    setSelectedBrigada(null)
  }

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
        <CButton color="primary" onClick={openNewBrigadeModal}>
          Añadir Brigada
        </CButton>
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
                    <CButton
                      color="info"
                      style={{ margin: 1 }}
                      onClick={() => openViewMoreModal(brigada)}
                    >
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

      <CModal
        size="lg"
        visible={visibleNewBrigade}
        aria-labelledby="OptionalSizesExample2"
        onClose={handleCloseModal}
      >
        <CModalHeader>
          <CModalTitle id="OptionalSizesExample2">Nueva Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="name">
                  <strong>Nombre de la brigada</strong>
                </CFormLabel>
                <CFormInput id="name" name="name" placeholder="Ingresa el nombre" />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="responsible">
                  <strong>Responsable </strong>
                </CFormLabel>
                <CFormInput
                  id="responsible"
                  name="responsible"
                  placeholder="Nombre del responsable"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="date">
                  <strong>Fecha de creación </strong>
                </CFormLabel>
                <CFormInput type="date" id="date" name="date" />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="area">
                  <strong>Área</strong>
                </CFormLabel>
                <CFormSelect id="area" name="area">
                  <option>Selecciona una opción</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Salud">Salud</option>
                  <option value="Ciencias Sociales">Ciencias Sociales</option>
                  <option value="Humanidades">Humanidades</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CFormLabel htmlFor="description">
              <strong>Descripción</strong>
            </CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe la brigada"
            />
          </CForm>
        </CModalBody>
      </CModal>

      {selectedBrigada && (
        <CModal visible={visibleViewMore} onClose={handleCloseViewMoreModal}>
          <CModalHeader>
            <CModalTitle>{selectedBrigada.nombre}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <img
              src={selectedBrigada.imagen}
              alt={selectedBrigada.nombre}
              style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
            />
            <p className="mt-3">
              <strong>Descripción:</strong> {selectedBrigada.descripcion}
            </p>
            <p>
              <strong>Estudiantes:</strong> {selectedBrigada.estudiantes}
            </p>
            <p>
              <strong>Actividades:</strong>
            </p>
            <ul>
              {selectedBrigada.actividades?.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseViewMoreModal}>
              Cerrar
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default brigada
