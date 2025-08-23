import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormFeedback,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CTooltip,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { BASE_URL, subService_URL, getService, ClinicAllData, getAllQuestions, postAllQuestionsAndAnswers } from '../../baseUrl'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import Select from 'react-select'
import sendDermaCareOnboardingEmail from '../../Utils/Emailjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FileInputWithRemove from './FileInputWithRemove'
import { getClinicTimings } from './AddClinicAPI'
// 🛠️ Add this array at the top of your component
// const nabhQuestions = [
//   "Are patient rights displayed prominently in the clinic?",
//   "Is informed consent taken for all procedures?",
//   "Is there a documented infection control policy?",
//   "Are hand hygiene practices followed by staff?",
//   "Is biomedical waste segregated and disposed of properly?",
//   "Are emergency exits clearly marked and accessible?",
//   "Is fire safety training conducted for staff?",
//   "Are patient records maintained and kept confidential?",
//   "Is staff trained in CPR and Basic Life Support?",
//   "Is there a system for handling patient complaints?",
//   "Are medicines stored as per guidelines with temperature monitoring?",
//   "Is there a valid pharmacist present in the clinic?",
//   "Are all medical equipment calibrated and maintained?",
//   "Are staff health checks done periodically?",
//   "Is there a documented disaster management plan?",
//   "Are safety drills conducted regularly?",
//   "Is there a system for continuous quality improvement (CQI)?",
//   "Are internal audits carried out and documented?",
//   "Are patients informed about estimated treatment costs?",
//   "Is data backup done regularly for patient records?",
// ];

const AddClinic = ({ mode = 'add', initialData = {}, onSubmit }) => {
  const navigate = useNavigate()
  const savedQuestionId = localStorage.getItem("savedQuestionId"); 

  const [errors, setErrors] = useState({})
  const [backendErrors, setBackendErrors] = ''
  const [categories, setCategories] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedPharmacistOption, setSelectedPharmacistOption] = useState('')
  const [clinicTypeOption, setClinicTypeOption] = useState('')
  const [subscription, setSubscription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timings, setTimings] = useState([])
  const [loadingTimings, setLoadingTimings] = useState(false)
