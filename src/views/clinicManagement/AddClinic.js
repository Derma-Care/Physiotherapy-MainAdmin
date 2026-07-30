import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  CForm,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTooltip,
} from '@coreui/react'
import {
  BASE_URL,
  ClinicAllData,
  getAllQuestions,
  postAllQuestionsAndAnswers,
} from '../../baseUrl'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import sendDermaCareOnboardingEmail from '../../Utils/Emailjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getClinicTimings } from './AddClinicAPI'

/* ─── Design tokens ─── */
const t = {
  primary: '#1a3a6b',
  text: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  surface: '#f8fafc',
  border: '#e2e8f0',
  danger: '#dc2626',
  success: '#16a34a',
  radius: '10px',
  radiusSm: '6px',
  shadow: '0 1px 3px rgba(0,0,0,0.07)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
}

/* ─── Shared UI primitives ─── */
const SectionHeading = ({ title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '20px 0 14px' }}>
    <span style={{ width: '4px', minHeight: '36px', borderRadius: '2px', backgroundColor: t.primary, flexShrink: 0, marginTop: '2px' }} />
    <div>
      <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, letterSpacing: '0.02em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px' }}>{subtitle}</div>}
    </div>
  </div>
)

const FieldLabel = ({ children, required }) => (
  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>
    {children}{required && <span style={{ color: t.danger, marginLeft: '3px' }}>*</span>}
  </label>
)

const FieldError = ({ message }) =>
  message ? <div style={{ fontSize: '11px', color: t.danger, marginTop: '3px' }}>{message}</div> : null

const Btn = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, style = {} }) => {
  const bg = variant === 'secondary' ? '#e2e8f0' : variant === 'danger' ? t.danger : variant === 'success' ? t.success : t.primary
  const color = variant === 'secondary' ? t.text : '#fff'
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 22px', borderRadius: t.radiusSm, fontSize: '13px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer', border: 'none', color, backgroundColor: bg, opacity: disabled ? 0.6 : 1, boxShadow: variant === 'secondary' ? 'none' : t.shadow, transition: 'opacity .15s', ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}>
      {children}
    </button>
  )
}

const FieldGrid = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px 24px', marginBottom: '4px' }}>
    {children}
  </div>
)

const Field = ({ label, required, error, children }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    {children}
    <FieldError message={error} />
  </div>
)

const Input = ({ error, ...props }) => (
  <input {...props}
    style={{ width: '100%', padding: '7px 10px', fontSize: '13px', border: `1px solid ${error ? t.danger : t.border}`, borderRadius: t.radiusSm, outline: 'none', color: t.text, backgroundColor: '#fff', boxSizing: 'border-box', transition: 'border-color .15s' }}
    onFocus={e => { e.target.style.borderColor = t.primary }}
    onBlur={e => { e.target.style.borderColor = error ? t.danger : t.border }} />
)

const StyledSelect = ({ error, children, ...props }) => (
  <select {...props}
    style={{ width: '100%', padding: '7px 10px', fontSize: '13px', border: `1px solid ${error ? t.danger : t.border}`, borderRadius: t.radiusSm, outline: 'none', color: t.text, backgroundColor: '#fff', appearance: 'auto', boxSizing: 'border-box' }}>
    {children}
  </select>
)

/* ─── FileField ───
   Handles three states:
   1. Fresh file picked this session -> shows filename chip (green)
   2. Edit mode: value already exists on record but no fresh filename -> shows "Existing file on record" chip (blue)
   3. No value at all -> "No file chosen"
*/
const FileField = ({ label, name, required = true, accept, error, formData, setFormData, setErrors, inputRef, tooltip }) => {
  const fileName = formData[`${name}FileName`]
  const hasExistingFile = !fileName && !!formData[name]

  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isLogo = name === 'hospitalLogo'
    const maxSize = isLogo ? 1 * 1024 * 1024 : 250 * 1024
    const allowed = isLogo
      ? ['image/jpeg', 'image/jpg', 'image/png']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'application/zip']
    if (!allowed.includes(file.type)) { setErrors(p => ({ ...p, [name]: 'Invalid file type' })); return }
    if (file.size > maxSize) { setErrors(p => ({ ...p, [name]: `File must be ≤ ${isLogo ? '1 MB' : '250 KB'}` })); return }
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
    })
    setFormData(p => ({ ...p, [name]: base64, [`${name}FileName`]: file.name }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleClear = () => {
    if (inputRef?.current) inputRef.current.value = ''
    setFormData(p => ({ ...p, [name]: null, [`${name}FileName`]: null }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const content = (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: t.radiusSm, border: `1px solid ${error ? t.danger : t.border}`, backgroundColor: '#fff', fontSize: '12px', fontWeight: '600', color: t.text, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          📎 {hasExistingFile ? 'Replace File' : 'Choose File'}
          <input ref={inputRef} type="file" name={name} accept={accept} style={{ display: 'none' }} onChange={handleChange} />
        </label>

        {fileName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#dcfce7', border: '1px solid #86efac', fontSize: '11px', fontWeight: '600', color: t.success, maxWidth: '180px' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
            <button onClick={handleClear} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.danger, padding: 0, lineHeight: 1, fontSize: '14px', fontWeight: '700' }}>×</button>
          </div>
        ) : hasExistingFile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', fontSize: '11px', fontWeight: '600', color: '#0369a1' }}>
            <span>✓ Existing file on record</span>
            <button onClick={handleClear} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.danger, padding: 0, lineHeight: 1, fontSize: '14px', fontWeight: '700' }}>×</button>
          </div>
        ) : (
          <span style={{ fontSize: '11px', color: t.textMuted }}>No file chosen</span>
        )}
      </div>
      <FieldError message={error} />
    </div>
  )
  return tooltip ? <CTooltip content={tooltip}>{content}</CTooltip> : content
}

