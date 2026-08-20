import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import routes from '../routes'
import { CBreadcrumb, CBreadcrumbItem, CButton } from '@coreui/react'
import { ArrowLeft } from 'lucide-react'
import { COLORS } from '../Constant/Themes'

const AppBreadcrumb = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ Route Name
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  // ✅ Breadcrumbs
  const getBreadcrumbs = (pathname) => {
    const breadcrumbs = []
    pathname.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        })
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(location.pathname)

  // ✅ Back Button Condition
  const showBackButton =
    location.pathname.startsWith('/employee-management') &&
    location.pathname !== '/employee-management'

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/branch-details')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}
    >
      {/* 🔹 LEFT - Breadcrumb */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <CBreadcrumb
          className="my-0"
          style={{
            marginBottom: 0,

            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '--cui-breadcrumb-divider-color': COLORS.white,
          }}
        >
          <CBreadcrumbItem
            style={{
              cursor: 'pointer',
              color: COLORS.white,

              textDecoration: 'none',
            }}
            onClick={() => navigate('/dashboard')}
          >
            Home
          </CBreadcrumbItem>

          {breadcrumbs.map((b, idx) => (
            <CBreadcrumbItem
              key={idx}
              style={{
                color: COLORS.white,
                cursor: b.active ? 'default' : 'pointer',

                textDecoration: 'none',
              }}
              {...(b.active ? { active: true } : { onClick: () => navigate(b.pathname) })}
            >
              {b.name}
            </CBreadcrumbItem>
          ))}
        </CBreadcrumb>
      </div>

      {/* 🔹 RIGHT - Back */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        {/* Back Button */}
        {showBackButton && (
          <CButton
            size="sm"
            onClick={handleBack}
            style={{
              backgroundColor: '#f9c571',
              color: '#1a3a6b',
              border: 'none',
              fontWeight: '600',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
            }}
          >
            <ArrowLeft size={14} />
            Back
          </CButton>
        )}
      </div>
    </div>
  )
}

export default React.memo(AppBreadcrumb)
