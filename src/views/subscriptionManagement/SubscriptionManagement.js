import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPopover,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Crown,
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronRight as ChevronRightSm,
  TrendingUp,
  FileText,
  Bell,
  Plus,
} from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import { COLORS } from '../../Constant/Themes'

const subscriptions = [
  {
    id: 1,
    clinicName: 'Skin Care Center',
    clinicId: 'CLN001',
    plan: 'Premium',
    type: '1 Year',
    server: 'Server 1',
    startDate: '15 May 2025',
    expiryDate: '15 Jun 2025',
    status: 'Active',
    amount: '₹24,999',
    logo: 'https://ui-avatars.com/api/?name=Skin+Care&background=fecaca&color=dc2626',
  },
  {
    id: 2,
    clinicName: 'Health Plus Clinic',
    clinicId: 'CLN002',
    plan: 'Standard',
    type: 'Monthly',
    server: 'Server 1',
    startDate: '02 May 2025',
    expiryDate: '02 Jun 2025',
    status: 'Expiring Soon',
    amount: '₹14,999',
    logo: 'https://ui-avatars.com/api/?name=Health+Plus&background=bbf7d0&color=16a34a',
  },
  {
    id: 3,
    clinicName: 'Derma Solution',
    clinicId: 'CLN003',
    plan: 'Basic',
    type: 'Quarterly',
    server: 'Server 2',
    startDate: '28 Apr 2025',
    expiryDate: '28 May 2025',
    status: 'Active',
    amount: '₹9,999',
    logo: 'https://ui-avatars.com/api/?name=Derma+Solution&background=bfdbfe&color=2563eb',
  },
  {
    id: 4,
    clinicName: 'Aura Skin Clinic',
    clinicId: 'CLN004',
    plan: 'Premium',
    type: 'Half-Yearly',
    server: 'Server 3',
    startDate: '10 Apr 2025',
    expiryDate: '10 Jun 2025',
    status: 'Active',
    amount: '₹24,999',
    logo: 'https://ui-avatars.com/api/?name=Aura+Skin&background=fed7aa&color=ea580c',
  },
  {
    id: 5,
    clinicName: 'Glow Derma Care',
    clinicId: 'CLN005',
    plan: 'Standard',
    type: '2 Years',
    server: 'Server 3',
    startDate: '18 Mar 2025',
    expiryDate: '18 May 2025',
    status: 'Expired',
    amount: '₹14,999',
    logo: 'https://ui-avatars.com/api/?name=Glow+Derma&background=e9d5ff&color=9333ea',
  },
  {
    id: 6,
    clinicName: 'Rejuve Clinic',
    clinicId: 'CLN006',
    plan: 'Basic',
    type: '3 Years',
    server: 'Server 4',
    startDate: '12 Apr 2025',
    expiryDate: '12 May 2025',
    status: 'Expired',
    amount: '₹9,999',
    logo: 'https://ui-avatars.com/api/?name=Rejuve+Clinic&background=fecdd3&color=e11d48',
  },
  {
    id: 7,
    clinicName: 'Bright Skin Clinic',
    clinicId: 'CLN007',
    plan: 'Standard',
    type: '4 Years',
    server: 'Server 5',
    startDate: '05 May 2025',
    expiryDate: '05 Aug 2025',
    status: 'Active',
    amount: '₹14,999',
    logo: 'https://ui-avatars.com/api/?name=Bright+Skin&background=fef08a&color=ca8a04',
  },
  {
    id: 8,
    clinicName: 'Healthy Skin Hub',
    clinicId: 'CLN008',
    plan: 'Premium',
    type: '5 Years',
    server: 'Server 5',
    startDate: '01 May 2025',
    expiryDate: '01 Jun 2025',
    status: 'Expiring Soon',
    amount: '₹24,999',
    logo: 'https://ui-avatars.com/api/?name=Healthy+Skin&background=fbcfe8&color=db2777',
  },
  {
    id: 9,
    clinicName: 'Elite Derma',
    clinicId: 'CLN009',
    plan: 'Basic',
    type: '1 Year',
    server: 'Server 1',
    startDate: '10 May 2025',
    expiryDate: '10 Jun 2025',
    status: 'Active',
    amount: '₹9,999',
    logo: 'https://ui-avatars.com/api/?name=Elite+Derma&background=bfdbfe&color=2563eb',
  },
  {
    id: 10,
    clinicName: 'Clear Skin Clinic',
    clinicId: 'CLN010',
    plan: 'Premium',
    type: 'Quarterly',
    server: 'Server 2',
    startDate: '01 Apr 2025',
    expiryDate: '01 Jul 2025',
    status: 'Active',
    amount: '₹24,999',
    logo: 'https://ui-avatars.com/api/?name=Clear+Skin&background=fecaca&color=dc2626',
  },
]

