import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
} from '@coreui/react'
import { Search, Plus, Edit, Trash2, Server, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL } from '../../baseUrl'


const ServerManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [modalMode, setModalMode] = useState('add')
  const [serverToEdit, setServerToEdit] = useState(null)

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [serverToDelete, setServerToDelete] = useState(null)

  const [showViewModal, setShowViewModal] = useState(false)
  const [viewServer, setViewServer] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    location: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [servers, setServers] = useState([])
  const [loadingServers, setLoadingServers] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  /* ── Map raw API server object -> table row shape ── */
  const mapServer = (s) => ({
    id: s.serverId,
    name: s.serverName,
    url: s.serverUrl,
    location: s.location,
    clinics: s.clinics ?? 0,
    status: s.status || 'OFFLINE',
  })

  /* ── Fetch all servers ── */
  const fetchServers = async () => {
    setLoadingServers(true)
    try {
      const response = await axios.get(`${BASE_URL}/api/SuperAdmin/getAllServers`)
      const list = response.data?.data
      const normalized = Array.isArray(list) ? list : list ? [list] : []
      setServers(normalized.map(mapServer))
    } catch (err) {
      console.error('Failed to fetch servers', err)
      toast.error(err.response?.data?.message || 'Failed to fetch servers', { position: 'top-right' })
    } finally {
      setLoadingServers(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  const filteredServers = servers.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.url?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredServers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredServers.length / itemsPerPage) || 1

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

  const validateForm = () => {
    const errs = {}
    if (!formData.name?.trim()) errs.name = 'Server name is required'
    if (!formData.url?.trim()) errs.url = 'Server URL is required'
    else {
      try {
        new URL(formData.url.trim())
      } catch {
        errs.url = 'Enter a valid URL (e.g. https://server6.example.com)'
      }
    }
    if (!formData.location?.trim()) errs.location = 'Location is required'
    return errs
  }

  const handleEdit = (row) => {
    setModalMode('edit')
    setServerToEdit(row.id)
    setFormData({
      name: row.name || '',
      url: row.url || '',
      location: row.location || '',
    })
    setFormErrors({})
    setShowAddModal(true)
  }

  const handleView = async (row) => {
    setShowViewModal(true)
    setLoadingView(true)
    setViewServer(null)
    try {
      const response = await axios.get(`${BASE_URL}/api/SuperAdmin/getServerById/${row.id}`)
      const data = response.data?.data || response.data
      setViewServer(mapServer(data))
    } catch (err) {
      console.error('Failed to fetch server details', err)
      toast.error(err.response?.data?.message || 'Failed to fetch server details', { position: 'top-right' })
      setShowViewModal(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleDeleteClick = (row) => {
    setServerToDelete(row.id)
    setIsDeleteModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (!serverToDelete) return
    setIsDeleting(true)
    try {
      const response = await axios.delete(`${BASE_URL}/api/SuperAdmin/deleteServer/${serverToDelete}`)
      if (response.data?.status !== false) {
        setServers((prev) => prev.filter((s) => s.id !== serverToDelete))
        toast.success(response.data?.message || 'Server deleted successfully', { position: 'top-right' })
      } else {
        toast.error(response.data?.message || 'Failed to delete server', { position: 'top-right' })
      }
    } catch (err) {
      console.error('Failed to delete server', err)
      toast.error(err.response?.data?.message || 'Failed to delete server', { position: 'top-right' })
    } finally {
      setIsDeleting(false)
      setIsDeleteModalVisible(false)
      setServerToDelete(null)
    }
  }

  const openAddModal = () => {
    setModalMode('add')
    setServerToEdit(null)
    setFormData({ name: '', url: '', location: '' })
    setFormErrors({})
    setShowAddModal(true)
  }

  const closeAddModal = () => {
    if (isSaving) return
    setShowAddModal(false)
  }

  const handleSave = async () => {
    const errs = validateForm()
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }
    setFormErrors({})
    setIsSaving(true)

    const payload = {
      serverName: formData.name.trim(),
      serverUrl: formData.url.trim(),
      location: formData.location.trim(),
    }

    try {
      if (modalMode === 'add') {
        const response = await axios.post(`${BASE_URL}/api/SuperAdmin/createserver`, payload)
        if (response.data?.status !== false) {
          const created = response.data?.data
          if (created) setServers((prev) => [...prev, mapServer(created)])
          else await fetchServers()
          toast.success(response.data?.message || 'Server created successfully', { position: 'top-right' })
          setShowAddModal(false)
        } else {
          toast.error(response.data?.message || 'Failed to create server', { position: 'top-right' })
        }
      } else {
        const response = await axios.put(`${BASE_URL}/api/SuperAdmin/updateServer/${serverToEdit}`, payload)
        if (response.data?.status !== false) {
          const updated = response.data?.data
          setServers((prev) =>
            prev.map((s) =>
              s.id === serverToEdit
                ? updated
                  ? mapServer(updated)
                  : { ...s, name: payload.serverName, url: payload.serverUrl, location: payload.location }
                : s,
            ),
          )
          toast.success(response.data?.message || 'Server updated successfully', { position: 'top-right' })
          setShowAddModal(false)
        } else {
          toast.error(response.data?.message || 'Failed to update server', { position: 'top-right' })
        }
      }
    } catch (err) {
      console.error('Failed to save server', err)
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-right' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <ToastContainer />

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
            {loadingServers ? 'Loading servers…' : `${servers.length} servers found`}
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
        <button
          onClick={fetchServers}
          disabled={loadingServers}
          style={{
            padding: '8px 14px',
            borderRadius: '9px',
            border: '1.5px solid #e5e7eb',
            background: '#fff',
            color: '#374151',
            fontSize: '12px',
            fontWeight: '600',
            cursor: loadingServers ? 'not-allowed' : 'pointer',
            opacity: loadingServers ? 0.6 : 1,
          }}
        >
          {loadingServers ? 'Refreshing…' : 'Refresh'}
        </button>
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
        {loadingServers ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ marginTop: '10px' }}>Loading servers…</div>
          </div>
        ) : filteredServers.length === 0 ? (
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
                          <div className="text-muted small" style={{ fontSize: '10px' }}>
                            {server.id}
                          </div>
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
                        color={server.status?.toUpperCase() === 'ONLINE' ? 'success' : 'secondary'}
                        className={
                          server.status?.toUpperCase() === 'ONLINE'
                            ? 'text-success bg-success bg-opacity-10 rounded-pill px-3 py-2 fw-semibold'
                            : 'text-secondary bg-secondary bg-opacity-10 rounded-pill px-3 py-2 fw-semibold'
                        }
                      >
                        {server.status}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="cm-action-btn view"
                          title="View"
                          onClick={() => handleView(server)}
                        >
                          <Eye size={14} />
                        </button>
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
        {!loadingServers && filteredServers.length > 0 && (
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
      <CModal visible={showAddModal} onClose={closeAddModal} alignment="center">
        <CModalHeader closeButton className="border-bottom-0 pb-0">
          <CModalTitle className="fw-bold">
            {modalMode === 'edit' ? 'Edit Server' : 'Add New Server'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-2">
          <p className="text-muted small mb-4">
            {modalMode === 'edit'
              ? 'Modify the configuration details of this server instance.'
              : 'Enter the configuration details to provision a new clinic server instance.'}
          </p>
          <CForm
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
          >
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">
                Server Name<span style={{ color: '#dc2626', marginLeft: '3px' }}>*</span>
              </CFormLabel>
              <CFormInput
                placeholder="e.g. Server 6"
                className="bg-light border-0 py-2"
                value={formData.name}
                invalid={!!formErrors.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setFormErrors((p) => ({ ...p, name: '' }))
                }}
              />
              {formErrors.name && (
                <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px' }}>{formErrors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">
                Server URL / IP<span style={{ color: '#dc2626', marginLeft: '3px' }}>*</span>
              </CFormLabel>
              <CFormInput
                placeholder="e.g. https://server6.physioelite.com"
                className="bg-light border-0 py-2"
                value={formData.url}
                invalid={!!formErrors.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value })
                  setFormErrors((p) => ({ ...p, url: '' }))
                }}
              />
              {formErrors.url && (
                <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px' }}>{formErrors.url}</div>
              )}
            </div>
            <div className="row">
              <div className="col-md-12 mb-3">
                <CFormLabel className="small fw-semibold text-dark">
                  Location<span style={{ color: '#dc2626', marginLeft: '3px' }}>*</span>
                </CFormLabel>
                <CFormInput
                  placeholder="e.g. Pune, India"
                  className="bg-light border-0 py-2"
                  value={formData.location}
                  invalid={!!formErrors.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value })
                    setFormErrors((p) => ({ ...p, location: '' }))
                  }}
                />
                {formErrors.location && (
                  <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px' }}>
                    {formErrors.location}
                  </div>
                )}
              </div>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="border-top-0 pt-0">
          <CButton
            color="light"
            className="text-dark fw-medium px-4"
            onClick={closeAddModal}
            disabled={isSaving}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            className="text-white fw-medium px-4"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="spinner-border spinner-border-sm" style={{ width: '13px', height: '13px' }} />
            ) : modalMode === 'edit' ? (
              'Save Changes'
            ) : (
              'Provision Server'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Server Modal */}
      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)} alignment="center">
        <CModalHeader closeButton className="border-bottom-0 pb-0">
          <CModalTitle className="fw-bold">Server Details</CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-2">
          {loadingView ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : viewServer ? (
            <div style={{ fontSize: '13px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Server ID:</strong> {viewServer.id}</div>
              <div><strong>Name:</strong> {viewServer.name}</div>
              <div><strong>URL:</strong> {viewServer.url}</div>
              <div><strong>Location:</strong> {viewServer.location}</div>
              <div><strong>Clinics:</strong> {viewServer.clinics}</div>
              <div><strong>Status:</strong> {viewServer.status}</div>
            </div>
          ) : (
            <div className="text-muted small">No details available.</div>
          )}
        </CModalBody>
        <CModalFooter className="border-top-0 pt-0">
          <CButton color="light" className="text-dark fw-medium px-4" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Delete Server"
        message="Are you sure you want to delete this server? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting…' : 'Yes, Delete'}
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="secondary"
        onConfirm={handleConfirmDelete}
        onCancel={() => !isDeleting && setIsDeleteModalVisible(false)}
      />
    </div>
  )
}

export default ServerManagement