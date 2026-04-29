import React from 'react'
import { CSpinner } from '@coreui/react'

const LoadingIndicator = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: fullScreen ? '100vh' : '50vh',
        color: '#1a3a6b',   // ✅ your color
        textAlign: 'center',
      }}
    >
      <CSpinner size="sm" className="mb-2" style={{ color: '#1a3a6b' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 ,color: '#1a3a6b'}}>
        {message}
      </span>
    </div>
  )
}

export default LoadingIndicator