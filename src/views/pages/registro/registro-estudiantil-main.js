"use client"

import { useState } from "react"
import TipoInscripcion from "./registro-estudiantil/tipo-inscripcion.js"
import CrearAlumno from "./registro-estudiantil/crear-alumno.js"
import ValidacionGrados from "./registro-estudiantil/validacion-grados.js"
import InscripcionPeriodo from "./registro-estudiantil/inscripcion-periodo.js"
import { CAlert, CContainer } from "@coreui/react"

export default function RegistroEstudiantilMain() {
  const [currentStep, setCurrentStep] = useState("tipo")
  const [tipoInscripcion, setTipoInscripcion] = useState(null)
  const [student, setStudent] = useState(null)
  const [hasAcademicHistory, setHasAcademicHistory] = useState(false)

  const handleTipoSelected = (tipo) => {
    setTipoInscripcion(tipo)
    setCurrentStep("crear-alumno")
  }

  const handleStudentCreated = (createdStudent) => {
    setStudent(createdStudent)
    setCurrentStep("validacion-grados")
  }

  const handleHistoryCompleted = (hasHistory) => {
    setHasAcademicHistory(hasHistory)
    setCurrentStep("inscripcion")
  }

  const handleInscriptionCompleted = () => {
    setCurrentStep("completado")
  }

  const handleBackToTipo = () => {
    setCurrentStep("tipo")
    setTipoInscripcion(null)
    setStudent(null)
    setHasAcademicHistory(false)
  }

  const handleBackToCrearAlumno = () => {
    setCurrentStep("crear-alumno")
  }

  const handleBackToValidacionGrados = () => {
    setCurrentStep("validacion-grados")
  }

  const handleStartNew = () => {
    setCurrentStep("tipo")
    setTipoInscripcion(null)
    setStudent(null)
    setHasAcademicHistory(false)
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      {currentStep === "tipo" && <TipoInscripcion onSelectTipo={handleTipoSelected} />}

      {currentStep === "crear-alumno" && tipoInscripcion && (
        <CrearAlumno
          tipoInscripcion={tipoInscripcion}
          onStudentCreated={handleStudentCreated}
          onBack={handleBackToTipo}
        />
      )}

      {currentStep === "validacion-grados" && student && tipoInscripcion && (
        <ValidacionGrados
          student={student}
          tipoInscripcion={tipoInscripcion}
          onHistoryCompleted={handleHistoryCompleted}
          onBack={handleBackToCrearAlumno}
        />
      )}

      {currentStep === "inscripcion" && student && tipoInscripcion && (
        <InscripcionPeriodo
          student={student}
          tipoInscripcion={tipoInscripcion}
          hasAcademicHistory={hasAcademicHistory}
          onInscriptionCompleted={handleInscriptionCompleted}
          onBack={handleBackToValidacionGrados}
        />
      )}

      {currentStep === "completado" && (
        <CContainer>
          <div className="text-center py-5">
            <CAlert color="success" className="mb-4">
              <h2 className="alert-heading">¡Inscripción Completada Exitosamente!</h2>
              <hr />
              <p className="mb-0">
                El estudiante{" "}
                <strong>
                  {student?.name} {student?.lastName}
                </strong>{" "}
                ha sido inscrito correctamente en el período académico actual.
              </p>
            </CAlert>

            <div className="mt-4">
              <button className="btn btn-primary btn-lg me-3" onClick={handleStartNew}>
                Inscribir Otro Estudiante
              </button>
              <button
                className="btn btn-outline-secondary btn-lg"
                onClick={() => (window.location.href = "/matricula")}
              >
                Ver Matrícula
              </button>
            </div>
          </div>
        </CContainer>
      )}
    </div>
  )
}