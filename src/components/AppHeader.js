import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilAccountLogout } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0"
      ref={headerRef}
      style={{ backgroundColor: '#1a3a6b', minHeight: '56px', height: '56px' }}
    >
      <CContainer className="px-4" fluid style={{ height: '100%', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px', color: '#ffffff', fontWeight: 'bold', marginRight: '10px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <AppBreadcrumb />

        <CHeaderNav className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 'normal', fontSize: '14px', marginRight: '16px', whiteSpace: 'nowrap' }}>Super Admin</span>
          <span 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            style={{ 
              color: '#fff', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'background-color 0.2s ease'
            }}
            title="Logout"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <CIcon icon={cilAccountLogout} size="lg" />
          </span>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader