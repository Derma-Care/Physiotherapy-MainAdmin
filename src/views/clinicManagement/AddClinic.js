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
  MainAdmin_URL,
  ClinicAllData,
  getAllQuestions,
  postAllQuestionsAndAnswers,
} from '../../baseUrl'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import sendDermaCareOnboardingEmail from '../../Utils/Emailjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getClinicTimings } from './AddClinicAPI'
import { updateBranchData } from './AddBranchAPI'


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
  { id: 6, label: 'Permissions', icon: '🔒' },
]

/* ─── Per-tab validation ─── */
const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
const normalizeWebsite = (url) => !/^https?:\/\//i.test(url) ? 'https://' + url : url


// Subscription date helpers
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

const calculateSubscriptionDates = (subscriptionType) => {
  if (!subscriptionType) {
    return {
      startDate: '',
      endDate: '',
    }
  }

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)

  switch (subscriptionType) {
    case 'Monthly':
      endDate.setMonth(endDate.getMonth() + 1)
      break

    case 'Quarterly':
      endDate.setMonth(endDate.getMonth() + 3)
      break

    case 'Half Yearly':
      endDate.setMonth(endDate.getMonth() + 6)
      break

    case 'Yearly':
    case 'First Year':
      endDate.setFullYear(endDate.getFullYear() + 1)
      break

    case 'Second Year':
      endDate.setFullYear(endDate.getFullYear() + 2)
      break

    case 'Third Year':
      endDate.setFullYear(endDate.getFullYear() + 3)
      break

    case 'Fourth Year':
      endDate.setFullYear(endDate.getFullYear() + 4)
      break

    case 'Fifth Year':
      endDate.setFullYear(endDate.getFullYear() + 5)
      break

    default:
      return {
        startDate: '',
        endDate: '',
      }
  }

  // End date is one day before the next subscription period
  endDate.setDate(endDate.getDate() - 1)

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  }
}

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
    if (!formData.server) errs.server = 'Please select a server for this clinic'
  }
  if (tabId === 1) {
    if (!formData.openingTime) errs.openingTime = 'Opening time is required'
    if (!formData.closingTime) errs.closingTime = 'Closing time is required'
  }
  if (tabId === 2) {
    if (!formData.subscription?.trim()) errs.subscription = 'Subscription is required'
    if (!formData.consultationExpiration) errs.consultationExpiration = 'Consultation days are required'
    if (!formData.freeFollowUps && formData.freeFollowUps !== 0) errs.freeFollowUps = 'Free follow ups is required'
  }
  if (tabId === 3) {
    if (!formData.latitude) errs.latitude = 'Latitude is required'
    else { const lat = parseFloat(formData.latitude); if (isNaN(lat) || lat < -90 || lat > 90) errs.latitude = 'Must be between -90 and 90' }
    if (!formData.longitude) errs.longitude = 'Longitude is required'
    else { const lng = parseFloat(formData.longitude); if (isNaN(lng) || lng > 180 || lng < -180) errs.longitude = 'Must be between -180 and 180' }
    if (formData.location?.trim()) {
      try { new URL(formData.location) } catch { errs.location = 'Enter a valid URL' }
    }
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
  const [loadingPermissions, setLoadingPermissions] = useState(false)

  // Registered servers, loaded live from superadmin (see loadServers effect
  // below). Each entry is { serverId, serverName, serverUrl, status }.
  // formData.server stores the serverId (NOT the URL) - that's what
  // superadmin's /SuperAdmin/clinics/{serverId}/... proxy routes need.
  const [servers, setServers] = useState([])
  const [loadingServers, setLoadingServers] = useState(false)

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
    gstRegistrationCertificate: null, newFeatureInput: '', others: [], consultationExpiration: '',
    subscription: '',
    subscriptionDates: '',
    subscriptionStartDate: '',
    subscriptionEndDate: '',
    instagramHandle: '',
    twitterHandle: '',
    facebookHandle: '',
    // Which registered superadmin server (by serverId) this clinic belongs to.
    // Selecting one in Basic Info enables "Open" to launch that server's
    // application in a new tab, and is what create/update actually route through.
    server: '',
    latitude: '', longitude: '', walkthrough: '', location: '', branch: '', loyaltyPoints: '', nabhScore: null,
    permissions: {},
  })



  const [existingDoctors, setExistingDoctors] = useState([])

  // masterPermissions: the feature/action template for whichever plan is
  // currently relevant (the selected Subscription in add mode, or the clinic's
  // saved subscription in edit mode). This is what the Permissions tab renders
  // against — NOT a flat merge of every plan's features together.
  const [masterPermissions, setMasterPermissions] = useState({})

  // planPermissionsData: the full plan-keyed table loaded once from
  // getAllPermisssions, e.g. { Basic: { Appointments: ['read'], ... }, Pro: {...},
  // Elite: {...}, Enterprise: {...} } — the exact same shape FeatureManagement.jsx
  // saves. Everything else derives from this.
  const [planPermissionsData, setPlanPermissionsData] = useState({
    Basic: {}, Pro: {}, Elite: {}, Enterprise: {},
  })

  const getResponseData = (body) => body?.data?.data ?? body?.data ?? body

  // FIX: getAllPermisssions returns permissions keyed BY PLAN — the old version
  // of this helper (extractPermissions) required every top-level value to be an
  // array to be treated as "a permissions map." Plan buckets (Basic, Pro, etc.)
  // are objects, not arrays, so that check always failed and silently returned
  // {} — meaning no plan's permissions ever actually loaded, regardless of what
  // Subscription was selected. This just extracts the plan-keyed object as-is.
  const extractPlanPermissions = (response) => {
    const body = getResponseData(response)
    if (!body) return {}
    const record = Array.isArray(body) ? body[0] : body
    if (!record || typeof record !== 'object') return {}
    if (record.permissions && typeof record.permissions === 'object') return record.permissions
    return record
  }

  // Merges a plan's feature template with whatever's already been chosen —
  // every feature in the template appears, keeping the clinic's own selected
  // actions where present, otherwise starting unchecked ([]).
  const mergePermissionTemplates = (masterPermissions = {}, clinicPermissions = {}) => {
    const merged = {}
    const allFeatures = new Set([...Object.keys(masterPermissions), ...Object.keys(clinicPermissions)])
    allFeatures.forEach((feature) => {
      if (Object.prototype.hasOwnProperty.call(clinicPermissions, feature)) {
        merged[feature] = Array.isArray(clinicPermissions[feature]) ? [...clinicPermissions[feature]] : []
      } else {
        merged[feature] = []
      }
    })
    return merged
  }

  // FIX: strips out features with no actions checked. This is used ONLY when
  // building what actually gets written to the backend (create/update payload) —
  // never for what's rendered in the picker, so the picker still shows every
  // available feature in the plan's template to choose from, but the saved record
  // only reflects the permissions you actually gave, exactly like the Permissions tab.
  const sanitizePermissions = (perms) =>
    Object.fromEntries(
      Object.entries(perms || {}).filter(([, actions]) => Array.isArray(actions) && actions.length > 0),
    )

  // Load the full plan-keyed permissions table once (used in both add and edit
  // mode — we just pick a different bucket out of it depending on the mode).
  //
  // FIX: this was previously calling `${BASE_URL}/admin/getAllPermisssions` —
  // a different endpoint than the one FeatureManagement.jsx actually reads/writes
  // plan permissions through (`${MainAdmin_URL}/getAllPermisssions`). Whatever
  // features/actions were configured per-plan in Feature Management could
  // silently fail to load here. Now this calls the SAME endpoint, so picking
  // "Basic" while adding a clinic always shows exactly what's configured for
  // Basic in Feature Management.
  useEffect(() => {
    const loadPlanPermissions = async () => {
      try {
        setLoadingPermissions(true)
        const res = await axios.get(`${MainAdmin_URL}/SuperAdmin/getAllPermisssions`)
        const allPlans = extractPlanPermissions(res)
        setPlanPermissionsData({
          Basic: allPlans.Basic || {},
          Pro: allPlans.Pro || {},
          Elite: allPlans.Elite || {},
          Enterprise: allPlans.Enterprise || {},
        })
      } catch (err) {
        console.error('Failed to load plan permission templates', err)
      } finally {
        setLoadingPermissions(false)
      }
    }
    loadPlanPermissions()
  }, [])

  // Loads the real list of registered servers from superadmin, so the
  // "Onboard Server" dropdown always reflects whatever's actually in the
  // database — not a hardcoded URL list that has to be kept in sync by hand.
  // formData.server is set to the server's serverId (see the <select> below),
  // which is exactly what /SuperAdmin/clinics/{serverId}/... expects.
  useEffect(() => {
    const loadServers = async () => {
      try {
        setLoadingServers(true)
        const res = await axios.get(`${MainAdmin_URL}/SuperAdmin/getAllServers`)
        const list = res.data?.data || []
        setServers(list)
      } catch (err) {
        console.error('Failed to load server list', err)
        toast.error('Failed to load servers - clinic registration may not work until this is fixed', { position: 'top-right' })
      } finally {
        setLoadingServers(false)
      }
    }
    loadServers()
  }, [])

  // FIX: this is the actual link between "Subscription" (Configuration tab) and
  // "Permissions" (last tab) in ADD mode. Whenever the selected plan changes —
  // including the very first time it's set — pull that plan's feature/action
  // defaults out of planPermissionsData and load them in as this clinic's
  // starting permissions. Re-selecting a different plan resets the picker to
  // that plan's defaults, since a fresh clinic has no permissions of its own yet.
  useEffect(() => {
    if (mode === 'edit') return
    if (!formData.subscription) return
    const planTemplate = planPermissionsData[formData.subscription] || {}
    setMasterPermissions(planTemplate)
    setFormData(prev => ({
      ...prev,
      permissions: JSON.parse(JSON.stringify(planTemplate)),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.subscription, planPermissionsData, mode])

  // Same idea for EDIT mode: scope the template to the clinic's OWN saved
  // subscription plan, then merge in whatever permissions the clinic already
  // has saved (from initialData.permissions, already spread into formData below)
  // so nothing the clinic already has assigned gets lost.
  useEffect(() => {
    if (mode !== 'edit' || !initialData) return
    const plan = initialData.subscription || formData.subscription || ''
    const planTemplate = planPermissionsData[plan] || {}
    const clinicPermissions = initialData.permissions && typeof initialData.permissions === 'object'
      ? initialData.permissions
      : {}
    const merged = mergePermissionTemplates(planTemplate, clinicPermissions)
    setMasterPermissions(planTemplate)
    setFormData(prev => ({ ...prev, permissions: merged }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData, planPermissionsData])

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
      const { permissions: initialPermissions, ...initialRest } = initialData
      setFormData(prev => ({ ...prev, ...initialRest }))
      setClinicTypeOption(initialData.clinicType || '')
      setSelectedOption(initialData.medicinesSoldOnSite || '')
      setSelectedPharmacistOption(initialData.hasPharmacist || '')

      // Load NABH score if editing
      if (initialData.nabhScore !== null && initialData.nabhScore !== undefined) {
        setNabhScore(initialData.nabhScore)
        setNabhSubmitted(true)
      }

      // NOTE: permissions for edit mode are handled by the dedicated
      // plan-scoped effect above (keyed on initialData.subscription), not here.
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

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      const perms = { ...(prev.permissions || {}) }
      if (perms[feature] && perms[feature].length > 0) {
        perms[feature] = []
      } else {
        perms[feature] = ['create', 'read', 'update', 'delete']
      }
      return { ...prev, permissions: perms }
    })
  }

  const handleAddNewFeature = () => {
    const featureName = formData.newFeatureInput?.trim()
    if (!featureName) return

    setFormData(prev => {
      const perms = { ...(prev.permissions || {}) }
      if (!perms[featureName]) {
        perms[featureName] = [] // Add it with empty array (not enabled yet, or we can default to enabled)
      }
      return { ...prev, permissions: perms, newFeatureInput: '' }
    })
  }

  const handleDeleteFeature = (feature) => {
    setFormData(prev => {
      const perms = { ...(prev.permissions || {}) }
      delete perms[feature]
      return { ...prev, permissions: perms }
    })
  }

  const togglePermission = (feature, action) => {
    setFormData(prev => {
      const perms = { ...(prev.permissions || {}) }
      if (!perms[feature]) perms[feature] = []
      if (perms[feature].includes(action)) {
        perms[feature] = perms[feature].filter(a => a !== action)
      } else {
        perms[feature] = [...perms[feature], action]
      }
      return { ...prev, permissions: perms }
    })
  }

  const toggleAllActions = (feature) => {
    setFormData(prev => {
      const perms = { ...(prev.permissions || {}) }
      const availableActions = ['create', 'read', 'update', 'delete']
      if (perms[feature] && perms[feature].length === availableActions.length) {
        perms[feature] = []
      } else {
        perms[feature] = [...availableActions]
      }
      return { ...prev, permissions: perms }
    })
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

    // formData.server is a serverId (see the Onboard Server <select> below) —
    // this is a final safety net in case submit is somehow reached without it
    // (e.g. edit mode loading an old record saved before this field existed).
    if (!formData.server) {
      toast.error('Please select an Onboard Server on the Basic Info tab', { position: 'top-right' })
      setActiveTab(0)
      setErrors(prev => ({ ...prev, server: 'Please select a server for this clinic' }))
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

      // FIX: formData.permissions holds every feature from the SELECTED PLAN'S
      // template (many as empty placeholder arrays) so the picker UI has
      // something to show/check. Only the features that actually have actions
      // checked should be written to the backend — same rule the Permissions
      // tab uses on save.
      const finalPermissions = sanitizePermissions(formData.permissions || {})

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
        subscription: formData.subscription,
        subscriptionDates: formData.subscriptionDates,
        subscriptionStartDate: formData.subscriptionStartDate,
        subscriptionEndDate: formData.subscriptionEndDate,

        latitude: formData.latitude, longitude: formData.longitude, location: formData.location?.trim() ? formData.location.trim() : '',
        walkthrough: formData.walkthrough, loyaltyPoints: formData.loyaltyPoints, nabhScore: formData.nabhScore, branch: formData.branch,
        // FIX: only the permissions actually given, not every template placeholder.
        permissions: finalPermissions,
      }

      const isEdit = mode === 'edit' && !!currentId
      const serverId = formData.server

      // Routed through superadmin's proxy - it resolves serverId to the real
      // deployed server's URL and forwards this request to adminservice's
      // own /admin/CreateClinic or /admin/updateClinic there. We never call
      // the deployed clinic server directly from the browser.
      const response = isEdit
        ? await axios.put(`${MainAdmin_URL}/SuperAdmin/clinics/${serverId}/${currentId}`, clinicData)
        : await axios.post(`${MainAdmin_URL}/SuperAdmin/clinics/${serverId}/register`, clinicData)

      if (response.data.success) {
        // Clear NABH localStorage after successful save
        localStorage.removeItem('nabhScore')
        localStorage.removeItem('nabhSubmitted')

        // Update permissions if any were actually given
        if (Object.keys(finalPermissions).length > 0) {
          const clinicIdToUse = isEdit ? initialData.clinicId : response.data.data?.clinicId
          const branchIdToUse = isEdit ? initialData.branchId : response.data.data?.branchId
          if (clinicIdToUse && branchIdToUse) {
            try {
              await axios.put(`${BASE_URL}/admin/updatePermissions/${clinicIdToUse}/${branchIdToUse}`, { permissions: finalPermissions })
            } catch (err) {
              console.error('Failed to save permissions', err)
            }
          }
        }

        // NEW — explicitly push location/virtualClinicTour onto the auto-created branch record.
        // CreateClinic on the backend creates a branch alongside the clinic, but does not
        // appear to copy location/walkthrough into it — so we push it explicitly here.
        if (!isEdit && response.data.data?.branchId) {
          try {
            const branchId = response.data.data.branchId

            await updateBranchData(
              serverId,
              branchId,
              {
                location: clinicData.location,
                virtualClinicTour: clinicData.walkthrough,
              }
            )
          } catch (err) {
            console.error(
              'Failed to sync location to auto-created branch',
              err
            )
          }

          try {
            window.dispatchEvent(
              new Event('clinic:branches:refresh')
            )
          } catch (e) {
            /* ignore */
          }
        }
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
  const renderTab0 = () => {
    // The server currently selected, so "Open ↗" can resolve its real URL -
    // formData.server holds the serverId, not the URL.
    const selectedServer = servers.find(s => s.serverId === formData.server)

    return (
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
          {/* Onboard Server — populated live from superadmin's own registered
            server list (GET /SuperAdmin/getAllServers), not a hardcoded URL
            array. The <select> value is the server's serverId, which is what
            create/update actually route through below. "Open" resolves the
            selected server's real URL to launch its application in a new tab -
            done from a real button click (not the select's onChange) because
            most browsers' popup blockers treat window.open() called from a
            <select> change event as not "user-initiated enough" and silently
            block it. */}
          <Field label="Onboard Server" required error={errors.server}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <div style={{ flex: 1 }}>
                <StyledSelect
                  name="server"
                  value={formData.server || ''}
                  error={errors.server}
                  disabled={loadingServers}
                  onChange={(e) => {
                    const serverId = e.target.value
                    setFormData(p => ({ ...p, server: serverId }))
                    setErrors(p => ({ ...p, server: '' }))
                  }}
                >
                  <option value="">
                    {loadingServers ? 'Loading servers…' : 'Select Server'}
                  </option>
                  {servers.map((s) => (
                    <option key={s.serverId} value={s.serverId}>
                      {s.serverName} — {s.serverUrl}
                    </option>
                  ))}
                </StyledSelect>
                {!loadingServers && servers.length === 0 && (
                  <div style={{ fontSize: '11px', color: t.danger, marginTop: '5px' }}>
                    No servers registered yet — add one in Server Management first.
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={!selectedServer}
                onClick={() => {
                  if (selectedServer?.serverUrl) {
                    window.open(selectedServer.serverUrl, '_blank', 'noopener,noreferrer')
                  }
                }}
                style={{
                  padding: '0 16px',
                  borderRadius: t.radiusSm,
                  border: `1px solid ${t.border}`,
                  backgroundColor: selectedServer ? t.primary : '#f1f5f9',
                  color: selectedServer ? '#fff' : t.textMuted,
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: selectedServer ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap',
                }}
              >
                Open ↗
              </button>
            </div>
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
  }

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
        <Field label="Subscription" required error={errors.subscription}>
          <StyledSelect name="subscription" value={formData.subscription} error={errors.subscription} onChange={handleInputChange}>
            <option value="">Select Subscription</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Elite">Elite</option>
            <option value="Enterprise">Enterprise</option>
          </StyledSelect>
          {formData.subscription && (
            <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '5px' }}>
              The Permissions tab will load {formData.subscription}'s default features.
            </div>
          )}
        </Field>
        <Field label="Subscription Mode" error={errors.subscriptionDates}>
          <StyledSelect
            name="subscriptionDates"
            value={formData.subscriptionDates || ''}
            error={errors.subscriptionDates}
            onChange={(e) => {
              const subscriptionType = e.target.value

              const { startDate, endDate } =
                calculateSubscriptionDates(subscriptionType)

              setFormData(prev => ({
                ...prev,
                subscriptionDates: subscriptionType,
                subscriptionStartDate: startDate,
                subscriptionEndDate: endDate,
              }))

              setErrors(prev => ({
                ...prev,
                subscriptionDates: '',
              }))
            }}
          >
            <option value="">Select Subscription Period</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half Yearly">Half Yearly</option>
            <option value="Yearly">Yearly</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            <option value="Fifth Year">Fifth Year</option>
          </StyledSelect>

          {formData.subscriptionStartDate &&
            formData.subscriptionEndDate && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 10px',
                  borderRadius: t.radiusSm,
                  backgroundColor: '#f0f4ff',
                  border: `1px solid ${t.border}`,
                  fontSize: '12px',
                  color: t.primary,
                  fontWeight: '600',
                }}
              >
                📅 Start Date: {formData.subscriptionStartDate}
                <br />
                📅 End Date: {formData.subscriptionEndDate}
              </div>
            )}
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
        <Field label="Clinic Location URL" error={errors.location}>
          <Input
            type="url"
            placeholder="https://maps.google.com/..."
            name="location"
            value={formData.location || ''}
            error={errors.location}
            onChange={e => {
              const v = e.target.value
              setFormData(p => ({ ...p, location: v }))
              if (v.trim()) {
                try { new URL(v); setErrors(p => ({ ...p, location: '' })) }
                catch { setErrors(p => ({ ...p, location: 'Enter a valid URL' })) }
              } else {
                setErrors(p => ({ ...p, location: '' }))
              }
            }}
          />
        </Field>
        <Field label="💎 Loyalty Points (% per ₹100 Spent)">
          <Input type="number" min="0" name="loyaltyPoints" placeholder="e.g. 2.5% per ₹100 spent" value={formData.loyaltyPoints || ''}
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
        <FileField label="Offer at LOGO" name="businessRegistrationCertificate"
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

  const renderTab6 = () => {
    const mergedPermissions = mergePermissionTemplates(masterPermissions, formData.permissions || {})
    const backendFeatures = Object.keys(mergedPermissions)
    const hasPermissions = backendFeatures.length > 0
    const planLabel = mode === 'edit' ? (initialData?.subscription || formData.subscription) : formData.subscription

    return (
      <>
        <SectionHeading
          title="Clinic Permissions"
          subtitle={planLabel
            ? `Defaults loaded from the ${planLabel} plan — customize as needed`
            : 'Select a Subscription plan in Configuration to load its default permissions'}
        />

        {loadingPermissions ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span style={{ marginLeft: '10px', color: t.textMuted, fontSize: '14px' }}>Loading permissions...</span>
          </div>
        ) : (
          <div>
            {/* <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
              <Input
                type="text"
                placeholder="New Feature (e.g. Settings)"
                value={formData.newFeatureInput || ''}
                onChange={(e) => setFormData(p => ({ ...p, newFeatureInput: e.target.value }))}
                style={{ maxWidth: '260px' }}
              />
              <Btn variant="secondary" onClick={handleAddNewFeature}>+ Add</Btn>
            </div> */}

            {!hasPermissions ? (
              <div style={{ padding: '30px', textAlign: 'center', backgroundColor: t.surface, borderRadius: t.radiusSm, border: `1px dashed ${t.border}`, marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: t.textMuted }}>No permissions added yet</div>
                <div style={{ fontSize: '12px', color: t.textLight, marginTop: '4px' }}>
                  {planLabel
                    ? `The ${planLabel} plan has no default features configured — type a feature name above to add one.`
                    : 'Select a Subscription plan above, or type a feature name to add it to this clinic\'s permissions.'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                {backendFeatures.map(feature => {
                  const assignedActions = mergedPermissions[feature] || []
                  const featureAvailableActions = ['create', 'read', 'update', 'delete']
                  const actionsToRender = featureAvailableActions

                  const isFeatureChecked = assignedActions.length > 0
                  const allSelected = isFeatureChecked && assignedActions.length === actionsToRender.length
                  return (
                    <div key={feature} style={{ width: '48%', padding: '12px', border: `1px solid ${t.border}`, borderRadius: t.radiusSm, backgroundColor: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                          <input type="checkbox" checked={isFeatureChecked} onChange={() => handleFeatureToggle(feature)} style={{ accentColor: t.primary, width: '16px', height: '16px' }} />
                          {feature}
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {isFeatureChecked && (
                            <label style={{ fontSize: '12px', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                              <input type="checkbox" checked={allSelected} onChange={() => toggleAllActions(feature)} style={{ accentColor: t.primary }} />
                              Select All
                            </label>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteFeature(feature)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                            title="Remove Feature"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      {isFeatureChecked && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                          {actionsToRender.map(action => (
                            <label key={action} style={{ fontSize: '12px', color: t.text, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                              <input type="checkbox" checked={assignedActions.includes(action)} onChange={() => togglePermission(feature, action)} style={{ accentColor: t.primary }} />
                              <span style={{ textTransform: 'capitalize' }}>{action}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </>
    )
  }

  const tabContent = [renderTab0, renderTab1, renderTab2, renderTab3, renderTab4, renderTab5, renderTab6]
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