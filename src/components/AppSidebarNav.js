import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const navLink = (name, icon, badge, indent = false, isActive = false) => {
    return (
      <>
        {icon
          ? React.cloneElement(icon, {
              style: { color: isActive ? '#1B4F8A' : '#ffffff', fontSize: '14px' },
            })
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...rest}
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#f9c571' : 'transparent',
              color: isActive ? '#1B4F8A' : '#ffffff',
              borderRadius: '8px',
              margin: '1px 8px',
              fontWeight: isActive ? '700' : '400',
              fontSize: '13px',
              padding: '6px 10px',
              transition: 'background-color 0.2s ease, color 0.2s ease',
            })}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      <style>{`
        .simplebar-content .nav-link {
          color: #ffffff !important;
          border-radius: 8px;
          margin: 1px 8px;
          font-size: 13px !important;
          padding: 6px 10px !important;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .simplebar-content .nav-link:hover:not(.active) {
          background-color: rgba(249, 197, 113, 0.2) !important;
          color: #ffffff !important;
        }
        .simplebar-content .nav-link.active {
          background-color: #f9c571 !important;
          color: #1B4F8A !important;
          font-weight: 700 !important;
        }
        .simplebar-content .nav-group-toggle {
          color: #ffffff !important;
          border-radius: 8px;
          margin: 1px 8px;
          font-size: 13px !important;
          padding: 6px 10px !important;
        }
        .simplebar-content .nav-group-toggle:hover {
          background-color: rgba(249, 197, 113, 0.2) !important;
          color: #ffffff !important;
        }
        .simplebar-content .nav-group.show > .nav-group-toggle {
          background-color: rgba(249, 197, 113, 0.15) !important;
          color: #ffffff !important;
        }
        .simplebar-content .nav-group.show {
          background-color: transparent !important;
        }
        .simplebar-content .nav-icon {
          width: 1.2rem !important;
          height: 1.2rem !important;
        }
        .simplebar-content .nav-icon svg {
          width: 14px !important;
          height: 14px !important;
        }
      `}</style>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}