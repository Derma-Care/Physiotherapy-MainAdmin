import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CButton,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import {
  getCustomerDataByID,
  updateCustomerData,
    CategoryData,
} from './CustomerAPI'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CustomerViewDetails = () => {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [editedCustomer, setEditedCustomer] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [mobileError, setMobileError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState('')
   const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [error, setError] = useState({
    mobileNumber: '',
    fullName: '',
    emailId: '',
    gender: '',
    status: '',
  })

  useEffect(() => {
    fetchData()
    fetchService()
  }, [])

  useEffect(() => {
    if (id) {
      fetchCustomer()
      fetchAppointments()
      fetchService()
      fetchData()
    }
  }, [id])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleEditClick = () => {
    setEditMode(!editMode)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setEditedCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    setError((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  const validateBasicFields = () => {
    const newErrors = {}

    if (!editedCustomer.fullName?.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }

    if (!editedCustomer.emailId?.trim()) {
      newErrors.emailId = 'Email is required.'
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
      if (!emailRegex.test(editedCustomer.emailId)) {
        newErrors.emailId = 'Please enter a valid Gmail address.'
      }
    }

    if (!editedCustomer.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required.'
    } else if (editedCustomer.mobileNumber.toString().length !== 10) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits long.'
    }

    if (!editedCustomer.gender?.trim()) {
      newErrors.gender = 'Gender is required.'
    }

    if (!editedCustomer.status?.trim()) {
      newErrors.status = 'Status is required.'
    }

    setError(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleUpdateClick = async () => {
    if (!validateBasicFields()) {
      return
    }

    const { id, ...updatedCustomerData } = editedCustomer

    updatedCustomerData.status = pendingStatus || updatedCustomerData.status

    try {
      await updateCustomerData(updatedCustomerData.mobileNumber, updatedCustomerData)
      setCustomer(updatedCustomerData)
      setEditMode(false)
      toast.success('Customer details updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })
    } catch (error) {
      toast.error(error.message, { position: 'top-right' })
    }
  }

  const handleSuspendSubmit = async () => {
    if (!remark) {
      toast.error('Please enter remarks for suspension.', { position: 'top-right' })
      return
    }

    const mobileNumber = editedCustomer.mobileNumber
    if (!mobileNumber) {
      toast.error('Invalid mobile number.', { position: 'top-right' })
      return
    }

    try {
      console.log('Submitting suspension with data:', {
        ...editedCustomer,
        status: 'suspended',
        remark,
      })

      await updateCustomerData(mobileNumber, {
        ...editedCustomer,
        status: 'suspended',
        remark,
      })

      toast.success('Customer suspended successfully!', { position: 'top-right' })
    } catch (error) {
      console.error('Error suspending customer:', error)
      toast.error('Failed to suspend customer.', { position: 'top-right' })
    } finally {
      setShowSuspendModal(false)
      setRemark('')
      fetchCustomer()
    }
  }

  const handleStatusSubmit = async () => {
    if (!pendingStatus) {
      toast.error('Please select a status.', { position: 'top-right' })
      return
    }

    const mobileNumber = editedCustomer.mobileNumber
    if (!mobileNumber) {
      toast.error('Invalid mobile number.', { position: 'top-right' })
      return
    }

    try {
      console.log('Submitting status update with data:', {
        ...editedCustomer,
        status: pendingStatus,
        remark,
      })

      await updateCustomerData(mobileNumber, {
        ...editedCustomer,
        status: pendingStatus,
        remark,
      })

      setCustomer((prev) => ({ ...prev, status: pendingStatus }))
      toast.success('Customer status updated successfully!', { position: 'top-right' })
    } catch (error) {
      console.error('Error updating customer status:', error)
      toast.error(error.message, { position: 'top-right' })
    } finally {
      setShowStatusModal(false)
      setRemark('')
    }
  }
const handleCancelModal = () => {
    setShowStatusModal(false)
    setPendingStatus('')
    setRemark('')
  }

  const handleSuspendClick = () => {
    setRemark(customer.remark || '')
    setShowSuspendModal(true)
  }
  const handleCancelClick = () => {
    setEditMode(false)
    setEditedCustomer(customer)
    setMobileError('')
    setEmailError('')
  }

  const centeredMessageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '1.5rem',
    color: '#808080',
  }
  return (
    <div>
      <ToastContainer />
      {customer ? (
        <>
          <CCard>
            <CCardHeader>Customer Details</CCardHeader>
            <CCardBody>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink
                    href="#"
                    active={activeTab === 'basic'}
                    onClick={() => handleTabClick('basic')}
                  >
                    Basic Details
                  </CNavLink>
                </CNavItem>
               
               
              </CNav>
            </CCardBody>
          </CCard>

          {activeTab === 'basic' && (
            <CAccordion className="mt-4" activeItemKey={1}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                  <span>Basic Profile</span>
                  <span
                    style={{
                      marginLeft: '10px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      backgroundColor:
                        customer.status === 'active'
                          ? 'green'
                          : customer.status === 'inactive'
                            ? 'orange'
                            : customer.status === 'suspended'
                              ? 'red'
                              : 'gray',
                    }}
                  />
                </CAccordionHeader>
                <CAccordionBody>
                  <div className="position-relative mt-3">
                    {editMode && (
                      <CButton
                        color="warning"
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </CButton>
                    )}
                    {editMode ? (
                      <>
                        <CButton color="primary" onClick={handleUpdateClick}>
                          Update
                        </CButton>
                      </>
                    ) : (
                      <CButton color="secondary" onClick={handleEditClick}>
                        Edit
                      </CButton>
                    )}
                    <CButton color="danger" className="m-3" onClick={handleSuspendClick}>
                      Suspend
                    </CButton>
                  </div>
                  <div className="customer-details-grid mt-4" style={gridStyle}>
                    <p>
                      <strong>Full Name : </strong>{' '}
                      {editMode ? (
                        <>
                          <CFormInput
                            type="text"
                            name="fullName"
                            value={editedCustomer.fullName}
                            onChange={handleInputChange}
                          />
                          {error.fullName && <span className="text-danger">{error.fullName}</span>}
                        </>
                      ) : (
                        editedCustomer.fullName
                      )}
                    </p>

                    <p>
                      <strong>Email : </strong>{' '}
                      {editMode ? (
                        <>
                          <CFormInput
                            type="text"
                            name="emailId"
                            value={editedCustomer.emailId || ''}
                            onChange={handleInputChange}
                          />
                          {error.emailId && <span className="text-danger">{error.emailId}</span>}
                        </>
                      ) : (
                        editedCustomer.emailId
                      )}
                    </p>

                  
                    <p>
                      <strong>Mobile Number : </strong>{' '}
                      {editMode ? (
                        <>
                          <CFormInput
                            type="tel"
                            name="mobileNumber"
                            value={editedCustomer.mobileNumber}
                            onChange={handleInputChange}
                          />
                          {error.mobileNumber && (
                            <span className="text-danger">{error.mobileNumber}</span>
                          )}
                        </>
                      ) : (
                        editedCustomer.mobileNumber
                      )}
                    </p>

                    <p>
                      <strong>Gender : </strong>{' '}
                      {editMode ? (
                        <>
                          <CFormSelect
                            name="gender"
                            value={editedCustomer.gender || ''}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </CFormSelect>
                          {error.gender && <span className="text-danger">{error.gender}</span>}
                        </>
                      ) : (
                        editedCustomer.gender || 'NA'
                      )}
                    </p>

                    <p>
                      <strong>Status : </strong>{' '}
                      {editMode ? (
                        <>
                          <CFormSelect
                            name="status"
                            value={pendingStatus || editedCustomer.status}
                            onChange={(e) => {
                              setPendingStatus(e.target.value)
                              setEditedCustomer({ ...editedCustomer, status: e.target.value })
                            }}
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </CFormSelect>
                          {error.status && <span className="text-danger">{error.status}</span>}
                        </>
                      ) : (
                        editedCustomer.status || 'NA'
                      )}
                    </p>

                   
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          )}

          {activeTab === 'address' && (
            <CAccordion className="mt-4" activeItemKey={2}>
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>Address Details</CAccordionHeader>
                <CAccordionBody>
                  <div>
                    <CButton color="success" onClick={addNewAddress} style={{ float: 'right' }}>
                      + Add Address
                    </CButton>
                  </div>
                  <div style={{ marginTop: '40px' }}>
                    {isAddingNewAddress && (
                      <CCard style={{ marginBottom: '1rem' }}>
                        <CCardBody>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
                              gap: '1rem',
                              marginTop: '1rem',
                            }}
                          >
                            <div
                              style={{
                                gridColumn: 'span 3',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '10px',
                              }}
                            >
                              <CButton
                                color="warning"
                                style={{ marginRight: '10px' }}
                                onClick={handleCancelAddAddress}
                              >
                                Cancel
                              </CButton>
                              <CButton color="primary" onClick={handleSaveNewAddress}>
                                Save
                              </CButton>
                            </div>

                            <div>
                              <h6>
                                House No : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="text"
                                name="houseNo"
                                value={newAddress.houseNo}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.houseNo && (
                                <div style={{ color: 'red' }}>{addressErrors.houseNo}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                Appointment : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="text"
                                name="apartment"
                                value={newAddress.apartment}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.apartment && (
                                <div style={{ color: 'red' }}>{addressErrors.apartment}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                Street <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="text"
                                name="street"
                                value={newAddress.street}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.street && (
                                <div style={{ color: 'red' }}>{addressErrors.street}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                City : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.city && (
                                <div style={{ color: 'red' }}>{addressErrors.city}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                Latitude : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="number"
                                name="latitude"
                                value={newAddress.latitude}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.latitude && (
                                <div style={{ color: 'red' }}>{addressErrors.latitude}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                Longitude : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="number"
                                name="longitude"
                                value={newAddress.longitude}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.longitude && (
                                <div style={{ color: 'red' }}>{addressErrors.longitude}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                State : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="text"
                                name="state"
                                value={newAddress.state}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.state && (
                                <div style={{ color: 'red' }}>{addressErrors.state}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                Postal Code : <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="number"
                                name="postalCode"
                                value={newAddress.postalCode}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.postalCode && (
                                <div style={{ color: 'red' }}>{addressErrors.postalCode}</div>
                              )}
                            </div>

                            <div>
                              <h6>
                                Country <span style={{ color: 'red' }}>*</span>
                              </h6>
                              <CFormInput
                                type="text"
                                name="country"
                                value={newAddress.country}
                                onChange={handleAddressInputChanges}
                              />
                              {addressErrors.country && (
                                <div style={{ color: 'red' }}>{addressErrors.country}</div>
                              )}
                            </div>
                          </div>
                        </CCardBody>
                      </CCard>
                    )}
                  </div>

                  <div style={{ marginTop: '50px' }}>
                    {Array.isArray(editedAddress) && editedAddress.length > 0 ? (
                      editedAddress.map((address, index) => (
                        <CCard key={`address-${index}`} style={{ marginBottom: '1rem' }}>
                          <CCardBody>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                                marginTop: '1rem',
                              }}
                            >
                              <div
                                style={{
                                  gridColumn: 'span 3',
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  marginTop: '10px',
                                }}
                              >
                                {editAddressMode[index] ? (
                                  <>
                                    <CButton
                                      color="warning"
                                      style={{ position: 'absolute', top: '10px', right: '10px' }}
                                      onClick={() => handleAddressCancelClick(index)}
                                    >
                                      Cancel
                                    </CButton>
                                    <CButton
                                      color="primary"
                                      style={{ position: 'absolute', top: '10px', left: '10px' }}
                                      onClick={() => handleAddressUpdateClick(index)}
                                    >
                                      Update
                                    </CButton>
                                  </>
                                ) : (
                                  <CButton
                                    color="secondary"
                                    style={{
                                      position: 'absolute',
                                      top: '10px',
                                      left: '10px',
                                      marginBottom: '20px',
                                    }}
                                    onClick={() => handleAddressEditClick(index)}
                                  >
                                    Edit
                                  </CButton>
                                )}

                                {!editAddressMode[index] && (
                                  <CButton
                                    color="danger"
                                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                                    onClick={() => removeAddress(index)}
                                  >
                                    Remove
                                  </CButton>
                                )}
                              </div>
                              {/* Address Fields */}
                              <div>
                                <strong>House No: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="houseNo"
                                      value={editedAddress[index]?.houseNo || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.houseNo && (
                                      <span className="text-danger">
                                        {addressErrors[index].houseNo}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.houseNo || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>Apartment: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="apartment"
                                      value={editedAddress[index]?.apartment || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.apartment && (
                                      <span className="text-danger">
                                        {addressErrors[index].apartment}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.apartment || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>Street: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="street"
                                      value={editedAddress[index]?.street || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.street && (
                                      <span className="text-danger">
                                        {addressErrors[index].street}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.street || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>City: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="city"
                                      value={editedAddress[index]?.city || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.city && (
                                      <span className="text-danger">
                                        {addressErrors[index].city}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.city || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>State: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="state"
                                      value={editedAddress[index]?.state || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.state && (
                                      <span className="text-danger">
                                        {addressErrors[index].state}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.state || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>Postal Code: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="postalCode"
                                      value={editedAddress[index]?.postalCode || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.postalCode && (
                                      <span className="text-danger">
                                        {addressErrors[index].postalCode}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.postalCode || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>Country: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="text"
                                      name="country"
                                      value={editedAddress[index]?.country || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.country && (
                                      <span className="text-danger">
                                        {addressErrors[index].country}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.country || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>Latitude: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="number"
                                      name="latitude"
                                      value={editedAddress[index]?.latitude || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.latitude && (
                                      <span className="text-danger">
                                        {addressErrors[index].latitude}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.latitude || 'NA'
                                )}
                              </div>

                              <div>
                                <strong>Longitude: </strong>
                                {editAddressMode[index] ? (
                                  <>
                                    <CFormInput
                                      type="number"
                                      name="longitude"
                                      value={editedAddress[index]?.longitude || ''}
                                      onChange={(e) => handleAddressInputChange(e, index)}
                                    />
                                    {addressErrors[index]?.longitude && (
                                      <span className="text-danger">
                                        {addressErrors[index].longitude}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  address.longitude || 'NA'
                                )}
                              </div>
                            </div>
                          </CCardBody>
                        </CCard>
                      ))
                    ) : (
                      <div>No address data available</div>
                    )}
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          )}

          {activeTab === 'Appointments' && (
            <CAccordion className="mt-4" activeItemKey={0}>
              <CAccordionItem itemKey={0}>
                <CAccordionHeader>Appointment Details</CAccordionHeader>

                <div style={{ marginTop: '20px' }}>
                  <CButton
                    color="success"
                    style={{
                      float: 'right',
                      marginBottom: '1rem',
                      marginRight: '30px',
                    }}
                    onClick={addNewAppointment}
                  >
                    Book Appointment
                  </CButton>
                </div>
                <div style={{ marginTop: '80px' }}>
                  {isAddingNewAppointment && (
                    <CCard style={{ marginBottom: '1rem' }}>
                      <CCardBody>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1rem',
                            marginTop: '1rem',
                          }}
                        >
                          <div
                            style={{
                              gridColumn: 'span 3',
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: '1rem',
                            }}
                          >
                            <CButton color="primary" onClick={handleSaveNewAppointment}>
                              Save
                            </CButton>
                            <CButton color="warning" onClick={handleCancelAddAppointment}>
                              Cancel
                            </CButton>
                          </div>

                          {/* Patient Details Section */}
                          <div style={{ gridColumn: 'span 3' }}>
                            <CCardHeader
                              style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '20px',
                              }}
                            >
                              Patient Details
                            </CCardHeader>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                              }}
                            >
                              <div>
                                <h6>
                                  Category Name <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormSelect
                                  name="categoryName"
                                  value={service.categoryName || ''}
                                  onChange={handleCategoryChange}
                                >
                                  <option value="">Select Category</option>
                                  {categoryList.length > 0 ? (
                                    categoryList.map((categoryItem, index) => (
                                      <option key={index} value={categoryItem.categoryName}>
                                        {categoryItem.categoryName}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>Loading categories...</option>
                                  )}
                                </CFormSelect>
                              </div>

                              <div>
                                <h6>
                                  Patient Name <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="patientName"
                                  value={newAppointment.patientName}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.patientName && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.patientName}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Relationship <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="relationShip"
                                  value={newAppointment.relationShip}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.relationShip && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.relationShip}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Gender <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormSelect
                                  name="gender"
                                  value={newAppointment.gender}
                                  onChange={handleNewAppointmentInputChanges}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </CFormSelect>
                                {AppointmentErrors.gender && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.gender}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Email ID <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="email"
                                  name="emailId"
                                  value={newAppointment.emailId}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.emailId && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.emailId}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Age <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="age"
                                  value={newAppointment.age}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.age && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.age}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Patient Number <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="number"
                                  name="patientNumber"
                                  value={newAppointment.patientNumber}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.patientNumber && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.patientNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ gridColumn: 'span 3' }}>
                            <CCardHeader
                              style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '20px',
                              }}
                            >
                              Patient Appointment
                            </CCardHeader>
                            <div style={{ gridColumn: 'span 3', position: 'relative' }}>
                              <CButton
                                color="secondary"
                                onClick={() =>
                                  setNewAppointment((prev) => ({
                                    ...prev,
                                    servicesAdded: [
                                      ...prev.servicesAdded,
                                      {
                                        serviceName: '',
                                        pricing: 0,
                                        discount: 0,
                                        discountAmount: 0,
                                        discountedCost: 0,
                                        tax: 0,
                                        taxAmount: 0,
                                        finalCost: 0,
                                        serviceStartDate: '',
                                        serviceEndDate: '',
                                        startTime: '',
                                        endTime: '',
                                        numberOfDays: 0,
                                        numberOfHours: 0,
                                      },
                                    ],
                                  }))
                                }
                                style={{
                                  position: 'absolute',
                                  marginTop: '-25px',
                                  right: '10px',
                                  zIndex: 10,
                                  marginBottom: '10px',
                                }}
                              >
                                Add Service
                              </CButton>
                              <div style={{ marginTop: '30px' }}>
                                {newAppointment.servicesAdded.map((service, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(4, 1fr)',
                                      gap: '1rem',
                                      marginBottom: '1rem',
                                      paddingTop: '30px',
                                    }}
                                  >
                                    {/* Service Name */}
                                    <div>
                                      <h6>
                                        Service Name <span style={{ color: 'red' }}>*</span>
                                      </h6>
                                      <CFormSelect
                                        name={`serviceName-${index}`}
                                        value={service.serviceName || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                      >
                                        <option value="">Select Service</option>
                                        {filteredServiceList && filteredServiceList.length > 0 ? (
                                          filteredServiceList.map((serviceOption, i) => (
                                            <option key={i} value={serviceOption.serviceName}>
                                              {serviceOption.serviceName}
                                            </option>
                                          ))
                                        ) : (
                                          <option value="">
                                            No services available for this category
                                          </option>
                                        )}
                                      </CFormSelect>
                                    </div>

                                    {/* Price */}
                                    <div>
                                      <h6>Price</h6>
                                      <CFormInput
                                        type="number"
                                        name={`price-${index}`}
                                        value={service.price || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                      />
                                    </div>

                                    {/* Discount */}
                                    <div>
                                      <h6>Discount (%)</h6>
                                      <CFormInput
                                        type="number"
                                        name={`discount-${index}`}
                                        value={service.discount || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                      />
                                    </div>

                                    {/* Discount Amount */}
                                    <div>
                                      <h6>Discount Amount</h6>
                                      <CFormInput
                                        type="number"
                                        name={`discountAmount-${index}`}
                                        value={service.discountAmount || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                        readOnly
                                      />
                                    </div>

                                    {/* Discounted Cost */}
                                    <div>
                                      <h6>Discounted Cost</h6>
                                      <CFormInput
                                        type="number"
                                        name={`discountedCost-${index}`}
                                        value={service.discountedCost || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                        readOnly
                                      />
                                    </div>

                                    {/* Tax */}
                                    <div>
                                      <h6>Tax (%)</h6>
                                      <CFormInput
                                        type="number"
                                        name={`tax-${index}`}
                                        value={service.tax || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                      />
                                    </div>

                                    {/* Tax Amount */}
                                    <div>
                                      <h6>Tax Amount</h6>
                                      <CFormInput
                                        type="number"
                                        name={`taxAmount-${index}`}
                                        value={service.taxAmount || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                        readOnly
                                      />
                                    </div>

                                    {/* Final Cost */}
                                    <div>
                                      <h6>Final Cost</h6>
                                      <CFormInput
                                        type="number"
                                        name={`finalCost-${index}`}
                                        value={service.finalCost || ''}
                                        onChange={(e) => handleServiceChange(e, index)}
                                        readOnly
                                      />
                                    </div>

                                    <div>
                                      <h6>
                                        Start Date <span style={{ color: 'red' }}>*</span>
                                      </h6>
                                      <CFormInput
                                        type="date"
                                        name={`serviceStartDate-${index}`}
                                        value={service.serviceStartDate || ''}
                                        onChange={(e) =>
                                          handleDateChange(e, index, 'serviceStartDate')
                                        }
                                      />
                                      {AppointmentErrors[`serviceStartDate-${index}`] && (
                                        <span style={{ color: 'red' }}>
                                          {AppointmentErrors[`serviceStartDate-${index}`]}
                                        </span>
                                      )}
                                    </div>

                                    <div>
                                      <h6>
                                        End Date <span style={{ color: 'red' }}>*</span>
                                      </h6>
                                      <CFormInput
                                        type="date"
                                        name={`serviceEndDate-${index}`}
                                        value={service.serviceEndDate || ''}
                                        onChange={(e) =>
                                          handleDateChange(e, index, 'serviceEndDate')
                                        }
                                      />
                                      {AppointmentErrors[`serviceEndDate-${index}`] && (
                                        <span style={{ color: 'red' }}>
                                          {AppointmentErrors[`serviceEndDate-${index}`]}
                                        </span>
                                      )}
                                    </div>

                                    <div>
                                      <h6>Number of Days : </h6>
                                      <CFormInput
                                        type="number"
                                        name={`numberOfDays-${index}`}
                                        value={service.numberOfDays || 0}
                                        readOnly
                                      />
                                    </div>

                                    <div>
                                      <h6>
                                        Start Time <span style={{ color: 'red' }}>*</span>
                                      </h6>
                                      <CFormInput
                                        type="time"
                                        name={`startTime-${index}`}
                                        value={service.startTime || ''}
                                        onChange={(e) => handleTimeChange(e, index, 'startTime')}
                                      />
                                    </div>

                                    <div>
                                      <h6>
                                        End Time <span style={{ color: 'red' }}>*</span>
                                      </h6>
                                      <CFormInput
                                        type="time"
                                        name={`endTime-${index}`}
                                        value={service.endTime || ''}
                                        onChange={(e) => handleTimeChange(e, index, 'endTime')}
                                      />
                                    </div>

                                    <div>
                                      <h6>Number of Hours and Minutes: </h6>
                                      <CFormInput
                                        type="text"
                                        name={`numberOfHoursAndMinutes-${index}`}
                                        value={
                                          service.numberOfHours !== undefined &&
                                          service.numberOfMinutes !== undefined
                                            ? `${service.numberOfHours} hrs ${service.numberOfMinutes} mins`
                                            : ''
                                        }
                                        readOnly
                                      />
                                    </div>

                                    {/* Remove Service Button */}
                                    <CButton
                                      color="danger"
                                      onClick={() => handleRemoveService(index)}
                                      style={{
                                        position: 'absolute',
                                        right: '10px',
                                        marginTop: '260px',
                                        zIndex: 10,
                                      }}
                                    >
                                      Cancel
                                    </CButton>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <strong>Total Cost </strong>
                                <CFormInput
                                  type="text"
                                  name="totalCost"
                                  style={{ width: '100px' }}
                                  value={newAppointment.totalCost || ''}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Address Section */}
                          <div style={{ gridColumn: 'span 3' }}>
                            <CCardHeader
                              style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '20px',
                              }}
                            >
                              Patient Address
                            </CCardHeader>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                              }}
                            >
                              <div>
                                <h6>
                                  House No <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="houseNo"
                                  value={newAppointment.addressDto.houseNo}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.houseNo && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.houseNo}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Apartment <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="apartment"
                                  value={newAppointment.addressDto.apartment}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.apartment && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.apartment}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Street <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="street"
                                  value={newAppointment.addressDto.street}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.street && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.street}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Latitude <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="number"
                                  name="latitude"
                                  value={newAppointment.addressDto.latitude}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.latitude && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.latitude}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  longitude <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="number"
                                  name="longitude"
                                  value={newAppointment.addressDto.longitude}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.longitude && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.longitude}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Direction <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="direction"
                                  value={newAppointment.addressDto.direction}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.direction && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.direction}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  City <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="city"
                                  value={newAppointment.addressDto.city}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.city && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.city}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  State <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="state"
                                  value={newAppointment.addressDto.state}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.state && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.state}</span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Postal Code <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="number"
                                  name="postalCode"
                                  value={newAppointment.addressDto.postalCode}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.postalCode && (
                                  <span style={{ color: 'red' }}>
                                    {AppointmentErrors.postalCode}
                                  </span>
                                )}
                              </div>

                              <div>
                                <h6>
                                  Country <span style={{ color: 'red' }}>*</span>
                                </h6>
                                <CFormInput
                                  type="text"
                                  name="country"
                                  value={newAppointment.addressDto.country}
                                  onChange={handleNewAppointmentInputChanges}
                                />
                                {AppointmentErrors.country && (
                                  <span style={{ color: 'red' }}>{AppointmentErrors.country}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  )}
                </div>

                <CAccordionItem itemKey={4}>
                  <CAccordionHeader>Past Appointments</CAccordionHeader>
                  <CAccordionBody>
                    {renderAppointmentList(completedAppointments, 'Past Appointments')}
                  </CAccordionBody>
                </CAccordionItem>
                <CAccordionItem itemKey={2}>
                  <CAccordionHeader>Active Appointments</CAccordionHeader>
                  <CAccordionBody>
                    {renderAppointmentList(activeAppointments, 'Active Appointments')}
                  </CAccordionBody>
                </CAccordionItem>

                <CAccordionItem itemKey={3}>
                  <CAccordionHeader>Upcoming Appointments</CAccordionHeader>
                  <CAccordionBody>
                    {renderAppointmentList(upcomingAppointments, 'Upcoming Appointments')}
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordionItem>
            </CAccordion>
          )}

          <CModal visible={showStatusModal} onClose={handleCancelModal}>
            <CModalHeader>Update Customer Status</CModalHeader>
            <CModalBody>
              <CFormSelect
                name="status"
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
              <CFormInput
                type="text"
                placeholder="Enter remarks (optional)"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="mt-2"
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={handleCancelModal}>
                Cancel
              </CButton>
              <CButton color="primary" onClick={handleStatusSubmit}>
                Update Status
              </CButton>
            </CModalFooter>
          </CModal>
          <CModal visible={showSuspendModal} onClose={() => setShowSuspendModal(false)}>
            <CModalHeader>Suspend Customer</CModalHeader>
            <CModalBody>
              <CFormInput
                type="text"
                placeholder="Remarks"
                value={remark}
                onChange={handleRemarkChange}
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowSuspendModal(false)}>
                Close
              </CButton>
              <CButton color="danger" onClick={handleSuspendSubmit}>
                Suspend Customer
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      ) : (
        <div style={centeredMessageStyle}>Loading customer details...</div>
      )}
    </div>
  )
}

export default CustomerViewDetails
