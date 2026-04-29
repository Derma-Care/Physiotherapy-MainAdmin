import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import routes from '../routes'
import { CBreadcrumb, CBreadcrumbItem, CButton } from '@coreui/react'
import { ArrowLeft } from 'lucide-react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
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

  const breadcrumbs = getBreadcrumbs(currentLocation)

  const showBackButton =
    currentLocation.startsWith('/employee-management') &&
    currentLocation !== '/employee-management'

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/branch-details')
    }
  }

  return (
    <>
      <style>{`
        .custom-breadcrumb .breadcrumb-item a {
          color: #fff !important;
          text-decoration: underline !important;
          font-size: 13px;
          font-weight: 500;
        }
        .custom-breadcrumb .breadcrumb-item a:hover {
          color: #ffffff !important;
        }
        .custom-breadcrumb .breadcrumb-item.active {
          color: #ffffff !important;
          font-weight: 600;
          font-size: 13px;
        }
        .custom-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>

      <div
        className="d-flex justify-content-between align-items-center"
        style={{ width: '100%' }}
      >
        {/* Breadcrumb Section */}
        <CBreadcrumb className="my-0 custom-breadcrumb">
          <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
          {breadcrumbs.map((breadcrumb, index) => (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          ))}
        </CBreadcrumb>

        {/* Back Button */}
        {showBackButton && (
          <CButton
            size="sm"
            onClick={handleBack}
            style={{
              backgroundColor: '#f9c571',
              color: '#1B4F8A',
              border: 'none',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '5px 14px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <ArrowLeft size={14} />
            Back
          </CButton>
        )}
      </div>
    </>
  )
}

export default React.memo(AppBreadcrumb)