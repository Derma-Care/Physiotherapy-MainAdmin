import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const Reports = () => {
  return (
    <CCard className="mb-4 shadow-sm border-0">
      <CCardHeader className="bg-white pt-4 pb-3">
        <h5 className="mb-0 fw-bold">Reports</h5>
      </CCardHeader>
      <CCardBody>
        <p className="text-muted">Export and generate administrative and clinic-level reports.</p>
        <div className="alert alert-info border-0">
          <strong>Dummy Data loaded.</strong> Report generation services are temporarily offline.
        </div>
      </CCardBody>
    </CCard>
  )
}

export default Reports
