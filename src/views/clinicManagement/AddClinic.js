import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import FileInput from './FileInput'
import {
  CForm,
  CFormLabel,
  CFormInput,
  CFormFeedback,
  CFormSelect,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CTooltip,
} from '@coreui/react'
import {
  BASE_URL,
  subService_URL,
  getService,
  ClinicAllData,
  getAllQuestions,
  postAllQuestionsAndAnswers,
} from '../../baseUrl'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import Select from 'react-select'
import sendDermaCareOnboardingEmail from '../../Utils/Emailjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FileInputWithRemove from './FileInputWithRemove'
import { getClinicTimings } from './AddClinicAPI'

/* ─── Design tokens (matches AppointmentDetails / DoctorDetailsPage) ─── */
const t = {
  primary: '#1B4F8A',
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

/** Vertical accent bar + bold label */
const SectionHeading = ({ title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '24px 0 16px' }}>
    <span style={{
      width: '4px', minHeight: '36px', borderRadius: '2px',
      backgroundColor: '#1B4F8A', flexShrink: 0, marginTop: '2px',
    }} />
    <div>
      <div style={{ fontSize: '13px', fontWeight: '700', color: t.text, letterSpacing: '0.02em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px' }}>{subtitle}</div>}
    </div>
  </div>
)

/** Consistent label */
const FieldLabel = ({ children, required }) => (
  <label style={{
    display: 'block', fontSize: '11px', fontWeight: '700', color: t.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px',
  }}>
    {children}{required && <span style={{ color: t.danger, marginLeft: '3px' }}>*</span>}
  </label>
)

/** Inline error */
const FieldError = ({ message }) =>
  message ? <div style={{ fontSize: '11px', color: t.danger, marginTop: '3px' }}>{message}</div> : null

/** Shared action button */
const Btn = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, style = {} }) => {
  const bg = variant === 'secondary' ? '#e2e8f0'
    : variant === 'danger' ? t.danger
    : variant === 'success' ? t.success
    : '#1B4F8A'
  const color = variant === 'secondary' ? t.text : '#fff'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '7px 20px', borderRadius: t.radiusSm, fontSize: '13px',
        fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none', color, backgroundColor: bg,
        opacity: disabled ? 0.6 : 1,
        boxShadow: variant === 'secondary' ? 'none' : t.shadow,
        transition: 'opacity .15s',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}

/** Two-column field grid wrapper */
const FieldGrid = ({ children, cols = 2 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '16px 24px',
    marginBottom: '4px',
  }}>
    {children}
  </div>
)

/** Field card (label + input + error) */
const Field = ({ label, required, error, children }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    {children}
    <FieldError message={error} />
  </div>
)

/** Styled text input */
const Input = ({ error, ...props }) => (
  <input
    {...props}
    style={{
      width: '100%', padding: '7px 10px', fontSize: '13px',
      border: `1px solid ${error ? t.danger : t.border}`,
      borderRadius: t.radiusSm, outline: 'none', color: t.text,
      backgroundColor: '#fff', boxSizing: 'border-box',
      transition: 'border-color .15s',
    }}
    onFocus={e => { e.target.style.borderColor = '#1B4F8A' }}
    onBlur={e => { e.target.style.borderColor = error ? t.danger : t.border }}
  />
)

/** Styled select */
const StyledSelect = ({ error, children, ...props }) => (
  <select
    {...props}
    style={{
      width: '100%', padding: '7px 10px', fontSize: '13px',
      border: `1px solid ${error ? t.danger : t.border}`,
      borderRadius: t.radiusSm, outline: 'none', color: t.text,
      backgroundColor: '#fff', appearance: 'auto', boxSizing: 'border-box',
    }}
  >
    {children}
  </select>
)