const plans = [
  {
    name: 'Basic Plan',
    price: '₹9,999 / Year',
    clinics: '10 Clinics',
    features: 'Basic features, 1 Branch, Email Support',
    color: '#22c55e',
    bg: '#dcfce7',
    badgeBg: '#dcfce7',
    badgeColor: '#16a34a',
  },
  {
    name: 'Pro Plan',
    price: '₹14,999 / Year',
    clinics: 'Unlimited Clinics',
    features: 'All Basic features, Multiple Branches, Priority Support',
    color: '#3b82f6',
    bg: '#dbeafe',
    badgeBg: '#dbeafe',
    badgeColor: '#2563eb',
  },
  {
    name: 'Elite Plan',
    price: '₹24,999 / Year',
    clinics: 'Unlimited Clinics',
    features: 'All Standard features, Advanced Reports, 24/7 Support',
    color: '#a855f7',
    bg: '#f3e8ff',
    badgeBg: '#f3e8ff',
    badgeColor: '#9333ea',
  },
  {
    name: 'Enterprise Plan',
    price: 'Custom Pricing',
    clinics: 'Custom',
    features: 'All Premium features, Custom Integrations, Dedicated Support',
    color: '#f97316',
    bg: '#ffedd5',
    badgeBg: '#ffedd5',
    badgeColor: '#ea580c',
  },
]

