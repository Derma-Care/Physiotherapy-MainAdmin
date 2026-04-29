import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Logo from './header/Kinetix.jpg.jpeg'

import {
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import './sidebar.css'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      style={{ backgroundColor: '#1B4F8A' }}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader
        style={{
          backgroundColor: '#1B4F8A',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          padding: '20px 16px 16px',
        }}
      >
        {/* Logo Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* White card behind logo */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '10px',
              width: '90px',
              height: '90px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <img
              src={Logo}
              alt="Kinetix Wellness Care Logo"
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'contain',
                borderRadius: '6px',
              }}
            />
          </div>

          {/* Brand Name */}
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '18px',
                color: '#ffffff',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '0.3px',
                lineHeight: '1.3',
              }}
            >
              Kinetix Wellness Care
            </h1>
           
          </div>

          {/* Decorative divider */}
          <div
            style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, #f9c571, transparent)',
              borderRadius: '2px',
            }}
          />
        </div>
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter
        className="border-top d-none d-lg-flex"
        style={{
          backgroundColor: '#1B4F8A',
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
          style={{ color: '#ffffff' }}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)