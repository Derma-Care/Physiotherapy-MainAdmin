import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
import { BASE_URL, subService_URL, getService } from '../../baseUrl'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import Select from 'react-select'
import sendDermaCareOnboardingEmail from '../../Utils/Emailjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const AddClinic = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [backendErrors, setBackendErrors] = ''
  const [categories, setCategories] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedPharmacistOption, setSelectedPharmacistOption] = useState('')
  const [clinicTypeOption, setClinicTypeOption] = useState('')

  // setSelectedPharmacistOption
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    contactNumber: '',
    // hospitalRegistrations: '',
    openingTime: '',
    closingTime: '',
    hospitalLogo: '',
    emailAddress: '',
    website: '',
    licenseNumber: '',
    IssuingAuthority: '',
    recommended: false,
    hospitalDoucuments: [],
    // hospitalcategory: [],
    hospitalContract: [],

    clinicalEstablishmentCertificate: '',
    businessRegistrationCertificate: '',
    clinicType: '',
    medicinesSoldOnSite: '',
    drugLicense: '',
    drugLicenseFormType: '',
    hasPharmacist: '',
    pharmacistCertificate: '',
    biomedicalWasteManagementAuth: '',
    tradeLicense: '',
    fireSafetyCertificate: '',
    professionalIndemnityInsurance: '',
    gstRegistrationCertificate: '',
    others: '',
    instagramHandle: '',
    twitterHandle: '',
    facebookHandle: '',
  })

  // const handleCategoryChange = async (selectedOptions) => {
  //   const selectedCategories = selectedOptions || []
  //   setFormData((prev) => ({
  //     ...prev,
  //     hospitalcategory: selectedCategories,
  //   }))

  //   const allServices = []

  //   for (const option of selectedCategories) {
  //     try {
  //       const res = await axios.get(`${subService_URL}/${getService}/${option.value}`)
  //       const data = res.data?.data || []
  //       allServices.push(...data)
  //     } catch (error) {
  //       console.error(`Failed to fetch services for category ${option.label}:`, error)
  //     }
  //   }

  //   const uniqueServices = Array.from(new Map(allServices.map((s) => [s.serviceId, s])).values())

  //   setServiceOptions(uniqueServices)
  // }

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

  const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/

  const preventNumberInput = (e) => {
    const isNumber = /[0-9]/.test(e.key)
    if (isNumber) {
      e.preventDefault()
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Hospital Name
    if (!formData.name.trim()) {
      newErrors.name = 'Clinic name is required'
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
      newErrors.name = 'Clinic name must contain only letters'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.city)) {
      newErrors.city = 'City name must contain only letters'
    }

    // // Hospital Registration
    // if (!formData.hospitalRegistrations.trim()) {
    //   newErrors.hospitalRegistrations = 'Registration number is required'
    // }

    // Email validation
    ;<CFormInput
      type="email"
      name="emailAddress"
      value={formData.emailAddress}
      onChange={handleInputChange}
      onBlur={(e) => {
        const value = e.target.value
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!value.trim()) {
          setErrors((prev) => ({
            ...prev,
            emailAddress: 'Email is required',
          }))
        } else if (!emailRegex.test(value)) {
          setErrors((prev) => ({
            ...prev,
            emailAddress: 'Please enter a valid email (example@domain.com)',
          }))
        } else {
          setErrors((prev) => ({
            ...prev,
            emailAddress: '',
          }))
        }
      }}
      invalid={!!errors.emailAddress}
    />

    // Contact Number
    const phoneRegex = /^[5-9]\d{9}$/ // This regex checks if the number starts with 5-9 and is followed by 9 digits

    if (!formData.contactNumber) {
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
    if (!formData.openingTime) {
      newErrors.openingTime = 'Opening time is required'
    }

    if (!formData.closingTime) {
      newErrors.closingTime = 'Closing time is required'
    } else if (formData.openingTime && formData.closingTime <= formData.openingTime) {
      newErrors.closingTime = 'Closing time must be after opening time'
    }

    // License Number
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required'
    }

    // Issuing Authority
    if (!formData.IssuingAuthority.trim()) {
      newErrors.IssuingAuthority = 'Issuing Authority is required'
    }

    // Hospital Logo
    if (!formData.hospitalLogo) {
      newErrors.hospitalLogo = 'Hospital logo is required'
    }

    // Hospital Documents
    if (formData.hospitalDoucuments.length === 0) {
      newErrors.hospitalDoucuments = 'Please upload at least one document'
    }
    if (!formData.clinicalEstablishmentCertificate) {
      newErrors.clinicalEstablishmentCertificate = 'Please upload at least one document'
    }
    if (!formData.businessRegistrationCertificate) {
      newErrors.businessRegistrationCertificate = 'Please upload at least one document'
    }
    if (formData.drugLicense) {
      newErrors.drugLicense = 'Please upload at least one document'
    }
    if (formData.drugLicenseFormType) {
      newErrors.drugLicenseFormType = 'Please upload at least one document'
    }
    if (formData.pharmacistCertificate) {
      newErrors.pharmacistCertificate = 'Please upload at least one document'
    }
    if (formData.biomedicalWasteManagementAuth) {
      newErrors.biomedicalWasteManagementAuth = 'Please upload at least one document'
    }
    if (formData.tradeLicense) {
      newErrors.tradeLicense = 'Please upload at least one document'
    }
    if (formData.fireSafetyCertificate) {
      newErrors.fireSafetyCertificate = 'Please upload at least one document'
    }
    if (formData.professionalIndemnityInsurance) {
      newErrors.professionalIndemnityInsurance = 'Please upload at least one document'
    }
    if (formData.gstRegistrationCertificate) {
      newErrors.gstRegistrationCertificate = 'Please upload at least one document'
    }
    if (formData.others) {
      newErrors.others = 'Please upload at least one document'
    }

    // Website (optional)
    if (!formData.website.trim()) {
      errors.website = 'Website is required.'
    } else if (
      !formData.website.trim().startsWith('http') &&
      !formData.website.trim().startsWith('https') &&
      !formData.website.trim().startsWith('www')
    ) {
      errors.website = 'Never a valid URL. Must start with http://, https://, or www.'
    } else if (!websiteRegex.test(formData.website.trim())) {
      errors.website = 'Enter a valid website URL.'
    } else {
      errors.website = ''
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length == 0
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }
  // const handleFileChange = async (e) => {
  //   const { name, files } = e.target

  //   const stripBase64Prefix = (base64) => base64.split(',')[1]

  //   try {
  //     const base64Files = await Promise.all(
  //       Array.from(files).map((file) => convertToBase64(file).then(stripBase64Prefix)),
  //     )

  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: files.length === 1 ? base64Files[0] : base64Files,
  //     }))
  //   } catch (error) {
  //     console.error('File conversion error:', error)
  //     setErrors((prev) => ({
  //       ...prev,
  //       [name]: 'File conversion failed',
  //     }))
  //   }
  // }

  const handleFileChange = async (e) => {
    const { name, files } = e.target
    console.log(name)
    console.log(files)
    try {
      const stripBase64Prefix = (base64) => {
        return base64.split(',')[1] // Removes "data:image/png;base64," part
      }

      if (name === 'hospitalLogo') {
        const base64 = await convertToBase64(files[0])
        setFormData((prev) => ({
          ...prev,
          hospitalLogo: stripBase64Prefix(base64),
        }))
      } else if (name === 'hospitalDoucuments') {
        const base64Files = await Promise.all(
          Array.from(files).map((file) => convertToBase64(file).then(stripBase64Prefix)),
        )
        setFormData((prev) => ({
          ...prev,
          hospitalDoucuments: base64Files,
        }))
      } else if (name === 'hospitalContract') {
        const base64Files = await Promise.all(
          Array.from(files).map((file) => convertToBase64(file).then(stripBase64Prefix)),
        )
        setFormData((prev) => ({
          ...prev,
          hospitalContract: base64Files,
        }))
        console.log('sdsfdsfdsfdsff', name, ':', 'clinicalEstablishmentCertificate')
      } else if (name === 'clinicalEstablishmentCertificate') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          clinicalEstablishmentCertificate: base64File,
        }))
        console.log('sdsfdsfdsfdsff', base64File)
      } else if (name === 'businessRegistrationCertificate') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)

        setFormData((prev) => ({
          ...prev,
          businessRegistrationCertificate: base64File,
        }))
      } else if (name === 'drugLicenseCertificate') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          drugLicenseCertificate: base64File,
        }))
      } else if (name === 'drugLicenseFormType') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          drugLicenseFormType: base64File,
        }))
      } else if (name === 'hasPharmacist') {
        const base64Files = await Promise.all(
          Array.from(files).map((file) => convertToBase64(file).then(stripBase64Prefix)),
        )
        setFormData((prev) => ({
          ...prev,
          hasPharmacist: base64Files,
        }))
      } else if (name === 'pharmacistCertificate') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          pharmacistCertificate: base64File,
        }))
      } else if (name === 'biomedicalWasteManagementAuth') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          biomedicalWasteManagementAuth: base64File,
        }))
      } else if (name === 'tradeLicense') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          tradeLicense: base64File,
        }))
      } else if (name === 'fireSafetyCertificate') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          fireSafetyCertificate: base64File,
        }))
      } else if (name === 'professionalIndemnityInsurance') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          professionalIndemnityInsurance: base64File,
        }))
      } else if (name === 'gstRegistrationCertificate') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          gstRegistrationCertificate: base64File,
        }))
      } else if (name === 'others') {
        const base64File = await convertToBase64(files[0]).then(stripBase64Prefix)
        setFormData((prev) => ({
          ...prev,
          others: base64File,
        }))
      }
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

  const handleSubmit = async (e) => {
    console.log('Handle submit triggered')

    e.preventDefault()
    console.log('Handle submit triggered')
    // if (!validateForm()) {
    //   return
    // }

    const clinicData = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      contactNumber: formData.contactNumber,
      // hospitalRegistrations: formData.hospitalRegistrations,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      hospitalLogo: formData.hospitalLogo,
      emailAddress: formData.emailAddress,
      website: formData.website,
      licenseNumber: formData.licenseNumber,
      issuingAuthority: formData.IssuingAuthority,

      // hospitalService: [],
      // hospitalCategory: formData.hospitalcategory.map((cat) => ({
      //   categoryId: cat.value, // Using 'value' from selected option
      //   categoryName: cat.label, // Using 'label' from selected option
      // })),
      hospitalDocuments: formData.hospitalDoucuments,
      recommended: formData.recommended,
      contractorDocuments: formData.hospitalContract,
      clinicalEstablishmentCertificate: formData.clinicalEstablishmentCertificate,

      businessRegistrationCertificate: formData.businessRegistrationCertificate,
      clinicType: clinicTypeOption,
      medicinesSoldOnSite: selectedOption,
      drugLicenseCertificate: formData.drugLicenseCertificate,
      drugLicenseFormType: formData.drugLicenseFormType,
      hasPharmacist: selectedPharmacistOption,
      pharmacistCertificate: formData.pharmacistCertificate,
      biomedicalWasteManagementAuth: formData.biomedicalWasteManagementAuth,
      tradeLicense: formData.tradeLicense,
      fireSafetyCertificate: formData.fireSafetyCertificate,
      professionalIndemnityInsurance: formData.professionalIndemnityInsurance,
      gstRegistrationCertificate: formData.gstRegistrationCertificate,
      others: formData.others,
      instagramHandle: formData.instagramHandle,
      twitterHandle: formData.twitterHandle,
      facebookHandle: formData.facebookHandle,
    }

    console.log('Clinic Data Saved:', clinicData)
    console.log(`${BASE_URL}/admin/CreateClinic`)

    try {
      console.log('Clinic Data Saved: try', clinicData)

      // Fix the URL construction

      const response = await axios.post(`${BASE_URL}/admin/CreateClinic`, clinicData)
      console.log(response)

      const savedClinicData = response.data
      console.log(savedClinicData)

      if (savedClinicData.success) {
        toast.success(response.message, { position: 'top-right' })
        const hospitalID = localStorage.getItem('HospitalId') // Assuming it's an email or unique ID
        const password = savedClinicData.password // Or extract from correct path
        const clinicUsername = savedClinicData.data.clinicUsername
        const clinicTemporaryPassword = savedClinicData.data.clinicTemporaryPassword
        console.log(clinicUsername)
        console.log(clinicTemporaryPassword)
        // sendDermaCareOnboardingEmail({
        //   name: 'Dr. Neha’s Clinic',
        //   email: 'prashanthr@gmail.com',
        //   password: 'Derma@1234',
        // })
        sendDermaCareOnboardingEmail({
          name: formData.name,
          email: formData.emailAddress,
          password: clinicTemporaryPassword,
          userID: clinicUsername,
        })

        navigate('/clinic-management', {
          state: {
            refresh: true,
            newClinic: savedClinicData,
          },
        })
      } else {
        toast.error(response.message || 'Something went wrong', { position: 'top-right' })
      }
    } catch (error) {
      console.error('Error submitting clinic data:', error)
      toast.error(`${error.message}`, { position: 'top-right' })
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
                  <span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyDown={preventNumberInput}
                  invalid={!!errors.name}
                />
                {errors.name && <CFormFeedback invalid>{errors.name}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Email Address<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  invalid={!!errors.emailAddress}
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
                  onKeyDown={preventNumberInput}
                  invalid={!!errors.website}
                />
                {errors.website && <div className="text-danger">{errors.website}</div>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Opening Time<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleInputChange}
                  invalid={!!errors.openingTime}
                />
                {errors.openingTime && <CFormFeedback invalid>{errors.openingTime}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Closing Time<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleInputChange}
                  invalid={!!errors.closingTime}
                />
                {errors.closingTime && <CFormFeedback invalid>{errors.closingTime}</CFormFeedback>}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormLabel>
                  License Number<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
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
                  name="IssuingAuthority"
                  value={formData.IssuingAuthority}
                  onChange={handleInputChange}
                  onKeyDown={preventNumberInput}
                  invalid={!!errors.IssuingAuthority}
                />
                {errors.IssuingAuthority && (
                  <CFormFeedback invalid>{errors.IssuingAuthority}</CFormFeedback>
                )}
              </CCol>
              {/* <CCol md={4}>
                <CFormLabel>
                  Hospital Registration<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="hospitalRegistrations"
                  value={formData.hospitalRegistrations}
                  onChange={handleInputChange}
                  invalid={!!errors.hospitalRegistrations}
                />
                {errors.hospitalRegistrations && (
                  <CFormFeedback invalid>{errors.hospitalRegistrations}</CFormFeedback>
                )}
              </CCol> */}
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>
                  Address<span style={{ color: 'red' }}>*</span>
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
                <CFormLabel>Recommendation Status</CFormLabel>
                <CFormSelect
                  name="isRecommended"
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
                  City<span style={{ color: 'red' }}>*</span>
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
                <CFormLabel>
                  Hospital Contract<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="file"
                  name="hospitalContract"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx"
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
                  Hospital Logo<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="file"
                  name="hospitalLogo"
                  onChange={handleFileChange}
                  accept="image/*"
                  invalid={!!errors.hospitalLogo}
                />
                {errors.hospitalLogo && (
                  <CFormFeedback invalid>{errors.hospitalLogo}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  Hospital Documents<span style={{ color: 'red' }}>*</span>
                </CFormLabel>
                <CFormInput
                  type="file"
                  name="hospitalDoucuments"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx"
                  invalid={!!errors.hospitalDoucuments}
                />
                {errors.hospitalDoucuments && (
                  <CFormFeedback invalid>{errors.hospitalDoucuments}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CTooltip content="Issued by Registrar of Companies or local municipal body">
                  <CFormLabel>Clinical Establishment Registration Certificate</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  name="clinicalEstablishmentCertificate"
                  id="clinicalReg"
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.zip,.doc,.docx"
                  invalid={!!errors.clinicalEstablishmentCertificate}
                />
                {errors.clinicalEstablishmentCertificate && (
                  <CFormFeedback invalid>{errors.clinicalEstablishmentCertificate}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CTooltip content="Issued by Registrar of Companies or local municipal body">
                  <CFormLabel>Business Registration Certificate</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="businessReg"
                  name="businessRegistrationCertificate"
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.zip,.doc,.docx"
                  invalid={!!errors.businessRegistrationCertificate}
                />
                {errors.businessRegistrationCertificate && (
                  <CFormFeedback invalid>{errors.businessRegistrationCertificate}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormLabel>Clinic Type</CFormLabel>
                <CFormSelect
                  className="form-select"
                  value={clinicTypeOption}
                  onChange={(e) => setClinicTypeOption(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option>Proprietorship</option>
                  <option>Partnership</option>
                  <option>LLP</option>
                  <option>Private Limited</option>
                </CFormSelect>
              </CCol>
              <CCol>
                <CTooltip content="Issued by Insurance Companies">
                  <CFormLabel>Professional Indemnity Insurance</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="indemnity"
                  name="professionalIndemnityInsurance"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx"
                  invalid={!!errors.professionalIndemnityInsurance}
                />
                {errors.professionalIndemnityInsurance && (
                  <CFormFeedback invalid>{errors.professionalIndemnityInsurance}</CFormFeedback>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Medicines sold on-site</CFormLabel>
                <CFormSelect
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CTooltip content="Issued by State Pollution Control Board (SPCB)">
                  <CFormLabel>Biomedical Waste Management Authorization</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="biomedicalWaste"
                  name="biomedicalWasteManagementAuth"
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.doc,.docx"
                  invalid={!!errors.biomedicalWasteManagementAuth}
                />
                {errors.biomedicalWasteManagementAuth && (
                  <CFormFeedback invalid>{errors.biomedicalWasteManagementAuth}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            {selectedOption === 'Yes' && (
              <CRow>
                <CCol md={6}>
                  <CTooltip content="Issued by State Drug Control Department">
                    <CFormLabel>Drug License Certificate</CFormLabel>
                  </CTooltip>
                  <CFormInput
                    type="file"
                    id="drugLicense"
                    name="drugLicenseCertificate"
                    onChange={handleFileChange}
                    // multiple
                    accept=".pdf,.doc,.docx"
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
                    onChange={handleFileChange}
                    // multiple
                    accept=".pdf,.doc,.docx"
                    invalid={!!errors.drugLicenseFormType}
                  />
                  {errors.drugLicenseFormType && (
                    <CFormFeedback invalid>{errors.drugLicenseFormType}</CFormFeedback>
                  )}
                </CCol>
              </CRow>
            )}
            <CRow>
              <CCol md={6}>
                <CTooltip content="Issued by Local Municipality">
                  <CFormLabel>Trade License / Shop & Establishment License</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  name="tradeLicense"
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.doc,.docx"
                  invalid={!!errors.tradeLicense}
                />
                {errors.tradeLicense && (
                  <CFormFeedback invalid>{errors.tradeLicense}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CTooltip content="Issued by Local Fire Department">
                  <CFormLabel>Fire Safety Certificate</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="fireSafety"
                  name="fireSafetyCertificate"
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.doc,.docx"
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
                  <CFormLabel>GST Registration Certificate</CFormLabel>
                </CTooltip>
                <CFormInput
                  type="file"
                  id="gstCert"
                  name="gstRegistrationCertificate"
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.doc,.docx"
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
                  onChange={handleFileChange}
                  // multiple
                  accept=".pdf,.doc,.docx"
                  invalid={!!errors.others}
                />
                {errors.others && <CFormFeedback invalid>{errors.others}</CFormFeedback>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel>Instagram</CFormLabel>
                <CFormInput
                  type="text"
                  id="instagram"
                  placeholder="@clinic_handle"
                  name="instagramHandle "
                  // value={formData.instagramHandle}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Facebook</CFormLabel>
                <CFormInput
                  type="text"
                  id="facebook"
                  placeholder="facebook.com/clinic"
                  name="facebookHandle  "
                  // value={formData.facebookHandle}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Twitter</CFormLabel>
                <CFormInput
                  type="text"
                  id="twitter"
                  placeholder="@clinic_tweet"
                  name="twitterHandle  "
                  value={formData.twitterHandle}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormLabel>Clinic has a valid pharmacist</CFormLabel>
                <CFormSelect
                  value={selectedPharmacistOption}
                  onChange={(e) => setSelectedPharmacistOption(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="n/a">N/A</option>
                </CFormSelect>
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
                    onChange={handleFileChange}
                    // multiple
                    accept=".pdf,.doc,.docx"
                    invalid={!!errors.pharmacistCertificate}
                  />
                  {errors.pharmacistCertificate && (
                    <CFormFeedback invalid>{errors.pharmacistCertificate}</CFormFeedback>
                  )}
                </CCol>
              )}
            </CRow>

            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton color="secondary" onClick={() => navigate('/clinic-management')}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
                Save Clinic
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddClinic
