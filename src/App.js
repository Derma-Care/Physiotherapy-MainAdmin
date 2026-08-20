import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute'
import Logo from './assets/images/DermaCareNoBG.png'
import MaintenanceScreen from './components/MaintenanceScreen'

// ✅ Import HospitalProvider
// import { HospitalProvider } from './Usecontext/HospitalContext'

// Lazy-loaded components
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// import ProtectedRoute from './components/ProtectedRoute'
import { injectTheme } from './Constant/Themes'
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)

  useEffect(() => {
    const handleMaintenance = () => setIsMaintenanceMode(true)
    window.addEventListener('maintenance-mode', handleMaintenance)
    return () => window.removeEventListener('maintenance-mode', handleMaintenance)
  }, [])

  useEffect(() => {
    injectTheme()
  }, [])
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [storedTheme, isColorModeSet, setColorMode])

  if (isMaintenanceMode) {
    return <MaintenanceScreen />
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Suspense
        fallback={
          <div
            className="pt-3 text-center"
            style={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: '120px', animation: 'pulseLogo 2s infinite' }}
            />
            <style>
              {`
                @keyframes pulseLogo {
                  0% { transform: scale(0.95); opacity: 0.8; }
                  50% { transform: scale(1.05); opacity: 1; }
                  100% { transform: scale(0.95); opacity: 0.8; }
                }
              `}
            </style>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/Dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
