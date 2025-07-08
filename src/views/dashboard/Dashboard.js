"use client"

import classNames from "classnames"
import { useState, useEffect } from "react"

import {
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
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CFormLabel,
  CSpinner,
  CAlert,
} from "@coreui/react"
import { CChart } from "@coreui/react-chartjs"
import CIcon from "@coreui/icons-react"
import { cilBook, cilUser, cilUserFemale, cilCloudDownload, cilPencil, cilEducation, cilNotes } from "@coreui/icons"

import MainChart from "./MainChart"

const Dashboard = () => {
  // Estados para los datos del dashboard
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartData, setChartData] = useState(null)

  // Estados para el modal de asistencia
  const [visible, setVisible] = useState(false)
  const [asistencia, setAsistencia] = useState({})
  const [savingAttendance, setSavingAttendance] = useState(false)

  // Función para hacer peticiones HTTP
  const apiRequest = async (url, options = {}) => {
    try {
      const token = localStorage.getItem("accessToken")
      const defaultOptions = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }

      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Request Error:", error)
      throw error
    }
  }

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Llamada a la API del dashboard
      const summaryResponse = await apiRequest("/api/dashboard/summary")

      if (summaryResponse.ok) {
        setDashboardData(summaryResponse.data)

        // Procesar datos para gráficas
        processChartData(summaryResponse.data)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Error al cargar los datos del dashboard. Usando datos de ejemplo.")

      // Usar datos de ejemplo en caso de error
      loadExampleData()
    } finally {
      setLoading(false)
    }
  }

  const loadExampleData = () => {
    // Datos de ejemplo para cuando no hay conexión con el backend
    const exampleData = {
      generalStats: {
        total_students: 450,
        total_teachers: 25,
        total_brigades: 8,
        new_students: 45,
        male_students: 234,
        female_students: 216,
      },
      gradeDistribution: [
        { grade_name: "Educación Inicial", student_count: 135 },
        { grade_name: "1° - 2° Primaria", student_count: 120 },
        { grade_name: "3° - 4° Primaria", student_count: 105 },
        { grade_name: "5° - 6° Primaria", student_count: 90 },
      ],
      monthlyAttendance: [
        { month: "Enero", percentage: 93 },
        { month: "Febrero", percentage: 91 },
        { month: "Marzo", percentage: 94 },
        { month: "Abril", percentage: 92 },
        { month: "Mayo", percentage: 95 },
        { month: "Junio", percentage: 94 },
      ],
      extracurricular: [
        { name: "Deportes", participants: 120 },
        { name: "Arte", participants: 85 },
        { name: "Música", participants: 70 },
        { name: "Ciencias", participants: 65 },
        { name: "Idiomas", participants: 95 },
      ],
      academicPerformance: [
        { grade_name: "Educación Inicial", avg_performance: 88, total_students: 135 },
        { grade_name: "1° - 2° Primaria", avg_performance: 85, total_students: 120 },
        { grade_name: "3° - 4° Primaria", avg_performance: 82, total_students: 105 },
        { grade_name: "5° - 6° Primaria", avg_performance: 87, total_students: 90 },
      ],
    }

    setDashboardData(exampleData)
    processChartData(exampleData)
  }

  const processChartData = (data) => {
    // Procesar datos para las gráficas
    const processedCharts = {
      studentDistribution: {
        labels: data.gradeDistribution?.map((item) => item.grade_name) || [],
        datasets: [
          {
            data: data.gradeDistribution?.map((item) => Number.parseInt(item.student_count) || 0) || [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
          },
        ],
      },
      monthlyAttendance: {
        labels: data.monthlyAttendance?.map((item) => item.month.substring(0, 3)) || [],
        datasets: [
          {
            label: "Asistencia (%)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
            pointBorderColor: "#fff",
            data: data.monthlyAttendance?.map((item) => item.percentage) || [],
          },
        ],
      },
      extracurricular: {
        labels: data.extracurricular?.map((item) => item.name) || [],
        datasets: [
          {
            label: "Participación de estudiantes",
            backgroundColor: "#4BC0C0",
            data: data.extracurricular?.map((item) => item.participants) || [],
          },
        ],
      },
      academicPerformance:
        data.academicPerformance?.map((item) => ({
          title: item.grade_name,
          percent: Number.parseFloat(item.avg_performance) || 0,
          value: `${item.avg_performance}/10`,
          students: Number.parseInt(item.total_students) || 0,
          icon: getGradeIcon(item.grade_name),
        })) || [],
    }

    setChartData(processedCharts)
  }

  const getGradeIcon = (gradeName) => {
    if (gradeName.includes("Inicial")) return cilPencil
    if (gradeName.includes("1°") || gradeName.includes("2°")) return cilBook
    if (gradeName.includes("3°") || gradeName.includes("4°")) return cilNotes
    return cilEducation
  }

  const abrirModal = () => {
    setVisible(true)
  }

  const cerrarModal = () => {
    setVisible(false)
    setAsistencia({})
  }

  const handleChange = (grado, dia, value) => {
    setAsistencia((prev) => ({
      ...prev,
      [grado]: {
        ...prev[grado],
        [dia]: value,
      },
    }))
  }

  const handleGuardar = async () => {
    try {
      setSavingAttendance(true)

      const response = await apiRequest("/api/dashboard/attendance/weekly", {
        method: "POST",
        body: JSON.stringify({
          attendanceData: asistencia,
        }),
      })

      if (response.ok) {
        console.log("Asistencia guardada exitosamente")
        cerrarModal()
        // Recargar datos del dashboard
        loadDashboardData()
      }
    } catch (error) {
      console.error("Error saving attendance:", error)
      setError("Error al guardar la asistencia")
    } finally {
      setSavingAttendance(false)
    }
  }

  // Calcular métricas de progreso
  const getProgressMetrics = () => {
    if (!dashboardData?.generalStats) {
      return [
        { title: "Asistencia", value: "450 Estudiantes", percent: 92, color: "success" },
        { title: "Promedio Académico", value: "8.5/10", percent: 85, color: "info" },
        { title: "Participación de Padres", value: "320 Padres", percent: 75, color: "warning" },
        { title: "Nuevos Estudiantes", value: "45 Estudiantes", percent: 10, color: "danger" },
        { title: "Tasa de Graduación", value: "Promedio", percent: 95.5, color: "primary" },
      ]
    }

    const stats = dashboardData.generalStats
    const totalStudents = Number.parseInt(stats.total_students) || 0
    const newStudents = Number.parseInt(stats.new_students) || 0

    return [
      {
        title: "Asistencia",
        value: `${totalStudents} Estudiantes`,
        percent: 92,
        color: "success",
      },
      {
        title: "Promedio Académico",
        value: "8.5/10",
        percent: 85,
        color: "info",
      },
      {
        title: "Participación de Padres",
        value: `${Math.floor(totalStudents * 0.75)} Padres`,
        percent: 75,
        color: "warning",
      },
      {
        title: "Nuevos Estudiantes",
        value: `${newStudents} Estudiantes`,
        percent: totalStudents > 0 ? Math.round((newStudents / totalStudents) * 100) : 0,
        color: "danger",
      },
      {
        title: "Tasa de Graduación",
        value: "Promedio",
        percent: 95.5,
        color: "primary",
      },
    ]
  }

  // Calcular distribución por género
  const getGenderDistribution = () => {
    if (!dashboardData?.generalStats) {
      return [
        { title: "Niños", icon: cilUser, value: 52 },
        { title: "Niñas", icon: cilUserFemale, value: 48 },
      ]
    }

    const stats = dashboardData.generalStats
    const maleStudents = Number.parseInt(stats.male_students) || 0
    const femaleStudents = Number.parseInt(stats.female_students) || 0
    const total = maleStudents + femaleStudents

    if (total === 0) {
      return [
        { title: "Niños", icon: cilUser, value: 50 },
        { title: "Niñas", icon: cilUserFemale, value: 50 },
      ]
    }

    return [
      {
        title: "Niños",
        icon: cilUser,
        value: Math.round((maleStudents / total) * 100),
      },
      {
        title: "Niñas",
        icon: cilUserFemale,
        value: Math.round((femaleStudents / total) * 100),
      },
    ]
  }

  const progressExample = getProgressMetrics()
  const progressGroupExample2 = getGenderDistribution()

  const progressGroupExample1 = [
    { title: "Lunes", value1: 92, value2: 88 },
    { title: "Martes", value1: 94, value2: 90 },
    { title: "Miércoles", value1: 91, value2: 87 },
    { title: "Jueves", value1: 93, value2: 89 },
    { title: "Viernes", value1: 90, value2: 85 },
  ]

  const grades = ["Educación Inicial", "1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado"]
  const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Cargando datos del dashboard...</span>
      </div>
    )
  }

  return (
    <>
      {error && (
        <CAlert color="warning" dismissible onClose={() => setError(null)}>
          {error}
        </CAlert>
      )}

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Asistencia Estudiantil
              </h4>
              <div className="small text-body-secondary">
                {dashboardData?.generalStats
                  ? `Total: ${dashboardData.generalStats.total_students} estudiantes`
                  : "Enero - Julio 2023"}
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="warning" className="float-end me-3" onClick={abrirModal}>
                <CIcon icon={cilCloudDownload} />
                Registrar Asistencia
              </CButton>
              <CButton color="primary" className="float-end me-3" onClick={loadDashboardData}>
                <CIcon icon={cilCloudDownload} />
                Actualizar
              </CButton>

              <CButtonGroup className="float-end me-3">
                {["Día", "Mes", "Año"].map((value) => (
                  <CButton color="outline-secondary" key={value} className="mx-0" active={value === "Mes"}>
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
                  "d-none d-xl-block": index + 1 === items.length,
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
        </CCardFooter>
      </CCard>

      {/* Gráficas educativas */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Distribución de Estudiantes</CCardHeader>
            <CCardBody>
              {chartData?.studentDistribution ? (
                <CChart
                  type="doughnut"
                  data={chartData.studentDistribution}
                  options={{
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || ""
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
              ) : (
                <div className="text-center">
                  <CSpinner />
                  <p>Cargando gráfica...</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Actividades Extracurriculares</CCardHeader>
            <CCardBody>
              {chartData?.extracurricular ? (
                <CChart
                  type="bar"
                  data={chartData.extracurricular}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Número de estudiantes",
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
              ) : (
                <div className="text-center">
                  <CSpinner />
                  <p>Cargando gráfica...</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Asistencia Mensual</CCardHeader>
            <CCardBody>
              {chartData?.monthlyAttendance ? (
                <CChart
                  type="line"
                  data={chartData.monthlyAttendance}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100,
                        title: {
                          display: true,
                          text: "Porcentaje (%)",
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
              ) : (
                <div className="text-center">
                  <CSpinner />
                  <p>Cargando gráfica...</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Rendimiento Académico por Nivel</CCardHeader>
            <CCardBody>
              {chartData?.academicPerformance ? (
                chartData.academicPerformance.map((item, index) => (
                  <div className="progress-group mb-4" key={index}>
                    <div className="progress-group-header">
                      <CIcon className="me-2" icon={item.icon} size="lg" />
                      <span>{item.title}</span>
                      <span className="ms-auto fw-semibold">
                        {item.value} <span className="text-body-secondary small">({item.percent}%)</span>
                      </span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress thin color="success" value={item.percent} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <CSpinner />
                  <p>Cargando datos...</p>
                </div>
              )}
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
                        <div className="text-body-secondary text-truncate small">Estudiantes Nuevos</div>
                        <div className="fs-5 fw-semibold">{dashboardData?.generalStats?.new_students || "45"}</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Estudiantes Regulares</div>
                        <div className="fs-5 fw-semibold">
                          {dashboardData?.generalStats
                            ? Number.parseInt(dashboardData.generalStats.total_students) -
                              Number.parseInt(dashboardData.generalStats.new_students)
                            : "405"}
                        </div>
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
                        <div className="text-body-secondary text-truncate small">Total Estudiantes</div>
                        <div className="fs-5 fw-semibold">{dashboardData?.generalStats?.total_students || "450"}</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Total Docentes</div>
                        <div className="fs-5 fw-semibold">{dashboardData?.generalStats?.total_teachers || "25"}</div>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal de asistencia */}
      <CModal visible={visible} size="xl" onClose={cerrarModal}>
        <CModalHeader>
          <CModalTitle>Registro de Asistencia Semanal</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {grades.map((grado) => (
              <CCard className="mb-3" key={grado}>
                <CCardBody>
                  <h5>{grado}</h5>
                  <CRow>
                    {weekdays.map((dia) => (
                      <CCol md={2} key={dia}>
                        <CFormLabel>{dia}</CFormLabel>
                        <CFormInput
                          type="number"
                          min={0}
                          max={100}
                          value={asistencia[grado]?.[dia] || ""}
                          onChange={(e) => handleChange(grado, dia, e.target.value)}
                          placeholder="Asistencia"
                        />
                      </CCol>
                    ))}
                  </CRow>
                </CCardBody>
              </CCard>
            ))}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={cerrarModal} disabled={savingAttendance}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleGuardar} disabled={savingAttendance}>
            {savingAttendance ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Dashboard