/** File upload row with filename chip */
const FileField = ({ label, name, required = true, accept, error, formData, setFormData, setErrors, inputRef, tooltip }) => {
  const fileName = formData[`${name}FileName`]

  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isLogo = name === 'hospitalLogo'
    const maxSize = isLogo ? 1 * 1024 * 1024 : 250 * 1024
    const allowed = isLogo
      ? ['image/jpeg', 'image/jpg', 'image/png']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'application/zip']

    if (!allowed.includes(file.type)) {
      setErrors(p => ({ ...p, [name]: 'Invalid file type' }))
      return
    }
    if (file.size > maxSize) {
      setErrors(p => ({ ...p, [name]: `File must be ≤ ${isLogo ? '1 MB' : '250 KB'}` }))
      return
    }

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
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '5px 12px', borderRadius: t.radiusSm,
          border: `1px solid ${error ? t.danger : t.border}`,
          backgroundColor: '#fff', fontSize: '12px', fontWeight: '600',
          color: t.text, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          📎 Choose File
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            style={{ display: 'none' }}
            onChange={handleChange}
          />
        </label>
        {fileName
          ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '20px',
              backgroundColor: '#dcfce7', border: '1px solid #86efac',
              fontSize: '11px', fontWeight: '600', color: t.success, maxWidth: '180px',
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
              <button onClick={handleClear} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.danger, padding: 0, lineHeight: 1, fontSize: '14px', fontWeight: '700' }}>×</button>
            </div>
          )
          : <span style={{ fontSize: '11px', color: t.textMuted }}>No file chosen</span>
        }
      </div>
      <FieldError message={error} />
    </div>
  )

  return tooltip
    ? <CTooltip content={tooltip}>{content}</CTooltip>
    : content
}

