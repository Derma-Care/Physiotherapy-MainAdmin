import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { COLORS } from '../Constant/Themes'


export const AppSidebarNav = ({ items }) => {
  const location = useLocation()

  // 🔹 Common Nav Content
  const navLink = (name, icon, badge, indent = false, isActive = false) => {
    return (
      <>
        {icon
          ? React.cloneElement(icon, {
              style: {
                ...icon.props.style,
                color: isActive ? COLORS.bgcolor : COLORS.white,
                fontSize: '16px', // ✅ bigger icon
              },
            })
          : indent && (
              <span className="nav-icon">
                <span
                  className="nav-icon-bullet"
                  style={{
                    backgroundColor: isActive ? COLORS.bgcolor : COLORS.white,
                  }}
                />
              </span>
            )}

        <span
          title={name}
          style={{
            color: isActive ? COLORS.bgcolor : COLORS.white,
            fontWeight: isActive ? '600' : '500',
            fontSize: '14px', // ✅ bigger text
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </span>

        {badge && (
          <CBadge
            className="ms-auto"
            size="sm"
            style={{
              backgroundColor: COLORS.orange,
              color: COLORS.white,
              fontWeight: '600',
            }}
          >
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  // 🔹 Single Item
  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component

    const isActive = location.pathname === rest.to

    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...rest}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: '4px 10px',
              borderRadius: '10px',
              padding: '10px 8px',
              backgroundColor: isActive ? COLORS.orange : 'transparent',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            {navLink(name, icon, badge, indent, isActive)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent, isActive)
        )}
      </Component>
    )
  }

  // 🔹 Group Item
  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component

    const isActive = location.pathname.startsWith(to || '')

    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon, null, false, isActive)}
        style={{
          backgroundColor: isActive ? COLORS.orange : 'transparent',
          borderRadius: '10px',
          margin: '4px 10px',
        }}
        {...rest}
      >
        {items?.map((child, idx) =>
          child.items ? navGroup(child, idx) : navItem(child, idx, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav
      as={SimpleBar}
      style={{
        backgroundColor: COLORS.bgcolor,
        paddingTop: '8px',
        paddingBottom: '8px',
      }}
    >
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default AppSidebarNav