import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ClinicAllData, BASE_URL } from '../../baseUrl'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, Search, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import {
  CTable, CTableHead, CTableBody, CTableRow,
  CTableHeaderCell, CTableDataCell,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CButton, CFormSelect,
} from '@coreui/react'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import { statusapi } from '../../baseUrl'
import LoadingIndicator from '../../Utils/loader'

/* ═══════════════════════════════════════════════════════
   STATUS MAPPING
═══════════════════════════════════════════════════════ */
const mapBackendStatusToUI = (status) => {
  switch (status) {
    case 'PENDING':                  return 'pending'
    case 'VERIFICATION_IN_PROGRESS': return 'start'
    case 'VERIFIED':                 return 'verified'
    case 'REJECTED':                 return 'rejected'
    default:                         return 'pending'
  }
}

const UI_TO_BACKEND = {
  pending:  'PENDING',
  start:    'VERIFICATION_IN_PROGRESS',
  verified: 'VERIFIED',
  rejected: 'REJECTED',
}

const STATUS_LABEL = {
  pending:  'Pending',
  start:    'Started',
  verified: 'Verified',
  rejected: 'Rejected',
}

const statusStyles = {
  pending:  { backgroundColor: '#FFE4B5', color: '#8B4513', fontWeight: '600' },
  start:    { backgroundColor: '#BEE3F8', color: '#0C4A6E', fontWeight: '600' },
  verified: { backgroundColor: '#C6F6D5', color: '#22543D', fontWeight: '600' },
  rejected: { backgroundColor: '#FED7D7', color: '#822727', fontWeight: '600' },
}

