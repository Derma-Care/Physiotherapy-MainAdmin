import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { CButton, CForm, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilLockUnlocked } from '@coreui/icons'
import Logo from '../../../assets/images/DermaCareNoBG.png'
import BgImage from '../../../assets/images/physiotherapy_bg.png'
import { BASE_URL, endPoint } from '../../../baseUrl'
import { COLORS } from '../../../Constant/Themes'

export default function LoginPage() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userName && !password) {
      setErrorMessage('Username and password are required.')
      return
    }
    if (!userName) {
      setErrorMessage('Username is required.')
      return
    }
    if (!password) {
      setErrorMessage('Password is required.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = { userName, password }
      const response = await axios.post(`${BASE_URL}/${endPoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        localStorage.setItem('userName', userName)
        localStorage.setItem('authentication', true)
        navigate(from, { replace: true })
      } else {
        setErrorMessage(response.data || 'Invalid login credentials.')
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'An unexpected error occurred.'
      const lowerMessage = backendMessage.toLowerCase()

      if (
        lowerMessage.includes('both') ||
        (lowerMessage.includes('username') && lowerMessage.includes('password'))
      ) {
        setErrorMessage('Both Username and Password are Invalid.')
      } else if (lowerMessage.includes('username')) {
        setErrorMessage('Invalid username.')
      } else if (lowerMessage.includes('password')) {
        setErrorMessage('Invalid password.')
      } else {
        setErrorMessage(backendMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row bg-white">
      <style>{`
        .bg-panel {
          background-image: url(${BgImage});
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
         
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .left-content {
          position: relative;
          z-index: 1;
        }
        .auth-form-wrapper {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
        }
        .custom-input {
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }
        .custom-btn {
          padding: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        .custom-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }
        .left-col {
          width: 100%;
          min-height: 40vh;
        }
        .right-col {
          width: 100%;
        }
        @media (min-width: 992px) {
          .left-col {
            width: 50%;
            min-height: 100vh;
          }
          .right-col {
            width: 50%;
          }
        }
      `}</style>

      {/* Left Panel - Branding & Image */}
      <div
        className="left-col bg-panel d-flex flex-column justify-content-center align-items-center text-white p-5 shadow-lg"
        style={{ zIndex: 10 }}
      >
        <div className="bg-overlay"></div>
        <div className="left-content text-center d-flex flex-column align-items-center">
          <div
            className="bg-white rounded-circle shadow p-3 mb-4 d-flex align-items-center justify-content-center"
            style={{ width: '120px', height: '120px' }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
          <h2 className="display-4 fw-bold mb-2  " style={{ color: COLORS.primary }}>
            PhysioElite
          </h2>
          <p className="lead mb-4 opacity-75  " style={{ color: COLORS.primary }}>
            Chiselon Clinic Management Suite
          </p>
          <p
            className="small w-75 opacity-75 d-none d-md-block  "
            style={{ lineHeight: '1.6', color: COLORS.primary }}
          >
            Empowering clinics with state-of-the-art tools for efficient management, seamless
            coordination, and exceptional patient experiences.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="right-col d-flex align-items-center justify-content-center p-4 p-sm-5 bg-white">
        <div className="auth-form-wrapper">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Welcome Back</h2>
            <p className="text-muted">Please sign in to your account</p>
          </div>

          <CForm onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="alert alert-danger border-0 shadow-sm rounded-3 py-2 text-center mb-4">
                {errorMessage}
              </div>
            )}

            <CInputGroup className="mb-4 shadow-sm rounded-3 overflow-hidden">
              <CInputGroupText className="bg-light border-0 px-3">
                <CIcon icon={cilUser} className="text-primary" />
              </CInputGroupText>
              <CFormInput
                className="border-0 custom-input bg-light"
                placeholder="Username"
                autoComplete="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ boxShadow: 'none' }}
              />
            </CInputGroup>

            <CInputGroup className="mb-4 shadow-sm rounded-3 overflow-hidden">
              <CInputGroupText
                className="bg-light border-0 px-3"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                <CIcon
                  icon={showPassword ? cilLockUnlocked : cilLockLocked}
                  className="text-primary"
                />
              </CInputGroupText>
              <CFormInput
                className="border-0 custom-input bg-light"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ boxShadow: 'none' }}
              />
            </CInputGroup>

            <div className="d-grid mt-5">
              <CButton
                color="primary"
                type="submit"
                className="custom-btn rounded-3 text-uppercase"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Login Securely'}
              </CButton>
            </div>

            <div className="text-center mt-5">
              <small className="text-muted">Protected Clinic Access</small>
            </div>
          </CForm>
        </div>
      </div>
    </div>
  )
}
