import React from 'react'

const dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const users = React.lazy(() => import('./views/pages/user/user.js'))
const registro = React.lazy(() => import('./views/pages/registro/registro.js'))
const matricula = React.lazy(() => import('./views/pages/matricula/matricula.js'))
const brigadas = React.lazy(() => import('./views/pages/brigada/brigada.js'))
const docente = React.lazy(() => import('./views/pages/docente/docente.js'))
const login = React.lazy(() => import('./views/pages/login/Login.js'))
const register = React.lazy(() => import('./views/pages/register/Register.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: dashboard },
  { path: '/users', name: 'Usuarios', element: users },
  { path: '/registro', name: 'Registro', element: registro },
  { path: '/matricula', name: 'Matricula', element: matricula },
  { path: '/brigadas', name: 'Brigadas', element: brigadas },
  { path: '/docentes', name: 'Docentes', element: docente },
  { path: '/login', name: 'Login', element: login },
  { path: '/register', name: 'Register', element: register },
]

export default routes
