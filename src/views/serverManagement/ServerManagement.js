import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CButton,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormSelect,
  CProgress,
  CPopover,
} from '@coreui/react'
import { Search, Plus, Edit, Trash2, Server, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'

const ServerManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [modalMode, setModalMode] = useState('add')
  const [serverToEdit, setServerToEdit] = useState(null)
  
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [serverToDelete, setServerToDelete] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    location: '',
    role: 'secondary'
  })

  const [servers, setServers] = useState([
    {
      id: 1,
      name: 'Server 1',
      isPrimary: true,
      url: 'https://server1.surecare.com',
      location: 'Mumbai, India',
      clinics: 12,
      status: 'Online',
      cpu: 29,
      memory: 45,
      disk: 40,
      lastBackup: '28 May 2025 02:30 AM',
      backupStatus: 'Success',
    },
    {
      id: 2,
      name: 'Server 2',
      isPrimary: false,
      url: 'https://server2.surecare.com',
      location: 'Delhi, India',
      clinics: 10,
      status: 'Online',
      cpu: 35,
      memory: 52,
      disk: 48,
      lastBackup: '28 May 2025 03:15 AM',
      backupStatus: 'Success',
    },
    {
      id: 3,
      name: 'Server 3',
      isPrimary: false,
      url: 'https://server3.surecare.com',
      location: 'Bangalore, India',
      clinics: 9,
      status: 'Online',
      cpu: 22,
      memory: 40,
      disk: 36,
      lastBackup: '28 May 2025 02:10 AM',
      backupStatus: 'Success',
    },
    {
      id: 4,
      name: 'Server 4',
      isPrimary: false,
      url: 'https://server4.surecare.com',
      location: 'Hyderabad, India',
      clinics: 8,
      status: 'Online',
      cpu: 30,
      memory: 47,
      disk: 42,
      lastBackup: '28 May 2025 02:00 AM',
      backupStatus: 'Success',
    },
    {
      id: 5,
      name: 'Server 5',
      isPrimary: false,
      url: 'https://server5.surecare.com',
      location: 'Chennai, India',
      clinics: 9,
      status: 'Online',
      cpu: 18,
      memory: 38,
      disk: 30,
      lastBackup: '28 May 2025 01:56 AM',
      backupStatus: 'Success',
    },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const filteredServers = servers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredServers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredServers.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getPaginationPages = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '…', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages)
      }
    }
    return pages
  }

  const handleEdit = (row) => {
    setModalMode('edit')
    setServerToEdit(row.id)
    setFormData({
      name: row.name,
      url: row.url,
      location: row.location,
      role: row.isPrimary ? 'primary' : 'secondary'
    })
    setShowAddModal(true)
  }

  const handleDeleteClick = (row) => {
    setServerToDelete(row.id)
    setIsDeleteModalVisible(true)
  }

  const handleConfirmDelete = () => {
    setServers(servers.filter(s => s.id !== serverToDelete))
    setIsDeleteModalVisible(false)
    setServerToDelete(null)
  }

  const openAddModal = () => {
    setModalMode('add')
    setFormData({ name: '', url: '', location: '', role: 'secondary' })
    setShowAddModal(true)
  }

  const handleSave = () => {
    if (modalMode === 'add') {
      const newServer = {
        id: servers.length > 0 ? Math.max(...servers.map(s => s.id)) + 1 : 1,
        name: formData.name,
        isPrimary: formData.role === 'primary',
        url: formData.url,
        location: formData.location,
        clinics: 0,
        status: 'Online',
        cpu: 0,
        memory: 0,
        disk: 0,
        lastBackup: 'Pending',
        backupStatus: 'Pending',
      }
      setServers([...servers, newServer])
    } else {
      setServers(servers.map(s => 
        s.id === serverToEdit 
          ? { ...s, name: formData.name, url: formData.url, location: formData.location, isPrimary: formData.role === 'primary' }
          : s
      ))
    }
    setShowAddModal(true)
  }

  return (
    <div>
      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h5 style={{ color: '#185fa5', fontWeight: '700', margin: 0, fontSize: '18px' }}>
            Server Management
          </h5>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            {servers.length} servers found
          </span>
        </div>
        <button
          onClick={openAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 18px',
            borderRadius: '10px',
            background: '#185fa5',
            color: '#fff',
            border: 'none',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(24,95,165,0.28)',
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0c447c')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#185fa5')}
        >
          <Plus size={15} /> Add Server
        </button>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '16px',
          boxShadow: '0 2px 12px rgba(24,95,165,0.07)',
          border: '1px solid #e8eef5',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            type="text"
            className="cm-search-input"
            placeholder="Search by server name, url..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              border: '1.5px solid #e5e7eb',
              borderRadius: '9px',
              fontSize: '13px',
              color: '#374151',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(24,95,165,0.08)',
          border: '1px solid #e8eef5',
        }}
      >
        {filteredServers.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖥️</div>No servers found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <CTable className="cm-table mb-0" hover responsive>
              <CTableHead>
                <CTableRow>
                  {[
                    'S.No',
                    'Server Name',
                    'Server URL / IP',
                    'Location',
                    'Clinics',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <CTableHeaderCell key={h} className={h === 'Actions' ? 'text-center' : ''}>
                      {h}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.map((server, index) => (
                  <CTableRow key={server.id}>
                    <CTableDataCell
                      style={{ color: '#9ca3af', fontWeight: '600', fontSize: '12px' }}
                    >
                      {indexOfFirstItem + index + 1}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: '500' }}>
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-dark rounded p-2 me-2 text-white d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Server size={14} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">{server.name}</div>
                          {server.isPrimary && (
                            <div className="text-success small fw-semibold" style={{ fontSize: '10px' }}>
                              Primary
                            </div>
                          )}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{server.url || '—'}</CTableDataCell>
                    <CTableDataCell>{server.location || '—'}</CTableDataCell>

                    <CTableDataCell>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: '#e6f1fb',
                          color: '#0c447c',
                        }}
                      >
                        {server.clinics} Clinics
                      </span>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge
                        color="success"
                        className="text-success bg-success bg-opacity-10 rounded-pill px-3 py-2 fw-semibold"
                      >
                        {server.status}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="cm-action-btn view"
                          title="Edit"
                          onClick={() => handleEdit(server)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="cm-action-btn view"
                          title="Delete"
                          style={{ borderColor: '#ef4444', color: '#ef4444' }}
                          onClick={() => handleDeleteClick(server)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        )}
        
        {/* Pagination Wrapper */}
        {filteredServers.length > 0 && (
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
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <ChevronRight size={13} />
              </button>
              <span
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginLeft: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                Page <strong style={{ color: '#185fa5' }}>{currentPage}</strong> of{' '}
                <strong style={{ color: '#185fa5' }}>{totalPages}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Server Modal */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} alignment="center">
        <CModalHeader closeButton className="border-bottom-0 pb-0">
          <CModalTitle className="fw-bold">{modalMode === 'edit' ? 'Edit Server' : 'Add New Server'}</CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-2">
          <p className="text-muted small mb-4">
            {modalMode === 'edit' ? 'Modify the configuration details of this server instance.' : 'Enter the configuration details to provision a new clinic server instance.'}
          </p>
          <CForm>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">Server Name</CFormLabel>
              <CFormInput 
                placeholder="e.g. Server 6" 
                className="bg-light border-0 py-2" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">Server URL / IP</CFormLabel>
              <CFormInput
                placeholder="e.g. https://server6.physioelite.com"
                className="bg-light border-0 py-2"
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Location</CFormLabel>
                <CFormInput 
                  placeholder="e.g. Pune, India" 
                  className="bg-light border-0 py-2" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Role</CFormLabel>
                <CFormSelect 
                  className="bg-light border-0 py-2"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="secondary">Secondary / Regional</option>
                  <option value="primary">Primary / Global</option>
                </CFormSelect>
              </div>
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
            color="primary"
            className="text-white fw-medium px-4"
            onClick={handleSave}
          >
            {modalMode === 'edit' ? 'Save Changes' : 'Provision Server'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Delete Server"
        message="Are you sure you want to delete this server? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="secondary"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </div>
  )
}

export default ServerManagement
