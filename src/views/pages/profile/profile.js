import React, { use, useState } from 'react'
import {
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CContainer,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToast,
  CToastHeader,
  CToastBody,
  COffcanvas,
  COffcanvasBody,
  COffcanvasTitle,
  COffcanvasHeader,
  CCloseButton,
  CCardFooter,
  CCardBody,
  CCard,
  CCardHeader,
  CCardImage,
  CCardTitle,
  CCardText,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
} from '@coreui/react'

const profile = () => {
  const [visible, setVisible] = useState(false)
  const [visibleCanvas, setVisibleCanvas] = useState(false)

  return (
    <CTabs activeItemKey={2}>
      <CTabList variant="underline">
        <CTab aria-controls="home-tab-pane" itemKey={1}>
          Home
        </CTab>
        <CTab aria-controls="profile-tab-pane" itemKey={2}>
          Profile
        </CTab>
        <CTab aria-controls="contact-tab-pane" itemKey={3}>
          Contact
        </CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel className="p-3" aria-labelledby="home-tab-pane" itemKey={1}>
          <CContainer>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} md={{ cols: 4 }}>
              <CCol>Name</CCol>
              <CCol>Email</CCol>
              <CCol>Address</CCol>
              <CCol>Status</CCol>
            </CRow>
          </CContainer>

          <CContainer>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} md={{ cols: 4 }}>
              <CCol>Carlos</CCol>
              <CCol>guerracarlos1309@gmail.com</CCol>
              <CCol>venezuela</CCol>
              <CCol>active</CCol>
            </CRow>
          </CContainer>
        </CTabPanel>
        <CTabPanel className="p-3" aria-labelledby="profile-tab-pane" itemKey={2}>
          <CToast style={{ marginTop: '2%' }} animation={false} autohide={false} visible={true}>
            <CToastHeader closeButton>
              <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              >
                <rect width="100%" height="100%" fill="#FADA7A"></rect>
              </svg>
              <div className="fw-bold me-auto">Carlos Guerra</div>
              <small>7 min ago</small>
            </CToastHeader>

            <CToastBody>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <CButton
                  style={{ marginLeft: '65%' }}
                  color="primary"
                  onClick={() => setVisibleCanvas(true)}
                >
                  Edit Profile
                </CButton>{' '}
              </div>
            </CToastBody>
          </CToast>

          <COffcanvas
            placement="end"
            visible={visibleCanvas}
            onHide={() => setVisibleCanvas(false)}
          >
            <COffcanvasHeader>
              <COffcanvasTitle>Profile</COffcanvasTitle>
              <CCloseButton className="text-reset" onClick={() => setVisibleCanvas(false)} />
            </COffcanvasHeader>
            <COffcanvasBody>
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
            </COffcanvasBody>

            <div
              className="d-grid gap-2 d-md-flex justify-content-md-end"
              style={{ marginBottom: '29%' }}
            >
              <CButton color="success" className="me-md-2" onClick={() => setVisible(!visible)}>
                Guardar Cambios
              </CButton>
              <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
              >
                <CModalHeader>
                  <CModalTitle id="LiveDemoExampleLabel">Confirmar Cambios</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <p>¿Estas seguro de guardar los cambios hechos?</p>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Cerrar
                  </CButton>
                  <CButton color="primary">Guardar Cambios</CButton>
                </CModalFooter>
              </CModal>
            </div>
          </COffcanvas>
        </CTabPanel>
        <CTabPanel className="p-3" aria-labelledby="contact-tab-pane" itemKey={3}></CTabPanel>
      </CTabContent>
    </CTabs>
  )
}

export default profile
