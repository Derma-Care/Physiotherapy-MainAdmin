import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CFormText,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CBadge,
  CCol,
  CFormSelect,
  CCardBody,
  CCard,
  CFormLabel,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  serviceData,
  CategoryData,
  postServiceData,
  updateServiceData,
  deleteServiceData,
  subServiceData,
  GetSubServices_ByClinicId,
} from './ProcedureManagementAPI'
import { getservice, BASE_URL } from '../../baseUrl'
import ProcedureQA from './QASection'
import { Edit2, Eye, Trash2, Plus, Search } from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'

/* ─── Design tokens (hard-coded — no CSS vars for content text) ─── */
const PRIMARY   = '#1a3a6b'
const t = {
  primary:    PRIMARY,
  text:       '#1e293b',
  textMuted:  '#64748b',
  surface:    '#f8fafc',
  border:     '#e2e8f0',
  danger:     '#dc2626',
  success:    '#16a34a',
  radius:     '10px',
  radiusSm:   '6px',
  shadow:     '0 1px 3px rgba(0,0,0,0.07)',
  shadowMd:   '0 4px 12px rgba(0,0,0,0.08)',
}

/* ─── Reusable primitives ─── */

const SectionHeading = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 14px' }}>
    <span style={{ width: '4px', height: '18px', borderRadius: '2px', backgroundColor: PRIMARY, flexShrink: 0 }} />
    <span style={{ fontSize: '12px', fontWeight: '700', color: t.text, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {title}
    </span>
  </div>
)

const FieldLabel = ({ children, required }) => (
  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>
    {children}{required && <span style={{ color: t.danger, marginLeft: '3px' }}>*</span>}
  </label>
)

const FieldError = ({ msg }) =>
  msg ? <div style={{ fontSize: '11px', color: t.danger, marginTop: '3px' }}>{msg}</div> : null

const Inp = ({ error, ...props }) => (
  <input
    {...props}
    style={{
      width: '100%', padding: '7px 10px', fontSize: '13px', boxSizing: 'border-box',
      border: `1px solid ${error ? t.danger : t.border}`, borderRadius: t.radiusSm,
      outline: 'none', color: t.text, backgroundColor: '#fff', transition: 'border-color .15s',
      ...props.style,
    }}
    onFocus={e => { e.target.style.borderColor = PRIMARY }}
    onBlur={e => { e.target.style.borderColor = error ? t.danger : t.border }}
  />
)

const Sel = ({ error, children, ...props }) => (
  <select
    {...props}
    style={{
      width: '100%', padding: '7px 10px', fontSize: '13px', boxSizing: 'border-box',
      border: `1px solid ${error ? t.danger : t.border}`, borderRadius: t.radiusSm,
      outline: 'none', color: t.text, backgroundColor: '#fff', appearance: 'auto',
    }}
  >
    {children}
  </select>
)

const Btn = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, size = 'md', style = {} }) => {
  const bg = variant === 'secondary' ? '#e2e8f0'
    : variant === 'danger'    ? t.danger
    : variant === 'outline'   ? 'transparent'
    : PRIMARY
  const color  = variant === 'secondary' ? t.text : variant === 'outline' ? PRIMARY : '#fff'
  const border = variant === 'outline' ? `1px solid ${PRIMARY}` : 'none'
  const pad    = size === 'sm' ? '4px 12px' : '7px 18px'
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px', padding: pad,
      borderRadius: t.radiusSm, fontSize: '12px', fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer', border, color,
      backgroundColor: bg, opacity: disabled ? 0.6 : 1,
      boxShadow: variant !== 'outline' && variant !== 'secondary' ? t.shadow : 'none',
      transition: 'opacity .15s', ...style,
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}

const Divider = () => <hr style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '16px 0' }} />

/* ─── helpers ─── */
const parseQA = (field) => {
  if (Array.isArray(field)) return field
  try { return JSON.parse(field || '[]') } catch { return [] }
}
const splitMinTime = (minTime = '') => {
  const parts = String(minTime).trim().split(' ')
  return { minTimeValue: parts[0] || '', minTimeUnit: parts[1] || 'minutes' }
}
const consentFormTypeLabels = { 1: 'Generic ConsentForm', 2: 'Procedure ConsentForm' }

