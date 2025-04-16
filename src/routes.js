import React from 'react'

const dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const users = React.lazy(() => import('./views/pages/user/user.js'))
const registro = React.lazy(() => import('./views/pages/registro/registro.js'))
const matricula = React.lazy(() => import('./views/pages/matricula/matricula.js'))
const brigadas = React.lazy(() => import('./views/pages/brigada/brigada.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: dashboard },
  { path: '/users', name: 'Usuarios', element: users },
  { path: '/registro', name: 'Register', element: registro },
  { path: '/matricula', name: 'Matricula', element: matricula },
  { path: '/brigadas', name: 'Brigadas', element: brigadas },
]

export default routes
