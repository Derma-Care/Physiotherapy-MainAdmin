import React, { useState } from 'react'
import Logo from '../../assets/images/DermaCareNoBG.png'
import Pagination from '../../Utils/Pagination'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CFormInput,
  CAvatar,
} from '@coreui/react'
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  Building2,
  UserCheck,
  Stethoscope,
  Users,
  Activity,
  Download,
  Filter,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react'
import { COLORS } from '../../Constant/Themes'

// Dummy Data
const initialUsers = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?u=1',
    username: 'dr.rahul',
    name: 'Dr. Rahul Sharma',
    role: 'Doctor',
    clinic: 'Skin Care Center',
    branch: 'Andheri Branch',
    server: 'Server 1',
    email: 'rahul.sharma@skincare.com',
    mobile: '9876543210',
    status: 'Active',
    lastLogin: '29 May 2025\n10:30 AM',
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/150?u=2',
    username: 'reception.jyoti',
    name: 'Jyoti Patel',
    role: 'Receptionist',
    clinic: 'Health Plus Clinic',
    branch: 'Main Branch',
    server: 'Server 1',
    email: 'jyoti.patel@healthplus.com',
    mobile: '9123456780',
    status: 'Active',
    lastLogin: '29 May 2025\n09:15 AM',
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/150?u=3',
    username: 'admin.sunil',
    name: 'Sunil Verma',
    role: 'Clinic Admin',
    clinic: 'Derma Solution',
    branch: 'Main Branch',
    server: 'Server 2',
    email: 'sunil.verma@dermasolution.com',
    mobile: '9988776655',
    status: 'Active',
    lastLogin: '29 May 2025\n11:20 AM',
  },
  {
    id: 4,
    avatar: 'https://i.pravatar.cc/150?u=4',
    username: 'therapist.neha',
    name: 'Neha Gupta',
    role: 'Therapist',
    clinic: 'Aura Skin Clinic',
    branch: 'Powai Branch',
    server: 'Server 3',
    email: 'neha.gupta@auraskin.com',
    mobile: '8877665544',
    status: 'Active',
    lastLogin: '28 May 2025\n04:45 PM',
  },
  {
    id: 5,
    avatar: 'https://i.pravatar.cc/150?u=5',
    username: 'billing.rohit',
    name: 'Rohit Mehta',
    role: 'Billing Staff',
    clinic: 'Glow Derma Care',
    branch: 'Goregaon Branch',
    server: 'Server 3',
    email: 'rohit.mehta@glowderma.com',
    mobile: '7766554433',
    status: 'Inactive',
    lastLogin: '26 May 2025\n02:10 PM',
  },
  {
    id: 6,
    avatar: '', // Intentionally left empty to show fallback logo
    username: 'reception.aki',
    name: 'Aki Singh',
    role: 'Receptionist',
    clinic: 'Bright Skin Clinic',
    branch: 'Main Branch',
    server: 'Server 4',
    email: 'aki.singh@brightskin.com',
    mobile: '9685741236',
    status: 'Active',
    lastLogin: '29 May 2025\n08:50 AM',
  },
  {
    id: 7,
    avatar: 'https://i.pravatar.cc/150?u=7',
    username: 'admin.karan',
    name: 'Karan Malhotra',
    role: 'Clinic Admin',
    clinic: 'Healthy Skin Hub',
    branch: 'Malad Branch',
    server: 'Server 5',
    email: 'karan.malhotra@healthyhub.com',
    mobile: '8855123654',
    status: 'Active',
    lastLogin: '29 May 2025\n12:05 PM',
  },
]

