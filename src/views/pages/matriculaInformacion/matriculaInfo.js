"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CSpinner,
  CAlert,
  CButton,
  CRow,
  CCol,
  CBadge,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilSchool,
  cilPhone,
  cilLocationPin,
  cilCalendar,
  cilPeople,
  cilArrowLeft,
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilWarning,
  cilReload,
  cilPrint,
} from "@coreui/icons"
import { helpFetch } from "../../../api/helpFetch.js"

const api = helpFetch()

const MatriculaInfo = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Estados principales
  const [matricula, setMatricula] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para modales
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Estados para formulario de edición
  const [editForm, setEditForm] = useState({
    repeater: false,
    observation: "",
    status: "active",
  })

  // Estados para datos auxiliares
  const [grados, setGrados] = useState([])
  const [secciones, setSecciones] = useState([])

  // Toast system
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (id) {
      loadMatriculaInfo()
      loadAuxiliaryData()
    }
  }, [id])

  const loadMatriculaInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Cargando información de matrícula:", id)

      const response = await api.get(`/api/matriculas/${id}`)
      console.log("📥 Respuesta matrícula:", response)

      if (!response.error) {
        setMatricula(response.matricula)
        setEditForm({
          repeater: response.matricula.repeater || false,
          observation: response.matricula.observation || "",
          status: response.matricula.status || "active",
        })
        console.log("✅ Matrícula cargada:", response.matricula)
      } else {
        setError(response.msg || "Error al cargar la información de la matrícula")
      }
    } catch (error) {
      console.error("❌ Error cargando matrícula:", error)
      setError("Error al cargar la información de la matrícula")
    } finally {
      setLoading(false)
    }
  }

  const loadAuxiliaryData = async () => {
    try {
      const [gradosResponse, seccionesResponse] = await Promise.all([
        api.get("/api/matriculas/utils/grados"),
        api.get("/api/matriculas/utils/docente-grados"),
      ])

      if (!gradosResponse.error) {
        setGrados(gradosResponse.grados || [])
      }

      if (!seccionesResponse.error) {
        setSecciones(seccionesResponse.docente_grados || [])
      }
    } catch (error) {
      console.error("❌ Error cargando datos auxiliares:", error)
    }
  }

  const showToast = (message, color = "success") => {
    const newToast = {
      id: Date.now(),
      message,
      color,
    }
    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
    }, 3000)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    try {
      setEditLoading(true)
      console.log("📝 Actualizando matrícula:", editForm)

      const response = await api.put(
        `/api/matriculas`,
        {
          body: editForm,
        },
        id,
      )

      console.log("📥 Respuesta actualización:", response)

      if (!response.error) {
        showToast("Matrícula actualizada exitosamente")
        setShowEditModal(false)
        loadMatriculaInfo() // Recargar datos
      } else {
        showToast(response.msg || "Error al actualizar la matrícula", "danger")
      }
    } catch (error) {
      console.error("❌ Error actualizando matrícula:", error)
      showToast("Error al actualizar la matrícula", "danger")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleteLoading(true)
      console.log("🗑️ Eliminando matrícula:", id)

      const response = await api.delet("/api/matriculas", id)
      console.log("📥 Respuesta eliminación:", response)

      if (!response.error) {
        showToast("Matrícula eliminada exitosamente")
        setTimeout(() => {
          navigate("/matriculas")
        }, 1500)
      } else {
        showToast(response.msg || "Error al eliminar la matrícula", "danger")
      }
    } catch (error) {
      console.error("❌ Error eliminando matrícula:", error)
      showToast("Error al eliminar la matrícula", "danger")
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handlePrint = async () => {
    try {
      console.log("🖨️ Generando PDF de matrícula:", id)

      const blob = await api.downloadFile(`/api/pdf/matricula/${id}`)

      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `matricula_${matricula?.student_ci || id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      showToast("PDF generado exitosamente")
    } catch (error) {
      console.error("❌ Error generando PDF:", error)
      showToast("Error al generar el PDF", "danger")
    }
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

  const calculateAge = (birthDate) => {
    if (!birthDate) return "-"
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return `${age} años`
  }

  if (loading) {
    return (
      <CContainer>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <CSpinner color="primary" />
          <span className="ms-2">Cargando información de la matrícula...</span>
        </div>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">
          <strong>Error:</strong> {error}
          <CButton color="danger" variant="outline" size="sm" className="ms-2" onClick={loadMatriculaInfo}>
            <CIcon icon={cilReload} className="me-1" />
            Reintentar
          </CButton>
        </CAlert>
      </CContainer>
    )
  }

  if (!matricula) {
    return (
      <CContainer>
        <CAlert color="warning">
          <strong>Advertencia:</strong> No se encontró la matrícula solicitada.
          <CButton color="primary" variant="outline" size="sm" className="ms-2" onClick={() => navigate("/matriculas")}>
            <CIcon icon={cilArrowLeft} className="me-1" />
            Volver a Matrículas
          </CButton>
        </CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer fluid>
      {/* Header */}
      <CRow className="mb-4">
        <CCol>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <CButton
                color="secondary"
                variant="outline"
                size="sm"
                className="me-3"
                onClick={() => navigate("/matriculas")}
              >
                <CIcon icon={cilArrowLeft} className="me-1" />
                Volver
              </CButton>
              <h2 className="mb-0">
                <CIcon icon={cilSchool} className="me-2" />
                Información de Matrícula
              </h2>
            </div>
            <div>
              <CButton color="info" size="sm" className="me-2" onClick={handlePrint}>
                <CIcon icon={cilPrint} className="me-1" />
                Imprimir
              </CButton>
              <CButton color="warning" size="sm" className="me-2" onClick={() => setShowEditModal(true)}>
                <CIcon icon={cilPencil} className="me-1" />
                Editar
              </CButton>
              <CButton color="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                <CIcon icon={cilTrash} className="me-1" />
                Eliminar
              </CButton>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow>
        {/* Información del Estudiante */}
        <CCol lg={6} className="mb-4">
          <CCard>
            <CCardHeader className="bg-primary text-white">
              <h5 className="mb-0">
                <CIcon icon={cilUser} className="me-2" />
                Información del Estudiante
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Cédula:</strong>
                  <span>{matricula.student_ci || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Nombres:</strong>
                  <span>{matricula.student_name || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Apellidos:</strong>
                  <span>{matricula.student_lastName || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Fecha de Nacimiento:</strong>
                  <span>{formatDate(matricula.student_birthday)}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Edad:</strong>
                  <span>{calculateAge(matricula.student_birthday)}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Sexo:</strong>
                  <CBadge color={matricula.student_sex === "Masculino" ? "primary" : "danger"}>
                    {matricula.student_sex || "-"}
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Lugar de Nacimiento:</strong>
                  <span>{matricula.student_birthPlace || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Dirección:</strong>
                  <span>{matricula.student_address || "-"}</span>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Información del Representante */}
        <CCol lg={6} className="mb-4">
          <CCard>
            <CCardHeader className="bg-success text-white">
              <h5 className="mb-0">
                <CIcon icon={cilPeople} className="me-2" />
                Información del Representante
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Cédula:</strong>
                  <span>{matricula.representative_ci || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Nombres:</strong>
                  <span>{matricula.representative_name || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Apellidos:</strong>
                  <span>{matricula.representative_lastName || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Teléfono:</strong>
                  <span>
                    <CIcon icon={cilPhone} className="me-1" />
                    {formatPhone(matricula.representative_phone)}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Email:</strong>
                  <span>{matricula.representative_email || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Dirección:</strong>
                  <span>
                    <CIcon icon={cilLocationPin} className="me-1" />
                    {matricula.representative_address || "-"}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Lugar de Trabajo:</strong>
                  <span>{matricula.representative_workplace || "-"}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Profesión:</strong>
                  <span>{matricula.representative_profesion || "-"}</span>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Información Académica */}
        <CCol lg={6} className="mb-4">
          <CCard>
            <CCardHeader className="bg-info text-white">
              <h5 className="mb-0">
                <CIcon icon={cilSchool} className="me-2" />
                Información Académica
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Grado:</strong>
                  <CBadge color="info" size="lg">
                    {matricula.grade_name || "-"}
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Sección:</strong>
                  <CBadge color="secondary">{matricula.section_name || "-"}</CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Docente:</strong>
                  <span>
                    {matricula.teacher_name && matricula.teacher_lastName
                      ? `${matricula.teacher_name} ${matricula.teacher_lastName}`
                      : "-"}
                  </span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Año Escolar:</strong>
                  <span>{matricula.school_year || new Date().getFullYear()}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Estado:</strong>
                  <CBadge color={matricula.repeater ? "warning" : "success"}>
                    {matricula.repeater ? "Repitiente" : "Regular"}
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Fecha de Inscripción:</strong>
                  <span>
                    <CIcon icon={cilCalendar} className="me-1" />
                    {formatDate(matricula.registrationDate)}
                  </span>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Observaciones */}
        <CCol lg={6} className="mb-4">
          <CCard>
            <CCardHeader className="bg-warning text-dark">
              <h5 className="mb-0">Observaciones</h5>
            </CCardHeader>
            <CCardBody>
              <p className="mb-0">{matricula.observation || "Sin observaciones registradas."}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal de Edición */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Editar Matrícula</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleEditSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormLabel>Estado del Estudiante</CFormLabel>
                <CFormSelect
                  value={editForm.repeater ? "repeater" : "regular"}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      repeater: e.target.value === "repeater",
                    }))
                  }
                  required
                >
                  <option value="regular">Regular</option>
                  <option value="repeater">Repitiente</option>
                </CFormSelect>
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel>Estado de la Matrícula</CFormLabel>
                <CFormSelect
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                  <option value="transferred">Trasladado</option>
                  <option value="withdrawn">Retirado</option>
                </CFormSelect>
              </CCol>
              <CCol md={12} className="mb-3">
                <CFormLabel>Observaciones</CFormLabel>
                <CFormTextarea
                  rows={4}
                  value={editForm.observation}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      observation: e.target.value,
                    }))
                  }
                  placeholder="Ingrese observaciones sobre la matrícula..."
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" type="submit" disabled={editLoading}>
              {editLoading ? <CSpinner size="sm" className="me-2" /> : null}
              Guardar Cambios
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal de Confirmación de Eliminación */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            ¿Está seguro que desea eliminar la matrícula de{" "}
            <strong>
              {matricula.student_name} {matricula.student_lastName}
            </strong>
            ?
          </p>
          <CAlert color="danger">
            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
          </CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? <CSpinner size="sm" className="me-2" /> : null}
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toast Container */}
      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast key={toast.id} autohide delay={3000} visible>
            <CToastHeader closeButton>
              <CIcon icon={toast.color === "success" ? cilCheckCircle : cilWarning} className="me-2" />
              <strong className="me-auto">{toast.color === "success" ? "Éxito" : "Error"}</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CContainer>
  )
}

export default MatriculaInfo