const [nabhQuestions, setNabhQuestions] = useState([]);
const [nabhAnswers, setNabhAnswers] = useState([]);
const [showNabhModal, setShowNabhModal] = useState(false);
const [nabhScore, setNabhScore] = useState(null);
const [nabhSubmitted, setNabhSubmitted]=useState(false);
  // const [initialData,setInitialData ]=useState()
  const fileInputRefs = {
    others: useRef(null),
    hospitalDocuments: useRef(null),
    hospitalContract: useRef(null),
    clinicalEstablishmentCertificate: useRef(null),
    businessRegistrationCertificate: useRef(null),
    tradeLicense: useRef(null),
    fireSafetyCertificate: useRef(null),
    gstRegistrationCertificate: useRef(null),
    // ...add others if needed
  }

  // setSelectedPharmacistOption
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    contactNumber: '',
    // hospitalRegistrations: '',
    openingTime: '',
    closingTime: '',
    hospitalLogo: null,
    emailAddress: '',
    website: '',
    licenseNumber: '',
    issuingAuthority: '',
    recommended: false,
    hospitalDocuments: null,
    // hospitalcategory: [],
    hospitalContract: null,
    freeFollowUps:'',
    clinicalEstablishmentCertificate: null,
    businessRegistrationCertificate: null,
    clinicType: '',
    medicinesSoldOnSite: '',
    drugLicenseCertificate: null,
    drugLicenseFormType: null,
    hasPharmacist: '',
    pharmacistCertificate: null,
    biomedicalWasteManagementAuth: null,
    tradeLicense: null,
    fireSafetyCertificate: null,
    professionalIndemnityInsurance: null,
    gstRegistrationCertificate: null,
    others: [],
    consultationExpiration: '',
    subscription: '',
    instagramHandle: '',
    twitterHandle: '',
    facebookHandle: '',
    latitude: "",
  longitude: "",
  walkthrough: "",
  branch: "",
  nabhScore:nabhScore,

  })
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
      setClinicTypeOption(initialData.clinicType)
      setSelectedOption(initialData.medicinesSoldOnSite)
      setSelectedPharmacistOption(initialData.hasPharmacist)
    }
  }, [initialData, mode])
  //get timings
  useEffect(() => {
    const fetchTimings = async () => {
      setLoadingTimings(true)
      const result = await getClinicTimings()
      if (result.success) {
        setTimings(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch clinic timings')
      }
      setLoadingTimings(false)
    }

    fetchTimings()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryData()

        if (response?.data) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const preventNumberInput = (e) => {
    const isNumber = /[0-9]/.test(e.key)
    if (isNumber) {
      e.preventDefault()
    }

  }
  const handleWebsiteBlur = () => {
    const website = formData.website.trim()

    if (!website) {
      setErrors((prev) => ({ ...prev, website: 'Website is required' }))
    } else if (!/^https?:\/\//i.test(website)) {
      setErrors((prev) => ({
        ...prev,
        website: 'Website must start with http:// or https://',
      }))
    } else if (!websiteRegex.test(website)) {
      setErrors((prev) => ({
        ...prev,
        website: 'Enter a valid website URL',
      }))
    } else {
      setErrors((prev) => ({ ...prev, website: '' }))
    }
  }
 
  const websiteRegex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/


  const validateForm = () => {
    const newErrors = {}

    // Hospital Name
    if (!formData.name?.trim()) {
      newErrors.name = 'Clinic name is required'
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
      newErrors.name = 'Clinic name must contain only letters'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    // City validation
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required'
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.city)) {
      newErrors.city = 'City name must contain only letters'
    }
    // Email validation-
    if (!formData.emailAddress?.trim()) {
      newErrors.emailAddress = 'Email is required'
    } else if (!emailRegex.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = 'Email must contain "@" and "." in a valid format'
    }
    // Contact Number
    const phoneRegex = /^[5-9][0-9]{9}$/ // This regex checks if the number starts with 5-9 and is followed by 9 digits

    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = 'Contact number is required'
    } else {
      const contactNumber = formData.contactNumber.trim()
      if (contactNumber.length !== 10) {
        newErrors.contactNumber = 'Contact number must be exactly 10 digits long'
      } else if (!phoneRegex.test(contactNumber)) {
        newErrors.contactNumber = 'Contact number must start with a digit between 5 and 9'
      }
    }

    // Time validation
    // Time validation
    if (!formData.openingTime) {
      newErrors.openingTime = 'Opening time is required'
    }

    if (!formData.closingTime) {
      newErrors.closingTime = 'Closing time is required'
    } else if (formData.openingTime && formData.closingTime) {
      const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(' ')
        let [hours, minutes] = time.split(':').map(Number)

        if (modifier === 'PM' && hours !== 12) {
          hours += 12
        } else if (modifier === 'AM' && hours === 12) {
          hours = 0
        }

        return new Date(0, 0, 0, hours, minutes)
      }

      const openingDate = parseTime(formData.openingTime)
      const closingDate = parseTime(formData.closingTime)

      if (closingDate <= openingDate) {
        newErrors.closingTime = 'Closing time must be after opening time'
      }
    }

    //consultation Expiration
    if (!formData.consultationExpiration) {
      newErrors.consultationExpiration = 'Consultation days are required'
    } else if (isNaN(formData.consultationExpiration) || formData.consultationExpiration <= 0) {
      newErrors.consultationExpiration = 'Enter a valid number greater than 0'
    }

    // License Number
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required'
    }

    // Issuing Authority
    if (!formData.issuingAuthority.trim()) {
      newErrors.issuingAuthority = 'Issuing Authority is required'
    }

    // Hospital Logo
    if (!formData.hospitalLogo) {
      newErrors.hospitalLogo = 'Hospital logo is required'
    }

    // Hospital Documents
    if (!formData.hospitalDocuments) {
      newErrors.hospitalDocuments = 'Please upload the document'
    }
    if (!formData.hospitalContract) {
      newErrors.hospitalContract = 'Please upload the document'
    }
    if (!formData.clinicalEstablishmentCertificate) {
      newErrors.clinicalEstablishmentCertificate = 'Please upload at least one document'
    }
    if (!formData.businessRegistrationCertificate) {
      newErrors.businessRegistrationCertificate = 'Please upload at least one document'
    }
    if (!formData.drugLicenseCertificate && selectedOption === 'Yes') {
      newErrors.drugLicenseCertificate = 'Please upload at least one document'
    }
    if (!formData.drugLicenseFormType && selectedOption === 'Yes') {
      newErrors.drugLicenseFormType = 'Please upload at least one document'
    }
    if (
      selectedOption === 'Yes' &&
      selectedPharmacistOption === 'Yes' &&
      !formData.pharmacistCertificate
    ) {
      newErrors.pharmacistCertificate = 'Please upload at least one document'
    }

    if (!formData.biomedicalWasteManagementAuth) {
      newErrors.biomedicalWasteManagementAuth = 'Please upload at least one document'
    }
    if (!formData.tradeLicense) {
      newErrors.tradeLicense = 'Please upload at least one document'
    }
    if (!formData.fireSafetyCertificate) {
      newErrors.fireSafetyCertificate = 'Please upload at least one document'
    }
    if (!formData.professionalIndemnityInsurance) {
      newErrors.professionalIndemnityInsurance = 'Please upload at least one document'
    }
    if (!formData.gstRegistrationCertificate) {
      newErrors.gstRegistrationCertificate = 'Please upload at least one document'
    }

    if (!clinicTypeOption || clinicTypeOption.trim() === '') {
      newErrors.clinicType = 'Please select a clinic Type.'
    }
    if (!selectedOption || selectedOption.trim() === '') {
      newErrors.medicinesSoldOnSite = 'Please select  atleast one option'
    }
    if (!selectedPharmacistOption || selectedPharmacistOption.trim() === '') {
      newErrors.hasPharmacist = 'Please select whether clinic has a valid pharmacist.'
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Website is required.'
    } else if (!websiteRegex.test(normalizeWebsite(formData.website.trim()))) {
      newErrors.website = 'Website must start with http:// or https:// and be a valid URL'
    }
    if (!formData.subscription || formData.subscription.trim() === '') {
      newErrors.subscription = 'Please select a subscription type'
    }
// Latitude validation
// Latitude
if (!formData.latitude) {
  newErrors.latitude = "Latitude is required";
} else {
  const lat = parseFloat(formData.latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    newErrors.latitude = "Latitude must be between -90 and 90";
  } else {
    delete newErrors.latitude; // ✅ clear error if valid
  }
}

