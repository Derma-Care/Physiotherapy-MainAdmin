import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import {
  CRow, CCol, CSpinner,
  CFormInput, CFormSelect, CFormFeedback,
  CModal, CModalHeader, CModalBody, CModalFooter,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL, UpdateClinic, DeleteClinic, DoctorAllData, CLINIC_ADMIN_URL } from '../../baseUrl'
import { getClinicTimings } from './AddClinicAPI'
import AddBranchForm from './AddBranchForm'
import ProcedureManagementDoctor from './ProcedureManagementDoctor'
import DocumentField from './DocumentField'
import {
  ArrowLeft, Building2, Phone, MapPin, Mail, Globe,
  Clock, Star, Stethoscope, BadgeDollarSign, FileText,
  Edit2, Trash2, Save, X, User, Briefcase,
} from 'lucide-react'

const TABS = ['Basic Details', 'Additional Details', 'Branch Details', 'Procedures']

/* ── shared input style ── */
const inp = (hasErr, disabled) => ({
  width: '100%',
  padding: '8px 12px',
  border: `1.5px solid ${hasErr ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: '8px',
  fontSize: '13px',
  color: '#374151',
  background: disabled ? '#f9fafb' : '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
})

const lbl = {
  fontSize: '12px', fontWeight: '600',
  color: '#374151', marginBottom: '5px', display: 'block',
}

const errTxt = { color: '#ef4444', fontSize: '11px', marginTop: '4px' }

const SectionBar = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop: '6px' }}>
    <span style={{ width: '3px', height: '18px', background: '#185fa5', borderRadius: '2px', flexShrink: 0 }} />
    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>{text}</span>
  </div>
)

const Divider = () => (
  <div style={{ borderTop: '0.5px solid #e5e7eb', margin: '18px 0' }} />
)

const ClinicDetails = () => {
  const { hospitalId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [formErrors, setFormErrors]           = useState({})
  const [clinicData, setClinicData]           = useState(null)
  const [editableClinicData, setEditableClinicData] = useState({ consultationExpiration: '' })
  const [timings, setTimings]                 = useState([])
  const [isEditing, setIsEditing]             = useState(false)
  const [isEditingAdditional, setIsEditingAdditional] = useState(false)
  const [activeTab, setActiveTab]             = useState(0)
  const [loading, setLoading]                 = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor]   = useState(null)
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [allDoctors, setAllDoctors]           = useState([])
  const [modalVisible, setModalVisible]       = useState(false)

  /* ── sync tab from URL ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setActiveTab(params.get('tab') ? Number(params.get('tab')) : 0)
  }, [location.search])

  const handleTabChange = (idx) => {
    setActiveTab(idx)
    navigate(`/clinic-management/${hospitalId}?tab=${idx}`)
  }

  /* ── fetch clinic ── */
  const fetchClinicDetails = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/admin/getClinicById/${hospitalId}`)
      const data = res.data.data
      const local = localStorage.getItem(`clinic-${hospitalId}-consultation-expiration`)
      if (local) data.consultationExpiration = local
      setClinicData(data)
      setEditableClinicData(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get(`${CLINIC_ADMIN_URL}${DoctorAllData}/${hospitalId}`)
      setAllDoctors(res.data.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (hospitalId) { fetchClinicDetails(); fetchAllDoctors() }
  }, [hospitalId])

  useEffect(() => {
    const fetchTimings = async () => {
      const result = await getClinicTimings()
      if (result.success) setTimings(result.data)
    }
    fetchTimings()
  }, [])

  /* ── helpers ── */
  const set = (key, val) => setEditableClinicData((p) => ({ ...p, [key]: val }))
  const clearErr = (key) => setFormErrors((p) => { const u = { ...p }; delete u[key]; return u })
  const setErr = (key, msg) => setFormErrors((p) => ({ ...p, [key]: msg }))

  const openPdfPreview = (base64) => {
    const bytes = atob(base64)
    const arr = new Uint8Array(bytes.length).map((_, i) => bytes.charCodeAt(i))
    const url = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }))
    window.open(url)
  }

  /* ── validation ── */
  const validateForm = () => {
    const errs = {}
    if (activeTab === 0) {
      const name = editableClinicData.name?.trim() || ''
      if (!name) errs.name = 'Clinic Name is required'
      else if (name.length < 3) errs.name = 'At least 3 characters'
      const num = editableClinicData.contactNumber?.trim() || ''
      if (!num) errs.contactNumber = 'Contact Number is required'
      else if (!/^[6-9]\d{9}$/.test(num)) errs.contactNumber = 'Must start with 6-9 and be 10 digits'
      if (!editableClinicData.city?.trim()) errs.city = 'City is required'
    }
    if (activeTab === 1) {
      if (!editableClinicData.emailAddress?.includes('@')) errs.emailAddress = 'Email must contain "@"'
      if (!editableClinicData.website?.trim()) errs.website = 'Website is required'
      if (!editableClinicData.issuingAuthority?.trim()) errs.issuingAuthority = 'Issuing Authority is required'
      if (!editableClinicData.openingTime) errs.openingTime = 'Opening time required'
      if (!editableClinicData.closingTime) errs.closingTime = 'Closing time required'
      if (!editableClinicData.subscription) errs.subscription = 'Subscription required'
      if (!editableClinicData.consultationExpiration) errs.consultationExpiration = 'Required'
      if (!editableClinicData.latitude) errs.latitude = 'Latitude required'
      if (!editableClinicData.longitude) errs.longitude = 'Longitude required'
      if (!editableClinicData.walkthrough?.trim()) errs.walkthrough = 'Walkthrough URL required'
      if (!editableClinicData.branch?.trim()) errs.branch = 'Branch name required'
      if (!editableClinicData.address?.trim()) errs.address = 'Address required'
      if (!editableClinicData.freeFollowUps || isNaN(editableClinicData.freeFollowUps) || editableClinicData.freeFollowUps < 1)
        errs.freeFollowUps = 'Must be a positive number'
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  /* ── save basic ── */
  const handleSaveBasic = async () => {
    if (!validateForm()) return
    try {
      await axios.put(`${BASE_URL}/${UpdateClinic}/${hospitalId}`, editableClinicData)
      await fetchClinicDetails()
      setIsEditing(false)
    } catch (err) { console.error(err) }
  }

  /* ── save additional ── */
  const handleSaveAdditional = async () => {
    if (!validateForm()) { toast.error('Please fix the errors before saving!'); return }
    try {
      localStorage.setItem(`clinic-${hospitalId}-consultation-expiration`, editableClinicData.consultationExpiration)
      await axios.put(`${BASE_URL}/${UpdateClinic}/${hospitalId}`, editableClinicData)
      await fetchClinicDetails()
      setIsEditingAdditional(false)
    } catch (err) { console.error(err) }
  }

  /* ── delete clinic ── */
  const handleDeleteClinic = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/${DeleteClinic}/${hospitalId}`)
      toast.success(res.data.message)
      setShowDeleteModal(false)
      navigate('/clinic-Management')
    } catch (err) {
      toast.error(err.message)
    }
  }

  /* ── form field helper ── */
  const Field = ({ label, required, error, children }) => (
    <div>
      <label style={lbl}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {error && <div style={errTxt}>{error}</div>}
    </div>
  )

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <ToastContainer />

      <style>{`
        .cd-tab {
          padding: 9px 18px; border: none; background: transparent;
          font-size: 13px; font-weight: 500; color: #6b7280;
          cursor: pointer; border-bottom: 2px solid transparent;
          transition: all 0.18s; white-space: nowrap;
        }
        .cd-tab:hover { color: #185fa5; }
        .cd-tab.active { color: #185fa5; font-weight: 700; border-bottom: 2px solid #185fa5; }
        .cd-input:focus { border-color: #185fa5 !important; box-shadow: 0 0 0 3px rgba(24,95,165,0.10); }
        .cd-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 8px;
          background: #185fa5; color: #fff; border: none;
          font-weight: 600; font-size: 13px; cursor: pointer;
          transition: background 0.15s;
        }
        .cd-btn-primary:hover { background: #0c447c; }
        .cd-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 8px;
          background: #fff; color: #374151;
          border: 1.5px solid #e5e7eb;
          font-weight: 600; font-size: 13px; cursor: pointer;
          transition: background 0.15s;
        }
        .cd-btn-secondary:hover { background: #f0f5fb; }
        .cd-btn-danger {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 8px;
          background: #fff; color: #dc2626;
          border: 1.5px solid #fca5a5;
          font-weight: 600; font-size: 13px; cursor: pointer;
          transition: all 0.15s;
        }
        .cd-btn-danger:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: '#185fa5', borderRadius: '10px 10px 0 0',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '9px',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color="#fff" />
          </div>
          <div>
            <h5 style={{ margin: 0, color: '#fff', fontWeight: '700', fontSize: '16px' }}>Clinic Details</h5>
            {clinicData?.name && (
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>{clinicData.name}</span>
            )}
          </div>
        </div>
        <button
         onClick={() => navigate(-1)}
           style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px', borderRadius: '10px',
              background: '#fff', color: '#1B4F8A',
              border: '1.5px solid #1B4F8A',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        background: '#fff',
        borderLeft: '0.5px solid #d0dce9', borderRight: '0.5px solid #d0dce9',
        display: 'flex', gap: '4px', overflowX: 'auto',
        borderBottom: '1px solid #e5e7eb', padding: '0 16px',
      }}>
        {TABS.map((label, idx) => (
          <button key={idx} className={`cd-tab ${activeTab === idx ? 'active' : ''}`}
            onClick={() => handleTabChange(idx)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        background: '#fff', border: '0.5px solid #d0dce9',
        borderTop: 'none', borderRadius: '0 0 10px 10px',
        padding: '20px 24px 28px',
      }}>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            {/* ══ TAB 0: Basic Details ══ */}
            {activeTab === 0 && (
              <div>
                <SectionBar text="Basic Information" />
                <CRow className="g-3 mb-3">
                  <CCol md={6}>
                    <Field label="Clinic Name" required error={formErrors.name}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.name, !isEditing)}
                        value={editableClinicData.name || ''}
                        disabled={!isEditing}
                        placeholder="Clinic name"
                        onChange={(e) => {
                          const v = e.target.value
                          set('name', v)
                          if (!v.trim()) setErr('name', 'Required')
                          else if (v.trim().length < 3) setErr('name', 'At least 3 characters')
                          else clearErr('name')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Contact Number" required error={formErrors.contactNumber}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.contactNumber, !isEditing)}
                        value={editableClinicData.contactNumber || ''}
                        disabled={!isEditing}
                        maxLength={10}
                        placeholder="10-digit number"
                        onChange={(e) => {
                          const v = e.target.value
                          set('contactNumber', v)
                          if (!v.trim()) setErr('contactNumber', 'Required')
                          else if (!/^\d*$/.test(v)) setErr('contactNumber', 'Only digits allowed')
                          else if (v.length === 10 && !/^[6-9]\d{9}$/.test(v)) setErr('contactNumber', 'Must start with 6-9')
                          else if (v.length < 10) setErr('contactNumber', 'Must be 10 digits')
                          else clearErr('contactNumber')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="City / Location" required error={formErrors.city}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.city, !isEditing)}
                        value={editableClinicData.city || ''}
                        disabled={!isEditing}
                        placeholder="City"
                        onChange={(e) => {
                          const v = e.target.value
                          set('city', v)
                          if (!v.trim()) setErr('city', 'Required')
                          else clearErr('city')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <label style={lbl}>Hospital Logo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {editableClinicData.hospitalLogo && (
                        <img
                          src={editableClinicData.hospitalLogo.startsWith('data:')
                            ? editableClinicData.hospitalLogo
                            : `data:image/jpeg;base64,${editableClinicData.hospitalLogo}`}
                          alt="Logo"
                          style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid #e5e7eb' }}
                        />
                      )}
                      {isEditing && (
                        <input
                          type="file"
                          accept="image/*"
                          style={inp(false, false)}
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (!file) return
                            const r = new FileReader()
                            r.onloadend = () => set('hospitalLogo', r.result.split(',')[1])
                            r.readAsDataURL(file)
                          }}
                        />
                      )}
                    </div>
                  </CCol>
                </CRow>

                <Divider />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {isEditing ? (
                    <>
                      <button className="cd-btn-primary" onClick={handleSaveBasic}>
                        <Save size={14} /> Save
                      </button>
                      <button className="cd-btn-secondary" onClick={() => { setIsEditing(false); setEditableClinicData(clinicData) }}>
                        <X size={14} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="cd-btn-primary" onClick={() => setIsEditing(true)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="cd-btn-danger" onClick={() => setShowDeleteModal(true)}>
                        <Trash2 size={14} /> Delete Clinic
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ══ TAB 1: Additional Details ══ */}
            {activeTab === 1 && (
              <div>
                <SectionBar text="Clinic Settings" />
                <CRow className="g-3 mb-2">
                  <CCol md={6}>
                    <Field label="Email" required error={formErrors.emailAddress}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.emailAddress, !isEditingAdditional)}
                        type="email"
                        value={editableClinicData.emailAddress || ''}
                        disabled={!isEditingAdditional}
                        placeholder="clinic@email.com"
                        onChange={(e) => {
                          const v = e.target.value
                          set('emailAddress', v)
                          if (!v.includes('@')) setErr('emailAddress', 'Must contain "@"')
                          else clearErr('emailAddress')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="City" error={formErrors.city}>
                      <input
                        className="cd-input"
                        style={inp(false, !isEditingAdditional)}
                        value={editableClinicData.city || ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => { set('city', e.target.value); clearErr('city') }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Website" required error={formErrors.website}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.website, !isEditingAdditional)}
                        value={editableClinicData.website || ''}
                        disabled={!isEditingAdditional}
                        placeholder="https://..."
                        onChange={(e) => { set('website', e.target.value); clearErr('website') }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Issuing Authority" required error={formErrors.issuingAuthority}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.issuingAuthority, !isEditingAdditional)}
                        value={editableClinicData.issuingAuthority || ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => {
                          const v = e.target.value
                          set('issuingAuthority', v)
                          if (!/^[A-Za-z\s]*$/.test(v)) setErr('issuingAuthority', 'Only alphabets and spaces')
                          else clearErr('issuingAuthority')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Opening Time" required error={formErrors.openingTime}>
                      <select
                        className="cd-input"
                        style={inp(!!formErrors.openingTime, !isEditingAdditional)}
                        value={editableClinicData.openingTime || ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => { set('openingTime', e.target.value); clearErr('openingTime') }}
                      >
                        <option value="">Select opening time</option>
                        {timings.map((s, i) => <option key={i} value={s.openingTime}>{s.openingTime}</option>)}
                      </select>
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Closing Time" required error={formErrors.closingTime}>
                      <select
                        className="cd-input"
                        style={inp(!!formErrors.closingTime, !isEditingAdditional)}
                        value={editableClinicData.closingTime || ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => { set('closingTime', e.target.value); clearErr('closingTime') }}
                      >
                        <option value="">Select closing time</option>
                        {timings.map((s, i) => <option key={i} value={s.closingTime}>{s.closingTime}</option>)}
                      </select>
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Consultation Expiration (days)" required error={formErrors.consultationExpiration}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.consultationExpiration, !isEditingAdditional)}
                        value={editableClinicData.consultationExpiration || ''}
                        disabled={!isEditingAdditional}
                        placeholder="Number of days"
                        onChange={(e) => { set('consultationExpiration', e.target.value); clearErr('consultationExpiration') }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Free Follow-Ups (count)" required error={formErrors.freeFollowUps}>
                      <input
                        className="cd-input"
                        type="number"
                        min={0}
                        style={inp(!!formErrors.freeFollowUps, !isEditingAdditional)}
                        value={editableClinicData.freeFollowUps || ''}
                        disabled={!isEditingAdditional}
                        placeholder="e.g. 2"
                        onChange={(e) => {
                          const v = e.target.value
                          set('freeFollowUps', v)
                          if (!/^\d+$/.test(v)) setErr('freeFollowUps', 'Only positive numbers')
                          else clearErr('freeFollowUps')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Subscription" required error={formErrors.subscription}>
                      <select
                        className="cd-input"
                        style={inp(!!formErrors.subscription, !isEditingAdditional)}
                        value={editableClinicData.subscription || ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => { set('subscription', e.target.value); clearErr('subscription') }}
                      >
                        <option value="">Select subscription</option>
                        {['Free', 'Basic', 'Standard', 'Premium'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="License Number">
                      <input
                        className="cd-input"
                        style={inp(false, !isEditingAdditional)}
                        value={editableClinicData.licenseNumber || ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => set('licenseNumber', e.target.value)}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Latitude" required error={formErrors.latitude}>
                      <input
                        className="cd-input"
                        type="number" step="any"
                        style={inp(!!formErrors.latitude, !isEditingAdditional)}
                        value={editableClinicData.latitude ?? ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => {
                          const v = e.target.value; const n = parseFloat(v)
                          set('latitude', v === '' ? null : n)
                          if (!v) setErr('latitude', 'Required')
                          else if (n < -90 || n > 90) setErr('latitude', 'Must be -90 to 90')
                          else clearErr('latitude')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Longitude" required error={formErrors.longitude}>
                      <input
                        className="cd-input"
                        type="number" step="any"
                        style={inp(!!formErrors.longitude, !isEditingAdditional)}
                        value={editableClinicData.longitude ?? ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => {
                          const v = e.target.value; const n = parseFloat(v)
                          set('longitude', v === '' ? null : n)
                          if (!v) setErr('longitude', 'Required')
                          else if (n < -180 || n > 180) setErr('longitude', 'Must be -180 to 180')
                          else clearErr('longitude')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Walkthrough URL" error={formErrors.walkthrough}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.walkthrough, !isEditingAdditional)}
                        value={editableClinicData.walkthrough ?? ''}
                        disabled={!isEditingAdditional}
                        placeholder="https://..."
                        onChange={(e) => {
                          const v = e.target.value; set('walkthrough', v)
                          if (!v.trim()) setErr('walkthrough', 'Required')
                          else if (!/^https?:\/\/[^\s]+$/.test(v)) setErr('walkthrough', 'Must start with http(s)://')
                          else clearErr('walkthrough')
                        }}
                      />
                      {!isEditingAdditional && editableClinicData.walkthrough && !formErrors.walkthrough && (
                        <a href={editableClinicData.walkthrough} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#185fa5', marginTop: '4px', display: 'block' }}>
                          Open Walkthrough ↗
                        </a>
                      )}
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="NABH Score">
                      <input
                        className="cd-input"
                        type="number"
                        style={inp(false, true)}
                        value={editableClinicData.nabhScore ?? ''}
                        disabled
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Branch" required error={formErrors.branch}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.branch, !isEditingAdditional)}
                        value={editableClinicData.branch ?? ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => {
                          const v = e.target.value; set('branch', v)
                          if (!v.trim()) setErr('branch', 'Required')
                          else clearErr('branch')
                        }}
                      />
                    </Field>
                  </CCol>
                  <CCol md={6}>
                    <Field label="Address" required error={formErrors.address}>
                      <input
                        className="cd-input"
                        style={inp(!!formErrors.address, !isEditingAdditional)}
                        value={editableClinicData.address ?? ''}
                        disabled={!isEditingAdditional}
                        onChange={(e) => {
                          const v = e.target.value; set('address', v)
                          if (!v.trim()) setErr('address', 'Required')
                          else clearErr('address')
                        }}
                      />
                    </Field>
                  </CCol>
                </CRow>

                <Divider />
                <SectionBar text="Documents" />
                <CRow className="g-3 mb-3">
                  {[
                    ['Hospital Documents', 'hospitalDocuments'],
                    ['Hospital Contract Documents', 'contractorDocuments'],
                    ['Business Registration Certificate', 'businessRegistrationCertificate'],
                    ['Biomedical Waste Management Auth', 'biomedicalWasteManagementAuth'],
                    ['Trade License', 'tradeLicense'],
                    ['Fire Safety Certificate', 'fireSafetyCertificate'],
                    ['Professional Indemnity Insurance', 'professionalIndemnityInsurance'],
                    ['Drug License Certificate', 'drugLicenseCertificate'],
                    ['Drug License Form Type', 'drugLicenseFormType'],
                    ['Pharmacist Certificate', 'pharmacistCertificate'],
                    ['Clinical Establishment Certificate', 'clinicalEstablishmentCertificate'],
                  ].map(([label, key]) => (
                    <CCol md={6} key={key}>
                      <label style={lbl}>{label} <span style={{ color: '#ef4444' }}>*</span></label>
                      <DocumentField
                        label={label}
                        base64Data={editableClinicData[key]}
                        clinicName={editableClinicData.name || 'Clinic'}
                        isEditing={isEditingAdditional}
                        openPdfPreview={openPdfPreview}
                        onFileChange={(val) => set(key, val)}
                      />
                    </CCol>
                  ))}
                  <CCol md={6}>
                    <label style={lbl}>Other Documents <span style={{ color: '#ef4444' }}>*</span></label>
                    <DocumentField
                      label="OtherDocuments"
                      base64Data={editableClinicData.others}
                      clinicName={editableClinicData.name || 'Clinic'}
                      isEditing={isEditingAdditional}
                      uploadType="multiple"
                      openPdfPreview={openPdfPreview}
                      onFileChange={(files) => set('others', files)}
                    />
                  </CCol>
                </CRow>

                <Divider />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {isEditingAdditional ? (
                    <>
                      <button className="cd-btn-primary" onClick={handleSaveAdditional}>
                        <Save size={14} /> Save
                      </button>
                      <button className="cd-btn-secondary" onClick={() => { setIsEditingAdditional(false); setEditableClinicData(clinicData) }}>
                        <X size={14} /> Cancel
                      </button>
                    </>
                  ) : (
                    <button className="cd-btn-primary" onClick={() => setIsEditingAdditional(true)}>
                      <Edit2 size={14} /> Edit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ══ TAB 2: Branch Details ══ */}
            {activeTab === 2 && <AddBranchForm clinicId={hospitalId} />}

            {/* ══ TAB 3: Procedures ══ */}
            {activeTab === 3 && <ProcedureManagementDoctor clinicId={hospitalId} />}
          </>
        )}
      </div>

      {/* ══ Delete Clinic Modal ══ */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} backdrop="static">
        <CModalHeader style={{ background: '#185fa5', borderBottom: 'none', padding: '14px 20px' }}>
          <strong style={{ color: '#fff', fontSize: '15px' }}>Delete Clinic</strong>
        </CModalHeader>
        <CModalBody style={{ padding: '20px 24px', fontSize: '14px', color: '#374151' }}>
          Are you sure you want to delete <strong style={{ color: '#0c447c' }}>{clinicData?.name}</strong>?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter style={{ background: '#fff', borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: '8px' }}>
          <button className="cd-btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
            onClick={handleDeleteClinic}
          >
            Delete
          </button>
        </CModalFooter>
      </CModal>

      {/* ══ Doctor Profile Modal ══ */}
      <CModal visible={showDoctorModal} onClose={() => setShowDoctorModal(false)} size="lg" backdrop="static">
        <CModalHeader style={{ background: '#185fa5', borderBottom: 'none', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={16} color="#fff" />
            </div>
            <strong style={{ color: '#fff', fontSize: '15px' }}>Doctor Profile</strong>
          </div>
        </CModalHeader>
        <CModalBody style={{ padding: '20px 24px', background: '#f7fafd' }}>
          {selectedDoctor && (
            <div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap' }}>
                <img src={selectedDoctor.doctorPicture} alt="Doctor"
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e6f1fb', flexShrink: 0 }} />
                <div>
                  <h5 style={{ margin: '0 0 4px', color: '#0c447c', fontWeight: '700' }}>{selectedDoctor.doctorName}</h5>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#6b7280' }}>{selectedDoctor.specialization}</p>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', background: '#e6f1fb', color: '#0c447c', fontSize: '12px', fontWeight: '600' }}>
                    {selectedDoctor.experience} yrs experience
                  </span>
                </div>
              </div>

              {[
                { title: 'Personal Information', fields: [
                  { label: 'Contact', value: selectedDoctor.doctorMobileNumber },
                  { label: 'Qualification', value: selectedDoctor.qualification },
                ]},
                { title: 'Availability', fields: [
                  { label: 'Available Days', value: selectedDoctor.availableDays },
                  { label: 'Available Times', value: selectedDoctor.availableTimes },
                ]},
                { title: 'Expertise', fields: [
                  { label: 'Languages', value: selectedDoctor.languages?.join(', ') || '—' },
                  { label: 'Focus Areas', value: selectedDoctor.focusAreas?.join(', ') || '—' },
                  { label: 'Highlights', value: selectedDoctor.highlights?.join(', ') || '—' },
                ]},
                { title: 'Consultation Fees', fields: [
                  { label: 'In-Clinic Fee', value: `₹${selectedDoctor.doctorFees?.inClinicFee || 0}` },
                  { label: 'Video Fee', value: `₹${selectedDoctor.doctorFees?.vedioConsultationFee || 0}` },
                ]},
              ].map(({ title, fields }) => (
                <div key={title} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ width: '3px', height: '16px', background: '#185fa5', borderRadius: '2px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>{title}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {fields.map(({ label, value }) => (
                      <div key={label} style={{ background: '#fff', border: '0.5px solid #e2ecf7', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#7a90a8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>{value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Services */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ width: '3px', height: '16px', background: '#185fa5', borderRadius: '2px' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>Services Offered</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedDoctor.service?.length > 0
                    ? selectedDoctor.service.map((s) => (
                        <span key={s.serviceId} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: '#e6f1fb', color: '#0c447c', border: '0.5px solid #b5d4f4' }}>
                          {s.serviceName}
                        </span>
                      ))
                    : <span style={{ color: '#9ca3af', fontSize: '13px' }}>No services listed</span>
                  }
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ width: '3px', height: '16px', background: '#185fa5', borderRadius: '2px' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>Profile Summary</span>
                </div>
                <div style={{ background: '#fff', border: '0.5px solid #e2ecf7', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                  {selectedDoctor.profileDescription || 'No description available.'}
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter style={{ background: '#fff', borderTop: '0.5px solid #d0dce9', padding: '12px 20px' }}>
          <button className="cd-btn-secondary" onClick={() => setShowDoctorModal(false)}>Close</button>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ClinicDetails