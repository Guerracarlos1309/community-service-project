import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
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
  },
  {
    component: CNavItem,
    name: 'Brigada Estudiantil',
    to: '/brigadas',
  },
  {
    component: CNavTitle,
    name: 'Personal',
  },
  {
    component: CNavItem,
    name: 'Matricula Estudiantil',
    to: '/matricula',
  },
  {
    component: CNavItem,
    name: 'Docentes',
    to: '/docentes ',
  },

  {
    component: CNavTitle,
    name: 'Personal',
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/users',
  },
]

export default _nav