// Longitude
if (!formData.longitude) {
  newErrors.longitude = "Longitude is required";
} else {
  const lng = parseFloat(formData.longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    newErrors.longitude = "Longitude must be between -180 and 180";
  } else {
    delete newErrors.longitude; // ✅ clear error if valid
  }
}



  if (!formData.walkthrough?.trim()) {
    newErrors.walkthrough = "Walkthrough URL is required"
  }

  if (!formData.branch?.trim()) {
    newErrors.branch = "Branch name is required"
  }

  if (!formData.freeFollowUps) {
    newErrors.freeFollowUps = "Free Follow Ups is required"
  } else if (isNaN(formData.freeFollowUps) || formData.freeFollowUps < 1) {
    newErrors.freeFollowUps = "Free Follow Ups must be a positive number"
  }
    // No `else { newErrors.website = '' }`

    console.log('Validation errors:', newErrors)

    // validate fields and set errors
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill all required fields', { position: 'top-right' })
      return false // stop form submit
    }

    return true // all good
  }

  const downloadFile = (base64, filename, mime = 'application/pdf') => {
    const link = document.createElement('a')
    link.href = `data:${mime};base64,${base64}`
    link.download = filename
    link.click()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear the error once the field is updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  const handleFileChange = async (e) => {
    const { name, files } = e.target
    const file = files[0]

    if (!file) return

    // Save the file object for displaying name in UI
    setFormData((prev) => ({
      ...prev,
      [name]: file, // keep original file for UI
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))

    const stripBase64Prefix = (base64) => base64.split(',')[1]

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }

    try {
      const base64File = await convertToBase64(file)
      const cleanBase64 = stripBase64Prefix(base64File)

      // Save base64 under a different key for submission
      setFormData((prev) => ({
        ...prev,
        [`${name}Base64`]: cleanBase64,
      }))
    } catch (error) {
      console.error('File conversion error:', error)
      setErrors((prev) => ({
        ...prev,
        [name]: 'File conversion failed',
      }))
    }
  }

  const handleEmailBlur = () => {
    const email = formData.emailAddress.trim()
    if (!email.includes('@')) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailAddress: 'Email must contain "@" symbol',
      }))
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailAddress: '',
      }))
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Remove error while typing
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }
  const normalizeWebsite = (url) => {
    // If starts with www. or does not have protocol, prepend https://
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url
    }
    return url
  }
  console.log('submit button clicked')

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(new Error('Invalid file type'))
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(new Error('Invalid file type'))
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1]) // remove prefix
      reader.onerror = (error) => reject(error)
    })
  }
  const [existingDoctors, setExistingDoctors] = useState([])
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${ClinicAllData}`)
        const clinicList = Array.isArray(response.data) // your actual API
        // const data = await response.json()
        console.log('Fetched doctor data:', response.data) // <-- CHECK THIS STRUCTURE
        setExistingDoctors(response.data.data)
      } catch (err) {
        console.error('Failed to load existing doctor data', err)
      }
    }

    fetchDoctors()
  }, [])
  useEffect(() => {
    const storedConsultation = localStorage.getItem('consultationExpiration')
    if (storedConsultation) {
      const onlyNumber = storedConsultation.replace(/\D/g, '')
      setFormData((prev) => ({
        ...prev,
        consultationExpiration: onlyNumber,
      }))
    }
  }, [])

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${getAllQuestions}`, {
        params: { id: savedQuestionId }
      });

      console.log("Fetched data:", response.data);

      if (response.data.success && response.data.data) {
        const qaList = response.data.data.questionsAndAnswers || [];

        // Extract questions
        setNabhQuestions(qaList.map((item) => item.question));

        // Extract existing answers (boolean values)
        setNabhAnswers(qaList.map((item) => item.answer));
      }
    } catch (err) {
      console.error("Error fetching NABH questions:", err);
    }
  };

  fetchQuestions();
}, [savedQuestionId]);



