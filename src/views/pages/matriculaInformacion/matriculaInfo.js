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
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Tipo de Ingreso</CTableHeaderCell>
                <CTableDataCell>{datosGenerales.tipoIngreso || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Nivel: </CTableHeaderCell>
                <CTableDataCell>{datosGenerales.nivel || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Grado</CTableHeaderCell>
                <CTableDataCell>{datosGenerales.grado || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>seccion</CTableHeaderCell>
                <CTableDataCell>{datosGenerales.seccion || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Fecha de inscripcion </CTableHeaderCell>
                <CTableDataCell>{datosGenerales.fechaInscripcion || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Plantel de Procedencia</CTableHeaderCell>
                <CTableDataCell>{datosGenerales.plantelProcedencia || '-'}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CTabPane>

        <CTabPane visible={activeTab === 'datosPersonales'}>
          <CTable striped bordered hover>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>Cédula Escolar</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.cedulaEscolar || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Apellidos</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.apellidos || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Nombres</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.nombres || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.fechaNacimiento || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Edad</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.edad || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Sexo</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.sexo || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Lugar de Nacimiento</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.lugarNacimiento || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Entidad Federal</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.entidadFederal || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Municipio</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.municipio || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Parroquia</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.parroquia || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Apreciación Cualitativa</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.apreciacionCualitativa || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Repitiente</CTableHeaderCell>
                <CTableDataCell>{datosPersonales.repitiente || '-'}</CTableDataCell>
              </CTableRow>
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
              <CTableRow>
                <CTableHeaderCell style={{ width: '40%' }}>
                  Apellidos Representante
                </CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.apellidosRepresentante || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Nombres Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.nombresRepresentante || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Cédula Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.cedulaRepresentante || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Edad Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.edadRepresentante || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Fecha Nacimiento Representante</CTableHeaderCell>
                <CTableDataCell>
                  {datosRepresentante.fechaNacimientoRepresentante || '-'}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Estado Civil Representante</CTableHeaderCell>
                <CTableDataCell>
                  {datosRepresentante.estadoCivilRepresentante || '-'}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Nexo del Estdiante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.nexoEstudiante || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Direccion de habitacion del Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.direccionHabitacion || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Telefono de casa del Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.telefonoCasa || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Telefono celular del Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.telefonoCelular || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Profesion del Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.profesion || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Lugar de trabajo del Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.lugarTrabajo || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Telefono del trabajo del Representante</CTableHeaderCell>
                <CTableDataCell>{datosRepresentante.telefonoTrabajo || '-'}</CTableDataCell>
              </CTableRow>
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
                <CTableHeaderCell>Talla de Camisa</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.tallaCamisa}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Talla de Pantalón</CTableHeaderCell>
                <CTableDataCell>{datosFisicos.tallaPantalon}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Talla de Zapato</CTableHeaderCell>
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
