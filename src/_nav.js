import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cibMyspace,
  cibVerizon,
  cilBook,
  cilEducation,
  cilMedicalCross,
  cilNotes,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'INFO JGM',
    },
  },
  {
    component: CNavTitle,
    name: 'Administracion',
  },

  {
    component: CNavItem,
    name: 'Registro Estudiantil',
    to: '/registro',
    icon: <CIcon icon={cibVerizon} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Brigada Estudiantil',
    to: '/brigadas',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Personal',
  },
  {
    component: CNavItem,
    name: 'Matricula Estudiantil',
    to: '/matricula',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Docentes',
    to: '/docentes ',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Personal',
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/users',
    icon: <CIcon icon={cibMyspace} customClassName="nav-icon" />,
  },
]

export default _nav
