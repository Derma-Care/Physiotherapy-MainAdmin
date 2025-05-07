import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Logo from './header/derma2.png'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <div to="/">
          <div className="d-flex justify-content-center">
            <img
              src={Logo}
              alt="DermaCare Logo"
              style={{ width: '80px', height: '80px', marginBottom: '0px', marginLeft: '30px' }}
            />
          </div>
          <div
            className="d-flex justify-content-center underline-none"
            style={{ marginLeft: '20px' }}
          >
            <h1 style={{ color: '#A020F0', fontSize: '30px' }}>Derma</h1>
            <h1 style={{ color: '#ffffff', fontSize: '30px' }}>Care</h1>
          </div>
        </div>
        {/* <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        /> */}
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