const handleNabhSubmit = async () => {
  try {
    const payload = {
      questionsAndAnswers: nabhQuestions.map((q, index) => ({
        question: q,
        answer: nabhAnswers[index] === true,
      })),
    };

    const response = await axios.post(
      `${BASE_URL}/${postAllQuestionsAndAnswers}`,
      payload
    );

    if (response.data.success) {
      const score = response.data.data?.score ?? 0;

      setNabhScore(score);       
      setFormData(prev => ({    
        ...prev,
        nabhScore: score,
      }));
      setNabhSubmitted(true);   
      setShowNabhModal(false);
    }
  } catch (error) {
    console.error("Error saving NABH answers:", error);
  }
};


  // ✅ Save to localStorage for frontend-only preview/debug
  const formattedConsultationDays = `${formData.consultationExpiration} days`
  const previewData = {
    ...formData,
    consultationExpiration: formattedConsultationDays,
  }
  localStorage.setItem('clinicFormPreview', JSON.stringify(previewData))
  console.log('👁️ Clinic Form Preview (Frontend only):', previewData)

  const previewFromLocalStorage = JSON.parse(localStorage.getItem('clinicFormPreview'))
  console.log('📦 Loaded from localStorage for preview:', previewFromLocalStorage)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const isValid = validateForm()
    if (!isValid) {
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true) // ⬅️ Start loading

    const { emailAddress, contactNumber } = formData

    // Check for duplicate email and mobile
    const safeExistingDoctors = Array.isArray(existingDoctors) ? existingDoctors : []

    console.log(emailAddress)
    console.log(contactNumber)

    const isEmailDuplicate = safeExistingDoctors.some(
      (doc) => doc.emailAddress?.toLowerCase() === emailAddress,
    )
    const isMobileDuplicate = safeExistingDoctors.some((doc) => doc.contactNumber === contactNumber)

    if (isEmailDuplicate || isMobileDuplicate) {
      setIsSubmitting(false)
      const newErrors = {}
      if (isEmailDuplicate) {
        toast.error('Email already exists')
        newErrors.emailAddress = 'Email already exists'
      }
      if (isMobileDuplicate) newErrors.contactNumber = 'Mobile number already exists'
      toast.error('Mobile number already exists')
      setErrors((prev) => ({ ...prev, ...newErrors }))
      return
    }
    // ✅ Save to localStorage as "4 days"
    // ✅ Save clinic formData to localStorage for preview
    const formattedConsultationDays = `${formData.consultationExpiration} days`
    const previewData = {
      ...formData,
      consultationExpiration: formattedConsultationDays,
    }
    localStorage.setItem('clinicFormPreview', JSON.stringify(previewData))
    console.log('👁️ Clinic Form Preview (Frontend only):', previewData)

    const previewFromLocalStorage = JSON.parse(localStorage.getItem('clinicFormPreview'))
    console.log('📦 Loaded from localStorage for preview:', previewFromLocalStorage)

    try {
      const convertIfExists = async (file) => (file ? await convertFileToBase64(file) : '')
      const convertMultipleIfExists = async (files) =>
        Array.isArray(files) ? await Promise.all(files.map(convertFileToBase64)) : []

      // Usage
      const hospitalLogoBase64 = await convertIfExists(formData.hospitalLogo)

      const hospitalDocumentsBase64 = await convertIfExists(formData.hospitalDocuments)

      // Then check the result of that conversion
      // if (hospitalDocumentsBase64.some((doc) => typeof doc !== 'string' || !doc.length)) {
      //   toast.error('One or more hospital documents failed to convert to base64.', {
      //     position: 'top-right',
      //   })
      //   return
      // }

      const hospitalContractBase64 = await convertIfExists(formData.hospitalContract)
      const clinicalEstablishmentCertificateBase64 = await convertIfExists(
        formData.clinicalEstablishmentCertificate,
      )
      const businessRegistrationCertificateBase64 = await convertIfExists(
        formData.businessRegistrationCertificate,
      )
      const drugLicenseCertificateBase64 = await convertIfExists(formData.drugLicenseCertificate)
      const drugLicenseFormTypeBase64 = await convertIfExists(formData.drugLicenseFormType)
      const pharmacistCertificateBase64 = await convertIfExists(formData.pharmacistCertificate)
      const biomedicalWasteManagementAuthBase64 = await convertIfExists(
        formData.biomedicalWasteManagementAuth,
      )
      const tradeLicenseBase64 = await convertIfExists(formData.tradeLicense)
      const fireSafetyCertificateBase64 = await convertIfExists(formData.fireSafetyCertificate)
      const professionalIndemnityInsuranceBase64 = await convertIfExists(
        formData.professionalIndemnityInsurance,
      )
      const gstRegistrationCertificateBase64 = await convertIfExists(
        formData.gstRegistrationCertificate,
      )
      // If `others` is an array
      const othersBase64 =
        formData.others && formData.others.length > 0
          ? await convertMultipleIfExists(formData.others)
          : ''

      const formatToAMPM = (time24) => {
        const [hourStr, minuteStr] = time24.split(':')
        let hour = parseInt(hourStr, 10)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        hour = hour % 12 || 12
        return `${hour.toString().padStart(2, '0')}:${minuteStr} ${ampm}`
      }

      const clinicData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        contactNumber: formData.contactNumber,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        hospitalLogo: hospitalLogoBase64,
        emailAddress: formData.emailAddress,
        website: normalizeWebsite(formData.website.trim()),
        licenseNumber: formData.licenseNumber,
        issuingAuthority: formData.issuingAuthority,
        hospitalDocuments: hospitalDocumentsBase64,
        contractorDocuments: hospitalContractBase64,
        clinicalEstablishmentCertificate: clinicalEstablishmentCertificateBase64,
        businessRegistrationCertificate: businessRegistrationCertificateBase64,
        clinicType: clinicTypeOption,
        medicinesSoldOnSite: selectedOption,
        drugLicenseCertificate: drugLicenseCertificateBase64,
        drugLicenseFormType: drugLicenseFormTypeBase64,
        hasPharmacist: selectedPharmacistOption,
        pharmacistCertificate: pharmacistCertificateBase64,
        biomedicalWasteManagementAuth: biomedicalWasteManagementAuthBase64,
        tradeLicense: tradeLicenseBase64,
        fireSafetyCertificate: fireSafetyCertificateBase64,
        professionalIndemnityInsurance: professionalIndemnityInsuranceBase64,
        gstRegistrationCertificate: gstRegistrationCertificateBase64,
        others: othersBase64,
        freeFollowUps:formData.freeFollowUps,
        instagramHandle: formData.instagramHandle,
        twitterHandle: formData.twitterHandle,
        facebookHandle: formData.facebookHandle,
        recommended: !!formData.recommended,
        consultationExpiration: formData.consultationExpiration
          ? `${formData.consultationExpiration} days`
          : '',
        subscription: formData.subscription,
        latitude:formData.latitude,
        longitude:formData.longitude,
        walkthrough:formData.walkthrough,
        nabhScore: formData.nabhScore,
        branch:formData.branch,
      }

      // API Submission
      const response = await axios.post(`${BASE_URL}/admin/CreateClinic`, clinicData)
      const savedClinicData = response.data
      console.log(response)
      console.log(response.message)
      console.log(savedClinicData.message)
      if (savedClinicData.success) {
        toast.success(savedClinicData.message || 'Clinic Added Successfully', {
          position: 'top-right',
        })
        setIsSubmitting(false) // ⬅️ Start loading

        sendDermaCareOnboardingEmail({
          name: formData.name,
          email: formData.emailAddress,
          password: savedClinicData.data.clinicTemporaryPassword,
          userID: savedClinicData.data.clinicUsername,
        })

        navigate('/clinic-management', {
          state: {
            refresh: true,
            newClinic: savedClinicData,
          },
        })
      } else {
        toast.error(savedClinicData.message || 'Something went wrong', { position: 'top-right' })
      }
    } catch (error) {
      console.error('Error submitting clinic data:', error)
      toast.error(error.message || 'Something went wrong', { position: 'top-right' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <CCard>
        <CCardHeader>
          <h3 className="mb-0">Add New Clinic</h3>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Clinic Name
                  <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
  type="text"
  name="name"
  value={formData.name || ""}
  onChange={(e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));  // <-- save the value

    // validate dynamically
    const error =
      !value.trim()
        ? "Clinic name is required"
        : !/^[a-zA-Z\s]{2,50}$/.test(value)
        ? "Clinic name must contain only letters (2–50 chars)"
        : "";

    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  }}
  onKeyDown={preventNumberInput}
  invalid={!!errors.name}
/>
{errors.name && <CFormFeedback invalid>{errors.name}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Email Address<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress || ""}
                  onChange={(e)=>{
                    const {name, value}=e.target;
                    setFormData((prev)=>({...prev, [name]:value}))
                    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    let error="";
                    if(!value.trim){
                      error="Email is required"
                    }else if(!emailRegex.test(value.trim())){
                      error='Email must contain "@" and "." in a valid format';
                    }
                    setErrors((prev)=>({...prev, [name]:error || undefined}));
                  }}
                  invalid={!!errors.emailAddress}
                  // feedbackInvalid={errors.emailAddress}
                />

                {errors.emailAddress && (
                  <CFormFeedback invalid>{errors.emailAddress}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Contact Number<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  maxLength="10"
                  invalid={!!errors.contactNumber}
                />
                {errors.contactNumber && (
                  <CFormFeedback invalid>{errors.contactNumber}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Website<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  onBlur={handleWebsiteBlur}
                  invalid={!!errors.website}
                />
                {errors.website && (
                  <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.website}</div>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>
                    Opening Time<span style={{ color: 'red' }}>*</span>
                  </CFormLabel>
                  <CFormSelect
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleInputChange}
                    invalid={!!errors.openingTime}
                    disabled={loadingTimings}
                  >
                    <option value="">Select Opening Time</option>
                    {timings.map((slot, idx) => (
                      <option key={idx} value={slot.openingTime}>
                        {slot.openingTime}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.openingTime && (
                    <CFormFeedback invalid>{errors.openingTime}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel>
                    Closing Time<span style={{ color: 'red' }}>*</span>
                  </CFormLabel>
                  <CFormSelect
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleInputChange}
                    invalid={!!errors.closingTime}
                    disabled={loadingTimings}
                  >
                    <option value="">Select Closing Time</option>
                    
                    {timings.map((slot, idx) => (
                      <option key={idx} value={slot.closingTime}>
                        {slot.closingTime}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.closingTime && (
                    <CFormFeedback invalid>{errors.closingTime}</CFormFeedback>
                  )}
                </CCol>
              </CRow>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormLabel>
                  License Number<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  invalid={!!errors.licenseNumber}
                />
                {errors.licenseNumber && (
                  <CFormFeedback invalid>{errors.licenseNumber}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Issuing Authority<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={handleInputChange}
                  onKeyDown={preventNumberInput}
                  invalid={!!errors.issuingAuthority}
                />
                {errors.issuingAuthority && (
                  <CFormFeedback invalid>{errors.issuingAuthority}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Address<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  invalid={!!errors.address}
                />
                {errors.address && <CFormFeedback invalid>{errors.address}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Recommendation Status
                  {/* <span className="text-danger">*</span> */}
                </CFormLabel>
                <CFormSelect
                  name="recommended"
                  value={formData.recommended}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recommended: e.target.value === 'true',
                    }))
                  }
                >
                  <option value="true">Yes, Recommend</option>
                  <option value="false">No, Don't Recommend</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  City<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onKeyDown={preventNumberInput}
                  invalid={!!errors.city}
                />
                {errors.city && <CFormFeedback invalid>{errors.city}</CFormFeedback>}
              </CCol>

              <CCol md={6}>
                <CTooltip content="Issued by Local Fire Department">
                  <CFormLabel>
                    Hospital Contract<span style={{ color: 'red' }}>*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  name="hospitalContract"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      hospitalContract: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        hospitalContract: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.hospitalContract}
                />
                {errors.hospitalContract && (
                  <CFormFeedback invalid>{errors.hospitalContract}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Hospital Logo<span className="text-danger">*</span>
                </CFormLabel>
                <FileInputWithRemove
                  name="hospitalLogo"
                  file={formData.hospitalLogo}
                  error={errors.hospitalLogo}
                  onChange={(e) => setFormData({ ...formData, hospitalLogo: e.target.files[0] })}
                  onRemove={(name) => {
                    setFormData((prev) => ({ ...prev, [name]: '' })) // OR null
                    setErrors((prev) => ({ ...prev, [name]: '' }))
                  }}
                  accept="image/*"
                  invalid={!!errors.hospitalLogo}
                />
              </CCol>
              <CCol md={6}>
                <CTooltip content="Issued by Local Fire Department">
                  <CFormLabel>
                    Hospital Documents<span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  name="hospitalDocuments"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      hospitalDocuments: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        hospitalDocuments: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.hospitalDocuments}
                />
                {errors.hospitalDocuments && (
                  <CFormFeedback invalid>{errors.hospitalDocuments}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6} className="mb-2">
                <CTooltip content="Issued by Registrar of Companies or local municipal body">
                  <CFormLabel>
                    Clinical Establishment Registration Certificate
                    <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  name="clinicalEstablishmentCertificate"
                  id="clinicalReg"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      clinicalEstablishmentCertificate: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        clinicalEstablishmentCertificate: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.clinicalEstablishmentCertificate}
                />
                {errors.clinicalEstablishmentCertificate && (
                  <CFormFeedback invalid>{errors.clinicalEstablishmentCertificate}</CFormFeedback>
                )}
              </CCol>

              <CCol md={6}>
                <CTooltip content="Issued by Registrar of Companies or local municipal body">
                  <CFormLabel>
                    Business Registration Certificate <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="businessReg"
                  name="businessRegistrationCertificate"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      businessRegistrationCertificate: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        businessRegistrationCertificate: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.businessRegistrationCertificate}
                />
                {errors.businessRegistrationCertificate && (
                  <CFormFeedback invalid>{errors.businessRegistrationCertificate}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Clinic Type <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  className="form-select"
                  value={clinicTypeOption}
                  onChange={(e) => {
                    setClinicTypeOption(e.target.value)
                    setErrors((prev) => ({ ...prev, clinicType: '' })) // clear error on change
                  }}
                  invalid={!!errors.clinicType} // this is critical!
                >
                  <option value="">Select Type</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">LLP</option>
                  <option value="Private Limited">Private Limited</option>
                </CFormSelect>

                {errors.clinicType && <CFormFeedback invalid>{errors.clinicType}</CFormFeedback>}
              </CCol>

              <CCol>
                <CTooltip content="Issued by Insurance Companies">
                  <CFormLabel>
                    Professional Indemnity Insurance
                    <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="indemnity"
                  name="professionalIndemnityInsurance"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      professionalIndemnityInsurance: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        professionalIndemnityInsurance: '',
                      }))
                    }
                  }}
                  multiple
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.professionalIndemnityInsurance}
                />

                {errors.professionalIndemnityInsurance && (
                  <CFormFeedback invalid>{errors.professionalIndemnityInsurance}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Medicines sold on-site
                  <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  className="form-select"
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value)
                    setErrors((prev) => ({ ...prev, medicinesSoldOnSite: '' })) // clear error on change
                  }}
                  invalid={!!errors.medicinesSoldOnSite}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </CFormSelect>
                {errors.medicinesSoldOnSite && (
                  <CFormFeedback invalid>{errors.medicinesSoldOnSite}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CTooltip content="Issued by State Pollution Control Board (SPCB)">
                  <CFormLabel>
                    Biomedical Waste Management Authorization
                    <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="biomedicalWaste"
                  name="biomedicalWasteManagementAuth"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      biomedicalWasteManagementAuth: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        biomedicalWasteManagementAuth: '',
                      }))
                    }
                  }}
                  // multiple
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.biomedicalWasteManagementAuth}
                />
                {errors.biomedicalWasteManagementAuth && (
                  <CFormFeedback invalid>{errors.biomedicalWasteManagementAuth}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            {selectedOption === 'Yes' && (
              <CRow className="mb-3">
                <CCol md={6}>
                  <CTooltip content="Issued by State Drug Control Department">
                    <CFormLabel>Drug License Certificate</CFormLabel>
                  </CTooltip>
                  <CFormInput
                    type="file"
                    id="drugLicenseCertificate"
                    name="drugLicenseCertificate"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setFormData((prev) => ({
                        ...prev,
                        drugLicenseCertificate: file,
                      }))
                      if (file) {
                        setErrors((prev) => ({
                          ...prev,
                          drugLicenseCertificate: '',
                        }))
                      }
                    }}
                    invalid={!!errors.drugLicenseCertificate}
                  />
                  {errors.drugLicenseCertificate && (
                    <CFormFeedback invalid>{errors.drugLicenseCertificate}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CTooltip content="Issued by State Drug Control Department">
                    <CFormLabel>DrugLicenseFormType 20/21</CFormLabel>
                  </CTooltip>
                  <CFormInput
                    type="file"
                    id="Form20/21"
                    name="drugLicenseFormType"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setFormData((prev) => ({
                        ...prev,
                        drugLicenseFormType: file,
                      }))
                      if (file) {
                        setErrors((prev) => ({
                          ...prev,
                          drugLicenseFormType: '',
                        }))
                      }
                    }}
                    accept=".pdf,.doc,.docx,.jpeg,.png"
                    invalid={!!errors.drugLicenseFormType}
                  />
                  {errors.drugLicenseFormType && (
                    <CFormFeedback invalid>{errors.drugLicenseFormType}</CFormFeedback>
                  )}
                </CCol>
              </CRow>
            )}
            <CRow className="mb-3">
              <CCol md={6}>
                <CTooltip content="Issued by Local Municipality">
                  <CFormLabel>
                    Trade License / Shop & Establishment License
                    <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  name="tradeLicense"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      tradeLicense: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        tradeLicense: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.tradeLicense}
                />
                {errors.tradeLicense && (
                  <CFormFeedback invalid>{errors.tradeLicense}</CFormFeedback>
                )}
              </CCol>

              <CCol md={6}>
                <CTooltip content="Issued by Local Fire Department">
                  <CFormLabel>
                    Fire Safety Certificate
                    <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="fireSafety"
                  name="fireSafetyCertificate"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      fireSafetyCertificate: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        fireSafetyCertificate: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.fireSafetyCertificate}
                />
                {errors.fireSafetyCertificate && (
                  <CFormFeedback invalid>{errors.fireSafetyCertificate}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CTooltip content="Issued by GST Department">
                  <CFormLabel>
                    GST Registration Certificate
                    <span className="text-danger">*</span>
                  </CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="gstCert"
                  name="gstRegistrationCertificate"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData((prev) => ({
                      ...prev,
                      gstRegistrationCertificate: file,
                    }))
                    if (file) {
                      setErrors((prev) => ({
                        ...prev,
                        gstRegistrationCertificate: '',
                      }))
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpeg,.png"
                  invalid={!!errors.gstRegistrationCertificate}
                />
                {errors.gstRegistrationCertificate && (
                  <CFormFeedback invalid>{errors.gstRegistrationCertificate}</CFormFeedback>
                )}
              </CCol>

              <CCol md={6}>
                <CTooltip content="NABH Accreditation / Aesthetic Procedure Training Certificate">
                  <CFormLabel>Others (NABH / Aesthetic Training)</CFormLabel>
                </CTooltip>

                <CFormInput
                  type="file"
                  name="others"
                  inputref9={fileInputRefs.others}
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || [])

                    const totalFiles = formData.others.length + selectedFiles.length

                    if (totalFiles > 6) {
                      setErrors((prev) => ({
                        ...prev,
                        others: 'You can upload up to 6 files only.',
                      }))
                      return
                    }

                    setFormData((prev) => ({
                      ...prev,
                      others: [...prev.others, ...selectedFiles],
                    }))

                    // Clear error
                    setErrors((prev) => ({ ...prev, others: '' }))

                    // Reset input to allow re-upload of same file
                    if (fileInputRefs.others.current) {
                      fileInputRefs.others.current.value = ''
                    }
                  }}
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                />

                {errors.others && <CFormFeedback invalid>{errors.others}</CFormFeedback>}

                {/* Display selected file names below input */}
                {Array.isArray(formData.others) && formData.others.length > 0 && (
                  <div className="mt-2">
                    {formData.others.map((file, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center border rounded px-2 py-1 mb-1"
                      >
                        <small className="text-dark">{file.name}</small>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const updatedFiles = formData.others.filter((_, i) => i !== index)
                            setFormData((prev) => ({
                              ...prev,
                              others: updatedFiles,
                            }))
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
               <CRow>
               
<CCol md={6}>
  <CFormLabel>
    Consultation Expiration (in days) <span className="text-danger">*</span>
  </CFormLabel>
  <CFormInput
  type="text"
  name="consultationExpiration"
  value={formData.consultationExpiration}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // allow only digits
    if (value.length > 2) value = value.slice(0, 2); // limit to 2 digits

    setFormData((prev) => ({
      ...prev,
      consultationExpiration: value,
    }));

    // Clear error if valid
    if (value) {
      setErrors((prev) => ({
        ...prev,
        consultationExpiration: "",
      }));
    } else {
      // Add error again if empty
      setErrors((prev) => ({
        ...prev,
        consultationExpiration: "Consultation Expiration is required",
      }));
    }
  }}
  onBlur={(e) => {
    let value = e.target.value;
    if (value.length === 1) {
      value = value.padStart(2, "0"); // add leading zero
    }

    setFormData((prev) => ({
      ...prev,
      consultationExpiration: value,
    }));

    // Double check on blur (so if user tabs away empty field, error comes back)
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        consultationExpiration: "Consultation Expiration is required",
      }));
    }
  }}
  placeholder="Enter consultation days (01-99)"
  invalid={!!errors.consultationExpiration}
