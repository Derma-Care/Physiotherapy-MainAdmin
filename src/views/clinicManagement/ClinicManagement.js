import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import ClinicAPI from './ClinicAPI'
import { ClinicAllData } from '../../baseUrl'
import { BASE_URL } from '../../baseUrl'
import { ClipLoader } from 'react-spinners'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const ClinicManagement = ({ service, onBack }) => {
  const navigate = useNavigate()
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const location = useLocation()

  const handleAddClinic = () => {
    navigate('/add-clinic', {
      state: {
        categoryName: service?.categoryName,
        categoryId: service?.id,
      },
    })
  }

  useEffect(() => {
    fetchClinics()
    if (location.state?.newClinic) {
      setClinics((prev) => [...prev, location.state.newClinic])
    }
  }, [location.state?.newClinic])

  const fetchClinics = async () => {
    console.log('calling')
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/${ClinicAllData}`)
      console.log(response.data)
      if (response.data) {
        // Filter clinics based on selected service if needed
        const clinicList = Array.isArray(response.data)
          ? response.data
          : response.data.hospitalCategory || response.data.data || []

        console.log('Raw response data:', response.data)
        console.log('Extracted clinicList:', clinicList)
        console.log('Selected service:', service)

        if (clinicList.length > 0) {
          clinicList.forEach((clinic, index) => {
            console.log(`Clinic ${index}:`, clinic)
            console.log(`clinic.hospitalCategory:`, clinic.hospitalCategory)

            // Check if hospitalCategory exists and is an array
            if (Array.isArray(clinic.hospitalCategory)) {
              clinic.hospitalCategory.forEach((category, catIndex) => {
                console.log(`--> Category ${catIndex}:`, category)
              })
            }
          })
        }

        const filteredClinics = service
          ? clinicList.filter(
              (clinic) =>
                Array.isArray(clinic.hospitalCategory) &&
                clinic.hospitalCategory.some((cat) => cat.categoryId === service.categoryId),
            )
          : clinicList

        console.log('Filtered Clinics:', filteredClinics)

        setClinics(filteredClinics)

        console.log('Fetched clinics:', clinicList)
        console.log('Fetched clinics:', filteredClinics)

        setClinics(filteredClinics)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching clinics:', error)
      setLoading(false)
    }
  }

 

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.mobile?.includes(searchTerm) ||
      clinic.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <CCard className="mt-4">
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <CButton color="secondary" onClick={onBack}>
            Back
          </CButton>
          <h2 className="mb-0">{service?.categoryName} Clinics</h2>
          <CButton color="primary" onClick={handleAddClinic}>
            Add Clinic
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="col-8">
            <CFormInput
              type="text"
              placeholder="Search by full name, mobile, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-4 text-end">No.of Hospitals: {filteredClinics?.length || 0}</div>
        </div>

        
        {error && <p className="text-center text-danger">{error}</p>}

        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Clinic Name</CTableHeaderCell>
              <CTableHeaderCell>Contact Number</CTableHeaderCell>
              <CTableHeaderCell>Email Address</CTableHeaderCell>
              <CTableHeaderCell>City</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
       
          <CTableBody>
            {filteredClinics?.length > 0
              ? filteredClinics.map((clinic, index) => (
                  <CTableRow key={clinic?.id || index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{clinic?.name}</CTableDataCell>
                    <CTableDataCell>{clinic?.contactNumber}</CTableDataCell>
                    <CTableDataCell>{clinic?.emailAddress}</CTableDataCell>
                    <CTableDataCell>{clinic?.city}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => navigate(`/clinic-Management/${clinic.hospitalId}`)}
                      >
                        View
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              : !loading && (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      No clinics found
                    </CTableDataCell>
                  </CTableRow>
                )}
          </CTableBody>
        </CTable>
      </CCardBody>
      
      {loading && (
        <div className="text-center">
          <ClipLoader color="#3498db" loading={loading} size={50} />
          <p>Loading...</p>
        </div>
      )}
    
    </CCard>
    
  )
}

export default ClinicManagement
