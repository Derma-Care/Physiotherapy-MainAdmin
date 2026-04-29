import React from 'react'
import { CCol, CRow } from '@coreui/react'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h4 style={{
          color: '#1B4F8A',
          fontWeight: '700',
          fontSize: '20px',
          margin: '0 0 2px 0',
          letterSpacing: '0.3px'
        }}>
          Welcome back 👋
        </h4>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
          Here's what's happening with your platform today.
        </p>
      </div>

      <WidgetsDropdown className="mb-4" />
      <WidgetsBrand className="mb-4" withCharts />
    </div>
  )
}

export default Dashboard