/>
  {errors.consultationExpiration && (
    <CFormFeedback invalid>{errors.consultationExpiration}</CFormFeedback>
  )}
</CCol>



                <CCol md={6}>
                   <CFormLabel>
                  No. of Free Follow Ups <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  name="freeFollowUps"
                  value={formData.freeFollowUps}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Enter next visit consultation count"
                  invalid={!!errors.freeFollowUps}
                />
                {errors.freeFollowUps && (
                  <CFormFeedback invalid>{errors.freeFollowUps}</CFormFeedback>
                )}
                </CCol>
               </CRow>
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Subscription<span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="subscription" // ✅ Must match key in formData
                  className="form-select"
                  value={formData.subscription}
                  onChange={handleInputChange} // ✅ Uses generic input handler
                  invalid={!!errors.subscription}
                >
                  <option value="">Select Subscription</option>
                  <option value="Free">Free</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </CFormSelect>
                {errors.subscription && <div className="text-danger">{errors.subscription}</div>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel>Instagram</CFormLabel>
                <CFormInput
                  type="text"
                  id="instagram"
                  placeholder="@clinic_handle"
                  name="instagramHandle"
                  value={formData.instagramHandle}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Facebook</CFormLabel>
                <CFormInput
                  type="text"
                  id="facebook"
                  placeholder="facebook.com/clinic"
                  name="facebookHandle"
                  value={formData.facebookHandle}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Twitter</CFormLabel>
                <CFormInput
                  type="text"
                  id="twitter"
                  placeholder="@clinic_tweet"
                  name="twitterHandle"
                  value={formData.twitterHandle}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Clinic has a valid pharmacist
                  <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  className="form-select"
                  value={selectedPharmacistOption}
                  onChange={(e) => {
                    setSelectedPharmacistOption(e.target.value)
                    setErrors((prev) => ({ ...prev, hasPharmacist: '' })) // clear error on change
                  }}
                  invalid={!!errors.hasPharmacist}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  {/* <option value="n/a">N/A</option> */}
                </CFormSelect>
                {errors.hasPharmacist && (
                  <CFormFeedback invalid>{errors.hasPharmacist}</CFormFeedback>
                )}
              </CCol>
              {selectedPharmacistOption === 'Yes' && (
                <CCol md={6}>
                  <CTooltip content="Valid Pharmacist Registration Certificate">
                    <CFormLabel>Pharmacist Certificate</CFormLabel>
                  </CTooltip>
                  <CFormInput
                    type="file"
                    id="pharmacistCert"
                    name="pharmacistCertificate"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setFormData((prev) => ({
                        ...prev,
                        pharmacistCertificate: file,
                      }))
                      if (file) {
                        setErrors((prev) => ({
                          ...prev,
                          pharmacistCertificate: '',
                        }))
                      }
                    }}
                    accept=".pdf,.doc,.docx,.jpeg,.png"
                    invalid={!!errors.pharmacistCertificate}
                  />
                  {errors.pharmacistCertificate && (
                    <CFormFeedback invalid>{errors.pharmacistCertificate}</CFormFeedback>
                  )}
                </CCol>
              )}
            </CRow>
              {/* ✅ Clinic Coordinates */}
