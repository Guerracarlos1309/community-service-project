"use client"
import { useState, useEffect } from "react"
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilGroup, cilPlus, cilPencil, cilTrash, cilUser, cilUserPlus, cilSearch, cilX, cilInfo } from "@coreui/icons"
import { helpFetch } from "../../../api/helpFetch"

const BrigadeManagement = () => {
  // Estados principales
  const [brigades, setBrigades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBrigades, setFilteredBrigades] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [brigadesPerPage] = useState(8)

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false)
  const [showEnrollStudentsModal, setShowEnrollStudentsModal] = useState(false)

  // Estados para datos seleccionados
  const [selectedBrigade, setSelectedBrigade] = useState(null)
  const [brigadeStudents, setBrigadeStudents] = useState([])
  const [availableTeachers, setAvailableTeachers] = useState([])
  const [availableStudents, setAvailableStudents] = useState([])

  // Estados para formularios
  const [brigadeForm, setBrigadeForm] = useState({
    name: "",
  })

  const [teacherForm, setTeacherForm] = useState({
    personalId: "",
    startDate: new Date().toISOString().split("T")[0],
  })

  const [studentForm, setStudentForm] = useState({
    studentIds: [],
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Instancia de API
  const api = helpFetch()

  // Cargar brigadas al montar
  useEffect(() => {
    loadBrigades()
    loadAvailableTeachers()
    loadAvailableStudents()
  }, [])

  // Filtrar brigadas cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBrigades(brigades)
    } else {
      const filtered = brigades.filter(
        (brigade) =>
          brigade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (brigade.encargado_name &&
            `${brigade.encargado_name} ${brigade.encargado_lastName}`.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredBrigades(filtered)
    }
    setCurrentPage(1)
  }, [searchTerm, brigades])

  const loadBrigades = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Cargando brigadas...")

      const response = await api.get("/api/brigadas")

      if (response.ok) {
        setBrigades(response.brigades || [])
        console.log("✅ Brigadas cargadas:", response.brigades?.length || 0)
      } else {
        throw new Error(response.msg || "Error al cargar brigadas")
      }
    } catch (error) {
      console.error("❌ Error cargando brigadas:", error)
      setError(`Error al cargar brigadas: ${error.msg || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableTeachers = async () => {
    try {
      const response = await api.get("/api/brigadas/utils/available-teachers")
      if (response.ok) {
        setAvailableTeachers(response.teachers || [])
        console.log("✅ Docentes disponibles cargados:", response.teachers?.length || 0)
      }
    } catch (error) {
      console.error("❌ Error cargando docentes:", error)
    }
  }

  const loadAvailableStudents = async () => {
    try {
      const response = await api.get("/api/brigadas/utils/available-students")
      if (response.ok) {
        setAvailableStudents(response.students || [])
        console.log("✅ Estudiantes disponibles cargados:", response.students?.length || 0)
      }
    } catch (error) {
      console.error("❌ Error cargando estudiantes:", error)
    }
  }

  const loadBrigadeStudents = async (brigadeId) => {
    try {
      const response = await api.get(`/api/brigadas/${brigadeId}/students`)
      if (response.ok) {
        setBrigadeStudents(response.students || [])
        console.log("✅ Estudiantes de brigada cargados:", response.students?.length || 0)
      }
    } catch (error) {
      console.error("❌ Error cargando estudiantes de brigada:", error)
      setBrigadeStudents([])
    }
  }

  const validateBrigadeForm = () => {
    const errors = {}

    if (!brigadeForm.name.trim()) {
      errors.name = "El nombre de la brigada es requerido"
    } else if (brigadeForm.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres"
    } else if (brigadeForm.name.length > 100) {
      errors.name = "El nombre es demasiado largo (máximo 100 caracteres)"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateBrigade = async () => {
    try {
      if (!validateBrigadeForm()) return

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log("➕ Creando brigada...")

      const response = await api.post("/api/brigadas", {
        body: brigadeForm,
      })

      if (response.ok) {
        setSuccess("Brigada creada exitosamente")
        setShowCreateModal(false)
        resetBrigadeForm()
        await loadBrigades()
        console.log("✅ Brigada creada")
      } else {
        setError(response.msg || "Error al crear brigada")
      }
    } catch (error) {
      console.error("❌ Error creando brigada:", error)
      setError(`Error de conexión: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateBrigade = async () => {
    try {
      if (!validateBrigadeForm()) return

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log("✏️ Actualizando brigada...")

      const response = await api.put(`/api/brigadas/${selectedBrigade.id}`, {
        body: brigadeForm,
      })

      if (response.ok) {
        setSuccess("Brigada actualizada exitosamente")
        setShowEditModal(false)
        resetBrigadeForm()
        await loadBrigades()
        console.log("✅ Brigada actualizada")
      } else {
        setError(response.msg || "Error al actualizar brigada")
      }
    } catch (error) {
      console.error("❌ Error actualizando brigada:", error)
      setError(`Error de conexión: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBrigade = async () => {
    try {
      if (!selectedBrigade) return

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log("🗑️ Eliminando brigada...")

      const response = await api.del(`/api/brigadas/${selectedBrigade.id}`)

      if (response.ok) {
        setSuccess("Brigada eliminada exitosamente")
        setShowDeleteModal(false)
        setSelectedBrigade(null)
        await loadBrigades()
        await loadAvailableStudents() // Recargar estudiantes disponibles
        console.log("✅ Brigada eliminada")
      } else {
        setError(response.msg || "Error al eliminar brigada")
      }
    } catch (error) {
      console.error("❌ Error eliminando brigada:", error)
      setError(`Error de conexión: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssignTeacher = async () => {
    try {
      if (!teacherForm.personalId) {
        setError("Debe seleccionar un docente")
        return
      }

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log("👨‍🏫 Asignando docente...")

      const response = await api.post(`/api/brigadas/${selectedBrigade.id}/assign-teacher`, {
        body: {
          personalId: Number.parseInt(teacherForm.personalId),
          startDate: teacherForm.startDate,
        },
      })

      if (response.ok) {
        setSuccess("Docente asignado exitosamente")
        setShowAssignTeacherModal(false)
        resetTeacherForm()
        await loadBrigades()
        await loadAvailableTeachers()
        console.log("✅ Docente asignado")
      } else {
        setError(response.msg || "Error al asignar docente")
      }
    } catch (error) {
      console.error("❌ Error asignando docente:", error)
      setError(`Error de conexión: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEnrollStudents = async () => {
    try {
      if (studentForm.studentIds.length === 0) {
        setError("Debe seleccionar al menos un estudiante")
        return
      }

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      console.log("👥 Inscribiendo estudiantes...")

      const response = await api.post(`/api/brigadas/${selectedBrigade.id}/enroll-students`, {
        body: {
          studentIds: studentForm.studentIds.map((id) => Number.parseInt(id)),
        },
      })

      if (response.ok) {
        setSuccess(
          `${response.result?.studentsEnrolled || studentForm.studentIds.length} estudiantes inscritos exitosamente`,
        )
        setShowEnrollStudentsModal(false)
        resetStudentForm()
        await loadBrigades()
        await loadAvailableStudents()
        console.log("✅ Estudiantes inscritos")
      } else {
        setError(response.msg || "Error al inscribir estudiantes")
      }
    } catch (error) {
      console.error("❌ Error inscribiendo estudiantes:", error)
      setError(`Error de conexión: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearBrigade = async (brigade) => {
    try {
      if (
        !window.confirm(
          `¿Está seguro de que desea limpiar la brigada "${brigade.name}"? Esto removerá todos los estudiantes.`,
        )
      ) {
        return
      }

      setError(null)
      setSuccess(null)

      console.log("🧹 Limpiando brigada...")

      const response = await api.post(`/api/brigadas/${brigade.id}/clear`)

      if (response.ok) {
        setSuccess(`Brigada limpiada exitosamente. ${response.result?.studentsRemoved || 0} estudiantes removidos.`)
        await loadBrigades()
        await loadAvailableStudents()
        console.log("✅ Brigada limpiada")
      } else {
        setError(response.msg || "Error al limpiar brigada")
      }
    } catch (error) {
      console.error("❌ Error limpiando brigada:", error)
      setError(`Error de conexión: ${error.message}`)
    }
  }

  const resetBrigadeForm = () => {
    setBrigadeForm({ name: "" })
    setFormErrors({})
  }

  const resetTeacherForm = () => {
    setTeacherForm({
      personalId: "",
      startDate: new Date().toISOString().split("T")[0],
    })
  }

  const resetStudentForm = () => {
    setStudentForm({ studentIds: [] })
  }

  const openCreateModal = () => {
    resetBrigadeForm()
    setShowCreateModal(true)
  }

  const openEditModal = (brigade) => {
    setSelectedBrigade(brigade)
    setBrigadeForm({ name: brigade.name })
    setFormErrors({})
    setShowEditModal(true)
  }

  const openDeleteModal = (brigade) => {
    setSelectedBrigade(brigade)
    setShowDeleteModal(true)
  }

  const openDetailsModal = async (brigade) => {
    setSelectedBrigade(brigade)
    await loadBrigadeStudents(brigade.id)
    setShowDetailsModal(true)
  }

  const openAssignTeacherModal = (brigade) => {
    setSelectedBrigade(brigade)
    resetTeacherForm()
    setShowAssignTeacherModal(true)
  }

  const openEnrollStudentsModal = (brigade) => {
    setSelectedBrigade(brigade)
    resetStudentForm()
    setShowEnrollStudentsModal(true)
  }

  const handleStudentSelection = (studentId) => {
    const currentIds = studentForm.studentIds
    const numericId = Number.parseInt(studentId)

    if (currentIds.includes(numericId)) {
      setStudentForm({
        studentIds: currentIds.filter((id) => id !== numericId),
      })
    } else {
      setStudentForm({
        studentIds: [...currentIds, numericId],
      })
    }
  }

  // Calcular brigadas para la página actual
  const indexOfLastBrigade = currentPage * brigadesPerPage
  const indexOfFirstBrigade = indexOfLastBrigade - brigadesPerPage
  const currentBrigades = filteredBrigades.slice(indexOfFirstBrigade, indexOfLastBrigade)
  const totalPages = Math.ceil(filteredBrigades.length / brigadesPerPage)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando brigadas...</span>
      </div>
    )
  }

  return (
    <>
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          <strong>Error:</strong> {error}
        </CAlert>
      )}

      {success && (
        <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
          <strong>Éxito:</strong> {success}
        </CAlert>
      )}

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilGroup} className="me-2" />
            Gestión de Brigadas ({brigades.length})
          </h5>
          <div className="d-flex gap-2">
            <CButton color="info" onClick={loadBrigades} disabled={loading}>
              {loading ? <CSpinner size="sm" className="me-1" /> : null}
              Actualizar
            </CButton>
            <CButton color="primary" onClick={openCreateModal}>
              <CIcon icon={cilPlus} className="me-1" />
              Nueva Brigada
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Barra de búsqueda */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar brigadas por nombre o encargado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6} className="text-end">
              <small className="text-muted">
                Mostrando {currentBrigades.length} de {filteredBrigades.length} brigadas
              </small>
            </CCol>
          </CRow>

          {/* Grid de brigadas */}
          <CRow className="g-4">
            {currentBrigades.length > 0 ? (
              currentBrigades.map((brigade) => (
                <CCol xs={12} sm={6} md={4} lg={3} key={brigade.id}>
                  <CCard className="h-100 shadow-sm">
                    <CCardBody className="d-flex flex-column">
                      <div className="flex-grow-1">
                        <h6 className="fw-bold text-truncate mb-2" title={brigade.name}>
                          {brigade.name}
                        </h6>

                        <div className="mb-2">
                          <small className="text-muted">Encargado:</small>
                          <div className="fw-semibold small">
                            {brigade.encargado_name && brigade.encargado_lastName
                              ? `${brigade.encargado_name} ${brigade.encargado_lastName}`
                              : "Sin asignar"}
                          </div>
                          {brigade.encargado_ci && <small className="text-muted">CI: {brigade.encargado_ci}</small>}
                        </div>

                        <div className="mb-3">
                          <CBadge color="info" className="me-2">
                            {brigade.studentcount || 0} estudiantes
                          </CBadge>
                          {brigade.fecha_inicio && (
                            <CBadge color="secondary">
                              Desde: {new Date(brigade.fecha_inicio).toLocaleDateString()}
                            </CBadge>
                          )}
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() => openDetailsModal(brigade)}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <CIcon icon={cilInfo} className="me-1" />
                          Ver Detalles
                        </CButton>

                        <CRow className="g-1">
                          <CCol xs={6}>
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => openEditModal(brigade)}
                              title="Editar"
                              className="w-100"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CCol>
                          <CCol xs={6}>
                            <CButton
                              color="success"
                              size="sm"
                              onClick={() => openAssignTeacherModal(brigade)}
                              title="Asignar Docente"
                              className="w-100"
                            >
                              <CIcon icon={cilUser} />
                            </CButton>
                          </CCol>
                        </CRow>

                        <CRow className="g-1">
                          <CCol xs={4}>
                            <CButton
                              color="primary"
                              size="sm"
                              onClick={() => openEnrollStudentsModal(brigade)}
                              title="Inscribir Estudiantes"
                              className="w-100"
                            >
                              <CIcon icon={cilUserPlus} />
                            </CButton>
                          </CCol>
                          <CCol xs={4}>
                            <CButton
                              color="secondary"
                              size="sm"
                              onClick={() => handleClearBrigade(brigade)}
                              title="Limpiar Brigada"
                              className="w-100"
                            >
                              <CIcon icon={cilX} />
                            </CButton>
                          </CCol>
                          <CCol xs={4}>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => openDeleteModal(brigade)}
                              title="Eliminar"
                              className="w-100"
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CCol>
                        </CRow>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))
            ) : (
              <CCol xs={12}>
                <div className="text-center text-muted py-5">
                  <CIcon icon={cilGroup} size="3xl" className="mb-3 opacity-50" />
                  <h5>{searchTerm ? "No se encontraron brigadas" : "No hay brigadas registradas"}</h5>
                  <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primera brigada"}</p>
                  {!searchTerm && (
                    <CButton color="primary" onClick={openCreateModal}>
                      <CIcon icon={cilPlus} className="me-1" />
                      Crear Primera Brigada
                    </CButton>
                  )}
                </div>
              </CCol>
            )}
          </CRow>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <CPagination>
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                  Anterior
                </CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{ cursor: "pointer" }}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >
                  Siguiente
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal para crear brigada */}
      <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CModalHeader>
          <CModalTitle>Crear Nueva Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nombre de la Brigada *</CFormLabel>
              <CFormInput
                value={brigadeForm.name}
                onChange={(e) => setBrigadeForm({ ...brigadeForm, name: e.target.value })}
                invalid={!!formErrors.name}
                placeholder="Ej: Brigada Ecológica"
                maxLength={100}
              />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              <small className="text-muted">Mínimo 3 caracteres, máximo 100 caracteres</small>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleCreateBrigade} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Creando...
              </>
            ) : (
              "Crear Brigada"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para editar brigada */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Editar Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nombre de la Brigada *</CFormLabel>
              <CFormInput
                value={brigadeForm.name}
                onChange={(e) => setBrigadeForm({ ...brigadeForm, name: e.target.value })}
                invalid={!!formErrors.name}
                placeholder="Ej: Brigada Ecológica"
                maxLength={100}
              />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              <small className="text-muted">Mínimo 3 caracteres, máximo 100 caracteres</small>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleUpdateBrigade} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Actualizando...
              </>
            ) : (
              "Actualizar Brigada"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para eliminar brigada */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            ¿Está seguro de que desea eliminar la brigada <strong>{selectedBrigade?.name}</strong>?
          </p>
          <CAlert color="warning">
            <strong>Advertencia:</strong> Esta acción no se puede deshacer y eliminará todos los datos asociados.
          </CAlert>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)} disabled={isSubmitting}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDeleteBrigade} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Eliminando...
              </>
            ) : (
              "Eliminar Brigada"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para ver detalles */}
      <CModal visible={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Detalles de la Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBrigade && (
            <>
              <div className="mb-4">
                <h5>{selectedBrigade.name}</h5>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <strong>Encargado:</strong>
                      <div>
                        {selectedBrigade.encargado_name && selectedBrigade.encargado_lastName
                          ? `${selectedBrigade.encargado_name} ${selectedBrigade.encargado_lastName}`
                          : "Sin asignar"}
                      </div>
                      {selectedBrigade.encargado_ci && (
                        <small className="text-muted">CI: {selectedBrigade.encargado_ci}</small>
                      )}
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <strong>Estudiantes:</strong>
                      <div>{brigadeStudents.length} inscritos</div>
                    </div>
                  </CCol>
                </CRow>
                {selectedBrigade.fecha_inicio && (
                  <div className="mb-3">
                    <strong>Fecha de Inicio:</strong>
                    <div>{new Date(selectedBrigade.fecha_inicio).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              <h6>Estudiantes Inscritos</h6>
              {brigadeStudents.length > 0 ? (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Nombre</CTableHeaderCell>
                      <CTableHeaderCell>CI</CTableHeaderCell>
                      <CTableHeaderCell>Sexo</CTableHeaderCell>
                      <CTableHeaderCell>Grado</CTableHeaderCell>
                      <CTableHeaderCell>Sección</CTableHeaderCell>
                      <CTableHeaderCell>Fecha Asignación</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {brigadeStudents.map((student) => (
                      <CTableRow key={student.id}>
                        <CTableDataCell>
                          {student.name} {student.lastName}
                        </CTableDataCell>
                        <CTableDataCell>{student.ci}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={student.sex === "Masculino" ? "info" : "warning"}>{student.sex}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{student.grade_name || "N/A"}</CTableDataCell>
                        <CTableDataCell>{student.section_name || "N/A"}</CTableDataCell>
                        <CTableDataCell>
                          {student.assignmentDate ? new Date(student.assignmentDate).toLocaleDateString() : "N/A"}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center text-muted py-3">
                  <CIcon icon={cilUser} size="2xl" className="mb-2 opacity-50" />
                  <p>No hay estudiantes inscritos en esta brigada</p>
                </div>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para asignar docente */}
      <CModal visible={showAssignTeacherModal} onClose={() => setShowAssignTeacherModal(false)}>
        <CModalHeader>
          <CModalTitle>Asignar Docente a Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Seleccionar Docente *</CFormLabel>
              <CFormSelect
                value={teacherForm.personalId}
                onChange={(e) => setTeacherForm({ ...teacherForm, personalId: e.target.value })}
              >
                <option value="">Seleccionar docente...</option>
                {availableTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} {teacher.lastName} - {teacher.ci} ({teacher.rol_nombre})
                  </option>
                ))}
              </CFormSelect>
              {availableTeachers.length === 0 && <small className="text-muted">No hay docentes disponibles</small>}
            </div>
            <div className="mb-3">
              <CFormLabel>Fecha de Inicio</CFormLabel>
              <CFormInput
                type="date"
                value={teacherForm.startDate}
                onChange={(e) => setTeacherForm({ ...teacherForm, startDate: e.target.value })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAssignTeacherModal(false)} disabled={isSubmitting}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={handleAssignTeacher} disabled={isSubmitting || !teacherForm.personalId}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Asignando...
              </>
            ) : (
              "Asignar Docente"
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para inscribir estudiantes */}
      <CModal visible={showEnrollStudentsModal} onClose={() => setShowEnrollStudentsModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Inscribir Estudiantes en Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <h6>Estudiantes Disponibles</h6>
            <small className="text-muted">
              Seleccione los estudiantes que desea inscribir en la brigada "{selectedBrigade?.name}". Los estudiantes
              pueden pertenecer a múltiples brigadas.
            </small>
          </div>

          {availableStudents.length > 0 ? (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell width="50">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStudentForm({
                              studentIds: availableStudents.map((s) => s.id),
                            })
                          } else {
                            setStudentForm({ studentIds: [] })
                          }
                        }}
                        checked={
                          studentForm.studentIds.length === availableStudents.length && availableStudents.length > 0
                        }
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>CI</CTableHeaderCell>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableHeaderCell>Grado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {availableStudents.map((student) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell>
                        <input
                          type="checkbox"
                          checked={studentForm.studentIds.includes(student.id)}
                          onChange={() => handleStudentSelection(student.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        {student.name} {student.lastName}
                      </CTableDataCell>
                      <CTableDataCell>{student.ci}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={student.sex === "Masculino" ? "info" : "warning"}>{student.sex}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{student.grade_name || "N/A"}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <CIcon icon={cilUser} size="3xl" className="mb-3 opacity-50" />
              <h6>No hay estudiantes disponibles</h6>
              <p>Todos los estudiantes están registrados en el sistema</p>
            </div>
          )}

          {studentForm.studentIds.length > 0 && (
            <div className="mt-3 p-3 bg-light rounded">
              <CBadge color="info" className="me-2">
                {studentForm.studentIds.length} estudiantes seleccionados
              </CBadge>
              <small className="text-muted">
                Se inscribirán {studentForm.studentIds.length} estudiantes en la brigada
              </small>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEnrollStudentsModal(false)} disabled={isSubmitting}>
            Cancelar
          </CButton>
          <CButton
            color="primary"
            onClick={handleEnrollStudents}
            disabled={isSubmitting || studentForm.studentIds.length === 0}
          >
            {isSubmitting ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Inscribiendo...
              </>
            ) : (
              `Inscribir ${studentForm.studentIds.length} Estudiante${studentForm.studentIds.length !== 1 ? "s" : ""}`
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default BrigadeManagement
