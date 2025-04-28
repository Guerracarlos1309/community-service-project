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
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Administracion',
  },

  {
    component: CNavGroup,
    name: 'Registro Estudiantil',
    items: [
      {
        component: CNavItem,
        name: 'Registro Educacion inicial',
        to: '/registro',
      },
      {
        component: CNavItem,
        name: 'Registrar 1er grado',
        to: '/registro/1er-grado',
      },
    ],
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
    name: 'Representantes',
    to: '/representantes ',
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
