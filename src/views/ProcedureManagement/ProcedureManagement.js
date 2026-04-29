import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CRow, CCol, CFormSelect, CFormInput, CButton,
  CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle,
  CTable, CCard, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CForm, CCardHeader, CInputGroup,
  CInputGroupText, CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL, updateSubservices } from '../../baseUrl'
import {
  postSubService, getAllSubServices, deleteSubServiceData, getSubServiceId,
} from './ProcedureAPI'
import { getServiceByCategoryId } from '../servicesManagement/ServiceAPI'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import { Edit2, Eye, Trash2, Search, Plus } from 'lucide-react'
import LoadingIndicator from '../../Utils/loader'

/* ─── Inline styles ──────────────────────────────────────────────────────── */
const S = {
  wrap: { background: '#f0f4f8', minHeight: '100vh', padding: '1.5rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(27,79,138,0.10)', overflow: 'hidden' },

  /* Header */
  header: { background: '#1B4F8A', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' },
  headerTitle: { color: '#fff', fontSize: '1.15rem', fontWeight: 600, margin: 0 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginTop: 2 },
  headerRight: { display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' },

  searchBox: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 7, padding: '0 0.6rem', height: 36 },
  searchInput: { background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.82rem', width: 180 },

  btnAdd: { background: '#fff', color: '#1B4F8A', border: 'none', borderRadius: 7, padding: '0 1rem', height: 36, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 },

  /* Filter bar */
  filterBar: { display: 'flex', gap: '0.5rem', padding: '0.85rem 1.5rem', borderBottom: '1px solid #e8eef5', background: '#f8fafd', alignItems: 'center', flexWrap: 'wrap' },
  filterBtnBase: { border: '1px solid #d0daea', borderRadius: 20, padding: '0.3rem 0.9rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' },
  filterBtnActive: { background: '#1B4F8A', color: '#fff', borderColor: '#1B4F8A' },
  filterBtnInactive: { background: '#fff', color: '#1B4F8A' },
  countBadge: { background: '#1B4F8A', color: '#fff', borderRadius: 20, padding: '0.28rem 0.7rem', fontSize: '0.75rem', fontWeight: 600 },

  /* Table */
  thead: { background: '#1B4F8A' },
  th: { color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.8rem 1rem', letterSpacing: '0.02em', whiteSpace: 'nowrap', borderBottom: 'none' },
  td: { padding: '0.75rem 1rem', fontSize: '0.83rem', color: '#2d3748', verticalAlign: 'middle', borderBottom: '1px solid #eef2f7' },
  sno: { color: '#6b7a8d', fontSize: '0.78rem', fontWeight: 500 },

  /* Badges */
  bookingId: { display: 'inline-block', background: '#e8f0fa', color: '#1B4F8A', border: '1px solid #b8d0ec', borderRadius: 20, padding: '0.18rem 0.7rem', fontSize: '0.76rem', fontWeight: 600, whiteSpace: 'nowrap' },
  procedureName: { fontWeight: 600, color: '#1B4F8A' },

  /* Action buttons */
  actionCell: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 },
  actionBtnBase: { width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', transition: 'all 0.15s' },
  btnView: { border: '1.5px solid #3b82f6', color: '#3b82f6' },
  btnEdit: { border: '1.5px solid #f59e0b', color: '#f59e0b' },
  btnDelete: { border: '1.5px solid #ef4444', color: '#ef4444' },

  /* Pagination bar */
  paginationBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', background: '#f8fafd', borderTop: '1px solid #e8eef5', flexWrap: 'wrap', gap: '0.5rem' },
  rowsLabel: { fontSize: '0.78rem', color: '#6b7a8d', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  rowsSelect: { border: '1px solid #d0daea', borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.78rem', color: '#2d3748', background: '#fff', outline: 'none', cursor: 'pointer' },
  pageInfo: { fontSize: '0.78rem', color: '#6b7a8d' },
  paginationWrap: { display: 'flex', alignItems: 'center', gap: 4 },
  pgBtnBase: { minWidth: 30, height: 30, borderRadius: 6, border: '1px solid #d0daea', background: '#fff', color: '#1B4F8A', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' },
  pgBtnActive: { background: '#1B4F8A', color: '#fff', borderColor: '#1B4F8A' },
  pgText: { fontSize: '0.78rem', color: '#6b7a8d', padding: '0 4px' },

  /* Modal */
  modalHead: { background: '#1B4F8A', color: '#fff' },
  modalTitle: { color: '#fff', fontWeight: 600 },
  formLabel: { fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.3rem', display: 'block' },
  formControl: { width: '100%', border: '1px solid #d0daea', borderRadius: 7, padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#2d3748', outline: 'none', background: '#fff' },
  btnGreen: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 7, padding: '0 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', height: 36, whiteSpace: 'nowrap' },
  btnCancel: { background: '#fff', border: '1px solid #d0daea', color: '#4a5568', borderRadius: 7, padding: '0 1.1rem', height: 36, fontSize: '0.82rem', cursor: 'pointer' },
  btnSubmit: { background: '#1B4F8A', color: '#fff', border: 'none', borderRadius: 7, padding: '0 1.4rem', height: 36, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' },
  pendingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f6ff', border: '1px solid #b8d0ec', borderRadius: 7, padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#1B4F8A', marginTop: 6 },
  btnRm: { background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 5, padding: '0.15rem 0.55rem', fontSize: '0.72rem', cursor: 'pointer' },

  /* Empty */
  emptyCell: { textAlign: 'center', color: '#9aa5b4', padding: '2.5rem', fontSize: '0.85rem' },

  /* View modal card */
  viewCard: { background: '#f9fafb', border: '1px solid #e8eef5', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1rem' },
  viewBadge: { background: '#e8f0fa', color: '#1B4F8A', border: '1px solid #b8d0ec', borderRadius: 6, padding: '0.18rem 0.7rem', fontSize: '0.75rem', fontWeight: 600 },
}



const ProcedureManagement = () => {
  const [category, setCategory] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [selectedSubServices, setSelectedSubServices] = useState([])
  const [selectSubService, setSelectSubService] = useState(null)
  const [subServiceInput, setSubServiceInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [removeShowModal, setRemoveShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editSubServiceId, setEditSubServiceId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSubServices, setFilteredSubServices] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteServiceId, setDeleteServiceId] = useState(null)
  const [selectedSub, setSelectedSub] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [subServices, setSubServices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [errors, setErrors] = useState({ category: '', service: '', subService: '' })
  const [newService, setNewService] = useState({ categoryName: '', categoryId: '', serviceName: '', serviceId: '' })

  useEffect(() => { fetchSubServices(); fetchCategories() }, [])

  /* ── Derived ── */
  const afterFilter = activeFilter === 'All'
    ? filteredSubServices
    : filteredSubServices.filter(r => r.category === activeFilter)

  const totalPages = Math.ceil(afterFilter.length / itemsPerPage)
  const indexOfFirst = (currentPage - 1) * itemsPerPage
  const indexOfLast = indexOfFirst + itemsPerPage
  const currentItems = afterFilter.slice(indexOfFirst, indexOfLast)

  /* ── Enter key ── */
  useEffect(() => {
    const handler = e => { if (e.key === 'Enter' && showModal) { e.preventDefault(); handleSubmit() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showModal, newService, selectedSubServices, editMode])

  /* ── Search filter ── */
  useEffect(() => {
    if (!searchQuery.trim()) { setFilteredSubServices(subServices); return }
    const q = searchQuery.toLowerCase()
    setFilteredSubServices(subServices.filter(r =>
      r.category?.toLowerCase().includes(q) ||
      r.service?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q)
    ))
    const newTotal = Math.ceil(filteredSubServices.length / itemsPerPage)
    if (currentPage > newTotal) setCurrentPage(newTotal || 1)
  }, [searchQuery, subServices])

  /* ── When filter changes, reset page ── */
  useEffect(() => { setCurrentPage(1) }, [activeFilter])

  /* ─── API calls ─────────────────────────────────────────────────────────── */
  const fetchSubServices = async () => {
    try {
      const result = await getAllSubServices()
      const formatted = result.flatMap(cat =>
        Array.isArray(cat.subServices)
          ? cat.subServices.map(sub => ({
            id: sub.subServiceId,
            name: sub.subServiceName,
            category: cat.categoryName,
            service: sub.serviceName,
            serviceId: sub.serviceId,
          }))
          : []
      )
      setSubServices(formatted)
      setFilteredSubServices(formatted)
    } catch { setSubServices([]); setFilteredSubServices([]) }
  }

  const fetchCategories = async () => {
    try {
      const res = await CategoryData()
      if (res?.data) setCategory(res.data || [])
    } catch { setCategory([]) }
  }

  /* ─── Helpers ────────────────────────────────────────────────────────────── */
  const normalize = val => (val ? val.toString().trim().toLowerCase() : '')

  const validateFields = () => {
    const e = {}
    if (!newService.categoryId) e.category = 'Please select a category'
    if (!newService.serviceId) e.service = 'Please select a service'
    if (!editMode && selectedSubServices.length === 0) e.subService = 'Please add at least one Procedure'
    if (editMode && selectedSubServices[0]?.subServiceName?.trim() === '') e.subService = 'Procedure name cannot be empty'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ─── Handlers ───────────────────────────────────────────────────────────── */
  const handleChanges = async e => {
    const { name, value } = e.target
    setErrors(prev => ({ ...prev, [name === 'categoryName' ? 'category' : 'service']: '' }))
    if (name === 'categoryName') {
      const sel = category.find(c => c.categoryId === value)
      setNewService(prev => ({ ...prev, categoryName: sel?.categoryName || '', categoryId: value, serviceName: '', serviceId: '' }))
      try { setServiceOptions(await getServiceByCategoryId(value)) } catch { setServiceOptions([]) }
    } else {
      const sel = serviceOptions.find(s => s.serviceId === value)
      setNewService(prev => ({ ...prev, serviceName: sel?.serviceName || '', serviceId: value }))
    }
  }

  const handleViewService = async id => {
    try {
      const res = await getSubServiceId(id)
      if (!res?.data) { toast.error('SubService not found'); return }
      setSelectSubService({ ...res.data, subServices: (res.data.subServices || []).filter(s => s.subServiceId === id) })
      setViewModalVisible(true)
    } catch { toast.error('Failed to fetch SubService details') }
  }

  const handleCategoryEdit = async row => {
    setEditMode(true); setEditSubServiceId(row.id); setShowModal(true)
    const sel = category.find(c => c.categoryName === row.category)
    const catId = sel?.categoryId || ''
    try {
      const res = await getServiceByCategoryId(catId)
      setServiceOptions(res)
      const svc = res.find(s => s.serviceName === row.service)
      setNewService({ categoryName: row.category, categoryId: catId, serviceName: row.service, serviceId: svc?.serviceId || '' })
    } catch { setServiceOptions([]) }
    setSelectedSubServices([{ subServiceName: row.name, serviceName: row.service, serviceId: row.serviceId }])
  }

  const handleCloseForm = () => {
    setNewService({ categoryId: '', categoryName: '', serviceName: '', serviceId: '' })
    setSelectedSubServices([]); setErrors({}); setEditMode(false); setShowModal(false)
  }

  const handleRemoveClick = sub => { setSelectedSub(sub); setRemoveShowModal(true) }
  const handleConfirmRemove = () => { setSelectedSubServices(prev => prev.filter(i => i !== selectedSub)); setRemoveShowModal(false) }

  const confirmDelete = id => { setDeleteServiceId(id); setShowDeleteModal(true) }
  const handleConfirmDelete = async () => {
    if (!deleteServiceId) return
    try {
      const res = await deleteSubServiceData(deleteServiceId)
      if (res?.success) { toast.success(res.message || 'Deleted successfully!'); await fetchSubServices() }
      else toast.error('Failed to delete.')
    } catch { toast.error('Failed to delete.') }
    setShowDeleteModal(false); setDeleteServiceId(null)
  }

  const handleSubmit = async () => {
    if (!validateFields()) return
    try {
      if (editMode && editSubServiceId) {
        for (const sub of selectedSubServices) {
          const isDup = Array.isArray(subServices) && subServices.some(s =>
            s.id !== editSubServiceId && s.serviceId === sub.serviceId && normalize(s.name) === normalize(sub.subServiceName)
          )
          if (isDup) { setErrors(p => ({ ...p, subService: `"${sub.subServiceName}" already exists under this service.` })); return }
        }
        const payload = { subServices: selectedSubServices.map(s => ({ serviceId: s.serviceId, serviceName: s.serviceName, subServiceName: s.subServiceName })) }
        try {
          const res = await axios.put(`${BASE_URL}/${updateSubservices}/${editSubServiceId}`, payload)
          if (res?.data?.success) { await fetchSubServices(); toast.success('Procedure updated successfully!') }
          else toast.error(res?.data?.message || 'Failed to update.')
        } catch (err) { toast.error(err.response?.data?.message || 'Error updating Procedure') }
      } else {
        for (const sub of selectedSubServices) {
          const isDup = Array.isArray(subServices) && subServices.some(s =>
            s.serviceId === sub.serviceId && normalize(s.name) === normalize(sub.subServiceName)
          )
          if (isDup) { setErrors(p => ({ ...p, subService: `"${sub.subServiceName}" already exists under this service.` })); return }
        }
        const payload = { categoryId: newService.categoryId, subServices: selectedSubServices.map(s => ({ serviceId: s.serviceId, serviceName: s.serviceName, subServiceName: s.subServiceName })) }
        try {
          const res = await postSubService(payload)
          if (res?.data?.success) toast.success('Procedure added successfully')
          else toast.error(res?.data?.message || 'Submission failed')
        } catch (err) { toast.error(err.response?.data?.message || 'Error submitting Procedures') }
      }
      await fetchSubServices()
      setSelectedSubServices([]); setSubServiceInput('')
      setNewService({ categoryName: '', categoryId: '', serviceName: '', serviceId: '' })
      setEditMode(false); setEditSubServiceId(null); setShowModal(false)
    } catch { toast.error('Error submitting subservices') }
  }

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={S.wrap}>
      <ToastContainer />
      <div style={S.card}>

        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <h4 style={S.headerTitle}>Procedure Management</h4>
            <p style={S.headerSub}>Manage all categories, services &amp; procedures</p>
          </div>
          <div style={S.headerRight}>
            <div style={S.searchBox}>
              <Search size={15} color="rgba(255,255,255,0.7)" />
              <input
                className="search-input"
                style={{ ...S.searchInput, marginLeft: 6 }}
                placeholder="Search procedures..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              style={S.btnAdd}
              onClick={() => {
                setEditMode(false); setEditSubServiceId(null)
                setNewService({ categoryName: '', categoryId: '', serviceName: '', serviceId: '' })
                setSelectedSubServices([]); setSubServiceInput(''); setErrors({}); setShowModal(true)
              }}
            >
              <Plus size={14} color="#1B4F8A" />
              Add New Procedure
            </button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div style={S.filterBar}>

          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#6b7a8d' }}>
            Total: <span style={S.countBadge}>{afterFilter.length}</span>
          </span>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <LoadingIndicator message="Fetching Procedure Details, Please wait..." />
        ) : error ? (
          <div style={{ padding: '1.5rem', color: '#ef4444' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={S.thead}>
                  {['S.No', 'Category', 'Service', 'Procedure', 'Actions'].map((h, i) => (
                    <th key={h} style={{ ...S.th, ...(h === 'Actions' ? { textAlign: 'center', width: 130 } : {}), ...(h === 'S.No' ? { width: 56 } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? currentItems.map((row, idx) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #eef2f7' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ ...S.td, ...S.sno }}>{indexOfFirst + idx + 1}</td>
                    <td style={S.td}>{row.category}</td>
                    <td style={S.td}>{row.service}</td>
                    <td style={S.td}><span style={S.procedureName}>{row.name}</span></td>
                    <td style={S.td}>
                      <div style={S.actionCell}>
                        <button style={{ ...S.actionBtnBase, ...S.btnView }} title="View" onClick={() => handleViewService(row.id)}>
                          <Eye size={14} />
                        </button>
                        <button style={{ ...S.actionBtnBase, ...S.btnEdit }} title="Edit" onClick={() => handleCategoryEdit(row)}>
                          <Edit2 size={14} />
                        </button>
                        <button style={{ ...S.actionBtnBase, ...S.btnDelete }} title="Delete" onClick={() => confirmDelete(row.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={S.emptyCell}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {afterFilter.length > 0 && (
          <div style={S.paginationBar}>
            <div style={S.rowsLabel}>
              Rows per page:
              <select style={S.rowsSelect} value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}>
                {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <span style={S.pageInfo}>
              Showing {afterFilter.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, afterFilter.length)} of {afterFilter.length} entries
            </span>
            <div style={S.paginationWrap}>
              <button style={S.pgBtnBase} disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>‹ Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} style={{ ...S.pgBtnBase, ...(currentPage === i + 1 ? S.pgBtnActive : {}) }} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button style={S.pgBtnBase} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next ›</button>
              <span style={S.pgText}>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        )}

        {/* ── Add / Edit Modal ── */}
        <CModal visible={showModal} onClose={handleCloseForm} size="lg" backdrop="static">
          <CForm onSubmit={e => { e.preventDefault(); handleSubmit() }} id="procedureForm">
            <CModalHeader style={S.modalHead} closeButton>
              <CModalTitle style={S.modalTitle}>{editMode ? 'Edit Procedure' : '➕ Add New Procedure'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow className="g-4">
                <CCol md={6}>
                  <label style={S.formLabel}>Category <span style={{ color: '#ef4444' }}>*</span></label>
                  <select name="categoryName" style={S.formControl} value={newService.categoryId || ''} onChange={handleChanges}>
                    <option value="">Select Category</option>
                    {category.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  </select>
                  {errors.category && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.category}</div>}
                </CCol>
                <CCol md={6}>
                  <label style={S.formLabel}>Service <span style={{ color: '#ef4444' }}>*</span></label>
                  <select name="serviceName" style={S.formControl} value={newService.serviceId || ''} onChange={handleChanges}>
                    <option value="">Select Service</option>
                    {serviceOptions.map(s => <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>)}
                  </select>
                  {errors.service && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.service}</div>}
                </CCol>
                <CCol md={12}>
                  <label style={S.formLabel}>{editMode ? 'Edit Procedure' : 'Add Procedure'} <span style={{ color: '#ef4444' }}>*</span></label>

                  {!editMode && (
                    <>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          style={{ ...S.formControl, flex: 1 }}
                          placeholder="Enter procedure name"
                          value={subServiceInput}
                          onChange={e => {
                            const v = e.target.value
                            if (/\d/.test(v) || !/^[A-Za-z\s@&\-.()]*$/.test(v)) return
                            setSubServiceInput(v)
                            if (v.trim()) setErrors(p => ({ ...p, subService: '' }))
                          }}
                          onPaste={e => {
                            const t = e.clipboardData.getData('text')
                            if (/\d/.test(t) || !/^[A-Za-z\s@&\-.()]+$/.test(t)) { e.preventDefault(); toast.error('Numbers & invalid symbols not allowed!') }
                          }}
                        />
                        <button style={S.btnGreen} type="button" onClick={() => {
                          const v = subServiceInput.trim()
                          if (!v) { setErrors(p => ({ ...p, subService: 'Procedure name is required.' })); return }
                          if (v.length < 3) { setErrors(p => ({ ...p, subService: 'Min 3 characters required.' })); return }
                          const svc = serviceOptions.find(s => s.serviceId === newService.serviceId)
                          if (!svc) { toast.warn('Please select a service first!'); return }
                          const entry = { serviceId: svc.serviceId, serviceName: svc.serviceName, subServiceName: v }
                          if (selectedSubServices.some(s => s.serviceId === entry.serviceId && s.subServiceName.toLowerCase() === v.toLowerCase())) { toast.warn('Already added!'); return }
                          setSelectedSubServices(p => [...p, entry]); setSubServiceInput('')
                        }}>Add</button>
                      </div>
                      {errors.subService && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.subService}</div>}
                      {selectedSubServices.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                          {selectedSubServices.map((sub, i) => (
                            <div key={i} style={S.pendingItem}>
                              <span><strong>{sub.serviceName}:</strong> {sub.subServiceName}</span>
                              <button style={S.btnRm} type="button" onClick={() => handleRemoveClick(sub)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {editMode && (
                    <>
                      <input
                        style={S.formControl}
                        placeholder="Edit Procedure"
                        value={selectedSubServices[0]?.subServiceName || ''}
                        onChange={e => {
                          const v = e.target.value
                          if (/\d/.test(v) || !/^[A-Za-z\s@&\-.()]*$/.test(v)) return
                          let msg = ''
                          if (!v.trim()) msg = 'Procedure name is required.'
                          else if (v.trim().length < 3) msg = 'Min 3 characters required.'
                          setErrors(p => ({ ...p, subService: msg }))
                          setSelectedSubServices([{ ...selectedSubServices[0], subServiceName: v }])
                        }}
                        onPaste={e => {
                          const t = e.clipboardData.getData('text')
                          if (/\d/.test(t) || !/^[A-Za-z\s@&\-.()]+$/.test(t)) { e.preventDefault(); toast.error('Numbers & invalid symbols not allowed!') }
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit() } }}
                      />
                      {errors.subService && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.subService}</div>}
                    </>
                  )}
                </CCol>
              </CRow>

              {removeShowModal && (
                <ConfirmationModal
                  isVisible={removeShowModal}
                  message="Are you sure you want to remove this item?"
                  onConfirm={handleConfirmRemove}
                  onCancel={() => setRemoveShowModal(false)}
                />
              )}
            </CModalBody>
            <CModalFooter>
              <button style={S.btnCancel} type="button" onClick={handleCloseForm}>Cancel</button>
              <button style={S.btnSubmit} type="submit" form="procedureForm">
                {editMode ? 'Update Procedure' : 'Add Procedure'}
              </button>
            </CModalFooter>
          </CForm>
        </CModal>

        {/* ── View Modal ── */}
        <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg" backdrop="static">
          <CModalHeader style={S.modalHead} closeButton>
            <CModalTitle style={{ ...S.modalTitle, textAlign: 'center', width: '100%' }}>Sub Service Details</CModalTitle>
          </CModalHeader>
          <CModalBody style={{ padding: '1.25rem' }}>
            {selectSubService?.subServices?.length > 0 ? selectSubService.subServices.map((item, i) => (
              <div key={item.subServiceId} style={S.viewCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: '#1B4F8A' }}>{i + 1}. {item.subServiceName || 'Unnamed'}</span>
                  <span style={S.viewBadge}>ID: {item.subServiceId}</span>
                </div>
                <hr style={{ borderColor: '#e8eef5', margin: '0.5rem 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7a8d', fontWeight: 600 }}>Category Name</div>
                    <div style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: 2 }}>{selectSubService.categoryName || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7a8d', fontWeight: 600 }}>Service Name</div>
                    <div style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: 2 }}>{item.serviceName || '-'}</div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: '#9aa5b4', padding: '2rem' }}>No sub-services found.</div>
            )}
          </CModalBody>
          <CModalFooter style={{ justifyContent: 'center' }}>
            <button style={{ ...S.btnCancel, background: '#6c757d', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem' }} onClick={() => setViewModalVisible(false)}>Close</button>
          </CModalFooter>
        </CModal>

        {/* ── Delete Confirm ── */}
        {showDeleteModal && (
          <ConfirmationModal
            isVisible={showDeleteModal}
            message="Are you sure you want to delete this procedure?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default ProcedureManagement