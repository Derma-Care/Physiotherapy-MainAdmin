import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const AuditLogs = () => {
  return (
    <CCard className="mb-4 shadow-sm border-0">
      <CCardHeader className="bg-white pt-4 pb-3">
        <h5 className="mb-0 fw-bold">Audit Logs</h5>
      </CCardHeader>
      <CCardBody>
        <p className="text-muted">System activity and user access logs.</p>
        <div className="alert alert-info border-0">
          <strong>Dummy Data loaded.</strong> Live log streaming is paused.
        </div>
      </CCardBody>
    </CCard>
  )
}

export default AuditLogs
