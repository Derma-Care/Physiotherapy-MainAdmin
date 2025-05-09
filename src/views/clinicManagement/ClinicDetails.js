import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'
import { DoctorAllData } from '../../baseUrl'

import { BASE_URL, DOCTOR_URL } from '../../baseUrl'
import classNames from 'classnames'
import axios from 'axios'

const ClinicDetails = () => {
  const { hospitalId } = useParams()
  const navigate = useNavigate()

  const [clinicData, setClinicData] = useState(null)
  const [editableClinicData, setEditableClinicData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [allDoctors, setAllDoctors] = useState([])

  const tabList = ['Basic Details', 'Additional Details', 'Doctors', 'Appointments']

  const fetchClinicDetails = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/admin/getClinicById/${hospitalId}`)
      console.log('Clinic Response:', response.data) // ✅ add this
      setClinicData(response.data.data)
      setEditableClinicData(response.data.data)
    } catch (error) {
      console.error('Error fetching clinic details:', error)
    }
    setLoading(false)
  }
  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(`${DOCTOR_URL}${DoctorAllData}/${hospitalId}`)
      console.log('Doctors data:', response.data)
      setAllDoctors(response.data.data)
    } catch (error) {
      console.error('Error fetching doctors data:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    if (hospitalId) {
      fetchClinicDetails()
      fetchAllDoctors()
    }
  }, [hospitalId])

  const updateClinicData = async (id, data) => {
    await axios.put(`${BASE_URL}/admin/updateClinic/${id}`, data)
  }

  const handleDeleteClinic = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/clinics/${hospitalId}`)
      setShowDeleteModal(false)
      navigate('/clinic-Management') // navigate back after delete
    } catch (error) {
      console.error('Failed to delete clinic:', error)
    }
  }

  return (
    <CCard className="mt-4">
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <CButton color="secondary" onClick={() => navigate(-1)}>
            Back
          </CButton>
          <h4 className="mb-0">Clinic Details</h4>
          {/* <CButton color="primary me-5" onClick={() => navigate('/add-doctor')}>
            Add Doctor
          </CButton> */}

          <div></div>
        </div>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <CNav variant="tabs" role="tablist">
              {tabList.map((tabName, idx) => (
                <CNavItem key={idx}>
                  <CNavLink
                    className={classNames({ active: activeTab === idx })}
                    onClick={() => setActiveTab(idx)}
                  >
                    {tabName}
                  </CNavLink>
                </CNavItem>
              ))}
            </CNav>

            <CTabContent className="mt-3">
              {/* Tab 1: Basic Details */}
              <CTabPane visible={activeTab === 0}>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel>Clinic Name</CFormLabel>
                      <CFormInput
                        type="text"
                        value={editableClinicData.name || ''}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditableClinicData({ ...editableClinicData, name: e.target.value })
                        }
                      />
                    </CCol>
                   
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel>Contact Number</CFormLabel>
                      <CFormInput
                        type="text"
                        value={editableClinicData.contactNumber || ''}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditableClinicData({
                            ...editableClinicData,
                            contactNumber: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Location</CFormLabel>
                      <CFormInput
                        type="text"
                        value={editableClinicData.city || ''}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditableClinicData({ ...editableClinicData, city: e.target.value })
                        }
                      />
                    </CCol>
                  </CRow>

                  <CButton
                    color="primary"
                    className="me-2"
                    onClick={async () => {
                      if (isEditing) {
                        try {
                          await updateClinicData(hospitalId, editableClinicData)
                          await fetchClinicDetails()
                          setIsEditing(false)
                        } catch (error) {
                          console.error('Error updating clinic:', error)
                        }
                      } else {
                        setIsEditing(true)
                      }
                    }}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </CButton>

                  <CButton color="danger" onClick={() => setShowDeleteModal(true)}>
                    Delete Clinic
                  </CButton>
                </CForm>
              </CTabPane>

              {/* Tab 2: Additional Details */}
              <CTabPane visible={activeTab === 1}>
                <p>
                  <strong>Administrator Name:</strong> {clinicData.address}
                </p>
                <p>
                  <strong>Clinic Registration No:</strong> {clinicData.hospitalRegistrations}
                </p>
                <p>
                  <strong>GST No:</strong> {clinicData.gstNo}
                </p>
                <p>
                  <strong>Status:</strong> {clinicData.status}
                </p>
                <p>
                  <strong>Working Days & Timings:</strong> {clinicData.openingTime}-
                  {clinicData.closingTime}
                </p>
                <p>
                  <strong>Clinic Description:</strong> {clinicData.description}
                </p>
                <p>
                  <strong>Uploaded Documents:</strong>
                </p>
                <ul>
                  {clinicData?.documents?.map((doc, idx) => (
                    <li key={idx}>
                      <a href={doc.url} target="_blank" rel="noreferrer">
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </CTabPane>

              {/* Tab 3: Doctors */}
              <CTabPane visible={activeTab === 2}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Contact</th>
                      <th>Specialization</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDoctors.length > 0 ? (
                      allDoctors.map((doc, idx) => (
                        <tr key={idx}>
                          <td>{doc.doctorName}</td>
                          <td>{doc.doctorMobileNumber}</td>
                          <td>{doc.specialization}</td>
                          <td>{doc.status || 'Active'}</td>{' '}
                          {/* Defaulting to 'Active' if no status is provided */}
                          <td>
                            <CButton
                              size="sm"
                              onClick={() => {
                                setSelectedDoctor(doc)
                                setShowDoctorModal(true)
                              }}
                            >
                              View
                            </CButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Doctors Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CTabPane>

              {/* Tab 4: Appointments */}
              <CTabPane visible={activeTab === 3}>
                {['Past', 'Active', 'Upcoming'].map((group) => (
                  <div key={group} className="mb-4">
                    <h5>{group} Appointments</h5>
                    <ul>
                      {clinicData?.appointments
                        ?.filter((a) => a.status === group)
                        ?.map((appt, idx) => (
                          <li key={idx}>
                            {appt.date} - {appt.patientName} with {appt.doctorName}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </CTabPane>
            </CTabContent>

            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
              <CModalHeader>Delete Clinic</CModalHeader>
              <CModalBody>Are you sure you want to delete this clinic?</CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </CButton>
                <CButton color="danger" onClick={handleDeleteClinic}>
                  Confirm
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal visible={showDoctorModal} onClose={() => setShowDoctorModal(false)}>
              <CModalHeader>Doctor Profile</CModalHeader>
              <CModalBody>
                {selectedDoctor && (
                  <>
                    <p>
                      <strong>Name:</strong> {selectedDoctor.doctorName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {selectedDoctor.doctorMobileNumber}
                    </p>
                    <p>
                      <strong>Specialization:</strong> {selectedDoctor.specialization}
                    </p>
                    <p>
                      <strong>Qualification:</strong> {selectedDoctor.qualification}
                    </p>
                    <p>
                      <strong>Experience:</strong> {selectedDoctor.experience} years
                    </p>
                    <p>
                      <strong>Available Days:</strong> {selectedDoctor.availableDays}
                    </p>
                    <p>
                      <strong>Available Times:</strong> {selectedDoctor.availableTimes}
                    </p>
                    <p>
                      <strong>Languages:</strong> {selectedDoctor.languages?.join(', ')}
                    </p>
                    <p>
                      <strong>Focus Areas:</strong> {selectedDoctor.focusAreas?.join(', ')}
                    </p>
                    <p>
                      <strong>Highlights:</strong> {selectedDoctor.highlights?.join(', ')}
                    </p>
                    <p>
                      <strong>Profile Description:</strong> {selectedDoctor.profileDescription}
                    </p>
                    <p>
                      <strong>Fees:</strong> In-Clinic ₹{selectedDoctor.doctorFees?.inClinicFee},
                      Video ₹{selectedDoctor.doctorFees?.vedioConsultationFee}
                    </p>
                    <p>
                      <strong>Services:</strong>{' '}
                      {selectedDoctor.service?.map((s) => s.serviceName).join(', ')}
                    </p>
                    <p>
                      <strong>Sub Services:</strong>{' '}
                      {selectedDoctor.subSerives?.map((s) => s.subServiceName).join(', ')}
                    </p>
                  </>
                )}
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setShowDoctorModal(false)}>
                  Close
                </CButton>
                <CButton color="primary">Edit</CButton>
              </CModalFooter>
            </CModal>
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default ClinicDetails