<CRow className="mb-3">
  <CCol md={6}>
    <CFormLabel>
      Clinic Latitude <span className="text-danger">*</span>
    </CFormLabel>
    <CFormInput
  type="number"
  step="any"
  placeholder="Enter latitude"
  value={formData.latitude || ""}
  onChange={(e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, latitude: value }));

    // validate immediately
    const lat = parseFloat(value);
    let error = "";
    if (!value) {
      error = "Latitude is required";
    } else if (isNaN(lat) || lat < -90 || lat > 90) {
      error = "Latitude must be between -90 and 90";
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.latitude = error;
      } else {
        delete newErrors.latitude; // ✅ remove error when valid
      }
      return newErrors;
    });
  }}
  invalid={!!errors.latitude}
/>
{errors.latitude && (
  <CFormFeedback invalid>{errors.latitude}</CFormFeedback>
)}

  </CCol>

  <CCol md={6}>
    <CFormLabel>
      Clinic Longitude <span className="text-danger">*</span>
    </CFormLabel>
    <CFormInput
  type="number"
  step="any"
  placeholder="Enter longitude"
  value={formData.longitude || ""}
  onChange={(e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, longitude: value }));

    // validate immediately
    const lng = parseFloat(value);
    let error = "";
    if (!value) {
      error = "Longitude is required";
    } else if (isNaN(lng) || lng < -180 || lng > 180) {
      error = "Longitude must be between -180 and 180";
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.longitude = error;
      } else {
        delete newErrors.longitude; // ✅ remove error when valid
      }
      return newErrors;
    });
  }}
  invalid={!!errors.longitude}
