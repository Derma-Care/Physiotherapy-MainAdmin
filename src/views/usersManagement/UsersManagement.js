import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const UsersManagement = () => {
  return (
    <CCard className="mb-4 shadow-sm border-0">
      <CCardHeader className="bg-white pt-4 pb-3">
        <h5 className="mb-0 fw-bold">Users Management</h5>
      </CCardHeader>
      <CCardBody>
        <p className="text-muted">Manage global portal users, permissions, and session access.</p>
        <div className="alert alert-info border-0">
          <strong>Dummy Data loaded.</strong> User management endpoints are temporarily offline.
        </div>
      </CCardBody>
    </CCard>
  )
}

export default UsersManagement
