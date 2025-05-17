import classNames from 'classnames'
import { useState } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CModal,
  CProgress,
  CRow,
} from '@coreui/react'
// Importar CChart desde el paquete correcto
import { CChart } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilCloudDownload,
  cilPencil,
  cilEducation,
  cilNotes,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import MainChart from './MainChart'

const Dashboard = () => {
  const progressExample = [
    { title: 'Asistencia', value: '450 Estudiantes', percent: 92, color: 'success' },
    { title: 'Promedio Académico', value: '8.5/10', percent: 85, color: 'info' },
    { title: 'Participación de Padres', value: '320 Padres', percent: 75, color: 'warning' },
    { title: 'Nuevos Estudiantes', value: '45 Estudiantes', percent: 10, color: 'danger' },
    { title: 'Tasa de Graduación', value: 'Promedio', percent: 95.5, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Lunes', value1: 92, value2: 88 },
    { title: 'Martes', value1: 94, value2: 90 },
    { title: 'Miércoles', value1: 91, value2: 87 },
    { title: 'Jueves', value1: 93, value2: 89 },
    { title: 'Viernes', value1: 90, value2: 85 },
  ]

  const progressGroupExample2 = [
    { title: 'Niños', icon: cilUser, value: 52 },
    { title: 'Niñas', icon: cilUserFemale, value: 48 },
  ]

  // Nuevas gráficas educativas en lugar de redes sociales
  const academicPerformanceByGrade = [
    { title: 'Preescolar', icon: cilPencil, percent: 88, value: '8.8/10' },
    { title: '1° - 2° Primaria', icon: cilBook, percent: 85, value: '8.5/10' },
    { title: '3° - 4° Primaria', icon: cilNotes, percent: 82, value: '8.2/10' },
    { title: '5° - 6° Primaria', icon: cilEducation, percent: 87, value: '8.7/10' },
  ]

  // Datos para gráfica de pastel - Distribución de estudiantes
  const studentDistributionData = {
    labels: ['Preescolar', '1° - 2° Primaria', '3° - 4° Primaria', '5° - 6° Primaria'],
    datasets: [
      {
        data: [135, 120, 105, 90],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  }

  // Datos para gráfica de barras - Actividades extracurriculares
  const extracurricularActivitiesData = {
    labels: ['Deportes', 'Arte', 'Música', 'Ciencias', 'Idiomas'],
    datasets: [
      {
        label: 'Participación de estudiantes',
        backgroundColor: '#4BC0C0',
        data: [120, 85, 70, 65, 95],
      },
    ],
  }

  // Datos para gráfica de líneas - Asistencia mensual
  const monthlyAttendanceData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Asistencia (%)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        data: [93, 91, 94, 92, 95, 94],
      },
    ],
  }

  const [visible, setVisible] = useState(false)

  const abrirModal = () => {
    setVisible(true)
  }
  const cerrarModal = () => {
    setVisible(false)
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Asistencia Estudiantil
              </h4>
              <div className="small text-body-secondary">Enero - Julio 2023</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Día', 'Mes', 'Año'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Mes'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>

          {/* 
           Boton para la asistencia semanal
          <CButton color="warning" className="float-end me-2" onClick={abrirModal}>
            <CIcon icon={cilCloudDownload} />
            Asistencia Estudiantil
          </CButton> */}
        </CCardFooter>
      </CCard>

      {/* Nuevas gráficas educativas */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Distribución de Estudiantes</CCardHeader>
            <CCardBody>
              <CChart
                type="doughnut"
                data={studentDistributionData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || ''
                          const value = context.raw || 0
                          const total = context.dataset.data.reduce((acc, val) => acc + val, 0)
                          const percentage = Math.round((value / total) * 100)
                          return `${label}: ${value} estudiantes (${percentage}%)`
                        },
                      },
                    },
                  },
                  aspectRatio: 2,
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Actividades Extracurriculares</CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                data={extracurricularActivitiesData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Número de estudiantes',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  aspectRatio: 2,
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Asistencia Mensual</CCardHeader>
            <CCardBody>
              <CChart
                type="line"
                data={monthlyAttendanceData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 80,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Porcentaje (%)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  aspectRatio: 2,
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Rendimiento Académico por Nivel</CCardHeader>
            <CCardBody>
              {academicPerformanceByGrade.map((item, index) => (
                <div className="progress-group mb-4" key={index}>
                  <div className="progress-group-header">
                    <CIcon className="me-2" icon={item.icon} size="lg" />
                    <span>{item.title}</span>
                    <span className="ms-auto fw-semibold">
                      {item.value}{' '}
                      <span className="text-body-secondary small">({item.percent}%)</span>
                    </span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress thin color="success" value={item.percent} />
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Estadísticas Escolares</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">
                          Estudiantes Nuevos
                        </div>
                        <div className="fs-5 fw-semibold">45</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Estudiantes Regulares
                        </div>
                        <div className="fs-5 fw-semibold">405</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Total Estudiantes
                        </div>
                        <div className="fs-5 fw-semibold">450</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Promedio Académico
                        </div>
                        <div className="fs-5 fw-semibold">8.5/10</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={visible}></CModal>
    </>
  )
}

export default Dashboard