/>
{errors.longitude && (
  <CFormFeedback invalid>{errors.longitude}</CFormFeedback>
)}

  </CCol>
</CRow>


{/* ✅ Walkthrough URL */}
<CRow className="mb-3">
  <CCol md={6}>
    <CFormLabel>
      Walkthrough URL <span className="text-danger">*</span>
    </CFormLabel>
 <CFormInput
  type="url"
  placeholder="https://example.com/walkthrough"
  value={formData.walkthrough || ""}
  onChange={(e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, walkthrough: value }));

    // ✅ validate URL
    let error = "";
    if (!value.trim()) {
      error = "Walkthrough URL is required";
    } else {
      try {
        new URL(value); // throws if invalid
      } catch {
        error = "Enter a valid URL (e.g. https://example.com)";
      }
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.walkthrough = error;
      } else {
        delete newErrors.walkthrough; // ✅ clear error when valid
      }
      return newErrors;
    });
  }}
  invalid={!!errors.walkthrough}
/>
{errors.walkthrough && (
  <CFormFeedback invalid>{errors.walkthrough}</CFormFeedback>
)}

  </CCol>
  {/* ✅ Branch Input */}

  <CCol md={6}>
    <CFormLabel>
      Branch <span className="text-danger">*</span>
    </CFormLabel>
    <CFormInput
      type="text"
      placeholder="Enter branch name"
      value={formData.branch || ""}
      onChange={(e) =>{
       const value = e.target.value;

    setFormData((prev) => ({ ...prev, branch: value }));
        if(!value){
        setErrors((prev)=>({...prev, branch:"Branch name is required"}))
        }
        else{
        setErrors((prev)=>({...prev, branch:""}))
        }
        }}

      invalid={!!errors.branch}
    />
    {errors.branch && <CFormFeedback invalid>{errors.branch}</CFormFeedback>}
  </CCol>

