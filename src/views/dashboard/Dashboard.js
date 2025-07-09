"use client"
import { useState, useEffect } from "react"
import { helpFetch } from "../../api/helpFetch"

import {
  CButton,
  CCard,
  CCardBody,
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
  CFormSelect,
  CFormInput,
  CFormLabel,
  CSpinner,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react"
import { CChart } from "@coreui/react-chartjs"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilCloudDownload,
  cilPeople,
  cilEducation,
  cilNotes,
  cilCalendar,
  cilSchool,
  cilGroup,
} from "@coreui/icons"

const Dashboard = () => {
  // Estados para los datos del dashboard
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartData, setChartData] = useState(null)

  // Estados para el modal de asistencia
  const [visible, setVisible] = useState(false)
  const [attendanceForm, setAttendanceForm] = useState({
    sectionId: "",
    date: new Date().toISOString().split("T")[0],
    observations: "",
    students: [],
  })

  // Instancia de helpFetch
  const api = helpFetch()

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Cargando datos del dashboard escolar...")

      const summaryResponse = await api.get("/api/dashboard/summary")

      console.log("📊 Respuesta del dashboard:", summaryResponse)

      if (summaryResponse.ok) {
        setDashboardData(summaryResponse.data)
        processChartData(summaryResponse.data)
        console.log("✅ Datos del dashboard cargados exitosamente")
      } else {
        throw new Error(summaryResponse.msg || "Error al cargar datos del dashboard")
      }
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error)
      setError(`Error al cargar los datos del dashboard: ${error.msg || error.message || "Error desconocido"}`)
      loadExampleData()
    } finally {
      setLoading(false)
    }
  }

  const loadExampleData = () => {
    console.log("📝 Cargando datos de ejemplo...")
    const exampleData = {
      generalStats: {
        total_students_active: 450,
        total_students: 465,
        total_teachers: 25,
        total_staff: 35,
        total_sections: 12,
        total_grades: 6,
        total_brigades: 3,
        repeating_students: 15,
        new_students: 450,
        male_students: 234,
        female_students: 231,
        total_representatives: 380,
      },
      gradeDistribution: [
        { grade_name: "Primer Grado", student_count: 85, male_count: 42, female_count: 43 },
        { grade_name: "Segundo Grado", student_count: 78, male_count: 38, female_count: 40 },
        { grade_name: "Tercer Grado", student_count: 82, male_count: 41, female_count: 41 },
      ],
      academicPerformance: [
        { subject: "Matemáticas", total_notes: 156, average_grade: 16.75, passing_grades: 142, failing_grades: 14 },
        { subject: "Lengua", total_notes: 156, average_grade: 17.25, passing_grades: 148, failing_grades: 8 },
      ],
      attendanceStats: [
        {
          date_a: "2025-01-10",
          grade_name: "Primer Grado",
          seccion: "A",
          total_registered: 28,
          present_students: 26,
          absent_students: 2,
          attendance_percentage: 92.86,
        },
      ],
      brigadeStats: [
        { brigade_name: "Brigada Ecológica", student_count: 45, teacher_name: "Ana", teacher_lastName: "García" },
        { brigade_name: "Brigada Deportiva", student_count: 38, teacher_name: "María", teacher_lastName: "Fernández" },
      ],
      staffByRole: [
        { role_name: "Docente", role_description: "Personal encargado de la enseñanza", staff_count: 25 },
        { role_name: "Administrador", role_description: "Personal administrativo", staff_count: 5 },
      ],
      studentsByStatus: [
        { status_description: "Activo", student_count: 450 },
        { status_description: "Inactivo", student_count: 10 },
        { status_description: "Graduado", student_count: 5 },
      ],
      enrollmentStats: [
        {
          grade_name: "Primer Grado",
          section_name: "A",
          total_enrolled: 28,
          repeaters: 2,
          new_students: 26,
          teacher_name: "Ana",
          teacher_lastName: "García",
        },
      ],
    }

    setDashboardData(exampleData)
    processChartData(exampleData)
  }

  const processChartData = (data) => {
    console.log("📈 Procesando datos para gráficas...")

    const processedCharts = {
      studentDistribution: {
        labels: data.gradeDistribution?.map((item) => item.grade_name) || [],
        datasets: [
          {
            label: "Estudiantes",
            data: data.gradeDistribution?.map((item) => Number.parseInt(item.student_count) || 0) || [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
          },
        ],
      },
      academicPerformance: {
        labels: data.academicPerformance?.map((item) => item.subject) || [],
        datasets: [
          {
            label: "Promedio de Notas",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            data: data.academicPerformance?.map((item) => Number.parseFloat(item.average_grade) || 0) || [],
          },
        ],
      },
      staffDistribution: {
        labels: data.staffByRole?.map((item) => item.role_name) || [],
        datasets: [
          {
            label: "Personal",
            backgroundColor: "#4BC0C0",
            data: data.staffByRole?.map((item) => Number.parseInt(item.staff_count) || 0) || [],
          },
        ],
      },
      studentStatus: {
        labels: data.studentsByStatus?.map((item) => item.status_description) || [],
        datasets: [
          {
            data: data.studentsByStatus?.map((item) => Number.parseInt(item.student_count) || 0) || [],
            backgroundColor: ["#28a745", "#ffc107", "#17a2b8", "#dc3545"],
            hoverBackgroundColor: ["#28a745", "#ffc107", "#17a2b8", "#dc3545"],
          },
        ],
      },
    }

    setChartData(processedCharts)
  }

  const abrirModal = () => {
    setVisible(true)
  }

  const cerrarModal = () => {
    setVisible(false)
    setAttendanceForm({
      sectionId: "",
      date: new Date().toISOString().split("T")[0],
      observations: "",
      students: [],
    })
  }

  const handleAttendanceSubmit = async () => {
    try {
      console.log("💾 Guardando asistencia...", attendanceForm)

      const response = await api.post("/api/dashboard/attendance", {
        body: attendanceForm,
      })

      if (response.ok) {
        console.log("✅ Asistencia guardada exitosamente")
        cerrarModal()
        loadDashboardData()
      } else {
        throw new Error(response.msg || "Error al guardar la asistencia")
      }
    } catch (error) {
      console.error("❌ Error saving attendance:", error)
      setError(`Error al guardar la asistencia: ${error.msg || error.message}`)
    }
  }

  // Calcular métricas de progreso
  const getProgressMetrics = () => {
    if (!dashboardData?.generalStats) {
      return [
        { title: "Estudiantes Activos", value: "450", percent: 96.8, color: "success" },
        { title: "Promedio General", value: "17.0/20", percent: 85, color: "info" },
        { title: "Asistencia Promedio", value: "92.5%", percent: 92.5, color: "warning" },
        { title: "Personal Docente", value: "25 Maestros", percent: 100, color: "primary" },
      ]
    }

    const stats = dashboardData.generalStats
    const activeRate = ((stats.total_students_active / stats.total_students) * 100).toFixed(1)

    return [
      {
        title: "Estudiantes Activos",
        value: `${stats.total_students_active}/${stats.total_students}`,
        percent: Number.parseFloat(activeRate),
        color: "success",
      },
      {
        title: "Personal Docente",
        value: `${stats.total_teachers} Maestros`,
        percent: 100,
        color: "info",
      },
      {
        title: "Secciones",
        value: `${stats.total_sections} Secciones`,
        percent: 100,
        color: "warning",
      },
      {
        title: "Brigadas",
        value: `${stats.total_brigades} Brigadas`,
        percent: 100,
        color: "primary",
      },
    ]
  }

  const progressMetrics = getProgressMetrics()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Cargando datos del sistema escolar...</span>
      </div>
    )
  }

  return (
    <>
      {error && (
        <CAlert color="warning" dismissible onClose={() => setError(null)}>
          <strong>⚠️ Advertencia:</strong> {error}
        </CAlert>
      )}

      {/* Tarjetas de estadísticas principales */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="mb-4" color="primary" textColor="white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {dashboardData?.generalStats?.total_students_active || "450"}
                  <span className="fs-6 ms-2 fw-normal">
                    ({dashboardData?.generalStats?.total_students || "465"} total)
                  </span>
                </div>
                <div>Estudiantes Activos</div>
              </div>
              <CIcon icon={cilUser} height={52} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4" color="info" textColor="white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{dashboardData?.generalStats?.total_teachers || "25"}</div>
                <div>Personal Docente</div>
              </div>
              <CIcon icon={cilEducation} height={52} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4" color="warning" textColor="white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{dashboardData?.generalStats?.total_sections || "12"}</div>
                <div>Secciones</div>
              </div>
              <CIcon icon={cilSchool} height={52} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={3}>
          <CCard className="mb-4" color="success" textColor="white">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{dashboardData?.generalStats?.total_brigades || "3"}</div>
                <div>Brigadas</div>
              </div>
              <CIcon icon={cilGroup} height={52} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Gráficas principales */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <CIcon icon={cilPeople} className="me-2" />
              Distribución por Grado
            </CCardHeader>
            <CCardBody>
              {chartData?.studentDistribution ? (
                <CChart
                  type="doughnut"
                  data={chartData.studentDistribution}
                  options={{
                    plugins: {
                      legend: { position: "bottom" },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || ""
                            const value = context.raw || 0
                            return `${label}: ${value} estudiantes`
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
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <CIcon icon={cilNotes} className="me-2" />
              Rendimiento Académico
            </CCardHeader>
            <CCardBody>
              {chartData?.academicPerformance ? (
                <CChart
                  type="bar"
                  data={chartData.academicPerformance}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 20,
                        title: { display: true, text: "Promedio de Notas" },
                      },
                    },
                    plugins: { legend: { display: false } },
                    aspectRatio: 2,
                  }}
                />
              ) : (
                <div className="text-center">
                  <CSpinner />
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Tabla de asistencia reciente */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <CIcon icon={cilCalendar} className="me-2" />
                Asistencia Reciente
              </div>
              <CButton color="primary" size="sm" onClick={abrirModal}>
                <CIcon icon={cilCloudDownload} className="me-1" />
                Registrar Asistencia
              </CButton>
            </CCardHeader>
            <CCardBody>
              {dashboardData?.attendanceStats?.length > 0 ? (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Grado</CTableHeaderCell>
                      <CTableHeaderCell>Sección</CTableHeaderCell>
                      <CTableHeaderCell>Presentes</CTableHeaderCell>
                      <CTableHeaderCell>Ausentes</CTableHeaderCell>
                      <CTableHeaderCell>% Asistencia</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {dashboardData.attendanceStats.map((attendance, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{new Date(attendance.date_a).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>{attendance.grade_name}</CTableDataCell>
                        <CTableDataCell>{attendance.seccion}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="success">{attendance.present_students}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="danger">{attendance.absent_students}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={attendance.attendance_percentage >= 90 ? "success" : "warning"}>
                            {attendance.attendance_percentage}%
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center text-muted">No hay datos de asistencia recientes</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Métricas de progreso */}
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Métricas del Sistema</CCardHeader>
            <CCardBody>
              <CRow className="text-center">
                {progressMetrics.map((item, index) => (
                  <CCol key={index} sm={6} lg={3} className="mb-3">
                    <div className="text-body-secondary">{item.title}</div>
                    <div className="fw-semibold text-truncate">{item.value}</div>
                    <CProgress thin className="mt-2" color={item.color} value={item.percent} />
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal de registro de asistencia */}
      <CModal visible={visible} size="lg" onClose={cerrarModal}>
        <CModalHeader>
          <CModalTitle>Registrar Asistencia Diaria</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Sección</CFormLabel>
                <CFormSelect
                  value={attendanceForm.sectionId}
                  onChange={(e) =>
                    setAttendanceForm((prev) => ({
                      ...prev,
                      sectionId: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar sección...</option>
                  <option value="1">1° Grado - Sección A</option>
                  <option value="2">1° Grado - Sección B</option>
                  <option value="3">2° Grado - Sección A</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Fecha</CFormLabel>
                <CFormInput
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) =>
                    setAttendanceForm((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Observaciones</CFormLabel>
                <CFormInput
                  as="textarea"
                  rows={3}
                  value={attendanceForm.observations}
                  onChange={(e) =>
                    setAttendanceForm((prev) => ({
                      ...prev,
                      observations: e.target.value,
                    }))
                  }
                  placeholder="Observaciones sobre la asistencia del día..."
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={cerrarModal}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleAttendanceSubmit}>
            Guardar Asistencia
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Dashboard
