import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const SupportCenter = () => {
  return (
    <CCard className="mb-4 shadow-sm border-0">
      <CCardHeader className="bg-white pt-4 pb-3">
        <h5 className="mb-0 fw-bold">Support Center</h5>
      </CCardHeader>
      <CCardBody>
        <p className="text-muted">Review support tickets and help requests from clinics.</p>
        <div className="alert alert-info border-0">
          <strong>Dummy Data loaded.</strong> No active support tickets available.
        </div>
      </CCardBody>
    </CCard>
  )
}

export default SupportCenter
