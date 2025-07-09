"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CContainer,
  CSpinner,
  CAlert,
  CButton,
  CFormSelect,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilSearch, cilPeople, cilSchool, cilUser, cilReload } from "@coreui/icons"
import { helpFetch } from "../../../api/helpFetch.js"

const api = helpFetch()

const MatriculasPorGrado = () => {
  const [activeTab, setActiveTab] = useState("todos")
  const [matriculas, setMatriculas] = useState([])
  const [grados, setGrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroGrado, setFiltroGrado] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [estadisticas, setEstadisticas] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Cargando datos de matrículas...")

      // Cargar matrículas y grados en paralelo
      const [matriculasResponse, gradosResponse] = await Promise.all([
        api.get("/api/matriculas"),
        api.get("/api/matriculas/utils/grados"),
      ])

      console.log("📥 Respuesta matrículas:", matriculasResponse)
      console.log("📥 Respuesta grados:", gradosResponse)

      if (!matriculasResponse.error) {
        setMatriculas(matriculasResponse.matriculas || [])
        calcularEstadisticas(matriculasResponse.matriculas || [])
        console.log("✅ Matrículas cargadas:", matriculasResponse.matriculas?.length || 0)
      } else {
        setError(matriculasResponse.msg || "Error al cargar matrículas")
      }

      if (!gradosResponse.error) {
        setGrados(gradosResponse.grados || [])
        console.log("✅ Grados cargados:", gradosResponse.grados?.length || 0)
      }
    } catch (error) {
      console.error("❌ Error cargando datos:", error)
      setError("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const calcularEstadisticas = (matriculasData) => {
    const stats = {}
    matriculasData.forEach((matricula) => {
      const grado = matricula.grade_name || "Sin grado"
      if (!stats[grado]) {
        stats[grado] = {
          total: 0,
          masculino: 0,
          femenino: 0,
          repitientes: 0,
        }
      }
      stats[grado].total++
      if (matricula.student_sex === "Masculino") stats[grado].masculino++
      if (matricula.student_sex === "Femenino") stats[grado].femenino++
      if (matricula.repeater) stats[grado].repitientes++
    })
    setEstadisticas(stats)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatPhone = (phone) => {
    if (!phone) return "-"
    return phone
  }

  // Filtrar matrículas
  const matriculasFiltradas = matriculas.filter((matricula) => {
    const cumpleFiltroGrado = !filtroGrado || matricula.grade_name === filtroGrado
    const cumpleBusqueda =
      !busqueda ||
      matricula.student_name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      matricula.student_lastName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      matricula.student_ci?.toLowerCase().includes(busqueda.toLowerCase())

    return cumpleFiltroGrado && cumpleBusqueda
  })

  // Agrupar por grado
  const matriculasPorGrado = matriculasFiltradas.reduce((acc, matricula) => {
    const grado = matricula.grade_name || "Sin grado"
    if (!acc[grado]) {
      acc[grado] = []
    }
    acc[grado].push(matricula)
    return acc
  }, {})

  if (loading) {
    return (
      <CContainer>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <CSpinner color="primary" size="lg" />
          <span className="ms-2">Cargando matrículas...</span>
        </div>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">
          <strong>Error:</strong> {error}
          <CButton color="danger" variant="outline" size="sm" className="ms-2" onClick={loadData}>
            <CIcon icon={cilReload} className="me-1" />
            Reintentar
          </CButton>
        </CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer fluid>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <CIcon icon={cilSchool} className="me-2" />
              Matrículas por Grado - Año Escolar {new Date().getFullYear()}
            </h2>
            <CBadge color="info" size="lg">
              Total: {matriculas.length} estudiantes
            </CBadge>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* Filtros */}
          <CRow className="mb-4">
            <CCol md={4}>
              <CFormSelect
                value={filtroGrado}
                onChange={(e) => setFiltroGrado(e.target.value)}
                aria-label="Filtrar por grado"
              >
                <option value="">Todos los grados</option>
                {grados.map((grado) => (
                  <option key={grado.id} value={grado.name}>
                    {grado.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por nombre, apellido o cédula..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" onClick={loadData} className="w-100">
                <CIcon icon={cilReload} className="me-1" />
                Actualizar
              </CButton>
            </CCol>
          </CRow>

          {/* Pestañas */}
          <CNav variant="tabs" role="tablist" className="mb-4">
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === "todos"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("todos")
                }}
              >
                <CIcon icon={cilPeople} className="me-1" />
                Todos los Estudiantes
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === "estadisticas"}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab("estadisticas")
                }}
              >
                📊 Estadísticas
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            {/* Pestaña: Todos los estudiantes */}
            <CTabPane visible={activeTab === "todos"}>
              {Object.keys(matriculasPorGrado).length === 0 ? (
                <CAlert color="info">
                  <CIcon icon={cilUser} className="me-2" />
                  No se encontraron matrículas con los filtros aplicados.
                </CAlert>
              ) : (
                Object.entries(matriculasPorGrado)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([grado, matriculasGrado]) => (
                    <CCard key={grado} className="mb-4">
                      <CCardHeader className="bg-info text-white">
                        <h4 className="mb-0">
                          {grado} ({matriculasGrado.length} estudiantes)
                        </h4>
                      </CCardHeader>
                      <CCardBody className="p-0">
                        <CTable striped hover responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Cédula</CTableHeaderCell>
                              <CTableHeaderCell>Apellidos y Nombres</CTableHeaderCell>
                              <CTableHeaderCell>Sexo</CTableHeaderCell>
                              <CTableHeaderCell>Sección</CTableHeaderCell>
                              <CTableHeaderCell>Docente</CTableHeaderCell>
                              <CTableHeaderCell>Representante</CTableHeaderCell>
                              <CTableHeaderCell>Teléfono</CTableHeaderCell>
                              <CTableHeaderCell>Estado</CTableHeaderCell>
                              <CTableHeaderCell>Fecha Inscripción</CTableHeaderCell>
                              <CTableHeaderCell>Acciones</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {matriculasGrado
                              .sort((a, b) => {
                                const apellidoA = a.student_lastName || ""
                                const apellidoB = b.student_lastName || ""
                                return apellidoA.localeCompare(apellidoB)
                              })
                              .map((matricula) => (
                                <CTableRow key={matricula.id}>
                                  <CTableDataCell>
                                    <strong>{matricula.student_ci || "-"}</strong>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <div>
                                      <strong>
                                        {matricula.student_lastName}, {matricula.student_name}
                                      </strong>
                                      <br />
                                      <small className="text-muted">{formatDate(matricula.student_birthday)}</small>
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color={matricula.student_sex === "Masculino" ? "primary" : "danger"}>
                                      {matricula.student_sex === "Masculino" ? "M" : "F"}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>{matricula.section_name || "-"}</CTableDataCell>
                                  <CTableDataCell>
                                    {matricula.teacher_name && matricula.teacher_lastName
                                      ? `${matricula.teacher_name} ${matricula.teacher_lastName}`
                                      : "-"}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {matricula.representative_name && matricula.representative_lastName
                                      ? `${matricula.representative_name} ${matricula.representative_lastName}`
                                      : "-"}
                                  </CTableDataCell>
                                  <CTableDataCell>{formatPhone(matricula.representative_phone)}</CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color={matricula.repeater ? "warning" : "success"}>
                                      {matricula.repeater ? "Repitiente" : "Regular"}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>{formatDate(matricula.registrationDate)}</CTableDataCell>
                                  <CTableDataCell>
                                    <CButton
                                      color="info"
                                      size="sm"
                                      onClick={() => {
                                        console.log("Ver detalles de matrícula:", matricula.id)
                                        // Aquí puedes abrir un modal o navegar a la vista de detalles
                                      }}
                                    >
                                      Ver
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  ))
              )}
            </CTabPane>

            {/* Pestaña: Estadísticas */}
            <CTabPane visible={activeTab === "estadisticas"}>
              <CRow>
                {Object.entries(estadisticas).map(([grado, stats]) => (
                  <CCol md={6} lg={4} key={grado} className="mb-4">
                    <CCard>
                      <CCardHeader className="bg-primary text-white">
                        <h5 className="mb-0">{grado}</h5>
                      </CCardHeader>
                      <CCardBody>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total estudiantes:</span>
                          <CBadge color="info" size="lg">
                            {stats.total}
                          </CBadge>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Masculino:</span>
                          <CBadge color="primary">{stats.masculino}</CBadge>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Femenino:</span>
                          <CBadge color="danger">{stats.femenino}</CBadge>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Repitientes:</span>
                          <CBadge color="warning">{stats.repitientes}</CBadge>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default MatriculasPorGrado
