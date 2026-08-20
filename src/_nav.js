import React from 'react'
import { CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilChartLine,
  cilCalendar,
  cilHospital,
  cilSettings,
  cilBell,
  cilWallet,
  cibGoogleAds,
  cilLayers,
  cilSitemap,
  cilCreditCard,
  cilPeople,
  cilDescription,
  cilLifeRing,
  cilNotes,
} from '@coreui/icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Server Management',
    to: '/server-management',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Clinic Management',
    to: '/clinic-Management',
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Branch Management',
    to: '/branchManagement',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subscription Management',
    to: '/subscription-management',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users Management',
    to: '/users-management',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Appointment Management',
  //   to: '/appointment-management',
  //   icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/reports',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payments',
    to: '/payouts',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Notifications',
    to: '/push-Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Audit Logs',
    to: '/audit-logs',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/feature-management',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ads Management',
    to: '/ads-management',
    icon: <CIcon icon={cibGoogleAds} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Support Center',
    to: '/support-center',
    icon: <CIcon icon={cilLifeRing} customClassName="nav-icon" />,
  },
]

export default _nav