const Divider = () => <hr style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '4px 0 20px' }} />

/* ─── TAB DEFINITIONS ─── */
const TABS = [
  { id: 0, label: 'Basic Info', icon: '🏥' },
  { id: 1, label: 'Hours & Licensing', icon: '🕐' },
  { id: 2, label: 'Configuration', icon: '⚙️' },
  { id: 3, label: 'Location & Social', icon: '📍' },
  { id: 4, label: 'Documents', icon: '📄' },
  { id: 5, label: 'NABH Score', icon: '🏆' },
]

/* ─── Per-tab validation ─── */
const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
const normalizeWebsite = (url) => !/^https?:\/\//i.test(url) ? 'https://' + url : url

const validateTab = (tabId, formData, selectedOption, selectedPharmacistOption, clinicTypeOption) => {
  const errs = {}
  if (tabId === 0) {
    if (!formData.name?.trim()) errs.name = 'Clinic name is required'
    else if (!/^[A-Za-z\s.&-]{2,50}$/.test(formData.name)) errs.name = "Only letters, spaces, '.', '-', and '&' allowed"
    if (!formData.address?.trim()) errs.address = 'Address is required'
    if (!formData.city?.trim()) errs.city = 'City is required'
    else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.city)) errs.city = 'City must contain only letters'
    if (!formData.emailAddress?.trim()) errs.emailAddress = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) errs.emailAddress = 'Enter a valid email'
    if (!formData.contactNumber?.trim()) errs.contactNumber = 'Contact number is required'
    else if (formData.contactNumber.trim().length !== 10 || !/^[5-9]\d{9}$/.test(formData.contactNumber.trim())) errs.contactNumber = 'Must be a 10-digit number starting with 5-9'
    if (formData.website?.trim()) {
      const normalizedWebsite = normalizeWebsite(formData.website.trim())
      if (!websiteRegex.test(normalizedWebsite)) errs.website = 'Enter a valid URL (e.g. https://example.com)'
    }
    if (!formData.branch?.trim()) errs.branch = 'Branch name is required'
  }
  if (tabId === 1) {
    if (!formData.openingTime) errs.openingTime = 'Opening time is required'
    if (!formData.closingTime) errs.closingTime = 'Closing time is required'
  }
  if (tabId === 2) {
    if (!formData.consultationExpiration) errs.consultationExpiration = 'Consultation days are required'
    if (!formData.freeFollowUps && formData.freeFollowUps !== 0) errs.freeFollowUps = 'Free follow ups is required'
  }
  if (tabId === 3) {
    if (!formData.latitude) errs.latitude = 'Latitude is required'
    else { const lat = parseFloat(formData.latitude); if (isNaN(lat) || lat < -90 || lat > 90) errs.latitude = 'Must be between -90 and 90' }
    if (!formData.longitude) errs.longitude = 'Longitude is required'
    else { const lng = parseFloat(formData.longitude); if (isNaN(lng) || lng < -180 || lng > 180) errs.longitude = 'Must be between -180 and 180' }
  }
  if (tabId === 4) {
    if (!formData.hospitalLogo) errs.hospitalLogo = 'Clinic logo is required'
  }
  if (tabId === 5) {
    // NABH score is optional; no validation block required.
  }
  return errs
}