const SubscriptionManagement = () => {
  const navigate = useNavigate()
  const plansScrollRef = useRef(null)
  const [plansList, setPlansList] = useState(plans)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [planToDeleteIndex, setPlanToDeleteIndex] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    clinics: '',
    features: '',
    theme: 'blue',
  })

  const handleAddPlan = () => {
    if (!formData.name || !formData.price) {
      alert('Please enter at least Plan Name and Price.')
      return
    }

    let themeColors = { color: '#3b82f6', bg: '#dbeafe', badgeBg: '#dbeafe', badgeColor: '#2563eb' }
    if (formData.theme === 'purple') {
      themeColors = { color: '#a855f7', bg: '#f3e8ff', badgeBg: '#f3e8ff', badgeColor: '#9333ea' }
    } else if (formData.theme === 'green') {
      themeColors = { color: '#22c55e', bg: '#dcfce7', badgeBg: '#dcfce7', badgeColor: '#16a34a' }
    } else if (formData.theme === 'orange') {
      themeColors = { color: '#f97316', bg: '#ffedd5', badgeBg: '#ffedd5', badgeColor: '#ea580c' }
    }

    const formattedPrice = formData.price.includes('₹')
      ? formData.price
      : `₹${Number(formData.price.replace(/,/g, '')).toLocaleString('en-IN')} / Year`

    const newPlan = {
      name: formData.name,
      price: formattedPrice,
      clinics: formData.clinics || 'Custom',
      features: formData.features || 'Standard Features',
      ...themeColors,
    }

    if (editIndex !== null) {
      const updated = [...plansList]
      updated[editIndex] = newPlan
      setPlansList(updated)
      setEditIndex(null)
    } else {
      setPlansList([...plansList, newPlan])
    }

    setShowAddModal(false)
    setFormData({ name: '', price: '', clinics: '', features: '', theme: 'blue' })
  }

  const handleEditPlan = (idx) => {
    const p = plansList[idx]
    let theme = 'blue'
    if (p.color === '#a855f7') theme = 'purple'
    if (p.color === '#22c55e') theme = 'green'
    if (p.color === '#f97316') theme = 'orange'
    setFormData({
      name: p.name,
      price: p.price.replace('₹', '').replace(' / Year', ''),
      clinics: p.clinics,
      features: p.features,
      theme,
    })
    setEditIndex(idx)
    setShowAddModal(true)
  }

  const handleDeletePlan = (idx) => {
    setPlanToDeleteIndex(idx)
    setIsDeleteModalVisible(true)
  }

  const confirmDeletePlan = () => {
    if (planToDeleteIndex !== null) {
      setPlansList(plansList.filter((_, i) => i !== planToDeleteIndex))
      setPlanToDeleteIndex(null)
      setIsDeleteModalVisible(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.clinicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPaginationPages = () => {
    let pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '…', totalPages]
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      } else {
        pages = [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages]
      }
    }
    return pages
  }

  const getPlanPill = (plan) => {
    switch (plan) {
      case 'Premium':
        return { bg: '#f3e8ff', color: '#9333ea' }
      case 'Standard':
        return { bg: '#dbeafe', color: '#2563eb' }
      case 'Basic':
        return { bg: '#dcfce7', color: '#16a34a' }
      default:
        return { bg: '#f3f4f6', color: '#4b5563' }
    }
  }

  const getServerPill = (server) => {
    const s = server.replace('Server ', '')
    const colors = [
      { bg: '#e0e7ff', color: '#4f46e5' },
      { bg: '#dbeafe', color: '#2563eb' },
      { bg: '#fef3c7', color: '#d97706' },
      { bg: '#dcfce7', color: '#16a34a' },
      { bg: '#fce7f3', color: '#db2777' },
    ]
    return colors[(parseInt(s) - 1) % colors.length] || colors[0]
  }

  const getStatusPill = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#dcfce7', color: '#16a34a' }
      case 'Expiring Soon':
        return { bg: '#ffedd5', color: '#ea580c' }
      case 'Expired':
        return { bg: '#fee2e2', color: '#dc2626' }
      default:
        return { bg: '#f3f4f6', color: '#4b5563' }
    }
  }

  return (
    <div style={{ background: 'transparent', padding: '0', minHeight: '100%' }}>
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '13px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => navigate('/')}
            >
              <Home size={12} /> Home
            </span>{' '}
            <ChevronRightSm size={14} />
            <span style={{ color: '#185fa5', fontWeight: '500' }}>Subscription Management</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              color: '#4b5563',
              outline: 'none',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search
              size={16}
              color="#9ca3af"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              placeholder="Search clinics, branches, servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(59,130,246,0.2)',
            }}
          >
            + Add Subscription Plan
          </button>
        </div>
      </div>

      {/* ── Top Stats Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={24} color="#9333ea" />
          </div>
          <div>
            <div
              style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}
            >
              Total Subscriptions
            </div>
            <div
              style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', lineHeight: '1.2' }}
            >
              85
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>All Plans</div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle size={24} color="#16a34a" />
          </div>
          <div>
            <div
              style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}
            >
              Active Subscriptions
            </div>
            <div
              style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', lineHeight: '1.2' }}
            >
              62
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>72.94% of total</div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#ffedd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={24} color="#ea580c" />
          </div>
          <div>
            <div
              style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}
            >
              Expiring Soon
            </div>
            <div
              style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', lineHeight: '1.2' }}
            >
              12
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>Next 30 days</div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <XCircle size={24} color="#dc2626" />
          </div>
          <div>
            <div
              style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}
            >
              Expired Subscriptions
            </div>
            <div
              style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', lineHeight: '1.2' }}
            >
              11
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>12.94% of total</div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign size={24} color="#4f46e5" />
          </div>
          <div>
            <div
              style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}
            >
              Monthly Revenue
            </div>
            <div
              style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', lineHeight: '1.2' }}
            >
              ₹18,75,430
            </div>
            <div
              style={{
                color: '#16a34a',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <TrendingUp size={12} /> 12.5%{' '}
              <span style={{ color: '#6b7280', fontWeight: '500' }}>vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top 50/50 Row ── */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'stretch',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <div
          style={{ flex: '0 0 40%', minWidth: '280px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Revenue Overview Chart */}
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
                Subscription Revenue Overview
              </h5>
              <select
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#4b5563',
                  outline: 'none',
                }}
              >
                <option>This Month</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>
                Total Revenue
              </div>
              <div style={{ color: '#1f2937', fontSize: '22px', fontWeight: '700' }}>
                ₹18,75,430
              </div>
              <div
                style={{
                  color: '#16a34a',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px',
                }}
              >
                <TrendingUp size={12} /> 12.5%{' '}
                <span style={{ color: '#6b7280', fontWeight: '500' }}>vs last month</span>
              </div>
            </div>
            <div
              style={{ height: '164px', position: 'relative', width: '100%', marginLeft: '24px' }}
            >
              <svg
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
                style={{ width: 'calc(100% - 24px)', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(147,51,234,0.3)" />
                    <stop offset="100%" stopColor="rgba(147,51,234,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 30 L20 40 L40 20 L60 35 L80 15 L100 10 L100 50 L0 50 Z"
                  fill="url(#gradient)"
                />
                <path
                  d="M0 30 L20 40 L40 20 L60 35 L80 15 L100 10"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx="0"
                  cy="30"
                  r="2"
                  fill="#fff"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx="20"
                  cy="40"
                  r="2"
                  fill="#fff"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx="40"
                  cy="20"
                  r="2"
                  fill="#fff"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx="60"
                  cy="35"
                  r="2"
                  fill="#fff"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx="80"
                  cy="15"
                  r="2"
                  fill="#fff"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx="100"
                  cy="10"
                  r="2"
                  fill="#fff"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* X Axis Labels */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: '-20px',
                  left: 0,
                  right: '24px',
                  fontSize: '9px',
                  color: '#9ca3af',
                  fontWeight: '500',
                }}
              >
                <span style={{ transform: 'translateX(-50%)' }}>01 May</span>
                <span style={{ transform: 'translateX(-50%)' }}>08 May</span>
                <span style={{ transform: 'translateX(-50%)' }}>15 May</span>
                <span style={{ transform: 'translateX(-50%)' }}>22 May</span>
                <span style={{ transform: 'translateX(-50%)' }}>29 May</span>
              </div>
              {/* Y Axis Labels */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: '0',
                  left: '-30px',
                  top: '0',
                  fontSize: '9px',
                  color: '#9ca3af',
                  fontWeight: '500',
                }}
              >
                <span>₹25L</span>
                <span>₹20L</span>
                <span>₹15L</span>
                <span>₹10L</span>
                <span>₹5L</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          {/* Subscription Plans Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
                Subscription Plans
              </h5>
              <span
                onClick={() => {
                  if (plansScrollRef.current) {
                    plansScrollRef.current.scrollTo({
                      top: plansScrollRef.current.scrollHeight,
                      behavior: 'smooth',
                    })
                  }
                }}
                style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', cursor: 'pointer' }}
              >
                View All Plans
              </span>
            </div>
            <div
              ref={plansScrollRef}
              className="cm-plans-scroll"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                flex: 1,
                minHeight: 0,
                maxHeight: '240px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {plansList.map((plan, idx) => (
                <div
                  key={idx}
                  className="cm-plan-card"
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    display: 'flex',
                    gap: '16px',
                    position: 'relative',
                  }}
                >
                  <div
                    className="cm-plan-actions"
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    <button
                      className="cm-plan-action-btn edit"
                      style={{ color: '#6b7280' }}
                      onClick={() => handleEditPlan(idx)}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="cm-plan-action-btn delete"
                      style={{ color: '#6b7280' }}
                      onClick={() => handleDeletePlan(idx)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: plan.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Crown size={20} color={plan.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px',
                      }}
                    >
                      <div>
                        <h6
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#1f2937',
                          }}
                        >
                          {plan.name}
                        </h6>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>
                          {plan.price}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                          background: plan.badgeBg,
                          color: plan.badgeColor,
                        }}
                      >
                        {plan.clinics}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: '6px 0 0',
                        fontSize: '11px',
                        color: '#6b7280',
                        lineHeight: '1.4',
                      }}
                    >
                      Features: {plan.features}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Table ── */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Left Table Section */}
        <div
          style={{
            flex: '1',
            width: '100%',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          {/* Table */}
          <div className="cm-table-container" style={{ overflowX: 'auto' }}>
            <CTable className="cm-table mb-0" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Clinic Name</CTableHeaderCell>
                  <CTableHeaderCell>Plan</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Server</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((sub) => (
                    <CTableRow key={sub.id}>
                      <CTableDataCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={sub.logo}
                            alt="logo"
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                          />
                          <span style={{ fontWeight: '600' }}>{sub.clinicName}</span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: getPlanPill(sub.plan).bg,
                            color: getPlanPill(sub.plan).color,
                          }}
                        >
                          {sub.plan}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell style={{ color: '#4b5563', fontSize: '12px' }}>
                        {sub.type}
                      </CTableDataCell>
                      <CTableDataCell>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: getServerPill(sub.server).bg,
                            color: getServerPill(sub.server).color,
                          }}
                        >
                          {sub.server}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: getStatusPill(sub.status).bg,
                            color: getStatusPill(sub.status).color,
                          }}
                        >
                          {sub.status}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell style={{ fontWeight: '600', color: '#1f2937' }}>
                        {sub.amount}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <CPopover
                            title={<span style={{ fontWeight: '600' }}>Subscription Info</span>}
                            content={
                              <div style={{ fontSize: '13px' }}>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong style={{ color: '#1a56a1' }}>Clinic ID:</strong>{' '}
                                  {sub.clinicId}
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong style={{ color: '#1a56a1' }}>Start Date:</strong>{' '}
                                  {sub.startDate}
                                </div>
                                <div>
                                  <strong style={{ color: '#1a56a1' }}>Expiry Date:</strong>{' '}
                                  {sub.expiryDate}
                                </div>
                              </div>
                            }
                            placement="left"
                            trigger={['hover', 'focus']}
                          >
                            <button className="cm-action-btn view">
                              <Eye size={14} />
                            </button>
                          </CPopover>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={7}
                      className="text-center"
                      style={{ padding: '40px 20px', color: '#6b7280' }}
                    >
                      No subscriptions found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Wrapper */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              borderTop: '1px solid #f0f0f0',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                Rows per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                style={{
                  padding: '5px 8px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '7px',
                  fontSize: '12px',
                  color: '#374151',
                  cursor: 'pointer',
                  outline: 'none',
                  background: '#fff',
                }}
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                className="cm-page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={13} /> Prev
              </button>
              {getPaginationPages().map((p, i) =>
                p === '…' ? (
                  <span
                    key={`e${i}`}
                    style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`cm-page-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                className="cm-page-btn"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subscription Modal */}
      <CModal
        alignment="center"
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton className="border-bottom-0 pb-0">
          <CModalTitle className="fw-bold">
            {editIndex !== null ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-2">
          <p className="text-muted small mb-4">
            {editIndex !== null
              ? 'Modify the features and pricing of this subscription plan.'
              : 'Create a new subscription plan tier for your clinics.'}
          </p>
          <CForm>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Plan Name</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="e.g. Pro, Elite"
                  className="bg-light border-0 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Price (₹)</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="e.g. 29999"
                  className="bg-light border-0 py-2"
                  value={formData.price}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setFormData({ ...formData, price: val })
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">Allowed Clinics</CFormLabel>
              <CFormInput
                type="text"
                placeholder="e.g. 50 Clinics, Unlimited Clinics"
                className="bg-light border-0 py-2"
                value={formData.clinics}
                onChange={(e) => setFormData({ ...formData, clinics: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">Features</CFormLabel>
              <CFormInput
                type="text"
                placeholder="e.g. All features included"
                className="bg-light border-0 py-2"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">Color Theme</CFormLabel>
              <CFormSelect
                className="bg-light border-0 py-2"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              >
                <option value="blue">Blue (Standard)</option>
                <option value="purple">Purple (Premium)</option>
                <option value="green">Green (Basic)</option>
                <option value="orange">Orange (Enterprise)</option>
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-top-0 pt-0">
          <CButton
            color="light"
            className="text-dark fw-medium px-4"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            style={{ backgroundColor: COLORS.primary }}
            className="text-white fw-medium px-4"
            onClick={handleAddPlan}
          >
            {editIndex !== null ? 'Save Changes' : 'Create Plan'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Delete Subscription Plan"
        message="Are you sure you want to delete this subscription plan? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="secondary"
        onConfirm={confirmDeletePlan}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </div>
  )
}

export default SubscriptionManagement