</CRow>

{/* ✅ NABH Score - Opens Modal */}
<CRow className="mb-3">
  <CCol md={12} className='d-flex align-items-center'>
    <CFormLabel className="me-3">NABH Score </CFormLabel>
    {nabhScore!==null && (
      <span className="me-3 fw-bold text-success">{nabhScore}%</span>
    )}
    <CButton
      color="primary"
      onClick={() => !nabhSubmitted && setShowNabhModal(true)}
      disabled={nabhSubmitted}
    >
       Open NABH Questionnaire
    </CButton>
  </CCol>
</CRow>

<CModal visible={showNabhModal} onClose={() => setShowNabhModal(false)} size="lg">
  <CModalHeader>
    <CModalTitle>NABH Questionnaire</CModalTitle>
  </CModalHeader>
  <CModalBody>
    {nabhQuestions.map((question, index) => (
      <CRow key={index} className="mb-4">
        {/* Question with number */}
        <CCol md={12}>
          <CFormLabel>
            {index + 1}. {question}
          </CFormLabel>
        </CCol>

        {/* Radio buttons below the question */}
        <CCol md={12} className="d-flex mt-2">
      <CFormCheck
  type="radio"
  name={`nabh-${index}`}
  id={`nabh-${index}-yes`}
  label="Yes"
  checked={nabhAnswers[index] === true}
  onChange={() => {
    const updated = [...nabhAnswers];
    updated[index] = true;
    setNabhAnswers(updated);
  }}
  className="me-4"
/>
<CFormCheck
  type="radio"
  name={`nabh-${index}`}
  id={`nabh-${index}-no`}
  label="No"
  checked={nabhAnswers[index] === false}
  onChange={() => {
    const updated = [...nabhAnswers];
    updated[index] = false;
    setNabhAnswers(updated);
  }}
/>

        </CCol>
      </CRow>
    ))}
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setShowNabhModal(false)}>
      Close
    </CButton>
    <CButton color="primary" onClick={handleNabhSubmit}>
      Save
    </CButton>
  </CModalFooter>
</CModal>
 
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton color="secondary" onClick={() => navigate('/clinic-management')}>
                Cancel
              </CButton>
              <CButton type="submit" color="success" className="me-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving Data...
                  </>
                ) : (
                  'Save Clinic'
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddClinic