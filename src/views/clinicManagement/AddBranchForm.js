import React, { useState, useEffect } from 'react'
import {
  CRow, CCol, CSpinner,
  CModal, CModalHeader, CModalBody, CModalFooter,
  CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import {
  fetchBranchById, createNewBranch, updateBranchData,
  deleteBranchById, fetchBranchByBranchId,
} from './AddBranchAPI'
import { Edit2, Eye, Trash2, Search, X, Plus, ChevronLeft, ChevronRight, GitBranch } from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'

/* ── shared styles ── */
const inp = (hasErr, disabled) => ({
  width: '100%', padding: '8px 12px',
  border: `1.5px solid ${hasErr ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: '8px', fontSize: '13px', color: '#374151',
  background: disabled ? '#f9fafb' : '#fff',
  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit',
})

const lbl = {
  fontSize: '12px', fontWeight: '600',
  color: '#374151', marginBottom: '5px', display: 'block',
}

const errTxt = { color: '#ef4444', fontSize: '11px', marginTop: '4px' }

const Field = ({ label, required, error, children }) => (
  <div>
    <label style={lbl}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {error && <div style={errTxt}>{error}</div>}
  </div>
)

const SectionBar = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
    <span style={{ width: '3px', height: '18px', background: '#1a3a6b', borderRadius: '2px', flexShrink: 0 }} />
    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>{text}</span>
  </div>
)

const AddBranchForm = ({ clinicId }) => {
  const navigate = useNavigate()

  const [branches, setBranches]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError]                 = useState('')
  const [success, setSuccess]             = useState('')
  const [modalVisible, setModalVisible]   = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [deletingBranch, setDeletingBranch] = useState(null)
  const [searchTerm, setSearchTerm]       = useState('')
  const [filterCity, setFilterCity]       = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [itemsPerPage, setItemsPerPage]   = useState(5)
  const [currentPage, setCurrentPage]     = useState(1)

  const initialForm = {
    clinicId: clinicId || '',
    branchName: '', address: '', city: '',
    contactNumber: '', email: '',
    latitude: '', longitude: '', virtualClinicTour: '', location: '',
  }
  const [formData, setFormData] = useState(initialForm)

  /* ── load ── */
  useEffect(() => { loadBranches() }, [])
  useEffect(() => {
    const onRefresh = () => { loadBranches() }
    window.addEventListener('clinic:branches:refresh', onRefresh)
    return () => window.removeEventListener('clinic:branches:refresh', onRefresh)
  }, [])
  useEffect(() => { if (clinicId) setFormData((p) => ({ ...p, clinicId })) }, [clinicId])
  useEffect(() => { setCurrentPage(1) }, [searchTerm, filterCity])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const res = await fetchBranchById(clinicId)
      setBranches(Array.isArray(res.data) ? res.data : [])
      setError('')
    } catch { setError('Failed to load branches.') }
    finally { setLoading(false) }
  }

  const flash = (setter, msg) => { setter(msg); setTimeout(() => setter(''), 3000) }

const buildBranchPayload = (currentData) => {
  const cleanUrl = (v) => {
    const trimmed = v?.trim() ?? ""
    return trimmed === "" ? "" : trimmed   // explicit: whitespace-only becomes truly empty
  }
  return {
    ...currentData,
    location: cleanUrl(currentData.location),
    virtualClinicTour: cleanUrl(currentData.virtualClinicTour),
  }
}

  /* ── form change ── */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
    setValidationErrors((p) => { const u = { ...p }; delete u[name]; return u })
  }

  /* ── validation ── */
  const validateForm = () => {
    const errs = {}
    if (!formData.branchName || !/^.{3,50}$/.test(formData.branchName.trim()) || !/[A-Za-z]/.test(formData.branchName))
      errs.branchName = 'Branch Name must be 3–50 characters and contain at least one letter.'
    if (!formData.clinicId || !/^\d{1,10}$/.test(String(formData.clinicId).trim()))
      errs.clinicId = 'Clinic ID must be 1–10 digits.'
    if (!formData.address || formData.address.trim().length < 5 || formData.address.trim().length > 500 || !/[A-Za-z]/.test(formData.address))
      errs.address = 'Address must be 5–500 characters and contain at least one letter.'
    if (!formData.city || !/^[A-Za-z\s]{2,50}$/.test(formData.city.trim()))
      errs.city = 'City must be 2–50 letters and spaces only.'
    if (!formData.contactNumber || !/^[1-9][0-9]{9}$/.test(formData.contactNumber.trim()))
      errs.contactNumber = 'Must be exactly 10 digits and cannot start with 0.'
    if (!formData.email) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Invalid email format.'
    const lat = parseFloat(formData.latitude)
    if (!formData.latitude) errs.latitude = 'Latitude is required.'
    else if (isNaN(lat) || lat < -90 || lat > 90) errs.latitude = 'Must be between -90 and 90.'
    const lng = parseFloat(formData.longitude)
    if (!formData.longitude) errs.longitude = 'Longitude is required.'
    else if (isNaN(lng) || lng < -180 || lng > 180) errs.longitude = 'Must be between -180 and 180.'
    if (formData.virtualClinicTour?.trim()) {
      if (!/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(formData.virtualClinicTour.trim()))
        errs.virtualClinicTour = 'Must be a valid URL starting with http:// or https://'
    }
    if (formData.location?.trim()) {
  if (!/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(formData.location.trim()))
    errs.location = 'Must be a valid URL starting with http:// or https://'
}
    setValidationErrors(errs)
    return Object.keys(errs).length === 0
  }

const handleSubmit = async () => {
  if (!validateForm()) return
  try {
    setSubmitLoading(true)
    const payload = buildBranchPayload(formData)

    if (editingBranch) {
      await updateBranchData(editingBranch.branchId, payload)
      const updatedBranch = { ...editingBranch, ...payload }
      setBranches((prev) => prev.map((branch) => (branch.branchId === editingBranch.branchId ? updatedBranch : branch)))
      flash(setSuccess, 'Branch updated successfully!')
    } else {
      await createNewBranch(payload)
      flash(setSuccess, 'Branch created successfully!')
    }
    setModalVisible(false)
    resetForm()
    setEditingBranch(null)
    loadBranches()
    try { window.dispatchEvent(new Event('clinic:branches:refresh')) } catch (e) { /* ignore */ }
  } catch (err) {
    flash(setError, `Error ${editingBranch ? 'updating' : 'creating'} branch: ${err.message}`)
  } finally { setSubmitLoading(false) }
}

  /* ── delete ── */
  const handleDelete = async () => {
    try {
      setSubmitLoading(true)
      await deleteBranchById(deletingBranch.branchId)
      flash(setSuccess, 'Branch deleted successfully!')
      setDeleteModalVisible(false)
      loadBranches()
    } catch (err) {
      flash(setError, `Error deleting branch: ${err.message}`)
    } finally { setSubmitLoading(false) }
  }

  const handleEdit = (branch) => {
    setEditingBranch(branch)
    setFormData({
      clinicId: formData.clinicId || '',
      branchName: branch.branchName || '',
      address: branch.address || '',
      city: branch.city || '',
      contactNumber: branch.contactNumber || '',
      email: branch.email || '',
      latitude: branch.latitude || '',
      longitude: branch.longitude || '',
      virtualClinicTour: branch.virtualClinicTour || '',
      location: branch.location || '',
    })
    setValidationErrors({})
    setModalVisible(true)
  }

  const handleAddNew = () => {
    setEditingBranch(null)
    resetForm()
    setValidationErrors({})
    setModalVisible(true)
  }

  const resetForm = () => setFormData(initialForm)

  const handleCloseModal = () => {
    setModalVisible(false)
    setEditingBranch(null)
    resetForm()
    setValidationErrors({})
  }

  /* ── filter + paginate ── */
  const filteredBranches = branches.filter((b) => {
    const q = searchTerm.toLowerCase()
    const matchSearch = b.branchName?.toLowerCase().includes(q) ||
      b.address?.toLowerCase().includes(q) ||
      b.city?.toLowerCase().includes(q)
    const matchCity = filterCity ? b.city === filterCity : true
    return matchSearch && matchCity
  })

  const indexOfLastItem  = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const paginatedBranches = filteredBranches.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage)
  const cities = [...new Set(branches.map((b) => b.city).filter(Boolean))]

  const handlePageChange = (p) => { if (p >= 1 && p <= totalPages) setCurrentPage(p) }
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
        .abf-table thead th {
          background: #1a3a6b !important; color: #fff !important;
          font-size: 12px; font-weight: 600; padding: 12px 14px;
          border: none; letter-spacing: 0.3px;
        }
        .abf-table tbody tr { font-size: 13px; transition: background 0.15s; }
        .abf-table tbody tr:hover { background: #eef4fb !important; }
        .abf-table tbody td { padding: 11px 14px; vertical-align: middle; border-color: #f0f0f0; color: #374151; }
        .abf-action-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1.5px solid transparent; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .abf-action-btn.view   { border-color: #1a3a6b; color: #1a3a6b; }
        .abf-action-btn.view:hover   { background: #1a3a6b; color: #fff; }
        .abf-action-btn.edit   { border-color: #f9a825; color: #f9a825; }
        .abf-action-btn.edit:hover   { background: #f9a825; color: #fff; }
        .abf-action-btn.delete { border-color: #ef4444; color: #ef4444; }
        .abf-action-btn.delete:hover { background: #ef4444; color: #fff; }
        .abf-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center; justify-content: center;
          gap: 4px; white-space: nowrap;
        }
        .abf-page-btn:hover:not(:disabled):not(.active) { border-color: #1a3a6b; color: #1a3a6b; background: #eef4fb; }
        .abf-page-btn.active { background: #1a3a6b; color: #fff; border-color: #1a3a6b; }
        .abf-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .abf-input:focus { border-color: #1a3a6b !important; box-shadow: 0 0 0 3px rgba(24,95,165,0.10); }
      `}</style>

      {/* ── toast alerts ── */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px',
          padding: '10px 14px', marginBottom: '14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '13px', color: '#b91c1c',
        }}>
          {error}
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c' }}><X size={14} /></button>
        </div>
      )}
      {success && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px',
          padding: '10px 14px', marginBottom: '14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '13px', color: '#166534',
        }}>
          {success}
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}><X size={14} /></button>
        </div>
      )}

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <h6 style={{ margin: 0, color: '#1a3a6b', fontWeight: '700', fontSize: '15px' }}>Branch Management</h6>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
            {filteredBranches.length} branch{filteredBranches.length !== 1 ? 'es' : ''} found
          </p>
        </div>
        <button
          onClick={handleAddNew}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '8px 18px', borderRadius: '10px',
            background: '#1a3a6b', color: '#fff', border: 'none',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(24,95,165,0.28)', transition: 'background 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0c447c')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#1a3a6b')}
        >
          <Plus size={15} /> Add New Branch
        </button>
      </div>

      {/* ── Search + Filter bar ── */}
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '14px 18px',
        marginBottom: '16px', boxShadow: '0 2px 12px rgba(24,95,165,0.07)',
        border: '1px solid #e8eef5', display: 'flex', gap: '12px',
        alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            className="abf-input"
            type="text"
            placeholder="Search by name, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inp(false, false), paddingLeft: '34px' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        <select
          className="abf-input"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          style={{ ...inp(false, false), minWidth: '160px' }}
        >
          <option value="">All Cities</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>

      {/* ── Table card ── */}
      <div style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(24,95,165,0.08)', border: '1px solid #e8eef5',
      }}>
        {loading ? (
          <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
            <CSpinner color="primary" />
          </div>
        ) : filteredBranches.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            <GitBranch size={36} color="#b5d4f4" style={{ marginBottom: '10px' }} />
            <p style={{ margin: 0 }}>No branches found.</p>
          </div>
        ) : (
          <>
            <CTable className="abf-table mb-0" hover responsive>
              <CTableHead>
                <CTableRow>
                  {['S.No', 'Branch Name', 'Address', 'City', 'Contact', 'Actions'].map((h) => (
                    <CTableHeaderCell key={h} className={h === 'Actions' ? 'text-center' : ''}>{h}</CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedBranches.map((branch, index) => (
                  <CTableRow key={branch.branchId}>
                    <CTableDataCell style={{ color: '#9ca3af', fontWeight: '600', fontSize: '12px' }}>
                      {indexOfFirstItem + index + 1}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: '500' }}>{branch.branchName}</CTableDataCell>
                    <CTableDataCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {branch.address}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: '#e6f1fb', color: '#0c447c',
                      }}>{branch.city}</span>
                    </CTableDataCell>
                    <CTableDataCell>{branch.contactNumber}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button className="abf-action-btn view" title="View"
                          onClick={() => navigate(`/branch-details/${branch.branchId}`)}>
                          <Eye size={14} />
                        </button>
                        {index !== 0 && (
                          <>
                            <button className="abf-action-btn edit" title="Edit"
                              onClick={() => handleEdit(branch)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="abf-action-btn delete" title="Delete"
                              onClick={() => { setDeletingBranch(branch); setDeleteModalVisible(true) }}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* ── Pagination ── */}
            {filteredBranches.length > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 18px', borderTop: '1px solid #f0f0f0',
                flexWrap: 'wrap', gap: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                    style={{ padding: '5px 8px', border: '1.5px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', color: '#374151', cursor: 'pointer', outline: 'none', background: '#fff' }}
                  >
                    {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button className="abf-page-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                    <ChevronLeft size={13} /> Prev
                  </button>
                  {getPaginationPages().map((p, i) =>
                    p === '…' ? (
                      <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}>…</span>
                    ) : (
                      <button key={p} className={`abf-page-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => handlePageChange(p)}>{p}</button>
                    )
                  )}
                  <button className="abf-page-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                    Next <ChevronRight size={13} />
                  </button>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                    Page <strong style={{ color: '#1a3a6b' }}>{currentPage}</strong> of{' '}
                    <strong style={{ color: '#1a3a6b' }}>{totalPages}</strong>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ Add / Edit Modal ══ */}
      <CModal visible={modalVisible} onClose={handleCloseModal} size="lg" backdrop="static">
        <CModalHeader style={{ background: '#1a3a6b', borderBottom: 'none', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={16} color="#fff" />
            </div>
            <strong style={{ color: '#fff', fontSize: '15px' }}>
              {editingBranch ? 'Edit Branch' : 'Add New Branch'}
            </strong>
          </div>
        </CModalHeader>

        <CModalBody style={{ padding: '20px 24px', background: '#f7fafd' }}>
          <SectionBar text="Branch Information" />
          <CRow className="g-3">
            <CCol md={6}>
              <Field label="Clinic ID">
                <input className="abf-input" style={inp(false, true)} value={formData.clinicId} disabled />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="Branch Name" required error={validationErrors.branchName}>
                <input className="abf-input" style={inp(!!validationErrors.branchName, false)}
                  name="branchName" value={formData.branchName}
                  placeholder="e.g. Downtown Branch"
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="Address" required error={validationErrors.address}>
                <input className="abf-input" style={inp(!!validationErrors.address, false)}
                  name="address" value={formData.address}
                  placeholder="Full address"
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="City" required error={validationErrors.city}>
                <input className="abf-input" style={inp(!!validationErrors.city, false)}
                  name="city" value={formData.city}
                  placeholder="e.g. Hyderabad"
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="Contact Number" required error={validationErrors.contactNumber}>
                <input className="abf-input" style={inp(!!validationErrors.contactNumber, false)}
                  name="contactNumber" value={formData.contactNumber}
                  placeholder="10-digit mobile number" maxLength={10}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                    setFormData((p) => ({ ...p, contactNumber: v }))
                    setValidationErrors((p) => { const u = { ...p }; delete u.contactNumber; return u })
                  }} />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="Email" required error={validationErrors.email}>
                <input className="abf-input" type="email"
                  style={inp(!!validationErrors.email, false)}
                  name="email" value={formData.email}
                  placeholder="branch@clinic.com"
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="Latitude" required error={validationErrors.latitude}>
                <input className="abf-input" type="number" step="any"
                  style={inp(!!validationErrors.latitude, false)}
                  name="latitude" value={formData.latitude}
                  placeholder="-90 to 90"
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={6}>
              <Field label="Longitude" required error={validationErrors.longitude}>
                <input className="abf-input" type="number" step="any"
                  style={inp(!!validationErrors.longitude, false)}
                  name="longitude" value={formData.longitude}
                  placeholder="-180 to 180"
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={12}>
              <Field label="Virtual Clinic Tour URL" error={validationErrors.virtualClinicTour}>
                <input className="abf-input"
                  style={inp(!!validationErrors.virtualClinicTour, false)}
                  name="virtualClinicTour" value={formData.virtualClinicTour}
                  placeholder="https://..."
                  onChange={handleChange} />
              </Field>
            </CCol>
            <CCol md={12}>
  <Field label="Clinic Location URL" error={validationErrors.location}>
    <input className="abf-input"
      style={inp(!!validationErrors.location, false)}
      name="location" value={formData.location}
      placeholder="https://..."
      onChange={handleChange} />
      
  </Field>
</CCol>
          </CRow>
        </CModalBody>

        <CModalFooter style={{ background: '#fff', borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: '8px' }}>
          <button
            onClick={handleCloseModal}
            style={{ padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              background: '#1a3a6b', color: '#fff', fontWeight: '600', fontSize: '13px',
              cursor: submitLoading ? 'not-allowed' : 'pointer', opacity: submitLoading ? 0.65 : 1,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            {submitLoading
              ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
              : editingBranch ? '✓ Update Branch' : '+ Add Branch'
            }
          </button>
        </CModalFooter>
      </CModal>

      {/* ── Delete confirm ── */}
      <ConfirmationModal
        isVisible={deleteModalVisible}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete branch{' '}
            <strong style={{ color: '#0c447c' }}>{deletingBranch?.branchName}</strong>?
            This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        loading={submitLoading}
      />
    </div>
  )
}

export default AddBranchForm