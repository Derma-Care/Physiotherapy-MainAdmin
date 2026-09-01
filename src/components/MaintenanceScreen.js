import React, { useState, useEffect } from 'react'
import { Loader2, Wrench, Hammer } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../baseUrl'

const MaintenanceScreen = () => {
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    // Poll the backend to check if it's back up.
    // Stay on the maintenance screen ONLY while the server responds with
    // 502 (Bad Gateway) or 503 (Service Unavailable). Any other outcome —
    // a successful response, 404, any other status code, or a network
    // error — means the server isn't in maintenance, so reload immediately.
    const interval = setInterval(async () => {
      try {
        await axios.get(BASE_URL, { timeout: 5000 })
        // Request succeeded — server is up.
        window.location.reload()
      } catch (error) {
        const status = error.response?.status
        const isUnderMaintenance = status === 502 || status === 503

        if (!isUnderMaintenance) {
          // Not a maintenance-related status (e.g. 404, 401, 500, or a
          // network error) — treat the server as reachable/back up.
          window.location.reload()
        }
        // Still down (502/503) — keep monitoring, do nothing.
      }
    }, 10000) // check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleManualReload = () => {
    setIsMonitoring(true)
    window.location.reload()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111827', // Dark navy background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Tools Icon Area */}
        <div
          style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          {/* We'll use a styled container to approximate the 3D tools look */}
          <div
            style={{
              position: 'absolute',
              transform: 'rotate(-45deg)',
              background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Wrench size={32} color="#1e293b" />
          </div>
          <div
            style={{
              position: 'absolute',
              transform: 'rotate(45deg)',
              background: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)',
              padding: '12px',
              borderRadius: '12px',
              mixBlendMode: 'hard-light',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Hammer size={32} color="#111827" />
          </div>
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: 0,
            color: '#f8fafc',
            letterSpacing: '-0.02em',
          }}
        >
          System Under Maintenance
        </h1>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#cbd5e1',
            margin: 0,
            maxWidth: '540px',
          }}
        >
          We are currently performing important updates to improve your experience. Our system is
          monitoring the status and will automatically reload this page as soon as the maintenance
          is complete.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '8px',
            color: '#60a5fa',
          }}
        >
          <Loader2
            size={20}
            className="lucide-spin"
            style={{ animation: 'spin 2s linear infinite' }}
          />
          <span style={{ fontSize: '15px', color: 'white' }}>Monitoring systems...</span>
        </div>

        <button
          onClick={handleManualReload}
          style={{
            marginTop: '16px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          Manual Reload
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default MaintenanceScreen