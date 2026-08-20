import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
        <AppHeader />
        <div className="body flex-grow-1" style={{ overflowY: 'auto' }}>
          <AppContent />
        </div>
        <div style={{ flexShrink: 0 }}>
          <AppFooter />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
