import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { AddDoctorByAdmin } from './DoctorAPI'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import sendDermaCareOnboardingEmail from '../../Utils/Emailjs'
import { useNavigate } from 'react-router-dom'
import {
  CModal, CModalHeader, CModalBody, CModalFooter,
  CFormInput, CFormSelect, CFormTextarea, CRow, CCol,
  CFormLabel, CFormCheck,
} from '@coreui/react'
import Select from 'react-select'
import {
  BASE_URL, MainAdmin_URL, getSubServicesbyserviceId,
  getadminSubServicesbyserviceId, getservice, GetBy_DoctorId,
} from '../../baseUrl'
import { serviceData, subServiceData, getSubServiceById } from '../ProcedureManagement/ProcedureAPI'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import { GetClinicBranches } from '../Doctors/DoctorAPI'
import {
  User, Briefcase, Clock, CreditCard, FileText,
  Layers, Save, X, Plus, Trash2,
} from 'lucide-react'

const AddDoctors = ({ modalVisible, setModalVisible, clinicId, closeForm, branchId, fetchAllDoctors }) => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab]             = useState(1)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [branchOptions, setBranchOptions]     = useState([])
  const [branchLoading, setBranchLoading]     = useState(false)
  const [isSaving, setIsSaving]               = useState(false)
  const [doctorData, setDoctorData]           = useState(null)
  const [errorMessage, setErrorMessage]       = useState('')
  const [newService, setNewService]           = useState({ serviceName: '', serviceId: '' })
  const [selectedServices, setSelectedServices] = useState([])
  const [enabledTypes, setEnabledTypes]       = useState({ inClinic: false, online: false, serviceTreatment: false })

  const [form, setForm] = useState({
    doctorPicture: null, doctorLicence: '', doctorMobileNumber: '',
    doctorEmail: '', doctorName: '', service: [], subServices: [],
    specialization: '', gender: '', experience: '', qualification: '',
    associationsOrMemberships: '', branch: [], availableDays: '',
    availableTimes: '', profileDescription: '', doctorSignature: null,
    doctorFees: { inClinicFee: '', vedioConsultationFee: '' },
    focusAreas: [], languages: [], highlights: [], availableConsultations: [],
  })

  const [startDay, setStartDay]               = useState('')
  const [endDay, setEndDay]                   = useState('')
  const [startTime, setStartTime]             = useState('')
  const [endTime, setEndTime]                 = useState('')
  const [category, setCategory]               = useState([])
  const [service, setService]                 = useState([])
  const [serviceOptions, setServiceOptions]   = useState([])
  const [serviceOptionsFormatted, setServiceOptionsFormatted] = useState([])
  const [subServiceOptions, setSubServiceOptions] = useState([])
  const [selectedSubService, setSelectedSubService] = useState([])
  const [formErrors, setFormErrors]           = useState({})
  const [loading, setLoading]                 = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState('')
  const [isSubServiceComplete, setIsSubServiceComplete] = useState(true)

  const clearFieldError = (field) => setFormErrors(prev => { const u = { ...prev }; delete u[field]; return u })

  const toggleType = (type) => {
    setEnabledTypes(prev => {
      const updated = { ...prev, [type]: !prev[type] }
      const c = []
      if (updated.serviceTreatment) c.push('Services & Treatments')
      if (updated.inClinic) c.push('In-Clinic')
      if (updated.online) c.push('Video/Online')
      setForm(f => ({ ...f, availableConsultations: c }))
      return updated
    })
  }

  const availableDays = (value, type) => {
    if (type === 'start') { setStartDay(value); setForm(p => ({ ...p, availableDays: `${value} - ${endDay || ''}`.trim() })) }
    else { setEndDay(value); setForm(p => ({ ...p, availableDays: `${startDay || ''} - ${value}`.trim() })) }
  }

  const handleTimeChange = (value, type) => {
    if (type === 'start') { setStartTime(value); setForm(p => ({ ...p, availableTimes: `${value} - ${endTime || ''}`.trim() })) }
    else { setEndTime(value); setForm(p => ({ ...p, availableTimes: `${startTime || ''} - ${value}`.trim() })) }
  }

  const fetchSubServices = async (serviceIds) => {
    if (!Array.isArray(serviceIds) || !serviceIds.length) return
    try {
      const all = await Promise.all(serviceIds.map(id => subServiceData(id)))
      const flat = all.flatMap(r => (r.data || []).flatMap(b => b.subServices || []))
      setSubServiceOptions(flat)
    } catch { setSubServiceOptions([]) }
  }

  const handleChanges = async (e) => {
    const { name, value } = e.target
    if (name === 'categoryId') {
      setNewService(p => ({ ...p, categoryId: value, serviceId: [], serviceName: [] }))
      try {
        const all = await Promise.all(value.map(id => axios.get(`${BASE_URL}/${getservice}/${id}`)))
        const merged = all.flatMap(r => r.data?.data || [])
        setServiceOptions(merged)
        setServiceOptionsFormatted(merged.map(s => ({ label: s.serviceName, value: s.serviceId })))
      } catch { setServiceOptions([]); setServiceOptionsFormatted([]) }
    }
  }

  const days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const times = ['07:00 AM','08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM',
                 '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM',
                 '07:00 PM','08:00 PM','09:00 PM','10:00 PM']

  const fetchData = async () => {
    try {
      const catRes = await CategoryData()
      if (catRes.data && Array.isArray(catRes.data)) setCategory(catRes.data)
      const svcRes = await serviceData()
      setService(svcRes.data)
    } catch (e) { console.error(e) }
  }

  const fetchHospitalDetails = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getClinicById/${id}`)
      if (res.status === 200) setSelectedHospital(res.data)
    } catch (e) { setErrorMessage('Error fetching clinic details.') }
  }

  const fetchDoctorDetails = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/${GetBy_DoctorId}/${id}`)
      if (res.status === 200) setDoctorData(res.data)
    } catch { setErrorMessage('Error fetching doctor details.') }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await fetchData()
        await fetchHospitalDetails(clinicId)
        setBranchLoading(true)
        const res = await GetClinicBranches(clinicId)
        const branches = res.data || []
        setBranchOptions(branches.map(b => ({ value: b.branchId || b.id || b.name, label: b.branchName || b.name })))
      } catch (e) { setShowErrorMessage('Failed to fetch hospital details') }
      finally { setLoading(false); setBranchLoading(false) }
    }
    init()
    fetchDoctorDetails(clinicId)
  }, [])

  const validateDoctorForm = () => {
    const errs = {}
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    if (!newService.categoryId?.length) errs.categoryId = 'Select at least one category.'
    if (!selectedServices?.length) errs.serviceId = 'Select at least one service.'
    if (!selectedSubService?.length) errs.subServiceName = 'Select at least one sub service.'
    if (!form.doctorName.trim()) errs.doctorName = 'Doctor name is required'
    if (!form.gender.trim()) errs.gender = 'Gender is required'
    if (!form.doctorLicence.trim()) errs.doctorLicence = 'License number is required'
    if (!form.doctorMobileNumber || !/^[789]\d{9}$/.test(form.doctorMobileNumber)) errs.doctorMobileNumber = 'Enter valid 10-digit number starting with 7, 8, or 9'
    if (!form.doctorEmail || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(form.doctorEmail)) errs.doctorEmail = 'Enter a valid email'
    if (!form.experience || isNaN(form.experience) || form.experience < 0) errs.experience = 'Enter valid experience'
    if (!form.qualification.trim()) errs.qualification = 'Qualification is required'
    if (!form.specialization.trim()) errs.specialization = 'Specialization is required'
    if (!form.profileDescription.trim()) errs.profileDescription = 'Profile description is required'
    if (enabledTypes.inClinic && (!form.doctorFees.inClinicFee || Number(form.doctorFees.inClinicFee) <= 0)) errs.inClinicFee = 'Enter valid in-clinic fee'
    if (enabledTypes.online && (!form.doctorFees.vedioConsultationFee || Number(form.doctorFees.vedioConsultationFee) <= 0)) errs.vedioConsultationFee = 'Enter valid video fee'
    if (!form.doctorPicture) errs.doctorPicture = 'Profile picture is required'
    if (!form.doctorSignature) errs.doctorSignature = 'Doctor signature is required'
    if (!form.languages?.length) errs.languages = 'Add at least one language.'
    if (!startDay || !endDay) errs.availableDays = 'Start and end days are required'
    else if (dayOrder.indexOf(startDay) > dayOrder.indexOf(endDay)) errs.availableDays = 'Start day cannot be after end day'
    const to24 = (t) => { const [r, m] = t.split(' '); let [h, mm] = r.split(':').map(Number); if (m==='PM'&&h!==12) h+=12; if (m==='AM'&&h===12) h=0; return h*60+mm }
    if (!startTime || !endTime) errs.availableTimes = 'Start and end times are required'
    else if (to24(startTime) >= to24(endTime)) errs.availableTimes = 'Start time must be before end time'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const categoryOptions = category.map(c => ({ value: c.categoryId, label: c.categoryName }))

  const resetForm = () => {
    setForm({ doctorPicture: null, doctorSignature: null, doctorLicence: '', doctorMobileNumber: '',
      doctorEmail: '', doctorName: '', gender: '', experience: '', qualification: '',
      associationsOrMemberships: '', branch: '', specialization: '', availableDays: '',
      availableTimes: '', profileDescription: '', focusAreas: [], languages: [], highlights: [],
      doctorFees: { inClinicFee: '', vedioConsultationFee: '' }, service: [], subServices: [],
      availableConsultations: [] })
    setNewService({ serviceId: '', serviceName: '', categoryId: '', categoryName: '' })
    setSelectedServices([]); setSelectedSubService([]); setServiceOptions([])
    setSubServiceOptions([]); setStartDay(''); setEndDay(''); setStartTime(''); setEndTime('')
  }

  const handleSubmit = async () => {
    if (!validateDoctorForm()) return
    setIsSaving(true)
    try {
      const subObjs = (subServiceOptions || [])
        .filter(s => selectedSubService.includes(s.subServiceId))
        .map(s => ({ subServiceId: s.subServiceId, subServiceName: s.subServiceName }))

      const payload = {
        branchId, hospitalId: clinicId,
        doctorPicture: form.doctorPicture, doctorSignature: form.doctorSignature,
        doctorName: form.doctorName, doctorMobileNumber: form.doctorMobileNumber,
        doctorEmail: form.doctorEmail, doctorLicence: form.doctorLicence,
        category: categoryOptions.filter(c => newService.categoryId?.includes(c.value)).map(c => ({ categoryId: c.value, categoryName: c.label })),
        service: selectedServices.map(s => ({ serviceId: s.serviceId, serviceName: s.serviceName })),
        subServices: subObjs, gender: form.gender, experience: form.experience,
        qualification: form.qualification, associationsOrMemberships: form.associationsOrMemberships,
        branches: form.branch, specialization: form.specialization,
        availableDays: form.availableDays, availableTimes: form.availableTimes,
        profileDescription: form.profileDescription, focusAreas: form.focusAreas,
        languages: form.languages, highlights: form.highlights,
        doctorFees: { inClinicFee: form.doctorFees?.inClinicFee ?? null, vedioConsultationFee: form.doctorFees?.vedioConsultationFee ?? null },
      }

      const response = await AddDoctorByAdmin(payload)
      if (!response?.data) throw new Error('Invalid API response')
      if (response.data.status === 201) {
        const newDoc = response.data.data?.doctor || response.data.data || payload
        setDoctorData(prev => ({ ...prev, data: [...(prev?.data || []), newDoc] }))
        if (response.data.data?.temporaryPassword) {
          await sendDermaCareOnboardingEmail({ name: form.doctorName, email: form.doctorEmail,
            password: response.data.data.temporaryPassword, userID: response.data.data.username,
            clinicName: localStorage.getItem('HospitalName') })
        }
        toast.success(response.data.message || 'Doctor added successfully')
        fetchAllDoctors(); resetForm(); setModalVisible(false)
      } else { throw new Error(response.data.message || 'Unexpected error') }
    } catch (err) { toast.error(err.message || 'Something went wrong'); setModalVisible(true) }
    finally { setIsSaving(false) }
  }

  const checkSubServiceDetails = async (ids) => {
    let incomplete = false
    for (const id of ids) {
      const data = await getSubServiceById(clinicId, id)
      if (!data || !data.price || !data.finalCost) { incomplete = true; break }
    }
    setIsSubServiceComplete(!incomplete)
  }

  // ── Shared helpers ────────────────────────────────────────────────────────
  const reactSelectStyles = {
    control: (base, state) => ({
      ...base, fontSize: 13, minHeight: 36,
      borderColor: state.isFocused ? '#185fa5' : '#d0dce9',
      borderWidth: '0.5px', borderRadius: 7, boxShadow: 'none',
      '&:hover': { borderColor: '#185fa5' },
    }),
    option: (base, state) => ({
      ...base, fontSize: 13,
      backgroundColor: state.isSelected ? '#185fa5' : state.isFocused ? '#f0f5fb' : '#fff',
      color: state.isSelected ? '#fff' : '#374151',
    }),
    multiValue:       (b) => ({ ...b, background: '#e6f1fb', borderRadius: 20 }),
    multiValueLabel:  (b) => ({ ...b, color: '#0c447c', fontSize: 12 }),
    multiValueRemove: (b) => ({ ...b, color: '#185fa5', ':hover': { background: '#b5d4f4' } }),
    // NOTE: menu styles removed here — portal renders outside modal, no clip risk
    placeholder:      (b) => ({ ...b, fontSize: 13, color: '#9ca3af' }),
  }

  // Shared props added to every <Select> to fix dropdown clipping inside modal
  const selectPortalProps = {
    menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
    menuPosition: 'fixed',
    styles: {
      ...reactSelectStyles,
      menuPortal: (b) => ({ ...b, zIndex: 99999 }),
    },
  }

  const FormSection = ({ icon: Icon, title, children }) => (
    <div className="ad-section">
      <div className="ad-section-title"><Icon size={14} className="ad-section-icon" />{title}</div>
      <div className="ad-section-body">{children}</div>
    </div>
  )

  const Field = ({ label, required, error, children, full }) => (
    <div className={`ad-field ${full ? 'ad-col-full' : ''}`}>
      <label className="ad-label">{label}{required && <span className="ad-required">*</span>}</label>
      {children}
      {error && <span className="ad-error">{error}</span>}
    </div>
  )

  const ChipSection = ({ label, items, onAdd, error }) => {
    const [input, setInput] = useState('')
    const add = () => {
      const t = input.trim()
      if (t && !items.includes(t)) { onAdd([...items, t]); setInput('') }
    }
    const remove = (i) => onAdd(items.filter((_, idx) => idx !== i))
    return (
      <div className="ad-field ad-col-full">
        <label className="ad-label">{label}</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input className="ad-input" placeholder={`Add ${typeof label === 'string' ? label : ''}…`}
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
          <button type="button" className="ad-chip-add" onClick={add}><Plus size={13} /> Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {items.length ? items.map((item, i) => (
            <span key={i} className="ad-chip">
              {item}
              <button type="button" className="ad-chip-remove" onClick={() => remove(i)}><X size={11} /></button>
            </span>
          )) : <span style={{ fontSize: 12, color: '#9ca3af' }}>None added</span>}
        </div>
        {error && <span className="ad-error">{error}</span>}
      </div>
    )
  }

  return (
    <div>
      

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#e6f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#185fa5' }}>
              <User size={17} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0c447c' }}>Add Doctor</span>
          </div>
        </CModalHeader>

        <CModalBody style={{ padding: '20px', maxHeight: '75vh', overflowY: 'auto', position: 'relative' }}>

          {/* ── Full-body loading overlay ── */}
          {loading && (
            <div className="ad-loading-overlay">
              <div className="ad-loading-card">
                <div className="ad-spinner" />
                <span className="ad-loading-text">Loading form data…</span>
              </div>
            </div>
          )}

          {/* ── Services ── */}
          <FormSection icon={Layers} title="Services & Procedures">
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="Category" required error={formErrors.categoryId}>
                  <Select
                    isMulti
                    {...selectPortalProps}
                    options={categoryOptions}
                    value={categoryOptions.filter(o => newService.categoryId?.includes(o.value))}
                    onChange={sel => {
                      handleChanges({ target: { name: 'categoryId', value: sel.map(o => o.value) } })
                      if (sel.length) clearFieldError('categoryId')
                    }}
                    placeholder="Select Category"
                  />
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="Service Name" required error={formErrors.serviceId}>
                  <Select
                    isMulti
                    {...selectPortalProps}
                    options={serviceOptionsFormatted}
                    value={serviceOptionsFormatted.filter(o => selectedServices.some(s => s.serviceId === o.value))}
                    onChange={sel => {
                      const objs = serviceOptions.filter(s => sel.some(x => x.value === s.serviceId))
                      setSelectedServices(objs)
                      fetchSubServices(objs.map(s => s.serviceId))
                      if (objs.length) clearFieldError('serviceId')
                    }}
                    placeholder="Select Services"
                  />
                </Field>
              </div>
            </div>
            <div className="ad-row">
              <div className="ad-col-full">
                <Field label="Procedure Name" required error={formErrors.subServiceName}>
                  <Select
                    isMulti
                    {...selectPortalProps}
                    options={(subServiceOptions || []).map(s => ({ label: s.subServiceName, value: s.subServiceId }))}
                    value={(subServiceOptions || []).filter(s => selectedSubService.includes(s.subServiceId)).map(s => ({ label: s.subServiceName, value: s.subServiceId }))}
                    onChange={sel => {
                      const ids = sel.map(o => o.value)
                      setSelectedSubService(ids)
                      if (ids.length) clearFieldError('subServiceName')
                      checkSubServiceDetails(ids)
                    }}
                    placeholder="Select Procedures"
                  />
                  {!isSubServiceComplete && (
                    <div style={{ fontSize: 12, color: '#e24b4a', marginTop: 6 }}>
                      Some procedures are missing price details.{' '}
                      <span style={{ color: '#185fa5', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => { closeForm?.(); navigate(`/clinic-management/${clinicId}?tab=3`) }}>
                        Add procedure details
                      </span>
                    </div>
                  )}
                </Field>
              </div>
            </div>
          </FormSection>

          {/* ── Doctor Details ── */}
          <FormSection icon={User} title="Doctor Details">
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="Doctor Name" required error={formErrors.doctorName}>
                  <input className="ad-input" value={form.doctorName}
                    onChange={e => {
                      let v = e.target.value.replace(/[0-9]/g, '')
                      const w = v.startsWith('Dr.') ? v : `Dr. ${v}`
                      setForm(p => ({ ...p, doctorName: w }))
                      if (w.length > 3) clearFieldError('doctorName')
                    }} />
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="License Number" required error={formErrors.doctorLicence}>
                  <input className="ad-input" value={form.doctorLicence}
                    onChange={e => { setForm(p => ({ ...p, doctorLicence: e.target.value })); if (e.target.value.trim()) clearFieldError('doctorLicence') }} />
                </Field>
              </div>
            </div>
            <div className="ad-row">
              <div className="ad-col-third">
                <Field label="Gender" required error={formErrors.gender}>
                  <select className="ad-input" value={form.gender}
                    onChange={e => { setForm(p => ({ ...p, gender: e.target.value })); if (e.target.value) clearFieldError('gender') }}>
                    <option value="">Select Gender</option>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </Field>
              </div>
              <div className="ad-col-third">
                <Field label="Experience (years)" required error={formErrors.experience}>
                  <input className="ad-input" type="number" value={form.experience}
                    onChange={e => { setForm(p => ({ ...p, experience: e.target.value })); if (!isNaN(e.target.value) && Number(e.target.value) >= 0) clearFieldError('experience') }} />
                </Field>
              </div>
              <div className="ad-col-third">
                <Field label="Qualification" required error={formErrors.qualification}>
                  <input className="ad-input" value={form.qualification}
                    onChange={e => { const v = e.target.value.replace(/[0-9]/g, ''); setForm(p => ({ ...p, qualification: v })); setFormErrors(p => ({ ...p, qualification: v.trim() ? '' : 'Required' })) }} />
                </Field>
              </div>
            </div>
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="Specialization" required error={formErrors.specialization}>
                  <input className="ad-input" value={form.specialization}
                    onChange={e => { const v = e.target.value.replace(/[0-9]/g, ''); setForm(p => ({ ...p, specialization: v })); setFormErrors(p => ({ ...p, specialization: v.trim() ? '' : 'Required' })) }} />
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="Profile Description" required error={formErrors.profileDescription}>
                  <textarea className="ad-input ad-textarea" rows={3} value={form.profileDescription}
                    onChange={e => { const v = e.target.value.replace(/[0-9]/g, ''); setForm(p => ({ ...p, profileDescription: v })); setFormErrors(p => ({ ...p, profileDescription: v.trim() ? '' : 'Required' })) }} />
                </Field>
              </div>
            </div>
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="Profile Picture" required error={formErrors.doctorPicture}>
                  <input className="ad-input" type="file" accept="image/jpeg,image/png"
                    onChange={e => {
                      const f = e.target.files[0]; if (!f) return
                      if (!['image/jpeg','image/png'].includes(f.type)) { setFormErrors(p => ({ ...p, doctorPicture: 'Only JPG/PNG allowed' })); return }
                      if (f.size > 250*1024) { setFormErrors(p => ({ ...p, doctorPicture: 'Max 250KB' })); return }
                      const r = new FileReader(); r.onloadend = () => { setForm(p => ({ ...p, doctorPicture: r.result })); clearFieldError('doctorPicture') }; r.readAsDataURL(f)
                    }} />
                  {form.doctorPicture && <img src={form.doctorPicture} alt="Preview" className="ad-img-preview" />}
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="Doctor Signature (for E-Prescription)" required error={formErrors.doctorSignature}>
                  <input className="ad-input" type="file" accept="image/jpeg,image/png"
                    onChange={e => {
                      const f = e.target.files[0]; if (!f) return
                      if (!['image/jpeg','image/png'].includes(f.type)) { setFormErrors(p => ({ ...p, doctorSignature: 'Only JPG/PNG allowed' })); return }
                      const r = new FileReader(); r.onloadend = () => { setForm(p => ({ ...p, doctorSignature: r.result })); clearFieldError('doctorSignature') }; r.readAsDataURL(f)
                    }} />
                  {form.doctorSignature && <img src={form.doctorSignature} alt="Signature" className="ad-img-preview" />}
                </Field>
              </div>
            </div>
          </FormSection>

          {/* ── Schedule ── */}
          <FormSection icon={Clock} title="Working Schedule">
            <div className="ad-row">
              <div className="ad-col-quarter">
                <Field label="Start Day" required error={formErrors.availableDays}>
                  <select className="ad-input" value={startDay}
                    onChange={e => { setStartDay(e.target.value); availableDays(e.target.value, 'start'); clearFieldError('availableDays') }}>
                    <option value="">Select</option>
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
              <div className="ad-col-quarter">
                <Field label="End Day" required>
                  <select className="ad-input" value={endDay}
                    onChange={e => { setEndDay(e.target.value); availableDays(e.target.value, 'end'); clearFieldError('availableDays') }}>
                    <option value="">Select</option>
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
              <div className="ad-col-quarter">
                <Field label="Start Time" required error={formErrors.availableTimes}>
                  <select className="ad-input" value={startTime}
                    onChange={e => { setStartTime(e.target.value); handleTimeChange(e.target.value, 'start'); clearFieldError('availableTimes') }}>
                    <option value="">Select</option>
                    {times.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <div className="ad-col-quarter">
                <Field label="End Time" required>
                  <select className="ad-input" value={endTime}
                    onChange={e => { setEndTime(e.target.value); handleTimeChange(e.target.value, 'end'); clearFieldError('availableTimes') }}>
                    <option value="">Select</option>
                    {times.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </FormSection>

          {/* ── Consultations & Fees ── */}
          <FormSection icon={CreditCard} title="Consultations & Fees">
            <div className="ad-row" style={{ marginBottom: 12 }}>
              <div className="ad-col-full">
                <label className="ad-label">Consultation Type</label>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 6 }}>
                  {[['serviceTreatment','Services & Treatments'],['inClinic','In-Clinic'],['online','Online']].map(([key, lbl]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                      <input type="checkbox" checked={enabledTypes[key]} onChange={() => toggleType(key)}
                        style={{ accentColor: '#185fa5', width: 14, height: 14 }} />
                      {lbl}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="In-Clinic Consultation Fee" required error={formErrors.inClinicFee}>
                  <input className="ad-input" type="number" placeholder="Enter fee"
                    disabled={!enabledTypes.inClinic}
                    value={form.doctorFees.inClinicFee}
                    onChange={e => { const v = e.target.value; setForm(p => ({ ...p, doctorFees: { ...p.doctorFees, inClinicFee: v } })); if (v && Number(v)>0) clearFieldError('inClinicFee') }}
                    style={{ opacity: enabledTypes.inClinic ? 1 : 0.5 }} />
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="Online Consultation Fee" required error={formErrors.vedioConsultationFee}>
                  <input className="ad-input" type="number" placeholder="Enter fee"
                    disabled={!enabledTypes.online}
                    value={form.doctorFees.vedioConsultationFee}
                    onChange={e => { const v = e.target.value; setForm(p => ({ ...p, doctorFees: { ...p.doctorFees, vedioConsultationFee: v } })); if (v && Number(v)>0) clearFieldError('vedioConsultationFee') }}
                    style={{ opacity: enabledTypes.online ? 1 : 0.5 }} />
                </Field>
              </div>
            </div>
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="Contact Number" required error={formErrors.doctorMobileNumber}>
                  <input className="ad-input" type="tel" maxLength={10} value={form.doctorMobileNumber}
                    placeholder="10-digit number"
                    onChange={e => { if (/^\d{0,10}$/.test(e.target.value)) { setForm(p => ({ ...p, doctorMobileNumber: e.target.value })); if (/^\d{10}$/.test(e.target.value)) clearFieldError('doctorMobileNumber') } }} />
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="Email Address" required error={formErrors.doctorEmail}>
                  <input className="ad-input" type="email" value={form.doctorEmail}
                    placeholder="doctor@email.com"
                    onChange={e => { setForm(p => ({ ...p, doctorEmail: e.target.value })); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) clearFieldError('doctorEmail') }} />
                </Field>
              </div>
            </div>
          </FormSection>

          {/* ── Additional ── */}
          <FormSection icon={FileText} title="Additional Details">
            <div className="ad-row">
              <div className="ad-col-half">
                <Field label="Association / Membership">
                  <input className="ad-input" value={form.associationsOrMemberships}
                    onChange={e => setForm(p => ({ ...p, associationsOrMemberships: e.target.value.replace(/[0-9]/g,'') })) } />
                </Field>
              </div>
              <div className="ad-col-half">
                <Field label="Branch">
                  <Select
                    isMulti
                    {...selectPortalProps}
                    options={branchOptions}
                    value={branchOptions.filter(o => Array.isArray(form.branch) && form.branch.some(b => b.branchId === o.value))}
                    onChange={sel => setForm(p => ({ ...p, branch: sel.map(o => ({ branchId: o.value, branchName: o.label })) }))}
                    placeholder="Select branches…"
                  />
                </Field>
              </div>
            </div>
            <div className="ad-row">
              <ChipSection label="Area of Expertise" items={form.focusAreas} onAdd={items => setForm(p => ({ ...p, focusAreas: items }))} />
            </div>
            <div className="ad-row">
              <ChipSection
                label={<span>Languages Known <span className="ad-required">*</span></span>}
                items={form.languages}
                onAdd={items => { setForm(p => ({ ...p, languages: items })); if (items.length) clearFieldError('languages') }}
                error={formErrors.languages} />
            </div>
            <div className="ad-row">
              <ChipSection label="Achievements / Awards" items={form.highlights} onAdd={items => setForm(p => ({ ...p, highlights: items }))} />
            </div>
          </FormSection>

        </CModalBody>

        <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: 8 }}>
          <button className="ad-btn-cancel" onClick={() => setModalVisible(false)}><X size={13} /> Cancel</button>
          <button className="ad-btn-save" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <><span className="spinner-border spinner-border-sm me-1" role="status" />Saving…</> : <><Save size={13} /> Submit</>}
          </button>
        </CModalFooter>
      </CModal>

      <style>{`
        /* ── Loading overlay ── */
        .ad-loading-overlay {
          position: absolute; inset: 0;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; border-radius: 0 0 10px 10px;
        }
        .ad-loading-card {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          background: #fff; border: 0.5px solid #d0dce9;
          border-radius: 12px; padding: 28px 36px;
          box-shadow: 0 8px 32px rgba(24, 95, 165, 0.12);
        }
        .ad-spinner {
          width: 36px; height: 36px;
          border: 3px solid #e6f1fb;
          border-top-color: #185fa5;
          border-radius: 50%;
          animation: ad-spin 0.75s linear infinite;
        }
        @keyframes ad-spin { to { transform: rotate(360deg); } }
        .ad-loading-text {
          font-size: 13px; font-weight: 600; color: #185fa5; letter-spacing: 0.01em;
        }

        /* ── Sections ── */
        .ad-section { margin-bottom: 18px; border: 0.5px solid #d0dce9; border-radius: 10px; overflow: hidden; }
        .ad-section-title { display: flex; align-items: center; gap: 8px; background: #185fa5; color: #fff; font-size: 12px; font-weight: 600; padding: 9px 14px; }
        .ad-section-icon  { color: #b5d4f4; }
        .ad-section-body  { padding: 14px; }

        /* ── Layout ── */
        .ad-row         { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 4px; }
        .ad-col-full    { flex: 1 1 100%; }
        .ad-col-half    { flex: 1 1 calc(50% - 12px); min-width: 150px; }
        .ad-col-third   { flex: 1 1 calc(33.333% - 12px); min-width: 130px; }
        .ad-col-quarter { flex: 1 1 calc(25% - 12px); min-width: 110px; }

        /* ── Fields ── */
        .ad-field    { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; flex: 1; }
        .ad-label    { font-size: 11px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 3px; }
        .ad-required { color: #e24b4a; font-size: 11px; }
        .ad-error    { font-size: 11px; color: #e24b4a; }

        /* ── Inputs ── */
        .ad-input {
          width: 100%; padding: 7px 10px; font-size: 12.5px; color: #374151;
          background: #fff; border: 0.5px solid #d0dce9; border-radius: 7px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none; -webkit-appearance: none;
        }
        .ad-input:focus { border-color: #185fa5; box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12); }
        .ad-input:disabled { background: #f0f5fb; color: #9ca3af; cursor: not-allowed; }
        .ad-textarea { resize: vertical; min-height: 72px; }

        /* ── Image preview ── */
        .ad-img-preview { width: 80px; height: 60px; object-fit: contain; border-radius: 6px; border: 0.5px solid #d0dce9; margin-top: 8px; display: block; }

        /* ── Chips ── */
        .ad-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: #e6f1fb; color: #0c447c; border: 0.5px solid #b5d4f4;
          border-radius: 20px; padding: 4px 10px; font-size: 12px; font-weight: 500;
        }
        .ad-chip-remove { background: none; border: none; color: #185fa5; cursor: pointer; display: flex; align-items: center; padding: 0; }
        .ad-chip-remove:hover { color: #a32d2d; }
        .ad-chip-add {
          display: inline-flex; align-items: center; gap: 4px;
          background: #185fa5; color: #fff; border: none; border-radius: 7px;
          padding: 7px 12px; font-size: 12px; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: filter 0.15s;
        }
        .ad-chip-add:hover { filter: brightness(0.9); }

        /* ── Footer buttons ── */
        .ad-btn-cancel {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; color: #374151; border: 0.5px solid #d0dce9;
          border-radius: 8px; padding: 7px 16px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .ad-btn-cancel:hover { background: #f3f4f6; }
        .ad-btn-save {
          display: inline-flex; align-items: center; gap: 5px;
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 7px 18px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: filter 0.15s;
        }
        .ad-btn-save:hover { filter: brightness(0.9); }
        .ad-btn-save:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 600px) {
          .ad-col-half, .ad-col-third, .ad-col-quarter { flex: 1 1 100%; }
        }
      `}</style>
    </div>
  )
}

export default AddDoctors