/* ════════════════════════════════════════════════════════════════════ */

const ProcedureManagementDoctor = ({ clinicId }) => {
  const [searchQuery,        setSearchQuery]        = useState('')
  const [service,            setService]            = useState([])
  const [category,           setCategory]           = useState([])
  const [filteredData,       setFilteredData]       = useState([])
  const [loading,            setLoading]            = useState(false)
  const [error,              setError]              = useState(null)
  const [modalVisible,       setModalVisible]       = useState(false)
  const [viewService,        setViewService]        = useState(null)
  const [serviceOptions,     setServiceOptions]     = useState([])
  const [subServiceOptions,  setSubServiceOptions]  = useState([])
  const [selectedSubService, setSelectedSubService] = useState('')
  const [subServiceId,       setSubServiceId]       = useState('')
  const [modalMode,          setModalMode]          = useState('add')
  const [isModalVisible,     setIsModalVisible]     = useState(false)
  const [serviceIdToDelete,  setServiceIdToDelete]  = useState(null)
  const [errors,             setErrors]             = useState({})

  const emptyService = {
    categoryName: '', categoryId: '', serviceName: '', serviceId: '',
    subServiceId: '', subServiceName: '', price: '', discount: 0, gst: 0,
    consultationFee: 0, taxPercentage: 0, minTimeValue: '', minTimeUnit: 'minutes',
    status: '', subServiceImage: '', subServiceImageFile: null,
    viewImage: '', viewDescription: '', consentFormType: '',
    platformFeePercentage: 0, procedureQA: [], preProcedureQA: [], postProcedureQA: [], descriptionQA: [],
  }
  const [newService, setNewService] = useState(emptyService)

  /* ── fetch ── */
  const fetchData = async () => {
    setLoading(true); setError(null)
    try {
      const catRes = await CategoryData()
      if (catRes.data && Array.isArray(catRes.data)) {
        setCategory(catRes.data.map(c => ({ categoryId: c.categoryId, categoryName: c.categoryName })))
      }
      if (clinicId) {
        const subSvcData = await GetSubServices_ByClinicId(clinicId)
        setService(Array.isArray(subSvcData) ? subSvcData : [])
      } else { setService([]) }
    } catch (err) {
      console.error(err); setError('Failed to fetch data.')
    } finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])

  /* ── search ── */
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) { setFilteredData([]); return }
    setFilteredData(service.filter(item =>
      item.subServiceName?.toLowerCase().startsWith(q) ||
      item.serviceName?.toLowerCase().startsWith(q) ||
      item.categoryName?.toLowerCase().startsWith(q)
    ))
  }, [searchQuery, service])

  /* ── modals ── */
  const openAddModal = () => {
    setModalMode('add'); setSelectedSubService('')
    setServiceOptions([]); setSubServiceOptions([])
    setNewService(emptyService); setErrors({}); setModalVisible(true)
  }

  const openEditModal = async (svc) => {
    setSubServiceId(svc.subServiceId); setModalMode('edit'); setModalVisible(true)
    const selectedCategory = category.find(cat => cat.categoryName === svc.categoryName)
    const categoryId = selectedCategory?.categoryId || ''
    let fetchedServiceOptions = []
    try {
      const res = await axios.get(`${BASE_URL}/${getservice}/${categoryId}`)
      fetchedServiceOptions = res.data?.data || []
      setServiceOptions(fetchedServiceOptions)
    } catch (err) { console.error(err) }
    const selectedService = fetchedServiceOptions.find(s => s.serviceName === svc.serviceName)
    const serviceId = selectedService?.serviceId || ''
    let subServiceList = []
    if (serviceId) {
      try {
        const subRes = await subServiceData(serviceId)
        const subList = subRes.data
        if (Array.isArray(subList)) subServiceList = subList.flatMap(item => item.subServices || [])
        else if (subList?.subServices) subServiceList = subList.subServices
      } catch (err) { console.error(err) }
    }
    setSubServiceOptions({ subServices: subServiceList })
    const selectedSubServiceObj = subServiceList.find(s => s.subServiceName === svc.subServiceName)
    setSelectedSubService(selectedSubServiceObj?.subServiceId || '')
    const { minTimeValue, minTimeUnit } = splitMinTime(svc.minTime)
    setNewService({
      subServiceId: selectedSubServiceObj?.subServiceId || '', subServiceName: selectedSubServiceObj?.subServiceName || '',
      serviceName: svc.serviceName || '', serviceId, categoryName: svc.categoryName || '', categoryId,
      price: svc.price || '', discount: svc.discountPercentage || 0, gst: svc.gst || 0,
      consultationFee: svc.consultationFee || 0, taxPercentage: svc.taxPercentage || 0,
      minTimeValue, minTimeUnit, subServiceImage: svc.subServiceImage || '',
      subServiceImageFile: null, status: svc.status || '', viewDescription: svc.viewDescription || '',
      consentFormType: svc.consentFormType ? String(svc.consentFormType) : '',
      platformFeePercentage: svc.platformFeePercentage || 0, viewImage: svc.viewImage || '',
      procedureQA: parseQA(svc.procedureQA), preProcedureQA: parseQA(svc.preProcedureQA),
      postProcedureQA: parseQA(svc.postProcedureQA), descriptionQA: [],
    })
    setErrors({})
  }

  /* ── validate ── */
  const validateForm = () => {
    const e = {}
    if (!newService.categoryName)   e.categoryName   = 'Category is required.'
    if (!newService.serviceName)    e.serviceName    = 'Service name is required.'
    if (!newService.subServiceName) e.subServiceName = 'Procedure name is required.'
    if (!newService.price) e.price = 'Price is required.'
    else if (isNaN(newService.price)) e.price = 'Must be a valid number.'
    else if (parseFloat(newService.price) < 0) e.price = 'Cannot be negative.'
    if (!newService.status) e.status = 'Status is required.'
    if (newService.gst === '' || isNaN(newService.gst) || parseFloat(newService.gst) < 0) e.gst = 'GST must be a valid non-negative number.'
    if (!newService.minTimeValue || isNaN(newService.minTimeValue)) e.minTime = 'Minimum time is required.'
    else if (parseFloat(newService.minTimeValue) <= 0) e.minTime = 'Must be greater than zero.'
    if (!newService.viewDescription) e.viewDescription = 'View description is required.'
    if (!newService.consentFormType) e.consentFormType = 'Consent form type is required.'
    if (!newService.subServiceImage) e.subServiceImage = 'Please upload a service image.'
    if (!newService.categoryId)      e.categoryId      = 'Please select a valid category.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── add ── */
  const handleAddService = async () => {
    if (!validateForm()) return
    const price = Number(newService.price || 0)
    const discountPercentage = parseFloat(newService.discount || 0)
    const taxPercentage = parseFloat(newService.taxPercentage || 0)
    const gst = parseFloat(newService.gst || 0)
    const consultationFee = parseFloat(newService.consultationFee || 0)
    const platformFeePercentage = parseFloat(newService.platformFeePercentage || 0)
    const discountAmount = (price * discountPercentage) / 100
    const discountedCost = price - discountAmount
    const taxAmount = (discountedCost * taxPercentage) / 100
    const platformFee = (discountedCost * platformFeePercentage) / 100
    const clinicPay = discountedCost + taxAmount - platformFee
    const finalCost = clinicPay + gst + consultationFee
    const payload = {
      hospitalId: clinicId, subServiceName: newService.subServiceName, subServiceId: newService.subServiceId,
      serviceId: newService.serviceId, serviceName: newService.serviceName, categoryName: newService.categoryName,
      categoryId: newService.categoryId, price, discountPercentage, discountAmount, discountedCost,
      taxPercentage, taxAmount, platformFeePercentage, platformFee, clinicPay, finalCost, gst,
      consultationFee, minTime: `${newService.minTimeValue} ${newService.minTimeUnit}`,
      status: newService.status, subServiceImage: newService.subServiceImage,
      procedureQA: newService.procedureQA, preProcedureQA: newService.preProcedureQA,
      postProcedureQA: newService.postProcedureQA, viewDescription: newService.viewDescription,
      consentFormType: Number(newService.consentFormType),
    }
    try {
      const response = await postServiceData(payload, newService.subServiceId)
      if (response.status === 201) {
        toast.success(response.data.message, { position: 'top-right' })
        setModalVisible(false); fetchData(); serviceData()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add procedure.', { position: 'top-right' })
    }
    setNewService(emptyService)
  }

  /* ── update ── */
  const handleUpdateService = async () => {
    try {
      let base64ImageToSend = ''
      if (newService.subServiceImageFile) {
        const full = await toBase64(newService.subServiceImageFile)
        base64ImageToSend = full.split(',')[1]
      } else if (newService.subServiceImage?.startsWith('data:')) {
        base64ImageToSend = newService.subServiceImage.split(',')[1]
      } else { base64ImageToSend = newService.subServiceImage || '' }
      const updatedService = {
        clinicId, subServiceName: newService.subServiceName, viewDescription: newService.viewDescription,
        consentFormType: Number(newService.consentFormType), status: newService.status,
        minTime: newService.minTimeValue ? `${newService.minTimeValue} ${newService.minTimeUnit}` : '',
        procedureQA: Array.isArray(newService.procedureQA) ? newService.procedureQA : [],
        preProcedureQA: Array.isArray(newService.preProcedureQA) ? newService.preProcedureQA : [],
        postProcedureQA: Array.isArray(newService.postProcedureQA) ? newService.postProcedureQA : [],
        price: newService.price || 0, discountPercentage: newService.discount || 0,
        taxPercentage: newService.taxPercentage || 0, platformFeePercentage: newService.platformFeePercentage || 0,
        subServiceImage: base64ImageToSend, gst: newService.gst || 0, consultationFee: newService.consultationFee || 0,
      }
      await updateServiceData(subServiceId, clinicId, updatedService)
      toast.success('Procedure updated successfully!', { position: 'top-right' })
      setModalVisible(false); fetchData()
    } catch (err) {
      toast.error('Error updating procedure.', { position: 'top-right' })
    }
  }

  /* ── delete ── */
  const handleServiceDelete = (row) => { setServiceIdToDelete(row.subServiceId); setIsModalVisible(true) }
  const handleConfirmDelete = async () => {
    try {
      await deleteServiceData(serviceIdToDelete, clinicId)
      toast.success('Procedure deleted successfully!', { position: 'top-right' }); fetchData()
    } catch (err) { toast.error('Failed to delete procedure.', { position: 'top-right' }) }
    setIsModalVisible(false)
  }

  /* ── onChange ── */
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewService(prev => {
      if (name === 'categoryName') {
        const sel = category.find(cat => cat.categoryName === value)
        return { ...prev, [name]: value, categoryId: sel?.categoryId || '' }
      }
      if (['gst', 'consultationFee', 'price', 'discount', 'taxPercentage', 'minTime'].includes(name))
        return { ...prev, [name]: parseFloat(value) || 0 }
      return { ...prev, [name]: value }
    })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleChanges = async (e) => {
    const { name, value } = e.target
    if (name === 'categoryId') {
      const sel = category.find(cat => cat.categoryId === value)
      setNewService(prev => ({ ...prev, categoryName: sel?.categoryName || '', categoryId: value, serviceName: '', serviceId: '' }))
      try {
        const res = await axios.get(`${BASE_URL}/${getservice}/${value}`)
        setServiceOptions(res.data?.data || [])
      } catch (err) { setServiceOptions([]) }
    } else if (name === 'serviceName') {
      const sel = serviceOptions.find(s => s.serviceName === value)
      const serviceId = sel?.serviceId || ''
      setNewService(prev => ({ ...prev, serviceName: value, serviceId }))
      if (serviceId) {
        try {
          const subRes = await subServiceData(serviceId)
          const subList = subRes.data
          let all = []
          if (Array.isArray(subList)) all = subList.flatMap(item => item.subServices || [])
          else if (subList?.subServices) all = subList.subServices
          setSubServiceOptions({ subServices: all })
        } catch (err) { setSubServiceOptions({ subServices: [] }) }
      }
    } else { setNewService(prev => ({ ...prev, [name]: value })) }
  }

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = err => reject(err)
  })

  const formatMinutes = (minTime) => {
    const minutes = parseInt(minTime, 10)
    if (isNaN(minutes)) return 'Invalid time'
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60); const rem = minutes % 60
    return rem === 0 ? `${h} hour${h > 1 ? 's' : ''}` : `${h} hour${h > 1 ? 's' : ''} ${rem} min`
  }

  /* ── table columns ── */
  const columns = [
    {
      name: 'S.No', selector: (_, i) => i + 1, sortable: false, center: true, width: '70px',
      cell: (_, i) => <span style={{ fontSize: '12px', color: t.textMuted, fontWeight: '600' }}>{i + 1}</span>,
    },
    {
      name: 'Procedure Name', selector: row => row.subServiceName || 'N/A', sortable: true, width: '190px',
      cell: row => <span style={{ fontSize: '12px', fontWeight: '600', color: t.text }}>{row.subServiceName}</span>,
    },
    {
      name: 'Service Name', selector: row => row.serviceName || 'N/A', width: '180px',
      cell: row => <span style={{ fontSize: '12px', color: t.text }}>{row.serviceName}</span>,
    },
    {
      name: 'Category', selector: row => row.categoryName || 'N/A', width: '160px',
      cell: row => <span style={{ fontSize: '12px', color: t.textMuted }}>{row.categoryName}</span>,
    },
    {
      name: 'Price', selector: row => `₹${row.price || '0'}`, width: '100px',
      cell: row => <span style={{ fontSize: '12px', fontWeight: '700', color: PRIMARY }}>₹{row.price || '0'}</span>,
    },
    {
      name: 'Status', width: '100px', center: true,
      cell: row => (
        <span style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: '20px',
          backgroundColor: row.status === 'Active' ? '#dcfce7' : '#f1f5f9',
          color: row.status === 'Active' ? t.success : t.textMuted,
          border: `1px solid ${row.status === 'Active' ? '#86efac' : t.border}`,
        }}>
          {row.status || '—'}
        </span>
      ),
    },
    {
      name: 'Actions', width: '140px', center: true,
      cell: row => (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button title="View" onClick={() => setViewService(row)} style={iconBtnStyle('#e0f2fe', PRIMARY)}>
            <Eye size={14} />
          </button>
          <button title="Edit" onClick={() => openEditModal(row)} style={iconBtnStyle('#fef3c7', '#b45309')}>
            <Edit2 size={14} />
          </button>
          <button title="Delete" onClick={() => handleServiceDelete(row)} style={iconBtnStyle('#fee2e2', t.danger)}>
            <Trash2 size={14} />
          </button>
          <ConfirmationModal
            isVisible={isModalVisible} title="Delete Procedure"
            message="Are you sure you want to delete this procedure? This action cannot be undone."
            confirmText="Yes, Delete" cancelText="Cancel" confirmColor="danger" cancelColor="secondary"
            onConfirm={handleConfirmDelete} onCancel={() => setIsModalVisible(false)}
          />
        </div>
      ),
    },
  ]

  const iconBtnStyle = (bg, color) => ({
    width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: t.radiusSm, border: 'none', cursor: 'pointer',
    backgroundColor: bg, color,
  })

  /* ── field helper for modal ── */
  const MField = ({ label, required, error, children, span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
      <FieldError msg={error} />
    </div>
  )

  /* ════ RENDER ════════════════════════════════════════════════════════ */
  return (
    <div style={{ color: t.text }}>
      

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: `1px solid ${t.border}`, borderRadius: t.radiusSm, overflow: 'hidden', backgroundColor: '#fff', maxWidth: '360px', flex: 1 }}>
          <span style={{ padding: '0 10px', color: t.textMuted, display: 'flex', alignItems: 'center' }}>
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search by procedure, category, service…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '13px', color: t.text, padding: '8px 10px 8px 0', flex: 1, backgroundColor: 'transparent' }}
          />
        </div>
        <Btn onClick={openAddModal}><Plus size={14} /> Add Procedure</Btn>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: t.textMuted, fontSize: '14px' }}>
          Loading procedures…
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: t.danger, fontSize: '13px' }}>{error}</div>
      ) : (
        <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius, overflow: 'hidden', backgroundColor: '#fff' }}>
          <DataTable
            columns={columns}
            data={filteredData.length > 0 ? filteredData : service}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
            highlightOnHover
            pointerOnHover
            customStyles={{
              table:    { style: { backgroundColor: '#fff', color: t.text } },
              headRow:  { style: { backgroundColor: t.surface, borderBottom: `2px solid ${t.border}`, minHeight: '44px' } },
              headCells:{ style: { color: t.text, fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px' } },
              cells:    { style: { fontSize: '12px', color: t.text, padding: '10px 14px', borderBottom: `1px solid ${t.border}` } },
              pagination:{ style: { borderTop: `1px solid ${t.border}`, color: t.textMuted, fontSize: '12px' } },
              rows:     { highlightOnHoverStyle: { backgroundColor: t.surface, transition: 'background-color .15s' } },
            }}
          />
        </div>
      )}

      {/* ══ VIEW MODAL ══════════════════════════════════════════════════ */}
      {viewService && (
        <CModal visible={!!viewService} onClose={() => setViewService(null)} size="xl" backdrop="static">
          <CModalHeader style={{ backgroundColor: PRIMARY, padding: '14px 20px', borderBottom: 'none' }}>
            <CModalTitle style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
              Procedure Details
            </CModalTitle>
          </CModalHeader>

          <CModalBody style={{ padding: '20px', backgroundColor: '#f8fafc', color: t.text }}>

            {/* Basic Info */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px', marginBottom: '14px' }}>
              <SectionHeading title="Basic Information" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px 24px' }}>
                {[
                  ['Procedure Name', viewService.subServiceName],
                  ['Procedure ID', viewService.subServiceId],
                  ['Service Name', viewService.serviceName],
                  ['Category Name', viewService.categoryName],
                  ['Consent Form', consentFormTypeLabels[viewService.consentFormType] || 'N/A'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: t.text }}>{val || '—'}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Status</div>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
                    backgroundColor: viewService.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                    color: viewService.status === 'Active' ? t.success : t.textMuted,
                    border: `1px solid ${viewService.status === 'Active' ? '#86efac' : t.border}`,
                  }}>{viewService.status}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px', marginBottom: '14px' }}>
              <SectionHeading title="Pricing & Fees" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px 24px' }}>
                {[
                  ['Price', `₹${viewService.price ? Math.round(viewService.price) : '—'}`],
                  ['Discount %', viewService.discountPercentage ? Math.round(viewService.discountPercentage) + '%' : '—'],
                  ['Discount Amt', `₹${viewService.discountAmount ? Math.round(viewService.discountAmount) : '—'}`],
                  ['Discounted Cost', `₹${viewService.discountedCost ? Math.round(viewService.discountedCost) : '—'}`],
                  ['Tax %', viewService.taxPercentage ? Math.round(viewService.taxPercentage) + '%' : '—'],
                  ['Tax Amount', `₹${viewService.taxAmount ? Math.round(viewService.taxAmount) : '—'}`],
                  ['Platform Fee %', viewService.platformFeePercentage ? Math.round(viewService.platformFeePercentage) + '%' : '—'],
                  ['Platform Fee', `₹${viewService.platformFee ? Math.round(viewService.platformFee) : '—'}`],
                  ['Clinic Pay', `₹${viewService.clinicPay ? Math.round(viewService.clinicPay) : '—'}`],
                  ['GST', `₹${viewService.gst ? Math.round(viewService.gst) : '—'}`],
                  ['Consultation Fee', `₹${viewService.consultationFee ?? '—'}`],
                  ['Final Cost', `₹${viewService.finalCost ? Math.round(viewService.finalCost) : '—'}`],
                  ['Service Time', viewService.minTime ? formatMinutes(viewService.minTime) : '—'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '13px', fontWeight: label === 'Final Cost' ? '700' : '500', color: label === 'Final Cost' ? PRIMARY : t.text }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A */}
            {['preProcedureQA', 'procedureQA', 'postProcedureQA'].map((qaType, i) => {
              const titles = { preProcedureQA: 'Pre-Procedure Q&A', procedureQA: 'Procedure Q&A', postProcedureQA: 'Post-Procedure Q&A' }
              const qaData = viewService[qaType]
              return (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px', marginBottom: '14px' }}>
                  <SectionHeading title={titles[qaType]} />
                  {Array.isArray(qaData) && qaData.length > 0 ? (
                    qaData.map((qa, idx) => {
                      const q = Object.keys(qa)[0]; const ans = qa[q]
                      return (
                        <div key={idx} style={{ marginBottom: '10px', padding: '10px', backgroundColor: t.surface, borderRadius: t.radiusSm, border: `1px solid ${t.border}` }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: t.text, marginBottom: '6px' }}>{q}</div>
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {ans.map((a, j) => <li key={j} style={{ fontSize: '12px', color: t.textMuted }}>{a}</li>)}
                          </ul>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ fontSize: '12px', color: t.textMuted, fontStyle: 'italic' }}>No Q&amp;A available</div>
                  )}
                </div>
              )
            })}

            {/* Image & Description */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px' }}>
              <SectionHeading title="Additional Details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Image</div>
                  {viewService.subServiceImage
                    ? <img src={`data:image/png;base64,${viewService.subServiceImage}`} alt="Service" style={{ maxWidth: '200px', borderRadius: t.radiusSm, border: `1px solid ${t.border}` }} />
                    : <span style={{ fontSize: '12px', color: t.textMuted }}>No image available</span>
                  }
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: t.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Description</div>
                  <div style={{ fontSize: '13px', color: t.text }}>{viewService.viewDescription || 'N/A'}</div>
                </div>
              </div>
            </div>
          </CModalBody>

          <CModalFooter style={{ borderTop: `1px solid ${t.border}`, padding: '12px 20px' }}>
            <Btn variant="secondary" onClick={() => setViewService(null)}>Close</Btn>
          </CModalFooter>
        </CModal>
      )}

      {/* ══ ADD / EDIT MODAL ════════════════════════════════════════════ */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="xl" backdrop="static">
        <CModalHeader style={{ backgroundColor: PRIMARY, padding: '14px 20px', borderBottom: 'none' }}>
          <CModalTitle style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
            {modalMode === 'edit' ? 'Edit Procedure Details' : 'Add New Procedure'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody style={{ padding: '20px', backgroundColor: '#f8fafc', color: t.text }}>
          <CForm>

            {/* ── Section: Classification ── */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px', marginBottom: '14px' }}>
              <SectionHeading title="Classification" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <MField label="Category" required error={errors.categoryName}>
                  <Sel name="categoryId" value={newService.categoryId || ''} onChange={handleChanges} disabled={modalMode === 'edit'} error={errors.categoryName}>
                    <option value="">Select Category</option>
                    {category.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                  </Sel>
                </MField>
                <MField label="Service" required error={errors.serviceName}>
                  <Sel name="serviceName" value={newService.serviceName || ''} onChange={handleChanges} disabled={modalMode === 'edit'} error={errors.serviceName}>
                    <option value="">Select Service</option>
                    {serviceOptions.map(s => <option key={s.serviceId} value={s.serviceName}>{s.serviceName}</option>)}
                  </Sel>
                </MField>
                <MField label="Procedure Name" required error={errors.subServiceName}>
                  <Sel name="subServiceId" value={selectedSubService} disabled={modalMode === 'edit'} error={errors.subServiceName}
                    onChange={e => {
                      const id = e.target.value; setSelectedSubService(id)
                      const obj = subServiceOptions?.subServices?.find(s => s.subServiceId === id)
                      setNewService(prev => ({ ...prev, subServiceId: id, subServiceName: obj?.subServiceName || '' }))
                    }}>
                    <option value="">Select Procedure</option>
                    {Array.isArray(subServiceOptions?.subServices) && subServiceOptions.subServices.map(sub =>
                      <option key={sub.subServiceId} value={sub.subServiceId}>{sub.subServiceName}</option>
                    )}
                  </Sel>
                </MField>
              </div>
            </div>

            {/* ── Section: Details ── */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px', marginBottom: '14px' }}>
              <SectionHeading title="Procedure Details" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>

                <MField label="Procedure Image" required error={errors.subServiceImage}>
                  <input type="file" accept="image/*" style={{ width: '100%', fontSize: '12px', color: t.text }}
                    onChange={e => {
                      const file = e.target.files[0]; if (!file) return
                      const reader = new FileReader()
                      reader.onloadend = () => setNewService(prev => ({ ...prev, subServiceImage: reader.result?.split(',')[1] || '', subServiceImageFile: file }))
                      reader.readAsDataURL(file)
                    }} />
                  {newService.subServiceImage && (
                    <img src={newService.subServiceImage.startsWith('data:') ? newService.subServiceImage : `data:image/jpeg;base64,${newService.subServiceImage}`}
                      alt="Preview" style={{ width: 70, height: 70, marginTop: 8, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, objectFit: 'cover' }} />
                  )}
                </MField>

                <MField label="View Description" required error={errors.viewDescription}>
                  <Inp type="text" name="viewDescription" value={newService.viewDescription || ''} onChange={handleChange} maxLength={100} placeholder="Short description…" />
                </MField>

                <MField label="Status" required error={errors.status}>
                  <Sel name="status" value={newService.status || ''} onChange={handleChange} error={errors.status}>
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="InActive">Inactive</option>
                  </Sel>
                </MField>

                <MField label="Consent Form Type" required error={errors.consentFormType}>
                  <Sel value={newService.consentFormType || ''} error={errors.consentFormType}
                    onChange={e => setNewService(prev => ({ ...prev, consentFormType: e.target.value }))}>
                    <option value="">Select type</option>
                    <option value="1">Generic ConsentForm</option>
                    <option value="2">Procedure ConsentForm</option>
                  </Sel>
                </MField>

                <MField label="Consultation Fee" required error={errors.consultationFee}>
                  <Inp type="number" value={newService.consultationFee || ''} placeholder="₹"
                    onChange={e => setNewService(prev => ({ ...prev, consultationFee: Number(e.target.value) }))} />
                </MField>

                <MField label="Min Time" required error={errors.minTime}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Inp type="number" name="minTimeValue" value={newService.minTimeValue || ''} placeholder="e.g. 30"
                      onChange={e => setNewService(prev => ({ ...prev, minTimeValue: e.target.value }))}
                      style={{ flex: 1 }} />
                    <Sel name="minTimeUnit" value={newService.minTimeUnit || 'minutes'}
                      onChange={e => setNewService(prev => ({ ...prev, minTimeUnit: e.target.value }))}
                      style={{ width: '110px', flexShrink: 0 }}>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </Sel>
                  </div>
                </MField>
              </div>
            </div>

            {/* ── Section: Pricing ── */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px', marginBottom: '14px' }}>
              <SectionHeading title="Pricing" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <MField label="Procedure Price (₹)" required error={errors.price}>
                  <Inp type="number" value={newService.price || ''} placeholder="₹"
                    onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))} />
                </MField>
                <MField label="Discount (%)" required error={errors.discount}>
                  <Inp type="number" name="discount" value={newService.discount || ''} onChange={handleChange} min={0}
                    onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault() }} />
                </MField>
                <MField label="GST (%)" required error={errors.gst}>
                  <Inp type="number" value={newService.gst || ''}
                    onChange={e => setNewService(prev => ({ ...prev, gst: Number(e.target.value) }))} />
                </MField>
                <MField label="Other Taxes (%)">
                  <Inp type="number" name="taxPercentage" value={newService.taxPercentage || ''} onChange={handleChange} min={0}
                    onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault() }} />
                </MField>
              </div>
            </div>

            {/* ── Q&A ── */}
            <div style={{ backgroundColor: '#fff', borderRadius: t.radius, border: `1px solid ${t.border}`, padding: '18px' }}>
              <SectionHeading title="Procedure Q&A (Optional)" />
              <ProcedureQA
                preQAList={newService.preProcedureQA}
                setPreQAList={data => setNewService(prev => ({ ...prev, preProcedureQA: data }))}
                procedureQAList={newService.procedureQA}
                setProcedureQAList={data => setNewService(prev => ({ ...prev, procedureQA: data }))}
                postQAList={newService.postProcedureQA}
                setPostQAList={data => setNewService(prev => ({ ...prev, postProcedureQA: data }))}
              />
            </div>

          </CForm>
        </CModalBody>

        <CModalFooter style={{ borderTop: `1px solid ${t.border}`, padding: '12px 20px', gap: '8px' }}>
          <Btn variant="secondary" onClick={() => { setNewService(emptyService); setErrors({}); setModalVisible(false) }}>
            Cancel
          </Btn>
          <Btn onClick={modalMode === 'edit' ? handleUpdateService : handleAddService}>
            {modalMode === 'edit' ? 'Update Procedure' : 'Add Procedure'}
          </Btn>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ProcedureManagementDoctor