const getRoleBadge = (role) => {
  if (role === 'Doctor')
    return (
      <span
        style={{
          color: '#3b82f6',
          background: '#eff6ff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {role}
      </span>
    )
  if (role === 'Receptionist')
    return (
      <span
        style={{
          color: '#f59e0b',
          background: '#fef3c7',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {role}
      </span>
    )
  if (role === 'Clinic Admin')
    return (
      <span
        style={{
          color: '#a855f7',
          background: '#f3e8ff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {role}
      </span>
    )
  if (role === 'Therapist')
    return (
      <span
        style={{
          color: '#ef4444',
          background: '#fee2e2',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {role}
      </span>
    )
  if (role === 'Billing Staff')
    return (
      <span
        style={{
          color: '#10b981',
          background: '#d1fae5',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {role}
      </span>
    )
  return <span>{role}</span>
}

const getServerBadge = (server) => {
  const serverNumber = server.replace('Server ', '')
  const colors = {
    1: { c: '#3b82f6', bg: '#eff6ff' },
    2: { c: '#10b981', bg: '#d1fae5' },
    3: { c: '#f59e0b', bg: '#fef3c7' },
    4: { c: '#a855f7', bg: '#f3e8ff' },
    5: { c: '#ef4444', bg: '#fee2e2' },
  }
  const theme = colors[serverNumber] || colors['1']
  return (
    <span
      style={{
        color: theme.c,
        background: theme.bg,
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      {server}
    </span>
  )
}

const getStatusBadge = (status) => {
  if (status === 'Active')
    return (
      <span
        style={{
          color: '#16a34a',
          background: '#dcfce7',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    )
  if (status === 'Inactive')
    return (
      <span
        style={{
          color: '#dc2626',
          background: '#fee2e2',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    )
  return <span>{status}</span>
}

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedServer, setSelectedServer] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredUsers = initialUsers.filter((u) => {
    const formattedId = String(u.id).padStart(4, '0')
    const matchesSearch =
      formattedId.includes(searchTerm) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === '' || u.role === selectedRole
    const matchesServer = selectedServer === '' || u.server === selectedServer
    const matchesStatus = selectedStatus === '' || u.status === selectedStatus

    return matchesSearch && matchesRole && matchesServer && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1
  const validCurrentPage = Math.min(currentPage, totalPages)
  const paginatedUsers = filteredUsers.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  )

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedRole('')
    setSelectedServer('')
    setSelectedStatus('')
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {[
          {
            title: 'Total Users',
            count: '256',
            sub: 'All Users',
            icon: <Building2 size={24} color="#8b5cf6" />,
            bg: '#ede9fe',
          },
          {
            title: 'Clinic Admins',
            count: '18',
            sub: '7.03% of total',
            icon: <UserCheck size={24} color="#10b981" />,
            bg: '#d1fae5',
          },
          {
            title: 'Doctors',
            count: '86',
            sub: '33.59% of total',
            icon: <Stethoscope size={24} color="#3b82f6" />,
            bg: '#dbeafe',
          },
          {
            title: 'Receptionists',
            count: '72',
            sub: '28.13% of total',
            icon: <Users size={24} color="#f59e0b" />,
            bg: '#fef3c7',
          },
          {
            title: 'Therapists',
            count: '32',
            sub: '12.50% of total',
            icon: <Activity size={24} color="#ef4444" />,
            bg: '#fee2e2',
          },
          {
            title: 'Other Staff',
            count: '48',
            sub: '18.75% of total',
            icon: <Users size={24} color="#f59e0b" />,
            bg: '#fef3c7',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {card.title}
              </div>
              <div
                style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}
              >
                {card.count}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div>
        {/* Table Section */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h5 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>All Users</h5>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#4b5563',
                  background: '#fff',
                }}
              >
                <option value="">All Roles</option>
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Clinic Admin">Clinic Admin</option>
                <option value="Therapist">Therapist</option>
                <option value="Billing Staff">Billing Staff</option>
              </select>

              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#4b5563',
                  background: '#fff',
                }}
              >
                <option value="">All Servers</option>
                <option value="Server 1">Server 1</option>
                <option value="Server 2">Server 2</option>
                <option value="Server 3">Server 3</option>
                <option value="Server 4">Server 4</option>
                <option value="Server 5">Server 5</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#4b5563',
                  background: '#fff',
                }}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', color: '#9ca3af' }}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    fontSize: '13px',
                    width: '260px',
                  }}
                />
              </div>

              <button
                onClick={handleClearFilters}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Clear
              </button>
              <button
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <CTable hover align="middle" style={{ margin: 0, borderBottom: 'none' }}>
              <CTableHead>
                <CTableRow>
                  {[
                    'Pic',
                    'Full Name',
                    'Role',
                    'Clinic / Branch',
                    'Server',
                    'Email',
                    'Mobile',
                    'Status',
                    'Last Login',
                  ].map((head, idx, arr) => (
                    <CTableHeaderCell
                      key={idx}
                      style={{
                        padding: '16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#ffffff',
                        backgroundColor: COLORS.primary,
                        borderBottom: 'none',
                        textAlign: 'left',
                        borderTopLeftRadius: idx === 0 ? '8px' : '0',
                        borderTopRightRadius: idx === arr.length - 1 ? '8px' : '0',
                      }}
                    >
                      {head}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedUsers.map((u, idx) => (
                  <CTableRow key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <CTableDataCell style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt="avatar"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <img
                              src={Logo}
                              alt="Logo"
                              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                            />
                          )}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                          {u.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          ID: {String(u.id).padStart(4, '0')}
                        </span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell style={{ padding: '16px' }}>
                      {getRoleBadge(u.role)}
                    </CTableDataCell>
                    <CTableDataCell style={{ padding: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {u.clinic}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {u.branch}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell style={{ padding: '16px' }}>
                      {getServerBadge(u.server)}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontSize: '13px', color: '#475569', padding: '16px' }}>
                      {u.email}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontSize: '13px', color: '#475569', padding: '16px' }}>
                      {u.mobile}
                    </CTableDataCell>
                    <CTableDataCell style={{ padding: '16px' }}>
                      {getStatusBadge(u.status)}
                    </CTableDataCell>
                    <CTableDataCell
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        padding: '16px',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {u.lastLogin}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination */}
          <div style={{ padding: '0px 20px 16px', borderTop: '1px solid #e5e7eb' }}>
            <Pagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersManagement
