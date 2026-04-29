import React, { useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Select from 'react-select'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormInput, CFormTextarea, CRow, CCol,
} from '@coreui/react'
import { format } from 'date-fns'
import { BASE_URL } from '../../baseUrl'
import capitalizeWords from '../../Utils/capitalizeWords'
import { GetClinicBranches, handleDeleteToggle, UpdateDoctorById } from './DoctorAPI'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getCustomerByMobile } from '../customerManagement/CustomerAPI'
import LoadingIndicator from '../../Utils/loader'
import ConfirmationModal from '../../components/ConfirmationModal'
import { http } from '../../Utils/Interceptors'
import { CategoryData, serviceData, subServiceData } from '../ProcedureManagement/ProcedureAPI'
import {
  User, Clock, Star, Layers, Calendar,
  Edit2, Trash2, PlusCircle, CheckCircle,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────
const generateTimeSlots = (intervalMinutes = 30, isToday = false) => {
  const slots = []; const now = new Date()
  const start = new Date(); start.setHours(7, 0, 0, 0)
  const end   = new Date(); end.setHours(20, 0, 0, 0)
  while (start <= end) {
    if (!isToday || start > now)
      slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
    start.setMinutes(start.getMinutes() + intervalMinutes)
  }
  return slots
}

function formatTimeAgo(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 60000)
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff} min${diff > 1 ? 's' : ''} ago`
  const hours = Math.floor(diff / 60)
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

function getInitials(name) {
  if (!name) return 'US'
  const cleaned = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '').trim()
  return cleaned.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || 'US'
}

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload  = () => resolve(reader.result)
  reader.onerror = reject
})

const selectPortalProps = {
  menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
  menuPosition: 'fixed',
  styles: {
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    control: (base, state) => ({
      ...base, fontSize: 13, minHeight: 36,
      borderColor: state.isFocused ? '#185fa5' : '#d0dce9',
      borderWidth: '0.5px', borderRadius: 8, boxShadow: 'none',
      '&:hover': { borderColor: '#185fa5' },
    }),
    option: (base, state) => ({
      ...base, fontSize: 13,
      backgroundColor: state.isSelected ? '#185fa5' : state.isFocused ? '#f0f5fb' : '#fff',
      color: state.isSelected ? '#fff' : '#374151',
    }),
    multiValue:      (b) => ({ ...b, background: '#e6f1fb', borderRadius: 20 }),
    multiValueLabel: (b) => ({ ...b, color: '#0c447c', fontSize: 12 }),
    multiValueRemove:(b) => ({ ...b, color: '#185fa5', ':hover': { background: '#b5d4f4' } }),
    placeholder:     (b) => ({ ...b, fontSize: 13, color: '#9ca3af' }),
    menu:            (b) => ({ ...b, fontSize: 13 }),
  },
}

// ─── Shared field wrapper ─────────────────────────────────
const InfoRow = ({ label, value, children }) => (
  <div className="dp-info-row">
    <span className="dp-info-label">{label}</span>
    {children ?? <span className="dp-info-value">{value || '—'}</span>}
  </div>
)

// ─── Component ───────────────────────────────────────────
const DoctorDetailsPage = () => {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const { doctorId: paramDoctorId } = useParams()

  const [doctorData, setDoctorData] = useState(state?.doctor || {})
  const [formData, setFormData]     = useState(state?.doctor || {})
  const branchId   = state?.branchId
  const hospitalId = state?.doctor?.hospitalId

  const [activeKey, setActiveKey]   = useState(1)
  const [isEditing, setIsEditing]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState({})
  const [showModal, setShowModal]   = useState(false)

  // Slots
  const [allSlots, setAllSlots]         = useState([])
  const [selectedSlots, setSelectedSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [days, setDays]                 = useState([])
  const [visibleSlot, setVisibleSlot]   = useState(false)
  const [slotInterval, setSlotInterval] = useState(30)
  const [slots, setSlots]               = useState([])
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [deleteMode, setDeleteMode]     = useState(null)

  // Ratings
  const [ratings, setRatings]               = useState(null)
  const [customerDetails, setCustomerDetails] = useState({})

  // Category / Service / SubService
  const [categoryOptions, setCategoryOptions]   = useState([])
  const [serviceOptions, setServiceOptions]     = useState([])
  const [subServiceOptions, setSubServiceOptions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedSubServices, setSelectedSubServices] = useState([])

  // Branches
  const [branchOptions, setBranchOptions] = useState([])

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const slotsForSelectedDate =
    (Array.isArray(allSlots)
      ? allSlots.find((sd) => sd.date === selectedDate)
      : null)?.availableSlots || []

  // ── Fetch doctor ──────────────────────────────────────
  useEffect(() => {
    if (!doctorData?.doctorId && paramDoctorId) {
      http.get(`/getDoctorById/${paramDoctorId}`)
        .then(res => { setDoctorData(res.data); setFormData(res.data) })
        .catch(err => console.error(err))
    }
  }, [])

  useEffect(() => {
    const today = new Date(); today.setHours(0,0,0,0)
    setDays(Array.from({ length: 15 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() + i)
      return { date: d, dayLabel: format(d,'EEE'), dateLabel: format(d,'dd MMM') }
    }))
  }, [])

  useEffect(() => { if (doctorData?.doctorId) fetchSlots() }, [doctorData?.doctorId])

  const fetchSlots = async () => {
    if (!hospitalId || !branchId || !doctorData?.doctorId) return
    try {
      const res = await http.get(`/clinic-admin/getDoctorSlots/${hospitalId}/${branchId}/${doctorData.doctorId}`)
      if (res.data.success) setAllSlots(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!hospitalId || !doctorData?.doctorId) return
    const fetchRatings = async () => {
      try {
        const res = await http.get(`/averageRatings/${hospitalId}/${doctorData.doctorId}`)
        if (!res.data.success) return
        const ratingData = res.data.data; setRatings(ratingData)
        const mobiles = [...new Set(ratingData.comments?.map((c) => c.customerMobileNumber) || [])]
        const details = {}
        await Promise.all(mobiles.map(async (num) => {
          try { const r = await getCustomerByMobile(num); details[num] = r?.data?.fullName || num }
          catch { details[num] = num }
        }))
        setCustomerDetails(details)
      } catch (err) { console.error(err) }
    }
    fetchRatings()
  }, [doctorData?.doctorId, hospitalId])

  useEffect(() => {
    if (!doctorData?.clinicId) return
    GetClinicBranches(doctorData.clinicId)
      .then(res => setBranchOptions((res?.data||[]).map(b => ({ value: b.branchId||b.id, label: b.branchName||b.name }))))
      .catch(() => setBranchOptions([]))
  }, [doctorData?.clinicId])

  useEffect(() => {
    CategoryData().then(res => setCategoryOptions((res?.data||[]).map(c => ({ value: c.categoryId, label: c.categoryName })))).catch(console.error)
  }, [])

  useEffect(() => {
    const prefill = async () => {
      if (!doctorData?.category?.length) return
      const cat = doctorData.category[0]
      setSelectedCategory({ value: cat.categoryId, label: cat.categoryName })
      const allServicesRes = await serviceData()
      const filtered = (allServicesRes?.data||[]).filter(s => s.categoryId === cat.categoryId)
      setServiceOptions(filtered.map(s => ({ value: s.serviceId, label: s.serviceName })))
      if (doctorData.service?.length) {
        const svcObjs = doctorData.service.map(s => ({ value: s.serviceId, label: s.serviceName }))
        setSelectedServices(svcObjs)
        const allSubs = await Promise.all(svcObjs.map(s => subServiceData(s.value)))
        const flatSubs = allSubs.flatMap(r => r?.data||[])
        setSubServiceOptions(flatSubs.map(ss => ({ value: ss.subServiceId, label: ss.subServiceName })))
        if (doctorData.subServices?.length)
          setSelectedSubServices(doctorData.subServices.map(ss => ({ value: ss.subServiceId, label: ss.subServiceName })))
      }
    }
    prefill()
  }, [doctorData])

  useEffect(() => { setFormData(p => ({ ...p, category: selectedCategory ? [{ categoryId: selectedCategory.value, categoryName: selectedCategory.label }] : [] })) }, [selectedCategory])
  useEffect(() => { setFormData(p => ({ ...p, services: selectedServices.map(s => ({ serviceId: s.value, serviceName: s.label })) })) }, [selectedServices])
  useEffect(() => { setFormData(p => ({ ...p, subServices: selectedSubServices.map(ss => ({ subServiceId: ss.value, subServiceName: ss.label })) })) }, [selectedSubServices])

  useEffect(() => {
    if (!selectedServices.length) { setSubServiceOptions([]); setSelectedSubServices([]); return }
    const fetchSubs = async () => {
      try {
        const responses = await Promise.all(selectedServices.map(s => subServiceData(s.value)))
        const all = responses.flatMap(res => { const list = res?.data||[]; return Array.isArray(list) ? list.flatMap(i => i.subServices||[]) : list.subServices||[] })
        const unique = Array.from(new Map(all.map(ss => [ss.subServiceId, ss])).values())
        setSubServiceOptions(unique.map(ss => ({ value: ss.subServiceId, label: ss.subServiceName })))
      } catch { setSubServiceOptions([]) }
    }
    fetchSubs()
  }, [selectedServices])

  // ── Handlers ──────────────────────────────────────────
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })) }
  const handleDateClick   = (dayObj, idx) => { setSelectedDate(format(dayObj.date,'yyyy-MM-dd')); setSelectedDateIndex(idx) }

  const handleDeleteDoctor = async (id) => {
    setShowModal(false)
    const isDeleted = await handleDeleteToggle(id)
    if (isDeleted) { toast.success('Doctor deleted'); navigate(`/branch-details/${branchId}?tab=1`) }
    else toast.error('Failed to delete doctor')
  }

  const handleCategoryChange = async (cat) => {
    setSelectedCategory(cat); setSelectedServices([]); setSelectedSubServices([]); setServiceOptions([]); setSubServiceOptions([])
    if (!cat) return
    try {
      const res = await serviceData()
      const filtered = (res?.data||[]).filter(s => s.categoryId === cat.value)
      const unique = Array.from(new Map(filtered.map(s => [s.serviceId, s])).values())
      setServiceOptions(unique.map(s => ({ value: s.serviceId, label: s.serviceName })))
    } catch (err) { console.error(err) }
  }

  const handleServiceChange = async (selected) => {
    const unique = Array.from(new Map((selected||[]).map(s => [s.value, s])).values())
    setSelectedServices(unique); setSelectedSubServices([])
    if (!unique.length) { setSubServiceOptions([]); return }
    try {
      const map = new Map()
      for (const svc of unique) { const res = await subServiceData(svc.value); (res?.data||[]).forEach(ss => { if (!map.has(ss.subServiceId)) map.set(ss.subServiceId, ss) }) }
      setSubServiceOptions(Array.from(map.values()).map(ss => ({ value: ss.subServiceId, label: ss.subServiceName })))
    } catch { setSubServiceOptions([]) }
  }

  const handleGenerate = () => {
    const generated = generateTimeSlots(slotInterval, isToday).map(s => ({ slot: s, available: true }))
    setSlots(generated); setSelectedSlots([])
    toast.success(`Generated ${generated.length} slots of ${slotInterval} min`)
  }

  const toggleSlot = (slot) => setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot])

  const handleAddSlot = async () => {
    if (!doctorData?.doctorId || !branchId || !hospitalId) { toast.error('Missing required IDs'); return }
    const existingSlots = slotsForSelectedDate.map(s => s.slot)
    const newSlots = selectedSlots.filter(s => !existingSlots.includes(s))
    if (!newSlots.length) { toast.info('No new slots to add!'); return }
    const payload = { doctorId: doctorData.doctorId, date: selectedDate, availableSlots: newSlots.map(slot => ({ slot, slotbooked: false })) }
    try {
      const res = await axios.post(`${BASE_URL}/admin/addDoctorSlots/${hospitalId}/${branchId}/${doctorData.doctorId}`, payload)
      if (res.data.success) { toast.success('Slots added!'); setVisibleSlot(false); setSelectedSlots([]); fetchSlots() }
      else toast.error(res.data.message || 'Failed')
    } catch (err) { toast.error('Network error.') }
  }

  const validateForm = () => {
    const e = {}
    if (!/^[a-zA-Z0-9]+$/.test(formData.doctorLicence?.trim())) e.doctorLicence = 'License must be alphanumeric.'
    if (!/^[A-Za-z\s.]+$/.test(formData.doctorName)) e.doctorName = 'Name: letters, spaces, dots only.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.doctorEmail?.trim())) e.doctorEmail = 'Enter valid email.'
    if (!/^[A-Za-z\s]+$/.test(formData.qualification?.trim())) e.qualification = 'Letters only.'
    if (!/^[A-Za-z\s]+$/.test(formData.specialization?.trim())) e.specialization = 'Letters only.'
    if (!/^\d+$/.test(String(formData.experience)?.trim())) e.experience = 'Numbers only.'
    if (!/^[6-9]\d{9}$/.test(formData.doctorMobileNumber?.trim())) e.doctorMobileNumber = '10-digit number starting 6–9.'
    if (!formData.gender) e.gender = 'Please select gender.'
    if (!formData.availableTimes?.trim()) e.availableTimes = 'Please enter timings.'
    if (!/^\d+$/.test(String(formData.doctorFees?.inClinicFee))) e.inClinicFee = 'Numbers only.'
    if (!/^\d+$/.test(String(formData.doctorFees?.vedioConsultationFee))) e.vedioConsultationFee = 'Numbers only.'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleUpdate = async () => {
    const payload = { ...formData,
      branch: formData.branch?.map(b => ({ branchId: b.branchId, branchName: b.branchName })) || [],
      category: formData.category || [],
      services: formData.services?.map(s => ({ serviceId: s.serviceId, serviceName: s.serviceName })) || [],
    }
    const res = await UpdateDoctorById(doctorData.doctorId, payload)
    if (res.success) {
      toast.success('Doctor updated successfully')
      setDoctorData(res.data.updatedDoctor); setFormData(res.data.updatedDoctor); setIsEditing(false)
      navigate(`/branch-details/${branchId}?tab=1`)
    } else toast.error('Failed to update')
  }

  const handleUpdateWithValidation = async () => { if (validateForm()) await handleUpdate() }

  if (!doctorData) return <p>No doctor data found.</p>

  const TABS = [
    { id: 1, label: 'Doctor Profile', icon: User },
    { id: 2, label: 'Slot Management', icon: Calendar },
    { id: 3, label: 'Ratings', icon: Star },
    { id: 4, label: 'Services', icon: Layers },
  ]

  return (
    <div style={{ padding: '1.25rem' }}>
      <ToastContainer />

      {/* ── Hero ──────────────────────────────── */}
      <div className="dp-hero">
        <div className="dp-hero-banner">
          <div className="dp-hero-accent" />
          <div className="dp-hero-badge">
            <span className="dp-hero-badge-dot" />
            Active Doctor
          </div>
          <h2 className="dp-hero-name">{capitalizeWords(doctorData.doctorName)}</h2>
          <p className="dp-hero-sub">{doctorData.specialization} &nbsp;·&nbsp; {doctorData.qualification}</p>
        </div>

        <div className="dp-hero-lower">
          <div className="dp-hero-avatar-wrap">
            {doctorData.doctorPicture
              ? <img src={doctorData.doctorPicture} alt="Doctor" className="dp-hero-avatar" />
              : <div className="dp-hero-avatar dp-hero-avatar-initials">{getInitials(doctorData.doctorName)}</div>
            }
          </div>
          <div className="dp-hero-meta">
            <span className="dp-hero-id">ID: {doctorData.doctorId}</span>
            <span className="dp-hero-avail">
              <span className="dp-avail-dot" />
              {doctorData.availableDays || 'Mon – Sat'}
            </span>
          </div>
        </div>

        <div className="dp-stats-row">
          <div className="dp-stat"><span className="dp-stat-val">{doctorData.experience}</span><span className="dp-stat-lbl">Yrs Exp.</span></div>
          <div className="dp-stat"><span className="dp-stat-val">₹{doctorData.doctorFees?.inClinicFee || '—'}</span><span className="dp-stat-lbl">In-Clinic</span></div>
          <div className="dp-stat"><span className="dp-stat-val">₹{doctorData.doctorFees?.vedioConsultationFee || '—'}</span><span className="dp-stat-lbl">Video Fee</span></div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="dp-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`dp-tab${activeKey === id ? ' active' : ''}`}
            onClick={() => setActiveKey(id)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ══ TAB 1: Profile ═══════════════════════════ */}
      {activeKey === 1 && (
        <div className="dp-tab-panel">

          {/* Edit: Category / Service selects */}
          {isEditing && (
            <div className="dp-edit-section">
              <div className="dp-section-label">Category &amp; Services</div>
              <CRow className="g-3">
                <CCol md={4}>
                  <label className="dp-label">Category</label>
                  <Select {...selectPortalProps} options={categoryOptions} value={selectedCategory} onChange={handleCategoryChange} placeholder="Select Category" />
                </CCol>
                <CCol md={4}>
                  <label className="dp-label">Services</label>
                  <Select isMulti {...selectPortalProps} options={serviceOptions} value={selectedServices} onChange={handleServiceChange} placeholder="Select Service(s)" />
                </CCol>
                <CCol md={4}>
                  <label className="dp-label">Procedures</label>
                  <Select isMulti {...selectPortalProps} options={subServiceOptions} value={selectedSubServices} onChange={setSelectedSubServices} placeholder="Select Procedures" />
                </CCol>
              </CRow>

              <div className="dp-photo-row">
                {formData.doctorPicture && <img src={formData.doctorPicture} alt="Preview" className="dp-photo-preview" />}
                <div>
                  <label className="dp-label" style={{ marginBottom: 4 }}>Profile Photo</label>
                  <input type="file" accept="image/*" className="dp-file-input"
                    onChange={async (e) => {
                      const file = e.target.files[0]; if (!file) return
                      if (file.size > 2*1024*1024) { toast.error('Max 2MB'); return }
                      const base64 = await toBase64(file)
                      setFormData(p => ({ ...p, doctorPicture: base64 }))
                    }} />
                </div>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="dp-info-grid">
            <div className="dp-info-col">
              <div className="dp-section-label">Basic Information</div>

              <InfoRow label="License No.">
                {isEditing
                  ? <><CFormInput name="doctorLicence" value={formData.doctorLicence} onChange={e => { setFormData(p => ({...p, doctorLicence: e.target.value.replace(/[^a-zA-Z0-9]/g,'')})); setErrors(p=>({...p,doctorLicence:''})) }} className="dp-input" />{errors.doctorLicence && <small className="dp-err">{errors.doctorLicence}</small>}</>
                  : doctorData.doctorLicence}
              </InfoRow>

              <InfoRow label="Full Name">
                {isEditing
                  ? <><CFormInput name="doctorName" value={formData.doctorName} onChange={e => { setFormData(p=>({...p,doctorName:e.target.value.replace(/[^A-Za-z\s.]/g,'')})); setErrors(p=>({...p,doctorName:''})) }} className="dp-input" />{errors.doctorName && <small className="dp-err">{errors.doctorName}</small>}</>
                  : doctorData.doctorName}
              </InfoRow>

              <InfoRow label="Email">
                {isEditing
                  ? <><CFormInput name="doctorEmail" value={formData.doctorEmail} onChange={e => { setFormData(p=>({...p,doctorEmail:e.target.value})); setErrors(p=>({...p,doctorEmail:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)?'':'Valid email required'})) }} className="dp-input" />{errors.doctorEmail && <small className="dp-err">{errors.doctorEmail}</small>}</>
                  : <span style={{ color: '#185fa5' }}>{doctorData.doctorEmail}</span>}
              </InfoRow>

              <InfoRow label="Qualification">
                {isEditing
                  ? <><CFormInput name="qualification" value={formData.qualification} onChange={e => { setFormData(p=>({...p,qualification:e.target.value.replace(/[^A-Za-z\s]/g,'')})); setErrors(p=>({...p,qualification:''})) }} className="dp-input" />{errors.qualification && <small className="dp-err">{errors.qualification}</small>}</>
                  : doctorData.qualification}
              </InfoRow>

              <InfoRow label="Specialization">
                {isEditing
                  ? <><CFormInput name="specialization" value={formData.specialization} onChange={e => { setFormData(p=>({...p,specialization:e.target.value.replace(/[^A-Za-z\s]/g,'')})); setErrors(p=>({...p,specialization:''})) }} className="dp-input" />{errors.specialization && <small className="dp-err">{errors.specialization}</small>}</>
                  : doctorData.specialization}
              </InfoRow>

              <InfoRow label="Experience">
                {isEditing
                  ? <><CFormInput name="experience" value={formData.experience} onChange={e => { setFormData(p=>({...p,experience:e.target.value.replace(/[^0-9]/g,'')})); setErrors(p=>({...p,experience:''})) }} className="dp-input" />{errors.experience && <small className="dp-err">{errors.experience}</small>}</>
                  : `${doctorData.experience} Years`}
              </InfoRow>
            </div>

            <div className="dp-info-col">
              <div className="dp-section-label">Contact &amp; Schedule</div>

              <InfoRow label="Languages">
                {isEditing
                  ? <CFormInput value={formData.languages?.join(', ')||''} onChange={e => setFormData(p=>({...p,languages:e.target.value.replace(/[^A-Za-z,\s]/g,'').split(',').map(l=>l.trim())}))} className="dp-input" />
                  : doctorData.languages?.join(', ')}
              </InfoRow>

              <InfoRow label="Contact">
                {isEditing
                  ? <><CFormInput name="doctorMobileNumber" value={formData.doctorMobileNumber} onChange={e => { setFormData(p=>({...p,doctorMobileNumber:e.target.value.replace(/[^0-9]/g,'')})); setErrors(p=>({...p,doctorMobileNumber:''})) }} className="dp-input" />{errors.doctorMobileNumber && <small className="dp-err">{errors.doctorMobileNumber}</small>}</>
                  : doctorData.doctorMobileNumber}
              </InfoRow>

              <InfoRow label="Gender">
                {isEditing
                  ? <select className="dp-input dp-select" value={formData.gender} onChange={e => { setFormData(p=>({...p,gender:e.target.value})); setErrors(p=>({...p,gender:''})) }}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select>
                  : doctorData.gender}
              </InfoRow>

              <InfoRow label="Available Days">
                {isEditing
                  ? <CFormInput name="availableDays" value={formData.availableDays} onChange={e => { setFormData(p=>({...p,availableDays:e.target.value.replace(/[^A-Za-z,\s\-]/g,'')})); setErrors(p=>({...p,availableDays:''})) }} className="dp-input" />
                  : doctorData.availableDays}
              </InfoRow>

              <InfoRow label="Available Timings">
                {isEditing
                  ? <CFormInput name="availableTimes" value={formData.availableTimes} onChange={handleInputChange} className="dp-input" />
                  : doctorData.availableTimes}
              </InfoRow>

              <InfoRow label="Branch">
                {isEditing
                  ? <Select isMulti {...selectPortalProps} options={branchOptions}
                      value={branchOptions.filter(opt => Array.isArray(formData.branch) && formData.branch.some(b => b.branchId.toString()===opt.value.toString()))}
                      onChange={sel => setFormData(p=>({...p,branch:sel.map(o=>({branchId:o.value,branchName:o.label}))}))}
                      placeholder="Select branches…" />
                  : (Array.isArray(doctorData.branches) && doctorData.branches.length > 0
                      ? doctorData.branches.map(b=>b.branchName).join(', ')
                      : 'No branches')}
              </InfoRow>
            </div>
          </div>

          {/* Fees */}
          <div className="dp-fees-grid">
            <div className="dp-fee-card clinic">
              <span className="dp-fee-label">In-Clinic Fee</span>
              {isEditing
                ? <><CFormInput value={formData.doctorFees?.inClinicFee||''} onChange={e => { setFormData(p=>({...p,doctorFees:{...p.doctorFees,inClinicFee:e.target.value.replace(/[^0-9]/g,'')}})); setErrors(p=>({...p,inClinicFee:''})) }} className="dp-input" />{errors.inClinicFee && <small className="dp-err">{errors.inClinicFee}</small>}</>
                : <span className="dp-fee-val">₹{formData.doctorFees?.inClinicFee||'N/A'}</span>}
            </div>
            <div className="dp-fee-card video">
              <span className="dp-fee-label">Video Consultation</span>
              {isEditing
                ? <><CFormInput value={formData.doctorFees?.vedioConsultationFee||''} onChange={e => { setFormData(p=>({...p,doctorFees:{...p.doctorFees,vedioConsultationFee:e.target.value.replace(/[^0-9]/g,'')}})); setErrors(p=>({...p,vedioConsultationFee:''})) }} className="dp-input" />{errors.vedioConsultationFee && <small className="dp-err">{errors.vedioConsultationFee}</small>}</>
                : <span className="dp-fee-val">₹{formData.doctorFees?.vedioConsultationFee||'N/A'}</span>}
            </div>
          </div>

          {/* Extras */}
          <div className="dp-extras-grid">
            <div className="dp-extra-block">
              <div className="dp-section-label">Association / Membership</div>
              {isEditing
                ? <CFormInput name="associationsOrMemberships" value={formData.associationsOrMemberships} onChange={e => setFormData(p=>({...p,associationsOrMemberships:e.target.value.replace(/[^A-Za-z\s]/g,'')}))} className="dp-input" />
                : <p className="dp-extra-text">{doctorData.associationsOrMemberships||'—'}</p>}
            </div>
            <div className="dp-extra-block">
              <div className="dp-section-label">Profile Description</div>
              {isEditing
                ? <CFormInput name="profileDescription" value={formData.profileDescription} onChange={handleInputChange} className="dp-input" />
                : <p className="dp-extra-text">{doctorData.profileDescription||'—'}</p>}
            </div>
            <div className="dp-extra-block">
              <div className="dp-section-label">Area of Expertise</div>
              {isEditing
                ? <CFormTextarea rows={4} value={formData.focusAreas?.join('\n')||''} onChange={e => setFormData(p=>({...p,focusAreas:e.target.value.split('\n').map(l=>l.trimStart().startsWith('•')?l.trim():`• ${l.trim()}`).filter(l=>l!=='•')}))} className="dp-input" />
                : <ul className="dp-bullet-list">{formData.focusAreas?.length>0 ? formData.focusAreas.map((a,i)=><li key={i}>{a.replace(/^•\s*/,'')}</li>) : <li style={{color:'#9ca3af'}}>None</li>}</ul>}
            </div>
            <div className="dp-extra-block">
              <div className="dp-section-label">Achievements</div>
              {isEditing
                ? <CFormTextarea rows={4} value={formData.highlights?.join('\n')||''} onChange={e => setFormData(p=>({...p,highlights:e.target.value.split('\n').map(l=>l.trimStart().startsWith('•')?l.trim():`• ${l.trim()}`).filter(Boolean)}))} className="dp-input" />
                : <ul className="dp-bullet-list">{formData.highlights?.length>0 ? formData.highlights.map((h,i)=><li key={i}>{h.replace(/^•\s*/,'')}</li>) : <li style={{color:'#9ca3af'}}>None</li>}</ul>}
            </div>
            <div className="dp-extra-block">
              <div className="dp-section-label">Doctor Signature</div>
              {isEditing && (
                <CFormInput type="file" accept="image/jpeg,image/png" className="dp-input"
                  onChange={e => { const f = e.target.files[0]; if(!f) return; const r=new FileReader(); r.onloadend=()=>setFormData(p=>({...p,doctorSignature:r.result})); r.readAsDataURL(f) }} />
              )}
              <div className="dp-sig-box">
                {(isEditing ? formData.doctorSignature : doctorData.doctorSignature)
                  ? <img src={isEditing ? formData.doctorSignature : doctorData.doctorSignature} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  : <span style={{ fontSize:11, color:'#9ca3af', fontStyle:'italic' }}>No signature on file</span>}
              </div>
              {errors.doctorSignature && <small className="dp-err">{errors.doctorSignature}</small>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="dp-action-row">
            {isEditing ? (
              <>
                <button className="dp-btn dp-btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="dp-btn dp-btn-primary" onClick={handleUpdateWithValidation}>Update Doctor</button>
              </>
            ) : (
              <>
                <button className="dp-btn dp-btn-danger" onClick={() => setShowModal(true)}><Trash2 size={13}/> Delete</button>
                <button className="dp-btn dp-btn-edit" onClick={() => setIsEditing(true)}><Edit2 size={13}/> Edit Profile</button>
              </>
            )}
          </div>

          <ConfirmationModal
            isVisible={showModal} title="Delete Doctor"
            message="Are you sure you want to delete this doctor? This cannot be undone."
            confirmText="Yes, Delete" cancelText="Cancel"
            confirmColor="danger" cancelColor="secondary"
            onConfirm={() => handleDeleteDoctor(doctorData.doctorId)}
            onCancel={() => setShowModal(false)}
          />
        </div>
      )}

      {/* ══ TAB 2: Slots ══════════════════════════════ */}
      {activeKey === 2 && (
        <div className="dp-tab-panel">
          <div className="dp-slot-header">
            <h5 className="dp-panel-title"><Calendar size={16}/> Slot Management</h5>
            <button className="dp-btn dp-btn-primary" onClick={() => setVisibleSlot(true)}>
              <PlusCircle size={13}/> Add Slots
            </button>
          </div>

          {/* Date strip */}
          <div className="dp-date-strip">
            {days.map((dayObj, idx) => {
              const active = selectedDate === format(dayObj.date, 'yyyy-MM-dd')
              return (
                <button
                  key={idx}
                  className={`dp-date-btn${active ? ' active' : ''}`}
                  onClick={() => handleDateClick(dayObj, idx)}
                >
                  <span className="dp-day-lbl">{dayObj.dayLabel}</span>
                  <span className="dp-date-lbl">{dayObj.dateLabel}</span>
                </button>
              )
            })}
          </div>

          {/* Slot grid */}
          {loading ? <LoadingIndicator message="Loading slots…" /> : (
            <div className="dp-slot-grid">
              {slotsForSelectedDate.length === 0
                ? <div className="dp-slot-empty">No slots scheduled for {selectedDate}</div>
                : slotsForSelectedDate.map((slotObj, i) => {
                    const isSel    = selectedSlots.includes(slotObj.slot)
                    const isBooked = slotObj?.slotbooked
                    return (
                      <div
                        key={i}
                        className={`dp-slot-chip${isBooked ? ' booked' : isSel ? ' selected' : ' available'}`}
                        onClick={() => { if (!isBooked) toggleSlot(slotObj.slot) }}
                        title={isBooked ? 'Booked' : 'Available'}
                      >
                        {slotObj.slot}
                      </div>
                    )
                  })}
            </div>
          )}

          <div className="dp-slot-legend">
            <span><span className="dp-legend-dot available-dot" />Available</span>
            <span><span className="dp-legend-dot booked-dot" />Booked</span>
            <span><span className="dp-legend-dot selected-dot" />Selected</span>
          </div>

          {/* Slot actions */}
          <div className="dp-slot-actions">
            <button className="dp-btn dp-btn-ghost" disabled={selectedSlots.length===0}
              onClick={() => { setDeleteMode('selected'); setShowDeleteConfirmModal(true) }}>
              Delete Selected ({selectedSlots.length})
            </button>
            <button className="dp-btn dp-btn-danger"
              onClick={() => { setDeleteMode('all'); setShowDeleteConfirmModal(true) }}>
              <Trash2 size={13}/> Delete All for Date
            </button>
          </div>
        </div>
      )}

      {/* ══ TAB 3: Ratings ════════════════════════════ */}
      {activeKey === 3 && (
        <div className="dp-tab-panel">
          {ratings ? (
            <>
              <div className="dp-rating-summary">
                <div className="dp-rating-card">
                  <span className="dp-rating-big">⭐ {ratings.overallDoctorRating}</span>
                  <span className="dp-rating-sub">Overall Rating</span>
                </div>
                <div className="dp-rating-card">
                  <span className="dp-rating-big">{ratings.comments?.length || 0}</span>
                  <span className="dp-rating-sub">Total Reviews</span>
                </div>
              </div>

              <div className="dp-comments">
                {ratings.comments?.map((comment, idx) => (
                  <div key={idx} className="dp-comment-card">
                    <div className="dp-comment-avatar">{getInitials(comment.patientName)}</div>
                    <div className="dp-comment-body">
                      <div className="dp-comment-header">
                        <div>
                          <span className="dp-comment-name">{comment.patientName}</span>
                          <span className="dp-comment-time">{formatTimeAgo(comment.dateAndTimeAtRating)}</span>
                        </div>
                        <span className="dp-comment-rating">⭐ {comment.doctorRating}</span>
                      </div>
                      <p className="dp-comment-text">{comment.feedback?.trim() || 'No feedback provided.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="dp-empty"><Star size={40} className="dp-empty-icon" /><p>No ratings yet.</p></div>
          )}
        </div>
      )}

      {/* ══ TAB 4: Services ═══════════════════════════ */}
      {activeKey === 4 && (
        <div className="dp-tab-panel">
          <div className="dp-svc-grid">
            {doctorData?.category?.length > 0 && (
              <div className="dp-svc-card cat">
                <div className="dp-svc-head">Categories</div>
                <ul className="dp-svc-list">{doctorData.category.map((c,i) => <li key={i}><span className="dp-svc-tag cat">{c.categoryName}</span></li>)}</ul>
              </div>
            )}
            {doctorData?.service?.length > 0 && (
              <div className="dp-svc-card svc">
                <div className="dp-svc-head">Services</div>
                <ul className="dp-svc-list">{doctorData.service.map((s,i) => <li key={i}><span className="dp-svc-tag svc">{s.serviceName}</span></li>)}</ul>
              </div>
            )}
            {doctorData?.subServices?.length > 0 && (
              <div className="dp-svc-card sub">
                <div className="dp-svc-head">Procedures</div>
                <ul className="dp-svc-list">{doctorData.subServices.map((ss,i) => <li key={i}><span className="dp-svc-tag sub">{ss.subServiceName}</span></li>)}</ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add Slots Modal ─────────────────────────── */}
      <CModal visible={visibleSlot} onClose={() => { setVisibleSlot(false); setSlots([]); setSelectedSlots([]) }} size="lg" backdrop="static" alignment="center" className="dp-modal">
        <CModalHeader className="dp-modal-header">
          <CModalTitle className="dp-modal-title">Add Time Slots — {selectedDate}</CModalTitle>
        </CModalHeader>
        <CModalBody className="dp-modal-body">
          <div className="dp-slot-gen-row">
            {[10, 20, 30].map(v => (
              <label key={v} className="dp-radio-label">
                <input type="radio" value={v} checked={slotInterval===v} onChange={() => { setSlotInterval(v); setSlots([]); setSelectedSlots([]) }} />
                {v} min
              </label>
            ))}
            <button className="dp-btn dp-btn-primary" onClick={handleGenerate}>Generate Slots</button>
          </div>

          {slots.length > 0 && (
            <label className="dp-select-all">
              <input type="checkbox"
                checked={selectedSlots.length===slots.filter(s=>s.available).length}
                onChange={e => setSelectedSlots(e.target.checked ? slots.filter(s=>s.available).map(s=>s.slot) : [])} />
              Select All
            </label>
          )}

          <div className="dp-slot-pick-grid">
            {slots.map((slotObj, i) => {
              const isSel = selectedSlots.includes(slotObj.slot)
              return (
                <button key={i}
                  className={`dp-slot-pick${isSel ? ' selected' : ''}${!slotObj.available ? ' disabled' : ''}`}
                  onClick={() => { if (!slotObj.available) { toast.info('Unavailable'); return } toggleSlot(slotObj.slot) }}>
                  {slotObj.slot}
                </button>
              )
            })}
          </div>
        </CModalBody>
        <CModalFooter className="dp-modal-footer">
          <button className="dp-btn dp-btn-ghost" onClick={() => setVisibleSlot(false)}>Cancel</button>
          <button className="dp-btn dp-btn-primary" disabled={selectedSlots.length===0} onClick={handleAddSlot}>
            Save Slots ({selectedSlots.length})
          </button>
        </CModalFooter>
      </CModal>

      {/* ── Delete Confirm Modal ────────────────────── */}
      <CModal visible={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} alignment="center" backdrop="static" className="dp-modal">
        <CModalHeader className="dp-modal-header">
          <CModalTitle className="dp-modal-title">Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody className="dp-modal-body">
          {deleteMode === 'selected'
            ? <p>Delete <strong>{selectedSlots.length}</strong> selected slot(s) for <strong>{selectedDate}</strong>?</p>
            : <p>Delete <strong>ALL</strong> slots for <strong>{selectedDate}</strong>?</p>}
        </CModalBody>
        <CModalFooter className="dp-modal-footer">
          <button className="dp-btn dp-btn-ghost" onClick={() => setShowDeleteConfirmModal(false)}>Cancel</button>
          <button className="dp-btn dp-btn-danger" onClick={async () => {
            try {
              if (deleteMode === 'selected') {
                await Promise.all(selectedSlots.map(slot => http.delete(`${BASE_URL}/doctorId/${doctorData.doctorId}/branchId/${branchId}/date/${selectedDate}/slot/${slot}`)))
                toast.success('Selected slots deleted.')
              } else {
                await http.delete(`${BASE_URL}/delete-by-date/${doctorData.doctorId}/${branchId}/${selectedDate}`)
                toast.success(`All slots for ${selectedDate} deleted.`)
              }
              setSelectedSlots([]); fetchSlots()
            } catch { toast.error('Failed to delete slots.') }
            finally { setShowDeleteConfirmModal(false) }
          }}><Trash2 size={13}/> Confirm Delete</button>
        </CModalFooter>
      </CModal>

      {/* ── STYLES ──────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Hero ─────────────────────────────── */
        .dp-hero {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1rem;
          box-shadow: 0 2px 12px rgba(24,95,165,0.06);
        }
        .dp-hero-banner {
          background: linear-gradient(135deg, #042C53 0%, #185fa5 100%);
          padding: 1.5rem 1.5rem 3.25rem;
          position: relative;
          overflow: hidden;
        }
        .dp-hero-banner::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .dp-hero-banner::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1.5px;
          background: rgba(250,199,117,0.5);
        }
        .dp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 0.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.85);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .dp-hero-badge-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #9FE1CB;
          animation: dp-pulse 2s infinite;
        }
        @keyframes dp-pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .dp-hero-name {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 5px;
          position: relative;
          z-index: 1;
        }
        .dp-hero-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          margin: 0;
          position: relative;
          z-index: 1;
        }
        .dp-hero-lower {
          display: grid;
          grid-template-columns: 96px 1fr;
          align-items: flex-end;
          padding: 0 1.5rem;
          margin-top: -38px;
        }
        .dp-hero-avatar-wrap { position: relative; z-index: 2; }
        .dp-hero-avatar {
          width: 76px; height: 76px;
          border-radius: 50%;
          border: 3px solid #fff;
          object-fit: cover;
          box-shadow: 0 4px 16px rgba(24,95,165,0.2);
          display: block;
        }
        .dp-hero-avatar-initials {
          background: #e6f1fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #185fa5;
        }
        .dp-hero-meta {
          padding-top: 42px;
          padding-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dp-hero-id {
          font-size: 11px;
          background: #f1efe8;
          border: 0.5px solid #d3d1c7;
          color: #5f5e5a;
          border-radius: 20px;
          padding: 3px 10px;
          font-weight: 500;
        }
        .dp-hero-avail {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #5f5e5a;
          font-weight: 500;
        }
        .dp-avail-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #1D9E75;
        }
        .dp-stats-row {
          display: flex;
          gap: 8px;
          padding: 12px 1.5rem 1.25rem;
          flex-wrap: wrap;
        }
        .dp-stat {
          flex: 1;
          min-width: 80px;
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          border-radius: 10px;
          padding: 10px 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .dp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #0c447c;
        }
        .dp-stat-lbl {
          font-size: 10px;
          font-weight: 600;
          color: #185fa5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Tabs ──────────────────────────────── */
        .dp-tabs {
          display: flex;
          gap: 3px;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .dp-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border: none;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 500;
          color: #5f5e5a;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .dp-tab.active {
          background: #185fa5;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(24,95,165,0.25);
        }
        .dp-tab:hover:not(.active) { background: #e6f1fb; color: #185fa5; }

        /* ── Panel ─────────────────────────────── */
        .dp-tab-panel {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }

        /* ── Section label ─────────────────────── */
        .dp-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #185fa5;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 0.5px solid #e6f1fb;
        }

        /* ── Edit section ──────────────────────── */
        .dp-edit-section {
          background: #f7fafd;
          border: 0.5px solid #d0dce9;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 1.25rem;
        }
        .dp-photo-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 12px;
        }
        .dp-photo-preview {
          width: 72px; height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #b5d4f4;
        }
        .dp-file-input { font-size: 12px; }
        .dp-label {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
          display: block;
          letter-spacing: 0.02em;
        }

        /* ── Inputs ────────────────────────────── */
        .dp-input {
          height: 34px !important;
          font-size: 13px !important;
          border: 0.5px solid #d0dce9 !important;
          border-radius: 8px !important;
          margin-top: 4px;
          background: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .dp-input:focus {
          border-color: #185fa5 !important;
          box-shadow: 0 0 0 3px rgba(24,95,165,0.1) !important;
          outline: none !important;
        }
        .dp-select {
          width: 100%;
          padding: 0 10px;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888780' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 10px center !important;
        }
        .dp-err { font-size: 11px; color: #a32d2d; margin-top: 3px; display: block; }

        /* ── Info grid ─────────────────────────── */
        .dp-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 640px) { .dp-info-grid { grid-template-columns: 1fr; } }
        .dp-info-col {}
        .dp-info-row { margin-bottom: 14px; display: flex; flex-direction: column; gap: 3px; }
        .dp-info-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #888780;
        }
        .dp-info-value { font-size: 13.5px; color: #2c2c2a; font-weight: 400; line-height: 1.4; }

        /* ── Fee cards ─────────────────────────── */
        .dp-fees-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 1.25rem;
        }
        .dp-fee-card {
          border-radius: 10px;
          padding: 14px 16px;
          border: 0.5px solid;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dp-fee-card.clinic { background: #E1F5EE; border-color: #9FE1CB; }
        .dp-fee-card.video  { background: #FAEEDA; border-color: #FAC775; }
        .dp-fee-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .dp-fee-card.clinic .dp-fee-label { color: #0F6E56; }
        .dp-fee-card.video  .dp-fee-label { color: #854F0B; }
        .dp-fee-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
        }
        .dp-fee-card.clinic .dp-fee-val { color: #085041; }
        .dp-fee-card.video  .dp-fee-val { color: #633806; }

        /* ── Extras ────────────────────────────── */
        .dp-extras-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 640px) { .dp-extras-grid { grid-template-columns: 1fr; } }
        .dp-extra-block {
          background: #f7f6f2;
          border: 0.5px solid #d3d1c7;
          border-radius: 10px;
          padding: 14px;
        }
        .dp-extra-text { font-size: 13px; color: #2c2c2a; line-height: 1.6; margin: 0; }
        .dp-bullet-list { list-style: none; margin: 6px 0 0; padding: 0; }
        .dp-bullet-list li {
          font-size: 13px;
          color: #2c2c2a;
          padding: 3px 0 3px 14px;
          position: relative;
          line-height: 1.5;
        }
        .dp-bullet-list li::before {
          content: '';
          position: absolute;
          left: 0; top: 9px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #378ADD;
        }
        .dp-sig-box {
          width: 150px; height: 70px;
          border: 0.5px solid #d3d1c7;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          margin-top: 8px;
          overflow: hidden;
        }

        /* ── Action row ────────────────────────── */
        .dp-action-row {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 0.5px solid #e6f1fb;
        }

        /* ── Buttons ───────────────────────────── */
        .dp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 9px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: 0.5px solid;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .dp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .dp-btn-primary {
          background: #185fa5;
          color: #fff;
          border-color: #185fa5;
          box-shadow: 0 2px 8px rgba(24,95,165,0.2);
        }
        .dp-btn-primary:hover:not(:disabled) { background: #0c447c; border-color: #0c447c; }
        .dp-btn-edit {
          background: #EAF3DE;
          color: #27500A;
          border-color: #C0DD97;
        }
        .dp-btn-edit:hover { background: #C0DD97; }
        .dp-btn-danger {
          background: #FCEBEB;
          color: #791F1F;
          border-color: #F7C1C1;
        }
        .dp-btn-danger:hover:not(:disabled) { background: #F7C1C1; }
        .dp-btn-ghost {
          background: #fff;
          color: #5f5e5a;
          border-color: #d0dce9;
        }
        .dp-btn-ghost:hover:not(:disabled) { background: #f1efe8; }

        /* ── Slot tab ──────────────────────────── */
        .dp-slot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .dp-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #0c447c;
          margin: 0;
        }
        .dp-date-strip {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 1rem;
          scrollbar-width: thin;
        }
        .dp-date-btn {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 54px;
          padding: 8px 6px;
          border: 0.5px solid #d0dce9;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .dp-date-btn.active { background: #185fa5; border-color: #185fa5; }
        .dp-date-btn:hover:not(.active) { border-color: #85B7EB; background: #e6f1fb; }
        .dp-day-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
        .dp-date-lbl { font-size: 11px; font-weight: 500; }
        .dp-date-btn        .dp-day-lbl, .dp-date-btn        .dp-date-lbl { color: #2c2c2a; }
        .dp-date-btn.active .dp-day-lbl, .dp-date-btn.active .dp-date-lbl { color: #fff; }
        .dp-slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 8px;
          margin-bottom: 10px;
        }
        .dp-slot-chip {
          text-align: center;
          padding: 9px 4px;
          border: 0.5px solid;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.12s;
          user-select: none;
        }
        .dp-slot-chip.available { background: #E1F5EE; color: #085041; border-color: #9FE1CB; }
        .dp-slot-chip.available:hover { background: #9FE1CB; }
        .dp-slot-chip.selected { background: #185fa5; color: #fff; border-color: #185fa5; }
        .dp-slot-chip.booked  { background: #FCEBEB; color: #791F1F; border-color: #F7C1C1; cursor: not-allowed; }
        .dp-slot-empty {
          grid-column: 1 / -1;
          text-align: center;
          color: #888780;
          font-size: 13px;
          padding: 2.5rem;
          background: #f7f6f2;
          border-radius: 10px;
          border: 0.5px solid #d3d1c7;
        }
        .dp-slot-legend {
          display: flex;
          gap: 14px;
          font-size: 11px;
          color: #5f5e5a;
          margin-bottom: 12px;
        }
        .dp-legend-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-right: 4px;
          vertical-align: middle;
        }
        .available-dot { background: #1D9E75; }
        .booked-dot    { background: #E24B4A; }
        .selected-dot  { background: #185fa5; }
        .dp-slot-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 0.5px solid #e6f1fb;
        }

        /* ── Ratings ───────────────────────────── */
        .dp-rating-summary { display: flex; gap: 10px; margin-bottom: 1.25rem; }
        .dp-rating-card {
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          border-radius: 12px;
          padding: 14px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 110px;
        }
        .dp-rating-big {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #0c447c;
          line-height: 1;
        }
        .dp-rating-sub {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #185fa5;
        }
        .dp-comments { display: flex; flex-direction: column; gap: 10px; }
        .dp-comment-card {
          display: flex;
          gap: 12px;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          padding: 14px;
          position: relative;
          overflow: hidden;
        }
        .dp-comment-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #185fa5;
        }
        .dp-comment-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #185fa5;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .dp-comment-body { flex: 1; }
        .dp-comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }
        .dp-comment-name { font-size: 13px; font-weight: 500; color: #0c447c; display: block; }
        .dp-comment-time { font-size: 11px; color: #888780; }
        .dp-comment-rating {
          font-size: 12px;
          font-weight: 600;
          color: #633806;
          background: #FAEEDA;
          border: 0.5px solid #FAC775;
          border-radius: 20px;
          padding: 2px 8px;
          white-space: nowrap;
        }
        .dp-comment-text { font-size: 13px; color: #5f5e5a; line-height: 1.6; margin: 0; }
        .dp-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 3rem; color: #888780; font-size: 13px;
        }
        .dp-empty-icon { color: #d3d1c7; }

        /* ── Services ──────────────────────────── */
        .dp-svc-grid { display: flex; flex-direction: column; gap: 10px; }
        .dp-svc-card { border: 0.5px solid; border-radius: 12px; overflow: hidden; }
        .dp-svc-head {
          padding: 10px 14px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
        }
        .dp-svc-card.cat { border-color: #b5d4f4; }
        .dp-svc-card.cat .dp-svc-head { background: #185fa5; }
        .dp-svc-card.svc { border-color: #9FE1CB; }
        .dp-svc-card.svc .dp-svc-head { background: #1D9E75; }
        .dp-svc-card.sub { border-color: #FAC775; }
        .dp-svc-card.sub .dp-svc-head { background: #BA7517; }
        .dp-svc-list {
          list-style: none; margin: 0; padding: 10px 14px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .dp-svc-tag {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          border: 0.5px solid;
        }
        .dp-svc-tag.cat { background: #e6f1fb; color: #0c447c; border-color: #b5d4f4; }
        .dp-svc-tag.svc { background: #E1F5EE; color: #085041; border-color: #9FE1CB; }
        .dp-svc-tag.sub { background: #FAEEDA; color: #633806; border-color: #FAC775; }

        /* ── Modal ─────────────────────────────── */
        .dp-modal .modal-content {
          border: 0.5px solid #d0dce9 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(4,44,83,0.14) !important;
        }
        .dp-modal-header {
          background: linear-gradient(135deg, #042C53, #185fa5) !important;
          border-bottom: none !important;
          padding: 16px 20px !important;
        }
        .dp-modal-title {
          font-family: 'Syne', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #fff !important;
        }
        .dp-modal .btn-close { filter: brightness(0) invert(1); opacity: 0.75; }
        .dp-modal-body { background: #f7f6f2 !important; padding: 1.25rem !important; }
        .dp-modal-footer {
          background: #f7f6f2 !important;
          border-top: 0.5px solid #d0dce9 !important;
          padding: 12px 1.25rem !important;
          display: flex; justify-content: flex-end; gap: 8px;
        }

        /* ── Slot modal controls ───────────────── */
        .dp-slot-gen-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .dp-radio-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
        }
        .dp-select-all {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .dp-slot-pick-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .dp-slot-pick {
          padding: 6px 10px;
          border: 0.5px solid #d0dce9;
          border-radius: 7px;
          background: #fff;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.12s;
          font-family: 'DM Sans', sans-serif;
        }
        .dp-slot-pick.selected { background: #185fa5; color: #fff; border-color: #185fa5; }
        .dp-slot-pick.disabled { background: #f1efe8; color: #888780; cursor: not-allowed; }
      `}</style>
    </div>
  )
}

export default DoctorDetailsPage