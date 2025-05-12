import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
} from '@coreui/react'
import { BASE_URL, subService_URL } from '../../baseUrl'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import Select from 'react-select'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const AddClinic = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    contactNumber: '',
    hospitalRegistrations: '',
    openingTime: '',
    closingTime: '',
    hospitalLogo: '',
    emailAddress: '',
    website: '',
    licenseNumber: '',
    IssuingAuthority: '',
    hospitalDoucuments: [],
    hospitalcategory: [],
  })

  const handleCategoryChange = async (selectedOptions) => {
    const selectedCategories = selectedOptions || []
    setFormData((prev) => ({
      ...prev,
      hospitalcategory: selectedCategories,
    }))

    const allServices = []

    for (const option of selectedCategories) {
      try {
        const res = await axios.get(`${subService_URL}/services/getServices/${option.value}`)
        const data = res.data?.data || []
        allServices.push(...data)
      } catch (error) {
        console.error(`Failed to fetch services for category ${option.label}:`, error)
      }
    }

    const uniqueServices = Array.from(new Map(allServices.map((s) => [s.serviceId, s])).values())

    setServiceOptions(uniqueServices)
  }

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

  const validateForm = () => {
    const newErrors = {}

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    // City validation
    if (!formData.city.trim()) newErrors.city = 'City is required'
    else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.city)) {
      newErrors.city = 'City name must contain only letters'
    }
    if (!formData.hospitalRegistrations.trim()) {
      newErrors.hospitalRegistrations = 'Registration number is required'
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email is required'
    } else if (!formData.emailAddress.includes('@')) {
      newErrors.emailAddress = 'Email must contain @ symbol'
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email format (example@domain.com)'
    }

    // Phone validation
    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required'
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit mobile number'
    }

    // Time validation
    if (!formData.openingTime) {
      newErrors.openingTime = 'Opening time is required'
    }
    if (!formData.closingTime) {
      newErrors.closingTime = 'Closing time is required'
    }

    // License validation
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required'
    }

    // Website validation (optional)
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://'
    }

    if (!formData.hospitalLogo) {
      newErrors.hospitalLogo = 'Hospital logo is required'
    }

    if (!formData.IssuingAuthority.trim()) {
      newErrors.IssuingAuthority = 'Issuing Authority is required'
    }

    if (formData.hospitalDoucuments.length === 0) {
      newErrors.hospitalDoucuments = 'Please upload at least one document'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handleFileChange = async (e) => {
    const { name, files } = e.target
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
      }
    } catch (error) {
      console.error('File conversion error:', error)
      setErrors((prev) => ({
        ...prev,
        [name]: 'File conversion failed',
      }))
    }
  }
  const handleChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      hospitalService: selectedOptions || [], // Update the formData with selected options
    }))
  }
  const services = {
    peelRemoval: [
      { servicesId: '1', servicesName: 'Chemical Peel - Medium Depth' },
      { servicesId: '2', servicesName: 'Chemical Peel - Deep' },
      { servicesId: '3', servicesName: 'Glycolic Acid Peel' },
      { servicesId: '4', servicesName: 'TCA Peel' },
      { servicesId: '5', servicesName: 'Microdermabrasion Peel' },
    ],
  }

  // const [submittedData, setSubmittedData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const clinicData = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      contactNumber: formData.contactNumber,
      hospitalRegistrations: formData.hospitalRegistrations,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      hospitalLogo: formData.hospitalLogo,
      emailAddress: formData.emailAddress,
      website: formData.website,
      licenseNumber: formData.licenseNumber,
      issuingAuthority: formData.IssuingAuthority,
      hospitalService: [],
      hospitalCategory: formData.hospitalcategory.map((cat) => ({
        categoryId: cat.value, // Using 'value' from selected option
        categoryName: cat.label, // Using 'label' from selected option
      })),
      hospitalDocuments: formData.hospitalDoucuments,
    }

    console.log('Clinic Data Saved:', clinicData)
    console.log(`${BASE_URL}/admin/createClinic`)

    try {
      // Fix the URL construction
      const response = await axios.post(`${BASE_URL}/admin/CreateClinic`, clinicData)

      const savedClinicData = response.data

      if (savedClinicData.success) {
        toast.success(response.message, { position: 'top-right' })
        navigate('/clinic-management', {
          state: {
            refresh: true,
            newClinic: savedClinicData,
          },
        })
      } else {
        alert(response.message)
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
                <CFormLabel>Clinic Category</CFormLabel>
                <Select
                  isMulti
                  name="hospitalcategory"
                  className="mb-5"
                  options={categories.map((cat) => ({
                    value: cat.categoryId,
                    label: cat.categoryName,
                  }))}
                  value={formData.hospitalcategory}
                  onChange={handleCategoryChange}
                  placeholder="Select multiple categories..."
                />

                {/* {errors.clinicName && <CFormFeedback invalid>{errors.clinicName}</CFormFeedback>} */}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Clinic Services</CFormLabel>
                <Select
                  isMulti
                  name="hospitalService"
                  className="mb-5"
                  options={serviceOptions.map((service) => ({
                    value: service.serviceId,
                    label: service.serviceName,
                  }))}
                  value={formData.hospitalService}
                  onChange={(selectedOptions) =>
                    setFormData((prev) => ({
                      ...prev,
                      hospitalService: selectedOptions || [],
                    }))
                  }
                  placeholder="Select multiple services..."
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Hosiptal Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  invalid={!!errors.clinicName}
                />
                {errors.clinicName && <CFormFeedback invalid>{errors.clinicName}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Email Address</CFormLabel>
                <CFormInput
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  invalid={!!errors.emailAddress}
                />
                {errors.emailAddress && (
                  <CFormFeedback invalid>{errors.emailAddress}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Contact Number</CFormLabel>
                <CFormInput
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  invalid={!!errors.contactNumber}
                />
                {errors.contactNumber && (
                  <CFormFeedback invalid>{errors.contactNumber}</CFormFeedback>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Website</CFormLabel>
                <CFormInput
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  invalid={!!errors.website}
                />
                {errors.website && <CFormFeedback invalid>{errors.website}</CFormFeedback>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Opening Time</CFormLabel>
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
                <CFormLabel>Closing Time</CFormLabel>
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

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>License Number</CFormLabel>
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
                <CFormLabel>Issuing Authority</CFormLabel>
                <CFormInput
                  type="text"
                  name="IssuingAuthority"
                  value={formData.IssuingAuthority}
                  onChange={handleInputChange}
                  invalid={!!errors.IssuingAuthority}
                />
                {errors.IssuingAuthority && (
                  <CFormFeedback invalid>{errors.IssuingAuthority}</CFormFeedback>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Address</CFormLabel>
                <CFormInput
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  invalid={!!errors.address}
                />
                {errors.address && <CFormFeedback invalid>{errors.address}</CFormFeedback>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>City</CFormLabel>
                <CFormInput
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  invalid={!!errors.city}
                />
                {errors.city && <CFormFeedback invalid>{errors.city}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Hospital Registration</CFormLabel>
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
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Hospital Logo</CFormLabel>
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
                <CFormLabel>Hospital Documents</CFormLabel>
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
