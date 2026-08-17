import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const SubscriptionManagement = () => {
  return (
    <CCard className="mb-4 shadow-sm border-0">
      <CCardHeader className="bg-white pt-4 pb-3">
        <h5 className="mb-0 fw-bold">Subscription Management</h5>
      </CCardHeader>
      <CCardBody>
        <p className="text-muted">Manage active subscriptions and billing plans across all clinics here.</p>
        <div className="alert alert-info border-0">
          <strong>Dummy Data loaded.</strong> API integration for subscriptions is currently disabled.
        </div>
      </CCardBody>
    </CCard>
  )
}

export default SubscriptionManagement