const badgeStyle = (uiStatus) => ({
  ...(statusStyles[uiStatus] || {}),
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '13px',
  display: 'inline-block',
})

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const ClinicManagement = ({ service, onBack }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [clinics,       setClinics]       = useState([])
  const [loading,       setLoading]       = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [error,         setError]         = useState(null)
  const [searchTerm,    setSearchTerm]    = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [categories,    setCategories]    = useState([])
  const [currentPage,   setCurrentPage]   = useState(1)
  const [itemsPerPage,  setItemsPerPage]  = useState(5)

  const [confirmModal, setConfirmModal] = useState({
    visible:    false,
    clinicId:   null,
    clinicName: '',
    fromStatus: '',
    toStatus:   '',
  })

  const handleAddClinic = () => {
    navigate('/add-clinic', {
      state: { categoryName: service?.categoryName, categoryId: service?.id },
    })
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await CategoryData()
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchClinics()
    if (location.state?.newClinic) {
      setClinics((prev) => [...prev, location.state.newClinic])
    }
  }, [location.state?.newClinic, filterCategory])

  const fetchClinics = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/${ClinicAllData}`)
      const clinicList = Array.isArray(response.data)
        ? response.data
        : response.data.hospitalCategory || response.data.data || []

      const filtered = filterCategory
        ? clinicList.filter(
            (c) =>
              Array.isArray(c.hospitalCategory) &&
              c.hospitalCategory.some((cat) => cat.categoryId === filterCategory),
          )
        : clinicList

      setClinics(filtered)
    } catch {
      setError('Failed to load clinics')
    } finally {
      setLoading(false)
    }
  }

  /* ── Status Handlers ── */
  const handleDropdownChange = (uiStatus, clinicId) => {
    const clinic = clinics.find((c) => c.hospitalId === clinicId)
    if (!clinic) return
    const currentUI = mapBackendStatusToUI(clinic.status)
    if (currentUI === uiStatus) return

    setConfirmModal({
      visible:    true,
      clinicId,
      clinicName: clinic.name,
      fromStatus: currentUI,
      toStatus:   uiStatus,
    })
  }

  const closeModal = () =>
    setConfirmModal({ visible: false, clinicId: null, clinicName: '', fromStatus: '', toStatus: '' })

  const handleConfirmStatusChange = async () => {
    const { clinicId, toStatus, clinicName } = confirmModal
    closeModal()

    if (toStatus === 'pending') {
      alert('Cannot reset to Pending — no backend API available for this transition.')
      return
    }

    setStatusLoading(true)
    try {
      if (toStatus === 'start') {
        await statusapi.startClinic(clinicId)
      } else if (toStatus === 'verified') {
        await statusapi.verifyClinic(clinicId)
      } else if (toStatus === 'rejected') {
        const reason =
          window.prompt(`Enter rejection reason for "${clinicName}":`, 'Invalid documents submitted') ||
          'Invalid documents submitted'
        await statusapi.rejectClinic(clinicId, reason)
      }
      await fetchClinics()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err.message
      alert(`Failed to update status.\n\nReason: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`)
      await fetchClinics()
    } finally {
      setStatusLoading(false)
    }
  }

  /* ── Derived ── */
  const filteredClinics = clinics.filter(
    (c) =>
      c.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.contactNumber?.startsWith(searchTerm) ||
      c.emailAddress?.toLowerCase().startsWith(searchTerm.toLowerCase()),
  )

  useEffect(() => { setCurrentPage(1) }, [searchTerm, filterCategory])

  const indexOfLastItem  = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems     = filteredClinics.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages       = Math.ceil(filteredClinics.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getPaginationPages = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
        acc.push(p)
        return acc
      }, [])

  return (
    <div>
      <style>{`
        .cm-table thead th {
          background: #185fa5 !important;
          color: #fff !important;
          font-size: 12px;
          font-weight: 600;
          padding: 12px 14px;
          border: none;
          letter-spacing: 0.3px;
        }
        .cm-table tbody tr { font-size: 13px; transition: background 0.15s; }
        .cm-table tbody tr:hover { background: #eef4fb !important; }
        .cm-table tbody td {
          padding: 11px 14px;
          vertical-align: middle;
          border-color: #f0f0f0;
          color: #374151;
        }
        .cm-action-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1.5px solid transparent; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .cm-action-btn.view  { border-color: #185fa5; color: #185fa5; }
        .cm-action-btn.view:hover { background: #185fa5; color: #fff; }
        .cm-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center;
          justify-content: center; gap: 4px; white-space: nowrap;
        }
        .cm-page-btn:hover:not(:disabled):not(.active) {
          border-color: #185fa5; color: #185fa5; background: #eef4fb;
        }
        .cm-page-btn.active { background: #185fa5; color: #fff; border-color: #185fa5; }
        .cm-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cm-status-select {
          border-radius: 20px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 3px 10px !important;
          border: none !important;
          cursor: pointer;
          outline: none;
          appearance: auto;
        }
        .cm-filter-select:focus,
        .cm-search-input:focus {
          outline: none;
          border-color: #185fa5 !important;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.10);
        }
      `}</style>

      {/* ── Confirmation Modal ── */}
      <CModal visible={confirmModal.visible} onClose={closeModal} alignment="center">
        <CModalHeader>
          <CModalTitle>Confirm Status Change</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p style={{ marginBottom: 0 }}>
            Are you sure you want to change{' '}
            <strong>{confirmModal.clinicName}</strong>'s status from{' '}
            <span style={badgeStyle(confirmModal.fromStatus)}>
              {STATUS_LABEL[confirmModal.fromStatus]}
            </span>{' '}
            to{' '}
            <span style={badgeStyle(confirmModal.toStatus)}>
              {STATUS_LABEL[confirmModal.toStatus]}
            </span>?
          </p>
          {confirmModal.toStatus === 'verified' && (
            <p className="mt-2 text-success" style={{ fontSize: 13 }}>
              ✅ A verification confirmation email will be sent to the clinic's registered email.
            </p>
          )}
          {confirmModal.toStatus === 'rejected' && (
            <p className="mt-2 text-danger" style={{ fontSize: 13 }}>
              ❌ You will be asked to enter a rejection reason. A rejection email will be sent to the clinic.
            </p>
          )}
          {confirmModal.toStatus === 'start' && (
            <p className="mt-2 text-info" style={{ fontSize: 13 }}>
              🔍 A "verification in progress" notification email will be sent to the clinic.
            </p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>No, Cancel</CButton>
          <CButton
            style={{ backgroundColor: '#185fa5', color: '#fff' }}
            onClick={handleConfirmStatusChange}
            disabled={statusLoading}
          >
            {statusLoading ? 'Updating...' : 'Yes, Change'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '20px',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <h5 style={{ color: '#185fa5', fontWeight: '700', margin: 0, fontSize: '18px' }}>
            {service?.categoryName ? `${service.categoryName} Clinics` : 'Clinic Management'}
          </h5>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0' }}>
            {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleAddClinic}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 18px', borderRadius: '10px',
            background: '#185fa5', color: '#fff',
            border: 'none', fontWeight: '600', fontSize: '13px',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(24,95,165,0.28)',
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0c447c')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#185fa5')}
        >
          <Plus size={15} /> Add Clinic
        </button>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '14px 18px',
        marginBottom: '16px', boxShadow: '0 2px 12px rgba(24,95,165,0.07)',
        border: '1px solid #e8eef5',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{
            position: 'absolute', left: '11px', top: '50%',
            transform: 'translateY(-50%)', color: '#9ca3af',
          }} />
          <input
            type="text"
            className="cm-search-input"
            placeholder="Search by name, mobile, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 34px',
              border: '1.5px solid #e5e7eb', borderRadius: '9px',
              fontSize: '13px', color: '#374151',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute', right: '10px', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: '#9ca3af',
                display: 'flex', alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          className="cm-filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '8px 12px', border: '1.5px solid #e5e7eb',
            borderRadius: '9px', fontSize: '13px', color: '#374151',
            background: '#fff', cursor: 'pointer', minWidth: '180px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table Card ── */}
      <div style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(24,95,165,0.08)', border: '1px solid #e8eef5',
      }}>
        {loading ? (
          <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
            <LoadingIndicator message="Fetching clinic details, please wait..." />
          </div>
        ) : error ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>{error}
          </div>
        ) : filteredClinics.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏥</div>No clinics found.
          </div>
        ) : (
          <>
            <CTable className="cm-table mb-0" hover responsive>
              <CTableHead>
                <CTableRow>
                  {['S.No', 'Clinic Name', 'Contact Number', 'Email Address', 'City', 'Status', 'Actions'].map((h) => (
                    <CTableHeaderCell key={h} className={h === 'Actions' ? 'text-center' : ''}>
                      {h}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.map((clinic, index) => {
                  const uiStatus = mapBackendStatusToUI(clinic.status)
                  return (
                    <CTableRow key={clinic?.hospitalId || index}>
                      <CTableDataCell style={{ color: '#9ca3af', fontWeight: '600', fontSize: '12px' }}>
                        {indexOfFirstItem + index + 1}
                      </CTableDataCell>
                      <CTableDataCell style={{ fontWeight: '500' }}>{clinic?.name || '—'}</CTableDataCell>
                      <CTableDataCell>{clinic?.contactNumber || '—'}</CTableDataCell>
                      <CTableDataCell>{clinic?.emailAddress || '—'}</CTableDataCell>
                      <CTableDataCell>
                        {clinic?.city ? (
                          <span style={{
                            padding: '2px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: '600',
                            background: '#e6f1fb', color: '#0c447c',
                          }}>
                            {clinic.city}
                          </span>
                        ) : '—'}
                      </CTableDataCell>

                      {/* ── Status Dropdown ── */}
                      <CTableDataCell>
                        <select
                          className="cm-status-select"
                          value={uiStatus}
                          onChange={(e) => handleDropdownChange(e.target.value, clinic.hospitalId)}
                          disabled={statusLoading}
                          style={{
                            ...statusStyles[uiStatus],
                            cursor: statusLoading ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="start">Started</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </CTableDataCell>

                      {/* ── View Button ── */}
                      <CTableDataCell className="text-center">
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button
                            className="cm-action-btn view"
                            title="View"
                            onClick={() => navigate(`/clinic-Management/${clinic.hospitalId}`)}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>

            {/* ── Pagination ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '12px 18px',
              borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  Rows per page:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                  style={{
                    padding: '5px 8px', border: '1.5px solid #e5e7eb',
                    borderRadius: '7px', fontSize: '12px', color: '#374151',
                    cursor: 'pointer', outline: 'none', background: '#fff',
                  }}
                >
                  {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button className="cm-page-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  <ChevronLeft size={13} /> Prev
                </button>
                {getPaginationPages().map((p, i) =>
                  p === '…' ? (
                    <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className={`cm-page-btn ${currentPage === p ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  )
                )}
                <button className="cm-page-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                  Next <ChevronRight size={13} />
                </button>
                <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                  Page <strong style={{ color: '#185fa5' }}>{currentPage}</strong> of <strong style={{ color: '#185fa5' }}>{totalPages}</strong>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ClinicManagement