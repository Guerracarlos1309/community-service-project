"use client"

import { useState } from "react"
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
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
} from "@coreui/react"
import { CFormLabel, CFormInput, CFormTextarea, CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react"
import angular from "../../../assets/images/angular.jpg"
import rea from "../../../assets/images/react.jpg"
import vue from "../../../assets/images/vue.jpg"

const Brigade = () => {
  // State to control the modal
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBrigade, setSelectedBrigade] = useState(null)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [newBrigade, setNewBrigade] = useState({
    name: "",
    description: "",
    image: angular, // Default image
    teacher: {
      name: "",
      subject: "",
      contact: "",
    },
    selectedStudents: [],
  })

  // List of all available students (this would typically come from an API)
  const allStudents = [
    { id: 101, name: "Ana García", grade: "3°A", age: 15 },
    { id: 102, name: "Pedro Martínez", grade: "3°A", age: 15 },
    { id: 103, name: "Sofía López", grade: "3°B", age: 16 },
    { id: 104, name: "Diego Hernández", grade: "2°C", age: 14 },
    { id: 201, name: "Carlos Ramírez", grade: "3°C", age: 16 },
    { id: 202, name: "Lucía Fernández", grade: "3°C", age: 16 },
    { id: 203, name: "Javier Torres", grade: "2°A", age: 14 },
    { id: 204, name: "Valentina Díaz", grade: "2°B", age: 14 },
    { id: 301, name: "Mariana González", grade: "3°D", age: 16 },
    { id: 302, name: "Alejandro Vargas", grade: "3°D", age: 16 },
    { id: 303, name: "Camila Reyes", grade: "2°D", age: 14 },
    { id: 304, name: "Sebastián Morales", grade: "2°C", age: 14 },
    { id: 401, name: "Daniel Castro", grade: "3°B", age: 15 },
    { id: 402, name: "Isabella Ramos", grade: "3°A", age: 15 },
    { id: 403, name: "Mateo Flores", grade: "2°B", age: 14 },
    { id: 404, name: "Valeria Campos", grade: "2°A", age: 14 },
  ]

  // Mock data for brigades
  const [brigades, setBrigades] = useState([
    {
      id: 1,
      name: "Brigada de Primeros Auxilios",
      description: "Encargada de brindar asistencia en situaciones de emergencia.",
      image: angular,
      teacher: {
        name: "Dra. Ana Pérez",
        subject: "Biología",
        contact: "ana.perez@escuela.edu",
      },
      students: [
        { id: 101, name: "Ana García", grade: "3°A", age: 15, role: "Coordinadora" },
        { id: 102, name: "Pedro Martínez", grade: "3°A", age: 15, role: "Auxiliar" },
      ],
    },
    {
      id: 2,
      name: "Brigada de Evacuación",
      description: "Responsable de dirigir y asegurar la evacuación en caso de siniestros.",
      image: rea,
      teacher: {
        name: "Ing. Carlos López",
        subject: "Física",
        contact: "carlos.lopez@escuela.edu",
      },
      students: [
        { id: 201, name: "Carlos Ramírez", grade: "3°C", age: 16, role: "Coordinador" },
        { id: 202, name: "Lucía Fernández", grade: "3°C", age: 16, role: "Auxiliar" },
      ],
    },
    {
      id: 3,
      name: "Brigada de Incendios",
      description: "Dedicada a la prevención y combate de incendios dentro de la institución.",
      image: vue,
      teacher: {
        name: "Sra. Marta Gómez",
        subject: "Química",
        contact: "marta.gomez@escuela.edu",
      },
      students: [
        { id: 301, name: "Mariana González", grade: "3°D", age: 16, role: "Coordinadora" },
        { id: 302, name: "Alejandro Vargas", grade: "3°D", age: 16, role: "Auxiliar" },
      ],
    },
  ])

  // Function to open modal with selected brigade information
  const openModal = (brigade) => {
    setSelectedBrigade(brigade)
    setModalVisible(true)
  }

  // Function to handle opening the add brigade modal
  const openAddModal = () => {
    setAddModalVisible(true)
  }

  // Function to handle form input changes
  const handleInputChange = (e, field, nestedField = null) => {
    const { value } = e.target

    if (nestedField) {
      setNewBrigade({
        ...newBrigade,
        [field]: {
          ...newBrigade[field],
          [nestedField]: value,
        },
      })
    } else {
      setNewBrigade({
        ...newBrigade,
        [field]: value,
      })
    }
  }

  // Function to handle student selection
  const handleStudentSelection = (studentId, isCoordinator) => {
    const student = allStudents.find((s) => s.id === Number.parseInt(studentId))
    if (!student) return

    // Check if student is already selected
    const isSelected = newBrigade.selectedStudents.some((s) => s.id === student.id)

    if (isSelected) {
      // Remove student if already selected
      setNewBrigade({
        ...newBrigade,
        selectedStudents: newBrigade.selectedStudents.filter((s) => s.id !== student.id),
      })
    } else {
      // Add student with role
      setNewBrigade({
        ...newBrigade,
        selectedStudents: [
          ...newBrigade.selectedStudents,
          {
            ...student,
            role: isCoordinator ? (student.name.endsWith("a") ? "Coordinadora" : "Coordinador") : "Auxiliar",
          },
        ],
      })
    }
  }

  // Function to handle form submission
  const handleSubmit = () => {
    // Validate form
    if (
      !newBrigade.name ||
      !newBrigade.description ||
      !newBrigade.teacher.name ||
      newBrigade.selectedStudents.length === 0
    ) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    // Create new brigade object
    const newBrigadeObj = {
      id: brigades.length + 1,
      name: newBrigade.name,
      image: newBrigade.image,
      description: newBrigade.description,
      teacher: newBrigade.teacher,
      students: newBrigade.selectedStudents,
    }

    // Add new brigade to the list (in a real app, this would be an API call)
    setBrigades([...brigades, newBrigadeObj])

    // Reset form and close modal
    setNewBrigade({
      name: "",
      description: "",
      image: angular,
      teacher: {
        name: "",
        subject: "",
        contact: "",
      },
      selectedStudents: [],
    })
    setAddModalVisible(false)
  }

  return (
    <div className="p-4">
      <div className="mb-4 position-relative">
        <h2
          className="text-center position-relative pb-3"
          style={{
            fontFamily: "Arial, sans-serif",
            color: "#4a4a4a",
            borderBottom: "3px solid",
            borderImage: "linear-gradient(to right, transparent, #4a4a4a, transparent) 1",
          }}
        >
          Brigadas Escolares
        </h2>
      </div>
      <div className="d-flex justify-content-end mb-4">
        <CButton color="primary" onClick={openAddModal}>
          Añadir Brigada
        </CButton>
      </div>
      <CRow className="g-4">
        {brigades.map((brigade) => (
          <CCol xs={12} sm={6} md={4} lg={3} key={brigade.id}>
            <CCard className="h-100 shadow-sm">
              <CCardBody className="d-flex flex-column justify-content-between">
                <div>
                  <CCardTitle className="fw-bold">{brigade.name}</CCardTitle>
                  <p className="text-muted mb-2">{brigade.description}</p>
                </div>
                <div className="my-3">
                  <img
                    src={brigade.image || "/placeholder.svg"}
                    alt={`Foto de ${brigade.name}`}
                    style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
                <div className="mb-2">
                  <h6 className="mb-1">Profesor encargado:</h6>
                  <p className="mb-0 fw-semibold">{brigade.teacher.name}</p>
                  <small className="text-muted">{brigade.teacher.subject}</small>
                </div>
                <div className="mb-2">
                  <h6 className="mb-1">Integrantes:</h6>
                  <p className="mb-0">{brigade.students.length} alumnos</p>
                </div>
                <div>
                  <div className="mt-3 d-flex justify-content-between">
                    <CButton color="info" onClick={() => openModal(brigade)}>
                      Ver detalles
                    </CButton>
                    <CButton color="danger">Eliminar</CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Modal to show brigade details */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        {selectedBrigade && (
          <>
            <CModalHeader>
              <CModalTitle>{selectedBrigade.name}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Descripción</h5>
                  <p>{selectedBrigade.description}</p>

                  <h5 className="mt-4">Profesor Encargado</h5>
                  <div className="card p-3 bg-light">
                    <h6>{selectedBrigade.teacher.name}</h6>
                    <p className="mb-1">
                      <strong>Asignatura:</strong> {selectedBrigade.teacher.subject}
                    </p>
                    <p className="mb-0">
                      <strong>Contacto:</strong> {selectedBrigade.teacher.contact}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src={selectedBrigade.image || "/placeholder.svg"}
                    alt={`Foto de ${selectedBrigade.name}`}
                    className="img-fluid rounded"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                </div>
              </div>

              <h5 className="mt-3 mb-3">Alumnos Integrantes</h5>
              <CTable hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Grado</CTableHeaderCell>
                    <CTableHeaderCell>Edad</CTableHeaderCell>
                    <CTableHeaderCell>Rol</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedBrigade.students.map((student) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell>{student.name}</CTableDataCell>
                      <CTableDataCell>{student.grade}</CTableDataCell>
                      <CTableDataCell>{student.age} años</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={student.role === "Coordinador" || student.role === "Coordinadora" ? "primary" : "info"}
                        >
                          {student.role}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Cerrar
              </CButton>
              <CButton color="primary">Editar Brigada</CButton>
            </CModalFooter>
          </>
        )}
      </CModal>

      {/* Modal for adding a new brigade */}
      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Añadir Nueva Brigada</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row mb-3">
            <div className="col-md-6">
              <CFormLabel htmlFor="brigadeName">Nombre de la Brigada*</CFormLabel>
              <CFormInput
                id="brigadeName"
                value={newBrigade.name}
                onChange={(e) => handleInputChange(e, "name")}
                placeholder="Ej: Brigada de Primeros Auxilios"
                required
              />
            </div>
            <div className="col-md-6">
              <CFormLabel htmlFor="brigadeImage">Imagen</CFormLabel>
              <CFormSelect
                id="brigadeImage"
                onChange={(e) =>
                  setNewBrigade({
                    ...newBrigade,
                    image: e.target.value === "1" ? angular : e.target.value === "2" ? vue : rea,
                  })
                }
              >
                <option value="1">Imagen 1</option>
                <option value="2">Imagen 2</option>
                <option value="3">Imagen 3</option>
              </CFormSelect>
              <small className="text-muted">En un entorno real, aquí habría un selector de archivos</small>
            </div>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="brigadeDescription">Descripción*</CFormLabel>
            <CFormTextarea
              id="brigadeDescription"
              value={newBrigade.description}
              onChange={(e) => handleInputChange(e, "description")}
              placeholder="Describe el propósito y actividades de esta brigada"
              rows={3}
              required
            />
          </div>

          <h5 className="mt-4 mb-3">Información del Profesor Encargado</h5>
          <div className="row mb-3">
            <div className="col-md-4">
              <CFormLabel htmlFor="teacherName">Nombre del Profesor*</CFormLabel>
              <CFormInput
                id="teacherName"
                value={newBrigade.teacher.name}
                onChange={(e) => handleInputChange(e, "teacher", "name")}
                placeholder="Ej: Prof. Juan Pérez"
                required
              />
            </div>
            <div className="col-md-4">
              <CFormLabel htmlFor="teacherSubject">Asignatura*</CFormLabel>
              <CFormInput
                id="teacherSubject"
                value={newBrigade.teacher.subject}
                onChange={(e) => handleInputChange(e, "teacher", "subject")}
                placeholder="Ej: Matemáticas"
                required
              />
            </div>
            <div className="col-md-4">
              <CFormLabel htmlFor="teacherContact">Contacto*</CFormLabel>
              <CInputGroup>
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  id="teacherContact"
                  value={newBrigade.teacher.contact}
                  onChange={(e) => handleInputChange(e, "teacher", "contact")}
                  placeholder="correo@escuela.edu"
                  required
                />
              </CInputGroup>
            </div>
          </div>

          <h5 className="mt-4 mb-3">Selección de Alumnos*</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <CFormLabel htmlFor="studentSelect">Seleccionar Alumnos</CFormLabel>
              <CFormSelect
                id="studentSelect"
                onChange={(e) => {
                  if (e.target.value) {
                    handleStudentSelection(e.target.value, false)
                  }
                }}
                value=""
              >
                <option value="">Seleccionar alumno...</option>
                {allStudents
                  .filter((student) => !newBrigade.selectedStudents.some((s) => s.id === student.id))
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </option>
                  ))}
              </CFormSelect>
              <small className="text-muted">Seleccione los alumnos que formarán parte de la brigada</small>
            </div>
            <div className="col-md-6">
              <CFormLabel htmlFor="coordinatorSelect">Seleccionar Coordinador/a</CFormLabel>
              <CFormSelect
                id="coordinatorSelect"
                onChange={(e) => {
                  if (e.target.value) {
                    handleStudentSelection(e.target.value, true)
                  }
                }}
                value=""
              >
                <option value="">Seleccionar coordinador/a...</option>
                {allStudents
                  .filter((student) => !newBrigade.selectedStudents.some((s) => s.id === student.id))
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </option>
                  ))}
              </CFormSelect>
              <small className="text-muted">Seleccione el alumno que será coordinador/a de la brigada</small>
            </div>
          </div>

          {newBrigade.selectedStudents.length > 0 && (
            <div className="mb-3">
              <h6>Alumnos Seleccionados:</h6>
              <CTable small hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Grado</CTableHeaderCell>
                    <CTableHeaderCell>Rol</CTableHeaderCell>
                    <CTableHeaderCell>Acción</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {newBrigade.selectedStudents.map((student) => (
                    <CTableRow key={student.id}>
                      <CTableDataCell>{student.name}</CTableDataCell>
                      <CTableDataCell>{student.grade}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={student.role === "Coordinador" || student.role === "Coordinadora" ? "primary" : "info"}
                        >
                          {student.role}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setNewBrigade({
                              ...newBrigade,
                              selectedStudents: newBrigade.selectedStudents.filter((s) => s.id !== student.id),
                            })
                          }}
                        >
                          Eliminar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}

          <div className="alert alert-info mt-3">
            <small>* Campos obligatorios</small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Guardar Brigada
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Brigade
