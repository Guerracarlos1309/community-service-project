import React, { useState } from 'react'
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react'

const matriculaInfo = () => {
  const [activeTab, setActiveTab] = useState('datosGenerales')

  const datosGenerales = {
    tipoIngreso: 'nuevo',
    nivel: 'primaria',
    grado: '3',
    seccion: 'B',
    fechaInscripcion: '2025-05-01',
    plantelProcedencia: 'Escuela ABC',
  }

  const datosPersonales = {
    cedulaEscolar: 'V-12345678',
    apellidos: 'Pérez López',
    nombres: 'Juan Carlos',
    fechaNacimiento: '2013-07-15',
    edad: 12,
    sexo: 'M',
    lugarNacimiento: 'Caracas',
    entidadFederal: 'Distrito Capital',
    municipio: 'Libertador',
    parroquia: null,
    apreciacionCualitativa: 'si',
    repitiente: 'no',
  }

  const datosFamiliares = {
    nombrePadre: 'Carlos Pérez',
    cedulaPadre: 'V-87654321',
    telefonoPadre: '0414-1234567',

    nombreMadre: 'María López',
    cedulaMadre: 'V-56781234',
    telefonoMadre: '0424-7654321',

    viveCon: ['padre', 'madre'],
  }

  const datosRepresentante = {
    apellidosRepresentante: 'Pérez López',
    nombresRepresentante: 'Carlos Alberto',
    cedulaRepresentante: 'V-87654321',
    edadRepresentante: 45,
    fechaNacimientoRepresentante: '1980-03-20',
    estadoCivilRepresentante: 'casado',
    nexoEstudiante: 'padre',
    direccionHabitacion: 'Av. Principal, Caracas',
    telefonoCasa: null,
    telefonoCelular: '0414-1234567',
    profesion: 'Ingeniero',
    lugarTrabajo: 'Empresa XYZ',
    telefonoTrabajo: '0212-1234567',
  }

  const datosFisicos = {
    peso: 45.5,
    estatura: 1.52,
    tallaCamisa: '12',
    tallaPantalon: '12',
    tallaZapato: '36',
    enfermedad: '',
    tieneHermanos: 'si',
    cuantosHermanos: 2,
    gradosHermanos: '1° y 4° grado',
    personasAutorizadas: [
      {
        nombreApellido: 'Ana Pérez',
        cedula: 'V-11223344',
        parentesco: 'Hermana',
      },
      {
        nombreApellido: 'Luis Gómez',
        cedula: 'V-55667788',
        parentesco: 'Tío',
      },
    ],
  }

  return (
    <CContainer>
      <h2 className="mb-4 text-center">Detalle Estudiante</h2>

      <CNav variant="tabs" role="tablist" className="mb-4">
        <CNavItem>
          <CNavLink
            href="#"
            active={activeTab === 'datosGenerales'}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('datosGenerales')
            }}
          >
            Datos Generales
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="#"
            active={activeTab === 'datosPersonales'}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('datosPersonales')
            }}
          >
            Datos Personales
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="#"
            active={activeTab === 'datosFamiliares'}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('datosFamiliares')
            }}
          >
            Datos Familiares
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="#"
            active={activeTab === 'datosRepresentante'}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('datosRepresentante')
            }}
          >
            Representante
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="#"
            active={activeTab === 'datosFisicos'}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab('datosFisicos')
            }}
          >
            Datos Físicos
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <CTabPane visible={activeTab === 'datosGenerales'}>
          <CTable striped bordered hover>
            <CTableBody>
              {Object.entries(datosGenerales).map(([label, val]) => (
                <CTableRow key={label}>
                  <CTableHeaderCell style={{ width: '40%' }}>{label}</CTableHeaderCell>
                  <CTableDataCell>{val || '-'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CTabPane>

        <CTabPane visible={activeTab === 'datosPersonales'}>
          <CTable striped bordered hover>
            <CTableBody>
              {Object.entries(datosPersonales).map(([label, val]) => (
                <CTableRow key={label}>
                  <CTableHeaderCell style={{ width: '40%' }}>{label}</CTableHeaderCell>
                  <CTableDataCell>{val || '-'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CTabPane>

        <CTabPane visible={activeTab === 'datosFamiliares'}>
          <CTable striped bordered hover>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Nombre Padre</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.nombrePadre || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Cédula Padre</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.cedulaPadre || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Teléfono Padre</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.telefonoPadre || '-'}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Nombre Madre</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.nombreMadre || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Cédula Madre</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.cedulaMadre || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Teléfono Madre</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.telefonoMadre || '-'}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Vive con</CTableHeaderCell>
                <CTableDataCell>{datosFamiliares.viveCon.join(', ')}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CTabPane>

        <CTabPane visible={activeTab === 'datosRepresentante'}>
          <CTable striped bordered hover>
            <CTableBody>
              {Object.entries(datosRepresentante).map(([label, val]) => (
                <CTableRow key={label}>
                  <CTableHeaderCell style={{ width: '40%' }}>{label}</CTableHeaderCell>
                  <CTableDataCell>{val || '-'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CTabPane>

        <CTabPane visible={activeTab === 'datosFisicos'}>
          <CTable striped bordered hover>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Peso (Kg)</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.peso}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Estatura (m)</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.estatura}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Talla Camisa</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.tallaCamisa}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Talla Pantalón</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.tallaPantalon}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Talla Zapato</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.tallaZapato}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Enfermedad</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.enfermedad || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Tiene Hermanos</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.tieneHermanos}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Cantidad de Hermanos</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.cuantosHermanos}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Grados de Hermanos</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.gradosHermanos || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Personas Autorizadas</CTableHeaderCell>
                <CTableDataCell>
                  {datosFisicos.personasAutorizadas.map((persona, i) => (
                    <div key={i}>
                      <strong>{persona.nombreApellido}</strong> — {persona.parentesco} (Cédula:{' '}
                      {persona.cedula})
                    </div>
                  ))}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CTabPane>
      </CTabContent>
    </CContainer>
  )
}

export default matriculaInfo
