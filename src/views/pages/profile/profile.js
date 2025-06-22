import React, { use, useEffect, useState } from 'react'
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
import { helpFetch } from '../../../api/helpFetch.js'

const api = helpFetch()

const profile = () => {
  const [visible, setVisible] = useState(false)
  const [visibleCanvas, setVisibleCanvas] = useState(false)

  const [data, setData] = useState([])

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {}, [data])
  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/profile')

      setData(response.user)

      setForm({
        username: response.user.username,
        email: response.user.email,
        security_word: response.user.security_word,
        respuesta_de_seguridad: response.user.respuesta_de_seguridad,
        currentPassword: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleSaveChanges = async () => {
    try {
      if (form.currentPassword && form.password && form.confirmPassword) {
        if (form.password !== form.confirmPassword) {
          alert('Las contraseñas no coinciden')
          return
        }

        const passwordResponse = await api.put('/api/users/change-password', {
          body: {
            currentPassword: form.currentPassword,
            newPassword: form.password,
          },
        })

        if (!passwordResponse.ok) {
          alert(passwordResponse.msg || 'Error al cambiar la contraseña')
          return
        }
      }

      const { currentPassword, password, confirmPassword, ...profileData } = form

      const profileResponse = await api.put('/api/users/profile', {
        body: profileData,
      })

      if (!profileResponse.error) {
        setVisible(false)
        setVisibleCanvas(false)
        fetchUserData()
        alert('Cambios guardados exitosamente')
      } else {
        alert('Error al guardar perfil')
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      alert('Error del servidor')
    }
  }

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
              <CCol>Username</CCol>
              <CCol>Email</CCol>
              <CCol>Permisos</CCol>
            </CRow>
          </CContainer>

          <CContainer>
            <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} md={{ cols: 4 }}>
              <CCol>{data.username}</CCol>
              <CCol>{data.email}</CCol>
              <CCol>{data.permiso_id}</CCol>
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
              <div className="fw-bold me-auto">{data.username}</div>
              <small>Connected</small>
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
                  type="email"
                  id="email"
                  label="Correo electronico"
                  placeholder="Ingrese el correo electronico"
                  className="mb-3"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <CFormInput
                  type="text"
                  id="security_word"
                  label="Palabra de seguridad"
                  placeholder="Ingrese la palabra de seguridad"
                  className="mb-3"
                  value={form.security_word}
                  onChange={(e) => setForm({ ...form, security_word: e.target.value })}
                />
                <CFormInput
                  type="text"
                  id="respues_de_seguridad"
                  label="Respuesta de seguridad"
                  placeholder="Ingrese la respuesta de seguridad"
                  className="mb-3"
                  value={form.respuesta_de_seguridad}
                  onChange={(e) => setForm({ ...form, respuesta_de_seguridad: e.target.value })}
                />

                <CFormInput
                  type="password"
                  id="currentPassword"
                  label="Contraseña actual"
                  placeholder="Ingrese la contraseña actual"
                  className="mb-3"
                  value={form.currentPassword || ''}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                />
                <CFormInput
                  type="password"
                  id="password"
                  label="Nueva contraseña"
                  placeholder="Ingrese la nueva contraseña"
                  className="mb-3"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <CFormInput
                  type="password"
                  id="confirmPassword"
                  label="Confirmar contraseña"
                  placeholder="Confirme la contraseña"
                  className="mb-3"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
                  <CButton color="primary" onClick={handleSaveChanges}>
                    Guardar Cambios
                  </CButton>
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