/* ─── Main Component ─── */
const AddClinic = ({ mode = 'add', initialData = {}, onSubmit }) => {
  const refs = {
    contractorDocuments: useRef(), hospitalDocuments: useRef(),
    clinicalEstablishmentCertificate: useRef(), businessRegistrationCertificate: useRef(),
    pharmacistCertificate: useRef(), biomedicalWasteManagementAuth: useRef(),
    fireSafetyCertificate: useRef(), professionalIndemnityInsurance: useRef(),
    gstRegistrationCertificate: useRef(), hospitalLogo: useRef(),
    clinicContract: useRef(), drugLicenseCertificate: useRef(),
    drugLicenseFormType: useRef(), tradeLicence: useRef(),
  }

  const savedQuestionId = localStorage.getItem('savedQuestionId')
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(0)
  const [completedTabs, setCompletedTabs] = useState([])
  const [errors, setErrors] = useState({})
  const [serviceOptions, setServiceOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedPharmacistOption, setSelectedPharmacistOption] = useState('')
  const [clinicTypeOption, setClinicTypeOption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timings, setTimings] = useState([])
  const [loadingTimings, setLoadingTimings] = useState(false)
  const [nabhQuestions, setNabhQuestions] = useState([])
  const [nabhAnswers, setNabhAnswers] = useState([])
  const [showNabhModal, setShowNabhModal] = useState(false)
  const [nabhScore, setNabhScore] = useState(null)
  const [nabhSubmitted, setNabhSubmitted] = useState(false)

  // In edit mode, treat a completed NABH questionnaire on the record as already-submitted
  // so the button doesn't force the user to redo it (they can still reopen via clearing state elsewhere if needed).

  const [formData, setFormData] = useState({
    name: '', address: '', city: '', contactNumber: '',
    openingTime: '', closingTime: '', hospitalLogo: null,
    emailAddress: '', website: '', licenseNumber: '', issuingAuthority: '',
    recommended: false, hospitalDocuments: null, hospitalContract: null,
    freeFollowUps: '', clinicalEstablishmentCertificate: null,
    businessRegistrationCertificate: null, clinicType: '',
    medicinesSoldOnSite: '', drugLicenseCertificate: null, drugLicenseFormType: null,
    hasPharmacist: '', pharmacistCertificate: null, biomedicalWasteManagementAuth: null,
    tradeLicense: null, fireSafetyCertificate: null, professionalIndemnityInsurance: null,
    gstRegistrationCertificate: null, others: [], consultationExpiration: '',
    subscription: '', instagramHandle: '', twitterHandle: '', facebookHandle: '',
    latitude: '', longitude: '', walkthrough: '', branch: '', loyaltyPoints: '', nabhScore: null,
  })

  const [existingDoctors, setExistingDoctors] = useState([])

  // Load NABH state from localStorage on mount (only relevant for add mode's in-progress flow)
  useEffect(() => {
    if (mode === 'edit') return // edit mode pulls NABH state from initialData instead
    const savedNabhScore = localStorage.getItem('nabhScore')
    const savedNabhSubmitted = localStorage.getItem('nabhSubmitted')

    if (savedNabhScore) {
      const score = JSON.parse(savedNabhScore)
      setNabhScore(score)
      setFormData(prev => ({ ...prev, nabhScore: score }))
    }

    if (savedNabhSubmitted === 'true') {
      setNabhSubmitted(true)
    }
  }, [mode])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
      setClinicTypeOption(initialData.clinicType || '')
      setSelectedOption(initialData.medicinesSoldOnSite || '')
      setSelectedPharmacistOption(initialData.hasPharmacist || '')

      // Load NABH score if editing
      if (initialData.nabhScore !== null && initialData.nabhScore !== undefined) {
        setNabhScore(initialData.nabhScore)
        setNabhSubmitted(true)
      }
    }
  }, [initialData, mode])

  useEffect(() => {
    const fetchTimings = async () => {
      setLoadingTimings(true)
      const result = await getClinicTimings()
      if (result.success) setTimings(result.data)
      else toast.error(result.message || 'Failed to fetch clinic timings')
      setLoadingTimings(false)
    }
    fetchTimings()
  }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${getAllQuestions}`, { params: { id: savedQuestionId } })
        if (response.data.success && response.data.data) {
          const qaList = response.data.data.questionsAndAnswers || []
          setNabhQuestions(qaList.map(item => item.question))
          setNabhAnswers(qaList.map(item => item.answer))
        }
      } catch (err) { console.error('Error fetching NABH questions:', err) }
    }
    fetchQuestions()
  }, [savedQuestionId])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${ClinicAllData}`)
        setExistingDoctors(response.data.data)
      } catch (err) { console.error('Failed to load existing doctor data', err) }
    }
    fetchDoctors()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const convertFileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = error => reject(error)
  })

  const handleAppendFiles = async (e, fieldName, maxFiles = 6) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) return
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'application/zip']
    const MAX_SIZE = 250 * 1024
    for (let file of selectedFiles) {
      if (!allowed.includes(file.type)) { setErrors(p => ({ ...p, [fieldName]: 'Invalid file type' })); return }
      if (file.size > MAX_SIZE) { setErrors(p => ({ ...p, [fieldName]: 'File must be ≤ 250 KB' })); return }
    }
    const base64Files = await Promise.all(
      selectedFiles.slice(0, maxFiles).map(file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve({ name: file.name, base64: reader.result.split(',')[1] })
        reader.onerror = err => reject(err)
      }))
    )
    setFormData(prev => {
      const existing = Array.isArray(prev[fieldName]) ? prev[fieldName] : []
      return { ...prev, [fieldName]: [...existing, ...base64Files].slice(0, maxFiles) }
    })
    setErrors(p => ({ ...p, [fieldName]: '' }))
  }

  const handleNabhSubmit = async () => {
    try {
      const payload = {
        questionsAndAnswers: nabhQuestions.map((q, index) => ({ question: q, answer: nabhAnswers[index] === true })),
      }
      const response = await axios.post(`${BASE_URL}/${postAllQuestionsAndAnswers}`, payload)
      if (response.data.success) {
        const score = response.data.data?.score ?? 0
        setNabhScore(score)
        setFormData(prev => ({ ...prev, nabhScore: score }))
        setNabhSubmitted(true)

        // Persist to localStorage (only meaningful for add-mode's multi-visit flow)
        if (mode !== 'edit') {
          localStorage.setItem('nabhScore', JSON.stringify(score))
          localStorage.setItem('nabhSubmitted', 'true')
        }

        setShowNabhModal(false)
        setErrors(prev => ({ ...prev, nabhScore: '' }))
        toast.success('NABH Score saved successfully', { position: 'top-right' })
      }
    } catch (error) {
      console.error('Error saving NABH answers:', error)
      toast.error('Failed to save NABH answers', { position: 'top-right' })
    }
  }

  /* ── Next tab handler with validation ── */
  const handleNext = () => {
    const tabErrors = validateTab(activeTab, formData, selectedOption, selectedPharmacistOption, clinicTypeOption)
    if (Object.keys(tabErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...tabErrors }))
      toast.error('Please fill all required fields before proceeding', { position: 'top-right' })
      return
    }
    setErrors({})
    setCompletedTabs(prev => [...new Set([...prev, activeTab])])
    setActiveTab(prev => prev + 1)
  }

  const handleTabClick = (tabId) => {
    // Allow clicking only completed tabs or the current tab
    if (tabId <= activeTab || completedTabs.includes(tabId)) {
      setActiveTab(tabId)
    }
  }

  const handleBack = () => {
    setActiveTab(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { emailAddress, contactNumber, licenseNumber } = formData
    const safe = Array.isArray(existingDoctors) ? existingDoctors : []

    // Exclude the record currently being edited from duplicate checks,
    // otherwise a clinic always "collides" with its own saved email/phone/license.
    const currentId = initialData?._id
    const others = (mode === 'edit' && currentId)
      ? safe.filter(d => d._id !== currentId)
      : safe

    const isEmailDup = others.some(d => d.emailAddress?.toLowerCase() === emailAddress?.toLowerCase())
    const isMobileDup = others.some(d => d.contactNumber === contactNumber)
    const isLicenseDup = !!licenseNumber?.trim() &&
      others.some(d => d.licenseNumber?.trim() && d.licenseNumber.toLowerCase() === licenseNumber.toLowerCase())

    if (isEmailDup || isMobileDup || isLicenseDup) {
      const newErrors = {}
      if (isEmailDup) newErrors.emailAddress = 'Email already exists'
      if (isMobileDup) newErrors.contactNumber = 'Mobile number already exists'
      if (isLicenseDup) newErrors.licenseNumber = 'License number already exists'
      setErrors(prev => ({ ...prev, ...newErrors }))
      if (isEmailDup || isMobileDup) { setActiveTab(0) }
      if (isLicenseDup) { setActiveTab(1) }
      setIsSubmitting(false)
      return
    }

    try {
      // Only re-encode a value if it's a fresh Blob/File picked this session.
      // If it's already a base64 string (existing record or freshly-picked & converted), pass it through as-is.
      const convertIfExists = async (file) => {
        if (!file) return ''
        if (file instanceof Blob) return await convertFileToBase64(file)
        return file
      }
      const convertMultiple = async (files) => {
        if (!Array.isArray(files)) return []
        return Promise.all(files.map(async f => {
          if (f?.base64) return f.base64
          if (f instanceof Blob) return await convertFileToBase64(f)
          return f
        }))
      }

      const clinicData = {
        name: formData.name, address: formData.address, city: formData.city,
        contactNumber: formData.contactNumber, openingTime: formData.openingTime,
        closingTime: formData.closingTime, hospitalLogo: await convertIfExists(formData.hospitalLogo),
        emailAddress: formData.emailAddress, website: formData.website?.trim() ? normalizeWebsite(formData.website.trim()) : '',
        licenseNumber: formData.licenseNumber, issuingAuthority: formData.issuingAuthority,
        hospitalDocuments: await convertIfExists(formData.hospitalDocuments),
        contractorDocuments: await convertIfExists(formData.hospitalContract),
        clinicalEstablishmentCertificate: await convertIfExists(formData.clinicalEstablishmentCertificate),
        businessRegistrationCertificate: await convertIfExists(formData.businessRegistrationCertificate),
        clinicType: clinicTypeOption, medicinesSoldOnSite: selectedOption,
        drugLicenseCertificate: await convertIfExists(formData.drugLicenseCertificate),
        drugLicenseFormType: await convertIfExists(formData.drugLicenseFormType),
        hasPharmacist: selectedPharmacistOption,
        pharmacistCertificate: await convertIfExists(formData.pharmacistCertificate),
        biomedicalWasteManagementAuth: await convertIfExists(formData.biomedicalWasteManagementAuth),
        tradeLicense: await convertIfExists(formData.tradeLicense),
        fireSafetyCertificate: await convertIfExists(formData.fireSafetyCertificate),
        professionalIndemnityInsurance: await convertIfExists(formData.professionalIndemnityInsurance),
        gstRegistrationCertificate: await convertIfExists(formData.gstRegistrationCertificate),
        others: await convertMultiple(formData.others),
        freeFollowUps: formData.freeFollowUps,
        instagramHandle: formData.instagramHandle, twitterHandle: formData.twitterHandle, facebookHandle: formData.facebookHandle,
        recommended: !!formData.recommended,
        consultationExpiration: formData.consultationExpiration
          ? (String(formData.consultationExpiration).includes('day') ? formData.consultationExpiration : `${formData.consultationExpiration} days`)
          : '',
        subscription: formData.subscription, latitude: formData.latitude, longitude: formData.longitude,
        walkthrough: formData.walkthrough, loyaltyPoints: formData.loyaltyPoints, nabhScore: formData.nabhScore, branch: formData.branch,
      }

      const isEdit = mode === 'edit' && !!currentId
      const response = isEdit
        ? await axios.put(`${BASE_URL}/admin/UpdateClinic/${currentId}`, clinicData)
        : await axios.post(`${BASE_URL}/admin/CreateClinic`, clinicData)

      if (response.data.success) {
        // Clear NABH localStorage after successful save (only relevant to add-mode flow)
        localStorage.removeItem('nabhScore')
        localStorage.removeItem('nabhSubmitted')

        toast.success(response.data.message || (isEdit ? 'Clinic Updated Successfully' : 'Clinic Added Successfully'), { position: 'top-right' })

        if (isEdit) {
          setTimeout(() => {
            navigate('/clinic-management', { state: { refresh: true } })
          }, 800)
        } else {
          setTimeout(() => {
            sendDermaCareOnboardingEmail({
              name: formData.name, email: formData.emailAddress,
              password: response.data.data.clinicTemporaryPassword,
              userID: response.data.data.clinicUsername,
            })
            navigate('/clinic-management', { state: { refresh: true, newClinic: response.data } })
          }, 1000)
        }
      } else {
        toast.error(response.data.message || 'Something went wrong', { position: 'top-right' })
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong', { position: 'top-right' })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Tab content renderers ── */
  const renderTab0 = () => (
    <>
      <SectionHeading title="Basic Information" subtitle="Core clinic identity and contact details" />
      <FieldGrid>
        <Field label="Clinic Name" required error={errors.name}>
          <Input type="text" name="name" value={formData.name || ''} error={errors.name}
            style={{ textTransform: 'capitalize' }}
            onChange={(e) => {
              const v = e.target.value
              setFormData(p => ({ ...p, name: v }))
              let err = ''
              if (!v.trim()) err = 'Clinic name is required'
              else if (/\d/.test(v)) err = 'Numbers not allowed'
              else if (!/^[A-Za-z\s.&-]+$/.test(v)) err = "Only letters, spaces, '.', '-', '&'"
              setErrors(p => ({ ...p, name: err || undefined }))
            }}
            onKeyDown={e => { if (/\d/.test(e.key)) e.preventDefault() }} />
        </Field>
        <Field label="Email Address" required error={errors.emailAddress}>
          <Input type="email" name="emailAddress" value={formData.emailAddress} error={errors.emailAddress}
            onChange={e => { setFormData(p => ({ ...p, emailAddress: e.target.value })); setErrors(p => ({ ...p, emailAddress: '' })) }} />
        </Field>
        <Field label="Contact Number" required error={errors.contactNumber}>
          <Input type="tel" name="contactNumber" value={formData.contactNumber} error={errors.contactNumber}
            maxLength={10}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '')
              setFormData(p => ({ ...p, contactNumber: v }))
              setErrors(p => ({ ...p, contactNumber: '' }))
            }} />
        </Field>
        <Field label="Website" error={errors.website}>
          <Input type="text" name="website" value={formData.website} error={errors.website}
            onChange={e => { const v = e.target.value; setFormData(p => ({ ...p, website: v })); setErrors(p => ({ ...p, website: '' })) }} />
        </Field>
        <Field label="Address" required error={errors.address}>
          <Input type="text" name="address" value={formData.address} error={errors.address} onChange={handleInputChange} />
        </Field>
        <Field label="City" required error={errors.city}>
          <Input type="text" name="city" value={formData.city} error={errors.city} onChange={handleInputChange}
            onKeyDown={e => { if (/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') e.preventDefault() }} />
        </Field>
        <Field label="Branch" required error={errors.branch}>
          <Input type="text" placeholder="e.g. Hyderabad Main" value={formData.branch || ''} error={errors.branch}
            onChange={e => { setFormData(p => ({ ...p, branch: e.target.value })); setErrors(p => ({ ...p, branch: '' })) }} />
        </Field>
        <Field label="Recommendation Status">
          <StyledSelect name="recommended" value={formData.recommended}
            onChange={e => setFormData(p => ({ ...p, recommended: e.target.value === 'true' }))}>
            <option value="true">Yes, Recommend</option>
            <option value="false">No, Don't Recommend</option>
          </StyledSelect>
        </Field>
      </FieldGrid>
    </>
  )

  const renderTab1 = () => (
    <>
      <SectionHeading title="Operating Hours & Licensing" subtitle="Set clinic hours and legal details" />
      <FieldGrid>
        <Field label="Opening Time" required error={errors.openingTime}>
          <StyledSelect name="openingTime" value={formData.openingTime} error={errors.openingTime}
            onChange={handleInputChange} disabled={loadingTimings}>
            <option value="">Select Opening Time</option>
            {timings.map((slot, idx) => <option key={idx} value={slot.openingTime}>{slot.openingTime}</option>)}
          </StyledSelect>
        </Field>
        <Field label="Closing Time" required error={errors.closingTime}>
          <StyledSelect name="closingTime" value={formData.closingTime} error={errors.closingTime}
            onChange={handleInputChange} disabled={loadingTimings}>
            <option value="">Select Closing Time</option>
            {timings.map((slot, idx) => <option key={idx} value={slot.closingTime}>{slot.closingTime}</option>)}
          </StyledSelect>
        </Field>
        <Field label="License Number" error={errors.licenseNumber}>
          <Input type="text" name="licenseNumber" value={formData.licenseNumber} error={errors.licenseNumber} onChange={handleInputChange} />
        </Field>
        <Field label="Issuing Authority" error={errors.issuingAuthority}>
          <Input type="text" name="issuingAuthority" value={formData.issuingAuthority} error={errors.issuingAuthority}
            onChange={handleInputChange} onKeyDown={e => { if (/[0-9]/.test(e.key)) e.preventDefault() }} />
        </Field>
      </FieldGrid>
    </>
  )

  const renderTab2 = () => (
    <>
      <SectionHeading title="Clinic Configuration" subtitle="Subscription, medicines and operations settings" />
      <FieldGrid>
        <Field label="Clinic Type" error={errors.clinicType}>
          <StyledSelect value={clinicTypeOption} error={errors.clinicType}
            onChange={e => { setClinicTypeOption(e.target.value); setErrors(p => ({ ...p, clinicType: '' })) }}>
            <option value="">Select Type</option>
            <option value="Proprietorship">Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="LLP">LLP</option>
            <option value="Private Limited">Private Limited</option>
          </StyledSelect>
        </Field>
        <Field label="Medicines Sold On-Site" error={errors.medicinesSoldOnSite}>
          <StyledSelect value={selectedOption} error={errors.medicinesSoldOnSite}
            onChange={e => { setSelectedOption(e.target.value); setErrors(p => ({ ...p, medicinesSoldOnSite: '' })) }}>
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </StyledSelect>
        </Field>
        <Field label="Clinic Has a Valid Pharmacist" error={errors.hasPharmacist}>
          <StyledSelect value={selectedPharmacistOption} error={errors.hasPharmacist}
            onChange={e => { setSelectedPharmacistOption(e.target.value); setErrors(p => ({ ...p, hasPharmacist: '' })) }}>
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </StyledSelect>
        </Field>
        <Field label="Subscription" error={errors.subscription}>
          <StyledSelect name="subscription" value={formData.subscription} error={errors.subscription} onChange={handleInputChange}>
            <option value="">Select Subscription</option>
            <option value="Free">Free</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </StyledSelect>
        </Field>
        <Field label="Consultation Expiration (days)" required error={errors.consultationExpiration}>
          <Input type="text" name="consultationExpiration" value={formData.consultationExpiration}
            error={errors.consultationExpiration} placeholder="01–99"
            onChange={e => {
              let v = e.target.value.replace(/\D/g, '')
              if (v.length > 2) v = v.slice(0, 2)
              setFormData(p => ({ ...p, consultationExpiration: v }))
              setErrors(p => ({ ...p, consultationExpiration: v ? '' : 'Required' }))
            }} />
        </Field>
        <Field label="No. of Free Follow Ups" required error={errors.freeFollowUps}>
          <Input type="number" name="freeFollowUps" value={formData.freeFollowUps} error={errors.freeFollowUps}
            min="0" placeholder="e.g. 2" onChange={handleInputChange} />
        </Field>
      </FieldGrid>
    </>
  )

  const renderTab3 = () => (
    <>
      <SectionHeading title="Location" subtitle="GPS coordinates for map integration" />
      <FieldGrid>
        <Field label="Latitude" required error={errors.latitude}>
          <Input type="number" step="any" placeholder="e.g. 17.3850" value={formData.latitude || ''} error={errors.latitude}
            onChange={e => {
              const v = e.target.value
              setFormData(p => ({ ...p, latitude: v }))
              const lat = parseFloat(v)
              setErrors(p => ({ ...p, latitude: !v ? 'Required' : isNaN(lat) || lat < -90 || lat > 90 ? 'Must be between -90 and 90' : '' }))
            }} />
        </Field>
        <Field label="Longitude" required error={errors.longitude}>
          <Input type="number" step="any" placeholder="e.g. 78.4867" value={formData.longitude || ''} error={errors.longitude}
            onChange={e => {
              const v = e.target.value
              setFormData(p => ({ ...p, longitude: v }))
              const lng = parseFloat(v)
              setErrors(p => ({ ...p, longitude: !v ? 'Required' : isNaN(lng) || lng < -180 || lng > 180 ? 'Must be between -180 and 180' : '' }))
            }} />
        </Field>
        <Field label="Virtual Clinic Tour URL" error={errors.walkthrough}>
          <Input type="url" placeholder="https://example.com/tour" value={formData.walkthrough || ''} error={errors.walkthrough}
            onChange={e => {
              const v = e.target.value
              setFormData(p => ({ ...p, walkthrough: v }))
              if (v.trim()) { try { new URL(v) } catch { setErrors(p => ({ ...p, walkthrough: 'Enter a valid URL' })) } }
            }} />
        </Field>
        <Field label="Loyalty Points">
          <Input type="number" min="0" name="loyaltyPoints" placeholder="e.g. 100" value={formData.loyaltyPoints || ''}
            onChange={handleInputChange} />
        </Field>
      </FieldGrid>

      <Divider />
      <SectionHeading title="Social Media Handles" subtitle="Optional — add your clinic's social profiles" />
      <FieldGrid cols={3}>
        <Field label="Instagram">
          <Input type="text" name="instagramHandle" placeholder="@clinic_handle" value={formData.instagramHandle} onChange={handleInputChange} />
        </Field>
        <Field label="Facebook">
          <Input type="text" name="facebookHandle" placeholder="facebook.com/clinic" value={formData.facebookHandle} onChange={handleInputChange} />
        </Field>
        <Field label="Twitter">
          <Input type="text" name="twitterHandle" placeholder="@clinic_tweet" value={formData.twitterHandle} onChange={handleInputChange} />
        </Field>
      </FieldGrid>
    </>
  )

  const renderTab4 = () => (
    <>
      <SectionHeading title="Documents & Certificates" subtitle="Max 250 KB per file (PDF, DOC, JPEG, PNG, ZIP)" />
      <FieldGrid>
        <FileField label="Clinic Logo" name="hospitalLogo" accept=".jpeg,.jpg,.png"
          required error={errors.hospitalLogo} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.hospitalLogo} />
        <FileField label="Clinic Contract" name="hospitalContract"
          required={false} error={errors.hospitalContract} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.clinicContract} />
        <FileField label="Letter at LOGO" name="hospitalDocuments" accept=".pdf,.doc,.docx,.jpeg,.png,.zip"
          required={false} error={errors.hospitalDocuments} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.hospitalDocuments} />
        <FileField label="Clinical Establishment Registration" name="clinicalEstablishmentCertificate"
          required={false} error={errors.clinicalEstablishmentCertificate} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.clinicalEstablishmentCertificate} />
        <FileField label="Business Registration Certificate" name="businessRegistrationCertificate"
          required={false} error={errors.businessRegistrationCertificate} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.businessRegistrationCertificate} />
        <FileField label="Biomedical Waste Management Auth" name="biomedicalWasteManagementAuth"
          tooltip="Issued by State Pollution Control Board (SPCB)"
          required={false} error={errors.biomedicalWasteManagementAuth} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.biomedicalWasteManagementAuth} />
        <FileField label="Trade Licence / Shop & Establishment" name="tradeLicense"
          required={false} error={errors.tradeLicense} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.tradeLicence} />
        <FileField label="Fire Safety Certificate" name="fireSafetyCertificate"
          required={false} error={errors.fireSafetyCertificate} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.fireSafetyCertificate} />
        <FileField label="GST Registration Certificate" name="gstRegistrationCertificate"
          required={false} error={errors.gstRegistrationCertificate} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.gstRegistrationCertificate} />
        <FileField label="Professional Indemnity Insurance" name="professionalIndemnityInsurance"
          required={false} error={errors.professionalIndemnityInsurance} formData={formData} setFormData={setFormData}
          setErrors={setErrors} inputRef={refs.professionalIndemnityInsurance} />
      </FieldGrid>

      {selectedOption === 'Yes' && (
        <>
          <SectionHeading title="Drug Licence Documents" />
          <FieldGrid>
            <FileField label="Drug Licence Certificate" name="drugLicenseCertificate"
              required={false} error={errors.drugLicenseCertificate} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.drugLicenseCertificate} />
            <FileField label="Drug Licence Form Type 20/21" name="drugLicenseFormType"
              required={false} error={errors.drugLicenseFormType} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.drugLicenseFormType} />
          </FieldGrid>
        </>
      )}

      {selectedPharmacistOption === 'Yes' && (
        <FieldGrid>
          <FileField label="Pharmacist Certificate" name="pharmacistCertificate"
            required={false} error={errors.pharmacistCertificate} formData={formData} setFormData={setFormData}
            setErrors={setErrors} inputRef={refs.pharmacistCertificate} />
          <div />
        </FieldGrid>
      )}

      <div style={{ marginBottom: '16px' }}>
        <FieldLabel>Others (NABH / Aesthetic Training)</FieldLabel>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: t.radiusSm, border: `1px solid ${t.border}`, backgroundColor: '#fff', fontSize: '12px', fontWeight: '600', color: t.text, cursor: 'pointer' }}>
          📎 Choose Files (up to 6)
          <input type="file" name="others" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
            style={{ display: 'none' }} onChange={e => handleAppendFiles(e, 'others', 6)} />
        </label>
        {Array.isArray(formData.others) && formData.others.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {formData.others.map((file, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', fontSize: '11px', color: '#0369a1' }}>
                <span>{file?.name || `File ${index + 1}`}</span>
                <button type="button" onClick={() => setFormData(p => ({ ...p, others: p.others.filter((_, i) => i !== index) }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.danger, padding: 0, fontWeight: '700', fontSize: '14px' }}>×</button>
              </div>
            ))}
          </div>
        )}
        <FieldError message={errors.others} />
      </div>
    </>
  )

  const renderTab5 = () => (
    <>
      <SectionHeading title="NABH Score" subtitle="Complete the questionnaire to generate your score" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        {nabhScore !== null && (
          <div style={{ padding: '6px 16px', borderRadius: '20px', backgroundColor: '#dcfce7', border: '1px solid #86efac', fontSize: '14px', fontWeight: '700', color: t.success }}>
            Score: {nabhScore}
          </div>
        )}
        <Btn onClick={() => !nabhSubmitted && setShowNabhModal(true)} disabled={nabhSubmitted}
          variant={nabhSubmitted ? 'secondary' : 'primary'}>
          {nabhSubmitted ? '✓ Questionnaire Submitted' : 'Open NABH Questionnaire'}
        </Btn>
        {mode === 'edit' && nabhSubmitted && (
          <Btn variant="secondary" onClick={() => setNabhSubmitted(false)}>
            Retake Questionnaire
          </Btn>
        )}
      </div>
      <FieldError message={errors.nabhScore} />
    </>
  )

  const tabContent = [renderTab0, renderTab1, renderTab2, renderTab3, renderTab4, renderTab5]
  const isLastTab = activeTab === TABS.length - 1

  /* ── Render ── */
  return (
    <div style={{ minHeight: '100vh', padding: '20px', color: t.text }}>
      <ToastContainer />

      {/* Page Header */}
      <div style={{ backgroundColor: t.primary, borderRadius: t.radius, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', boxShadow: t.shadowMd }}>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>CLINIC MANAGEMENT</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{mode === 'edit' ? 'Edit Clinic' : 'Add New Clinic'}</div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          Step {activeTab + 1} of {TABS.length}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ backgroundColor: '#fff', borderRadius: t.radius, boxShadow: t.shadow, border: `1px solid ${t.border}`, marginBottom: '2px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: `2px solid ${t.border}` }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const isCompleted = completedTabs.includes(tab.id)
            const isAccessible = tab.id <= activeTab || isCompleted
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                style={{
                  flex: '1 1 0',
                  minWidth: '110px',
                  padding: '12px 8px 10px',
                  border: 'none',
                  borderBottom: isActive ? `3px solid ${t.primary}` : '3px solid transparent',
                  backgroundColor: isActive ? '#f0f4ff' : '#fff',
                  cursor: isAccessible ? 'pointer' : 'not-allowed',
                  transition: 'all .2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  opacity: isAccessible ? 1 : 0.45,
                }}
              >
                {/* Step indicator circle */}
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700',
                  backgroundColor: isCompleted ? t.success : isActive ? t.primary : t.border,
                  color: isCompleted || isActive ? '#fff' : t.textMuted,
                  flexShrink: 0,
                }}>
                  {isCompleted ? '✓' : tab.id + 1}
                </div>
                <span style={{ fontSize: '11px', fontWeight: isActive ? '700' : '500', color: isActive ? t.primary : isCompleted ? t.success : t.textMuted, whiteSpace: 'nowrap' }}>
                  {tab.icon} {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content Card */}
      <div style={{ backgroundColor: '#fff', color: t.text, borderRadius: t.radius, boxShadow: t.shadow, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <CForm
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          style={{ padding: "24px" }}
        >

          {/* Render active tab content */}
          {tabContent[activeTab]()}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', marginTop: '8px', borderTop: `1px solid ${t.border}` }}>
            <div>
              {activeTab > 0 && (
                <Btn variant="secondary" onClick={handleBack}>
                  ← Back
                </Btn>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn variant="secondary" onClick={() => navigate('/clinic-management')}>Cancel</Btn>
              {!isLastTab ? (
                <Btn onClick={handleNext} variant="primary">
                  Next →
                </Btn>
              ) : (
                <Btn
                  type="button"
                  variant="success"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        style={{ width: "12px", height: "12px" }}
                      />
                      {/* Saving... */}
                    </>
                  ) : (
                    mode === 'edit' ? '✓ Update Clinic' : '✓ Save Clinic'
                  )}
                </Btn>
              )}
            </div>
          </div>
        </CForm>
      </div>

      {/* NABH Modal */}
      <CModal visible={showNabhModal} onClose={() => setShowNabhModal(false)} size="lg" backdrop="static">
        <CModalHeader style={{ borderBottom: `1px solid ${t.border}`, padding: '14px 20px' }}>
          <CModalTitle style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>NABH Questionnaire</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
          {nabhQuestions.map((question, index) => (
            <div key={index} style={{ padding: '14px 16px', marginBottom: '10px', backgroundColor: t.surface, borderRadius: t.radiusSm, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '10px' }}>
                {index + 1}. {question}
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', color: t.text, cursor: 'pointer' }}>
                  <input type="radio" name={`nabh-${index}`} style={{ accentColor: t.primary }}
                    checked={nabhAnswers[index] === true}
                    onChange={() => { const u = [...nabhAnswers]; u[index] = true; setNabhAnswers(u) }} />
                  Yes
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', color: t.text, cursor: 'pointer' }}>
                  <input type="radio" name={`nabh-${index}`} style={{ accentColor: t.primary }}
                    checked={nabhAnswers[index] === false}
                    onChange={() => { const u = [...nabhAnswers]; u[index] = false; setNabhAnswers(u) }} />
                  No
                </label>
              </div>
            </div>
          ))}
        </CModalBody>
        <CModalFooter style={{ borderTop: `1px solid ${t.border}`, padding: '12px 20px', gap: '8px' }}>
          <Btn variant="secondary" onClick={() => setShowNabhModal(false)}>Close</Btn>
          <Btn onClick={handleNabhSubmit}>Submit Answers</Btn>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AddClinic