/** Horizontal divider */
const Divider = () => <hr style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '4px 0 20px' }} />

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

  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedPharmacistOption, setSelectedPharmacistOption] = useState('')
  const [clinicTypeOption, setClinicTypeOption] = useState('')
  const [subscription, setSubscription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timings, setTimings] = useState([])
  const [loadingTimings, setLoadingTimings] = useState(false)
  const [nabhQuestions, setNabhQuestions] = useState([])
  const [nabhAnswers, setNabhAnswers] = useState([])
  const [showNabhModal, setShowNabhModal] = useState(false)
  const [nabhScore, setNabhScore] = useState(null)
  const [nabhSubmitted, setNabhSubmitted] = useState(false)

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
    latitude: '', longitude: '', walkthrough: '', branch: '', nabhScore: null,
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
      setClinicTypeOption(initialData.clinicType)
      setSelectedOption(initialData.medicinesSoldOnSite)
      setSelectedPharmacistOption(initialData.hasPharmacist)
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
    const fetchCategories = async () => {
      try {
        const response = await CategoryData()
        if (response?.data) setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
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
      } catch (err) {
        console.error('Error fetching NABH questions:', err)
      }
    }
    fetchQuestions()
  }, [savedQuestionId])

  const [existingDoctors, setExistingDoctors] = useState([])
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${ClinicAllData}`)
        setExistingDoctors(response.data.data)
      } catch (err) {
        console.error('Failed to load existing doctor data', err)
      }
    }
    fetchDoctors()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const websiteRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
  const normalizeWebsite = (url) => !/^https?:\/\//i.test(url) ? 'https://' + url : url

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
        setShowNabhModal(false)
        setErrors(prev => ({ ...prev, nabhScore: '' }))
      }
    } catch (error) {
      console.error('Error saving NABH answers:', error)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name?.trim()) newErrors.name = 'Clinic name is required'
    else if (!/^[A-Za-z\s.&-]{2,50}$/.test(formData.name)) newErrors.name = "Only letters, spaces, '.', '-', and '&' allowed"
    if (!formData.address?.trim()) newErrors.address = 'Address is required'
    if (!formData.city?.trim()) newErrors.city = 'City is required'
    else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.city)) newErrors.city = 'City must contain only letters'
    if (!formData.emailAddress?.trim()) newErrors.emailAddress = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) newErrors.emailAddress = 'Enter a valid email'
    if (!formData.contactNumber?.trim()) newErrors.contactNumber = 'Contact number is required'
    else if (formData.contactNumber.trim().length !== 10 || !/^[5-9]\d{9}$/.test(formData.contactNumber.trim())) newErrors.contactNumber = 'Must be a 10-digit number starting with 5-9'
    if (!formData.openingTime) newErrors.openingTime = 'Opening time is required'
    if (!formData.closingTime) newErrors.closingTime = 'Closing time is required'
    if (!formData.consultationExpiration) newErrors.consultationExpiration = 'Consultation days are required'
    if (!formData.licenseNumber?.trim()) newErrors.licenseNumber = 'License number is required'
    if (!formData.issuingAuthority?.trim()) newErrors.issuingAuthority = 'Issuing authority is required'
    if (!formData.hospitalLogo) newErrors.hospitalLogo = 'Clinic logo is required'
    if (!formData.hospitalDocuments) newErrors.hospitalDocuments = 'Please upload the document'
    if (!formData.hospitalContract) newErrors.hospitalContract = 'Please upload the document'
    if (!formData.clinicalEstablishmentCertificate) newErrors.clinicalEstablishmentCertificate = 'Please upload'
    if (!formData.businessRegistrationCertificate) newErrors.businessRegistrationCertificate = 'Please upload'
    if (selectedOption === 'Yes' && !formData.drugLicenseCertificate) newErrors.drugLicenseCertificate = 'Please upload'
    if (selectedOption === 'Yes' && !formData.drugLicenseFormType) newErrors.drugLicenseFormType = 'Please upload'
    if (selectedOption === 'Yes' && selectedPharmacistOption === 'Yes' && !formData.pharmacistCertificate) newErrors.pharmacistCertificate = 'Please upload'
    if (!formData.biomedicalWasteManagementAuth) newErrors.biomedicalWasteManagementAuth = 'Please upload'
    if (!formData.tradeLicense) newErrors.tradeLicense = 'Please upload'
    if (!formData.fireSafetyCertificate) newErrors.fireSafetyCertificate = 'Please upload'
    if (!formData.gstRegistrationCertificate) newErrors.gstRegistrationCertificate = 'Please upload'
    if (!clinicTypeOption?.trim()) newErrors.clinicType = 'Please select a clinic type'
    if (!selectedOption?.trim()) newErrors.medicinesSoldOnSite = 'Please select an option'
    if (!selectedPharmacistOption?.trim()) newErrors.hasPharmacist = 'Please select an option'
    if (!formData.website?.trim()) newErrors.website = 'Website is required'
    else if (!websiteRegex.test(normalizeWebsite(formData.website.trim()))) newErrors.website = 'Enter a valid URL'
    if (!formData.subscription?.trim()) newErrors.subscription = 'Please select a subscription'
    if (!formData.latitude) newErrors.latitude = 'Latitude is required'
    if (!formData.longitude) newErrors.longitude = 'Longitude is required'
    if (!formData.branch?.trim()) newErrors.branch = 'Branch name is required'
    if (!formData.nabhScore && formData.nabhScore !== 0) newErrors.nabhScore = 'NABH Score is required'
    if (!formData.freeFollowUps) newErrors.freeFollowUps = 'Free follow ups is required'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) { toast.error('Please fill all required fields', { position: 'top-right' }); return false }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    const { emailAddress, contactNumber, licenseNumber } = formData
    const safe = Array.isArray(existingDoctors) ? existingDoctors : []
    const isEmailDup = safe.some(d => d.emailAddress?.toLowerCase() === emailAddress?.toLowerCase())
    const isMobileDup = safe.some(d => d.contactNumber === contactNumber)
    const isLicenseDup = safe.some(d => d.licenseNumber?.toLowerCase() === licenseNumber?.toLowerCase())

    if (isEmailDup || isMobileDup || isLicenseDup) {
      const newErrors = {}
      if (isEmailDup) newErrors.emailAddress = 'Email already exists'
      if (isMobileDup) newErrors.contactNumber = 'Mobile number already exists'
      if (isLicenseDup) newErrors.licenseNumber = 'License number already exists'
      setErrors(prev => ({ ...prev, ...newErrors }))
      setIsSubmitting(false)
      return
    }

    try {
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
        emailAddress: formData.emailAddress, website: normalizeWebsite(formData.website.trim()),
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
        consultationExpiration: formData.consultationExpiration ? `${formData.consultationExpiration} days` : '',
        subscription: formData.subscription, latitude: formData.latitude, longitude: formData.longitude,
        walkthrough: formData.walkthrough, nabhScore: formData.nabhScore, branch: formData.branch,
      }

      const response = await axios.post(`${BASE_URL}/admin/CreateClinic`, clinicData)
      if (response.data.success) {
        toast.success(response.data.message || 'Clinic Added Successfully', { position: 'top-right' })
        setTimeout(() => {
          sendDermaCareOnboardingEmail({
            name: formData.name, email: formData.emailAddress,
            password: response.data.data.clinicTemporaryPassword,
            userID: response.data.data.clinicUsername,
          })
          navigate('/clinic-management', { state: { refresh: true, newClinic: response.data } })
        }, 1000)
      } else {
        toast.error(response.data.message || 'Something went wrong', { position: 'top-right' })
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong', { position: 'top-right' })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div style={{  minHeight: '100vh', padding: '20px', color: t.text }}>
      <ToastContainer />

      {/* ── Page Header Bar ── */}
      <div style={{
        backgroundColor: '#1B4F8A',
        borderRadius: t.radius, padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', boxShadow: t.shadowMd,
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>CLINIC MANAGEMENT</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Add New Clinic</div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Fill all required fields to register</div>
      </div>

      {/* ── Main Form Card ── */}
      <div style={{
        backgroundColor: '#fff', color: t.text,
        borderRadius: t.radius, boxShadow: t.shadow,
        border: `1px solid ${t.border}`, overflow: 'hidden',
      }}>
        <CForm onSubmit={handleSubmit} style={{ padding: '24px' }}>

          {/* ══ SECTION 1: Basic Information ══ */}
          <SectionHeading title="Basic Information" subtitle="Core clinic identity and contact details" />
          <FieldGrid>
            <Field label="Clinic Name" required error={errors.name}>
              <Input
                type="text"
                name="name"
                value={formData.name || ''}
                error={errors.name}
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
                onKeyDown={e => { if (/\d/.test(e.key)) e.preventDefault() }}
              />
            </Field>
            <Field label="Email Address" required error={errors.emailAddress}>
              <Input type="email" name="emailAddress" value={formData.emailAddress} error={errors.emailAddress}
                onChange={e => { setFormData(p => ({ ...p, emailAddress: e.target.value })); setErrors(p => ({ ...p, emailAddress: '' })) }} />
            </Field>
            <Field label="Contact Number" required error={errors.contactNumber}>
              <Input type="tel" name="contactNumber" value={formData.contactNumber} error={errors.contactNumber}
                maxLength={10}
                onChange={e => { const v = e.target.value.replace(/\D/g, ''); setFormData(p => ({ ...p, contactNumber: v })); setErrors(p => ({ ...p, contactNumber: '' })) }} />
            </Field>
            <Field label="Website" required error={errors.website}>
              <Input type="text" name="website" value={formData.website} error={errors.website}
                onChange={e => { const v = e.target.value; setFormData(p => ({ ...p, website: v })); setErrors(p => ({ ...p, website: !v.trim() ? 'Required' : !/^https?:\/\/[^\s]+$/.test(v.trim()) ? 'Must start with http(s)://' : '' })) }} />
            </Field>
            <Field label="Address" required error={errors.address}>
              <Input type="text" name="address" value={formData.address} error={errors.address} onChange={handleInputChange} />
            </Field>
            <Field label="City" required error={errors.city}>
              <Input type="text" name="city" value={formData.city} error={errors.city} onChange={handleInputChange}
                onKeyDown={e => { if (/[0-9]/.test(e.key)) e.preventDefault() }} />
            </Field>
            <Field label="Branch" required error={errors.branch}>
              <Input type="text" placeholder="e.g. Hyderabad Main" value={formData.branch || ''}
                error={errors.branch}
                onChange={e => { setFormData(p => ({ ...p, branch: e.target.value })); setErrors(p => ({ ...p, branch: !e.target.value ? 'Branch name is required' : '' })) }} />
            </Field>
            <Field label="Recommendation Status">
              <StyledSelect name="recommended" value={formData.recommended}
                onChange={e => setFormData(p => ({ ...p, recommended: e.target.value === 'true' }))}>
                <option value="true">Yes, Recommend</option>
                <option value="false">No, Don't Recommend</option>
              </StyledSelect>
            </Field>
          </FieldGrid>

          <Divider />

          {/* ══ SECTION 2: Operating Hours & Licensing ══ */}
          <SectionHeading title="Operating Hours & Licensing" />
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
            <Field label="License Number" required error={errors.licenseNumber}>
              <Input type="text" name="licenseNumber" value={formData.licenseNumber} error={errors.licenseNumber} onChange={handleInputChange} />
            </Field>
            <Field label="Issuing Authority" required error={errors.issuingAuthority}>
              <Input type="text" name="issuingAuthority" value={formData.issuingAuthority} error={errors.issuingAuthority}
                onChange={handleInputChange} onKeyDown={e => { if (/[0-9]/.test(e.key)) e.preventDefault() }} />
            </Field>
          </FieldGrid>

          <Divider />

          {/* ══ SECTION 3: Clinic Configuration ══ */}
          <SectionHeading title="Clinic Configuration" />
          <FieldGrid>
            <Field label="Clinic Type" required error={errors.clinicType}>
              <StyledSelect value={clinicTypeOption} error={errors.clinicType}
                onChange={e => { setClinicTypeOption(e.target.value); setErrors(p => ({ ...p, clinicType: '' })) }}>
                <option value="">Select Type</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="Private Limited">Private Limited</option>
              </StyledSelect>
            </Field>
            <Field label="Medicines Sold On-Site" required error={errors.medicinesSoldOnSite}>
              <StyledSelect value={selectedOption} error={errors.medicinesSoldOnSite}
                onChange={e => { setSelectedOption(e.target.value); setErrors(p => ({ ...p, medicinesSoldOnSite: '' })) }}>
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </StyledSelect>
            </Field>
            <Field label="Clinic Has a Valid Pharmacist" required error={errors.hasPharmacist}>
              <StyledSelect value={selectedPharmacistOption} error={errors.hasPharmacist}
                onChange={e => { setSelectedPharmacistOption(e.target.value); setErrors(p => ({ ...p, hasPharmacist: '' })) }}>
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </StyledSelect>
            </Field>
            <Field label="Subscription" required error={errors.subscription}>
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
                error={errors.consultationExpiration}
                placeholder="01–99"
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

          <Divider />

          {/* ══ SECTION 4: Location ══ */}
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
          </FieldGrid>

          <Divider />

          {/* ══ SECTION 5: Social Media ══ */}
          <SectionHeading title="Social Media Handles" />
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

          <Divider />

          {/* ══ SECTION 6: Documents ══ */}
          <SectionHeading title="Documents & Certificates" subtitle="Max 250 KB per file (PDF, DOC, JPEG, PNG, ZIP)" />

          <FieldGrid>
            <FileField label="Clinic Logo" name="hospitalLogo" accept=".jpeg,.jpg,.png"
              required error={errors.hospitalLogo} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.hospitalLogo} />
            <FileField label="Clinic Contract" name="hospitalContract"
              required error={errors.hospitalContract} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.clinicContract} />
            <FileField label="Clinic Documents" name="hospitalDocuments" accept=".pdf,.doc,.docx,.jpeg,.png,.zip"
              required error={errors.hospitalDocuments} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.hospitalDocuments} />
            <FileField label="Clinical Establishment Registration" name="clinicalEstablishmentCertificate"
              required error={errors.clinicalEstablishmentCertificate} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.clinicalEstablishmentCertificate} />
            <FileField label="Business Registration Certificate" name="businessRegistrationCertificate"
              required error={errors.businessRegistrationCertificate} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.businessRegistrationCertificate} />
            <FileField label="Biomedical Waste Management Auth" name="biomedicalWasteManagementAuth"
              tooltip="Issued by State Pollution Control Board (SPCB)"
              required error={errors.biomedicalWasteManagementAuth} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.biomedicalWasteManagementAuth} />
            <FileField label="Trade Licence / Shop & Establishment" name="tradeLicense"
              required error={errors.tradeLicense} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.tradeLicence} />
            <FileField label="Fire Safety Certificate" name="fireSafetyCertificate"
              required error={errors.fireSafetyCertificate} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.fireSafetyCertificate} />
            <FileField label="GST Registration Certificate" name="gstRegistrationCertificate"
              required error={errors.gstRegistrationCertificate} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.gstRegistrationCertificate} />
            <FileField label="Professional Indemnity Insurance" name="professionalIndemnityInsurance"
              required={false} error={errors.professionalIndemnityInsurance} formData={formData} setFormData={setFormData}
              setErrors={setErrors} inputRef={refs.professionalIndemnityInsurance} />
          </FieldGrid>

          {/* Drug licence — conditional */}
          {selectedOption === 'Yes' && (
            <>
              <SectionHeading title="Drug Licence Documents" />
              <FieldGrid>
                <FileField label="Drug Licence Certificate" name="drugLicenseCertificate"
                  required error={errors.drugLicenseCertificate} formData={formData} setFormData={setFormData}
                  setErrors={setErrors} inputRef={refs.drugLicenseCertificate} />
                <FileField label="Drug Licence Form Type 20/21" name="drugLicenseFormType"
                  required error={errors.drugLicenseFormType} formData={formData} setFormData={setFormData}
                  setErrors={setErrors} inputRef={refs.drugLicenseFormType} />
              </FieldGrid>
            </>
          )}

          {/* Pharmacist certificate — conditional */}
          {selectedPharmacistOption === 'Yes' && (
            <FieldGrid>
              <FileField label="Pharmacist Certificate" name="pharmacistCertificate"
                required error={errors.pharmacistCertificate} formData={formData} setFormData={setFormData}
                setErrors={setErrors} inputRef={refs.pharmacistCertificate} />
              <div /> {/* spacer */}
            </FieldGrid>
          )}

          {/* Others (multi-file) */}
          <div style={{ marginBottom: '16px' }}>
            <FieldLabel>Others (NABH / Aesthetic Training)</FieldLabel>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: t.radiusSm,
              border: `1px solid ${t.border}`, backgroundColor: '#fff',
              fontSize: '12px', fontWeight: '600', color: t.text, cursor: 'pointer',
            }}>
              📎 Choose Files (up to 6)
              <input type="file" name="others" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                style={{ display: 'none' }} onChange={e => handleAppendFiles(e, 'others', 6)} />
            </label>
            {Array.isArray(formData.others) && formData.others.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {formData.others.map((file, index) => (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: '20px',
                    backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc',
                    fontSize: '11px', color: '#0369a1',
                  }}>
                    <span>{file.name}</span>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, others: p.others.filter((_, i) => i !== index) }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.danger, padding: 0, fontWeight: '700', fontSize: '14px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <FieldError message={errors.others} />
          </div>

          <Divider />

          {/* ══ SECTION 7: NABH Score ══ */}
          <SectionHeading title="NABH Score" subtitle="Complete the questionnaire to generate your score" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {nabhScore !== null && (
              <div style={{
                padding: '6px 16px', borderRadius: '20px',
                backgroundColor: '#dcfce7', border: '1px solid #86efac',
                fontSize: '14px', fontWeight: '700', color: t.success,
              }}>
                Score: {nabhScore}
              </div>
            )}
            <Btn
              onClick={() => !nabhSubmitted && setShowNabhModal(true)}
              disabled={nabhSubmitted}
              variant={nabhSubmitted ? 'secondary' : 'primary'}
            >
              {nabhSubmitted ? '✓ Questionnaire Submitted' : 'Open NABH Questionnaire'}
            </Btn>
          </div>
          <FieldError message={errors.nabhScore} />

          <Divider />

          {/* ── Form action buttons ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
            <Btn variant="secondary" onClick={() => navigate('/clinic-management')}>Cancel</Btn>
            <Btn type="submit" disabled={isSubmitting} variant="success">
              {isSubmitting
                ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: '12px', height: '12px' }} />Saving...</>
                : 'Save Clinic'
              }
            </Btn>
          </div>
        </CForm>
      </div>

      {/* ══ NABH Modal ══ */}
      <CModal visible={showNabhModal} onClose={() => setShowNabhModal(false)} size="lg" backdrop="static">
        <CModalHeader style={{ borderBottom: `1px solid ${t.border}`, padding: '14px 20px' }}>
          <CModalTitle style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>
            NABH Questionnaire
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
          {nabhQuestions.map((question, index) => (
            <div key={index} style={{
              padding: '14px 16px', marginBottom: '10px',
              backgroundColor: t.surface, borderRadius: t.radiusSm,
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '10px' }}>
                {index + 1}. {question}
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', color: t.text, cursor: 'pointer' }}>
                  <input type="radio" name={`nabh-${index}`} style={{ accentColor: '#1B4F8A' }}
                    checked={nabhAnswers[index] === true}
                    onChange={() => { const u = [...nabhAnswers]; u[index] = true; setNabhAnswers(u) }} />
                  Yes
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', color: t.text, cursor: 'pointer' }}>
                  <input type="radio" name={`nabh-${index}`} style={{ accentColor: '#1B4F8A' }}
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