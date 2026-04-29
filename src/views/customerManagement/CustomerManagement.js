import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'
import { Edit2, Eye, Trash2, UserPlus, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { CustomerData, deleteCustomerData, addCustomer, getCustomerByMobile, updateCustomerData } from './CustomerAPI'
import { ToastContainer, toast } from 'react-toastify'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import LoadingIndicator from '../../Utils/loader'

const CustomerManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery]   = useState('')
  const [customerData, setCustomerData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [currentPage, setCurrentPage]   = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isAdding, setIsAdding]         = useState(false)
  const [isEditing, setIsEditing]       = useState(false)
  const [currentMobile, setCurrentMobile]           = useState(null)
  const [formattedDisplayDate, setFormattedDisplayDate] = useState('')
  const [isModalVisible, setIsModalVisible]         = useState(false)
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null)
  const [formErrors, setFormErrors]     = useState({})

  const [formData, setFormData] = useState({
    fullName: '', mobileNumber: '', gender: '',
    emailId: '', dateOfBirth: '', referCode: '',
  })

  const indexOfLastItem  = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems     = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages       = Math.ceil(filteredData.length / itemsPerPage)

  const fetchCustomers = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await CustomerData()
      const safeData = Array.isArray(data) ? data.filter((i) => i && typeof i === 'object') : []
      setCustomerData(safeData); setFilteredData(safeData)
    } catch {
      setError('Failed to fetch customer data.')
      setCustomerData([]); setFilteredData([])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) { setFilteredData(customerData); setCurrentPage(1); return }
    setFilteredData(customerData.filter((c) =>
      (c?.fullName || '').toLowerCase().startsWith(q) ||
      (c?.mobileNumber || '').toString().startsWith(q) ||
      (c?.emailId || '').toLowerCase().startsWith(q)
    ))
    setCurrentPage(1)
  }, [searchQuery, customerData])

  useEffect(() => {
    if (formData.dateOfBirth) {
      const d = new Date(formData.dateOfBirth)
      if (!isNaN(d)) {
        setFormattedDisplayDate(
          `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
        )
      } else setFormattedDisplayDate('')
    } else setFormattedDisplayDate('')
  }, [formData.dateOfBirth])

  const handleEditCustomer = async (mobileNumber) => {
    try {
      setLoading(true)
      const response = await getCustomerByMobile(mobileNumber)
      const customer = response.data || response
      let formattedDate = ''
      if (customer.dateOfBirth) {
        const dobStr = customer.dateOfBirth.trim()
        if (/^\d{2}-\d{2}-\d{4}$/.test(dobStr)) {
          const [day, month, year] = dobStr.split('-')
          formattedDate = `${year}-${month}-${day}`
        } else {
          const p = new Date(dobStr)
          if (!isNaN(p)) formattedDate = `${p.getFullYear()}-${String(p.getMonth() + 1).padStart(2, '0')}-${String(p.getDate()).padStart(2, '0')}`
        }
      }
      setFormData({
        fullName: customer.fullName || '', mobileNumber: customer.mobileNumber || '',
        gender: customer.gender || '', emailId: customer.emailId || '',
        dateOfBirth: formattedDate, referCode: customer.referCode || '',
      })
      setCurrentMobile(mobileNumber); setIsEditing(true); setIsAdding(true)
    } catch { toast.error('Failed to load customer data') }
    finally { setLoading(false) }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: undefined })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required'
    else if (/\d/.test(formData.fullName)) errors.fullName = 'Numbers not allowed'
    else if (!/^[A-Za-z.\s]+$/.test(formData.fullName)) errors.fullName = 'Only letters, spaces, dots allowed'
    else if (formData.fullName.trim().length < 3) errors.fullName = 'Minimum 3 characters'

    if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required'
    else if (!/^[1-9]\d{9}$/.test(formData.mobileNumber)) errors.mobileNumber = 'Must be 10 digits'

    if (!formData.emailId.trim()) errors.emailId = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) errors.emailId = 'Invalid email'

    if (!formData.dateOfBirth.trim()) errors.dateOfBirth = 'Date of Birth is required'
    else {
      const d = new Date(formData.dateOfBirth), today = new Date()
      if (isNaN(d)) errors.dateOfBirth = 'Invalid date'
      else if (d > today) errors.dateOfBirth = 'Cannot be future date'
      else {
        const old = new Date()
        old.setFullYear(today.getFullYear() - 100)
        if (d < old) errors.dateOfBirth = 'Too far in past'
      }
    }
    if (formData.referCode && /[^a-zA-Z0-9]/.test(formData.referCode)) errors.referCode = 'Only letters and numbers'
    if (!formData.gender) errors.gender = 'Gender is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!isEditing) {
      if (customerData.some((c) => c.mobileNumber === formData.mobileNumber)) { toast.error('Mobile number already exists'); return }
      if (customerData.some((c) => c.emailId === formData.emailId)) { toast.error('Email already exists'); return }
    }
    try {
      const updated = { ...formData }
      if (updated.dateOfBirth) {
        const d = new Date(updated.dateOfBirth)
        if (!isNaN(d)) updated.dateOfBirth = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
      }
      if (isEditing) { await updateCustomerData(updated.mobileNumber, updated); toast.success('Customer updated') }
      else { await addCustomer(updated); toast.success('Customer added') }
      await fetchCustomers(); handleCancel()
    } catch (err) {
      if (err?.response?.status === 409) toast.error('Already exists')
      else toast.error('Something went wrong')
    }
  }

  const handleCancel = () => {
    setIsAdding(false); setIsEditing(false); setCurrentMobile(null)
    setFormData({ fullName: '', mobileNumber: '', gender: '', emailId: '', dateOfBirth: '', referCode: '' })
    setFormErrors({})
  }

  const confirmDeleteCustomer = async () => {
    try {
      await deleteCustomerData(customerIdToDelete)
      toast.success('Customer deleted')
      setCustomerData((p) => p.filter((c) => c.mobileNumber !== customerIdToDelete))
      setFilteredData((p) => p.filter((c) => c.mobileNumber !== customerIdToDelete))
    } catch { toast.error('Failed to delete') }
    finally { setIsModalVisible(false); setCustomerIdToDelete(null) }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const inputStyle = (hasError) => ({
    border: `1.5px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '8px', fontSize: '13px',
    padding: '8px 12px', outline: 'none',
    width: '100%', transition: 'border-color 0.2s',
  })

  const labelStyle = {
    fontSize: '12px', fontWeight: '600',
    color: '#374151', marginBottom: '5px', display: 'block',
  }

  const getPaginationPages = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
        acc.push(p)
        return acc
      }, [])
  }

  return (
    <>
      <ToastContainer />
      <style>{`
        .cust-table thead th {
          background: #1a3a6b !important;
          color: #fff !important;
          font-size: 12px; font-weight: 600;
          padding: 12px 14px; border: none; letter-spacing: 0.3px;
        }
        .cust-table tbody tr { font-size: 13px; transition: background 0.15s; }
        .cust-table tbody tr:hover { background: #eef4fb !important; }
        .cust-table tbody td { padding: 11px 14px; vertical-align: middle; border-color: #f0f0f0; color: #374151; }
        .cust-action-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1.5px solid transparent; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .cust-action-btn.view  { border-color: #1a3a6b; color: #1a3a6b; }
        .cust-action-btn.view:hover  { background: #1a3a6b; color: #fff; }
        .cust-action-btn.edit  { border-color: #f9a825; color: #f9a825; }
        .cust-action-btn.edit:hover  { background: #f9a825; color: #fff; }
        .cust-action-btn.delete { border-color: #ef4444; color: #ef4444; }
        .cust-action-btn.delete:hover { background: #ef4444; color: #fff; }
        .cust-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center;
          justify-content: center; gap: 4px; white-space: nowrap;
        }
        .cust-page-btn:hover:not(:disabled):not(.active) {
          border-color: #1a3a6b; color: #1a3a6b; background: #eef4fb;
        }
        .cust-page-btn.active { background: #1a3a6b; color: #fff; border-color: #1a3a6b; }
        .cust-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .form-input:focus { border-color: #1a3a6b !important; box-shadow: 0 0 0 3px rgba(27,79,138,0.1); }
      `}</style>

      {!isAdding ? (
        <div>
          {/* ── Page Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h5 style={{ color: '#1a3a6b', fontWeight: '700', margin: 0, fontSize: '18px' }}>Patient Management</h5>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0' }}>
                {filteredData.length} customer{filteredData.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 18px', borderRadius: '10px',
                background: '#1a3a6b', color: '#fff',
                border: 'none', fontWeight: '600', fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,79,138,0.3)',
              }}
            >
              <UserPlus size={15} /> Add Patient
            </button>
          </div>

          {/* ── Search Bar ── */}
          <div style={{
            background: '#fff', borderRadius: '14px', padding: '14px 18px',
            marginBottom: '16px', boxShadow: '0 2px 12px rgba(27,79,138,0.07)',
            border: '1px solid #e8eef5', display: 'flex', gap: '12px',
            alignItems: 'center', flexWrap: 'wrap',
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search by name, mobile, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 34px',
                  border: '1.5px solid #e5e7eb', borderRadius: '9px',
                  fontSize: '13px', color: '#374151', outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* ── Table Card ── */}
          <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(27,79,138,0.08)', border: '1px solid #e8eef5' }}>
            {loading ? (
              <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
                <LoadingIndicator message="Loading customers..." />
              </div>
            ) : error ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>{error}
              </div>
            ) : filteredData.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>No customers found.
              </div>
            ) : (
              <>
                <CTable className="cust-table mb-0" hover responsive>
                  <CTableHead>
                    <CTableRow>
                      {['S.No', 'Full Name', 'Mobile Number', 'Gender', 'Date of Birth', 'Actions'].map((h) => (
                        <CTableHeaderCell key={h} className={h === 'Actions' ? 'text-center' : ''}>{h}</CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.map((customer, index) => (
                      <CTableRow key={customer.mobileNumber || index}>
                        <CTableDataCell style={{ color: '#9ca3af', fontWeight: '600', fontSize: '12px' }}>
                          {indexOfFirstItem + index + 1}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontWeight: '500' }}>{customer?.fullName || '—'}</CTableDataCell>
                        <CTableDataCell>{customer?.mobileNumber || '—'}</CTableDataCell>
                        <CTableDataCell>
                          <span style={{
                            padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                            background: customer?.gender === 'Male' ? '#dbeafe' : customer?.gender === 'Female' ? '#fce7f3' : '#f3f4f6',
                            color: customer?.gender === 'Male' ? '#1e40af' : customer?.gender === 'Female' ? '#9d174d' : '#374151',
                          }}>
                            {customer?.gender || '—'}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>{customer?.dateOfBirth || '—'}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                            <button className="cust-action-btn view" title="View"
                              onClick={() => navigate(`/customer-management/${customer?.mobileNumber}`)}>
                              <Eye size={14} />
                            </button>
                            <button className="cust-action-btn edit" title="Edit"
                              onClick={() => handleEditCustomer(customer?.mobileNumber)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="cust-action-btn delete" title="Delete"
                              onClick={() => { setCustomerIdToDelete(customer?.mobileNumber); setIsModalVisible(true) }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <ConfirmationModal
                            isVisible={isModalVisible}
                            message="Are you sure you want to delete this customer?"
                            onConfirm={confirmDeleteCustomer}
                            onCancel={() => { setIsModalVisible(false); setCustomerIdToDelete(null) }}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {/* ── Pagination ── */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 18px', borderTop: '1px solid #f0f0f0',
                  flexWrap: 'wrap', gap: '10px',
                }}>
                  {/* Left: Rows per page */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Rows per page:</span>
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

                  {/* Right: Prev + pages + Next + Page X of Y */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="cust-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft size={13} /> Prev
                    </button>

                    {getPaginationPages().map((p, i) =>
                      p === '…' ? (
                        <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}>…</span>
                      ) : (
                        <button
                          key={p}
                          className={`cust-page-btn ${currentPage === p ? 'active' : ''}`}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      className="cust-page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next <ChevronRight size={13} />
                    </button>

                    <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                      Page <strong style={{ color: '#1a3a6b' }}>{currentPage}</strong> of{' '}
                      <strong style={{ color: '#1a3a6b' }}>{totalPages}</strong>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      ) : (
        /* ── ADD / EDIT FORM ── */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <button
              onClick={handleCancel}
              style={{ width: '34px', height: '34px', borderRadius: '9px', border: '1.5px solid #1a3a6b', background: '#fff', color: '#1a3a6b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <div>
              <h5 style={{ color: '#1a3a6b', fontWeight: '700', margin: 0, fontSize: '18px' }}>
                {isEditing ? 'Edit Patient' : 'Add New Patient'}
              </h5>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' }}>
                {isEditing ? 'Update patient information below' : 'Fill in the details to add a new patient'}
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 16px rgba(27,79,138,0.08)', border: '1px solid #e8eef5' }}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #f0f4f8' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#eef4fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px' }}>👤</span>
                  </div>
                  <span style={{ color: '#1a3a6b', fontWeight: '700', fontSize: '13px' }}>Personal Information</span>
                </div>

                <CRow className="g-3">
                  <CCol md={6}>
                    <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      name="fullName" value={formData.fullName}
                      onChange={handleInputChange} placeholder="Enter full name"
                      style={{ ...inputStyle(!!formErrors.fullName), textTransform: 'capitalize' }}
                      className="form-input"
                      onKeyDown={(e) => { if (/\d/.test(e.key)) e.preventDefault() }}
                      onPaste={(e) => { if (/\d/.test(e.clipboardData.getData('text'))) { e.preventDefault(); toast.error('Numbers not allowed') } }}
                    />
                    {formErrors.fullName && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.fullName}</div>}
                  </CCol>

                  <CCol md={6}>
                    <label style={labelStyle}>Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      name="mobileNumber" value={formData.mobileNumber}
                      onChange={handleInputChange} maxLength={10}
                      disabled={isEditing} placeholder="10-digit mobile number"
                      style={{ ...inputStyle(!!formErrors.mobileNumber), background: isEditing ? '#f9fafb' : '#fff' }}
                      className="form-input"
                      onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') e.preventDefault() }}
                      onPaste={(e) => e.preventDefault()}
                    />
                    {formErrors.mobileNumber && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.mobileNumber}</div>}
                  </CCol>

                  <CCol md={6}>
                    <label style={labelStyle}>Email ID <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      name="emailId" value={formData.emailId} type="email"
                      onChange={handleInputChange} placeholder="example@email.com"
                      style={inputStyle(!!formErrors.emailId)} className="form-input"
                    />
                    {formErrors.emailId && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.emailId}</div>}
                  </CCol>

                  <CCol md={6}>
                    <label style={labelStyle}>Gender <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      name="gender" value={formData.gender} onChange={handleInputChange}
                      style={inputStyle(!!formErrors.gender)} className="form-input"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                    {formErrors.gender && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.gender}</div>}
                  </CCol>

                  <CCol md={6}>
                    <label style={labelStyle}>Date of Birth <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      name="dateOfBirth" value={formData.dateOfBirth} type="date"
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      style={inputStyle(!!formErrors.dateOfBirth)} className="form-input"
                    />
                    {formErrors.dateOfBirth && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.dateOfBirth}</div>}
                    {formattedDisplayDate && (
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>📅 {formattedDisplayDate}</div>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <label style={labelStyle}>Referral Code</label>
                    <input
                      name="referCode" value={formData.referCode}
                      onChange={handleInputChange} placeholder="Optional"
                      style={inputStyle(!!formErrors.referCode)} className="form-input"
                    />
                    {formErrors.referCode && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{formErrors.referCode}</div>}
                  </CCol>
                </CRow>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #f0f4f8' }}>
                <button
                  type="button" onClick={handleCancel}
                  style={{ padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 24px', borderRadius: '10px', background: '#1a3a6b', color: '#fff', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,79,138,0.3)' }}
                >
                  {isEditing ? '✓ Update Customer' : '+ Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default React.memo(CustomerManagement)