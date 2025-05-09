import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CForm, CFormInput, CInputGroup, CInputGroupText, CButton, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { CustomerData, deleteCustomerData } from './CustomerAPI'
import {
  CTable,
  CTableHead,
  CTableRow,              
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { toast } from 'react-toastify'

const CustomerManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [customerData, setCustomerData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Centered message style
  const centeredMessageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '1.5rem',
    color: '#808080',
  }

  // Fetching customer data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await CustomerData()
        // Ensure data is always an array and filter out any invalid entries
        const safeData = Array.isArray(data) 
          ? data.filter(item => item && typeof item === 'object') 
          : []
        setCustomerData(safeData)
        setFilteredData(safeData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch customer data.')
        setCustomerData([])
        setFilteredData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handling search functionality
  useEffect(() => {
    const handleSearch = () => {
      const trimmedQuery = searchQuery.toLowerCase().trim()
      if (!trimmedQuery) {
        setFilteredData(customerData)
        return
      }

      const filtered = customerData.filter((customer) => {
        return (
          (customer?.fullName || '').toLowerCase().includes(trimmedQuery) ||
          (customer?.mobileNumber || '').toString().includes(trimmedQuery) ||
          (customer?.emailId || '').toLowerCase().includes(trimmedQuery)
        )
      })

      setFilteredData(filtered)
    }

    handleSearch()
  }, [searchQuery, customerData])

  const handleCustomerViewDetails = (mobileNumber) => {
    navigate(`/customer-management/${mobileNumber}`)
  }

  const handleDeleteCustomer = async(mobileNumber) => {
    const confirmed = window.confirm("Are you sure you want to delete this customer")
    if (!confirmed) return
    try {
      await deleteCustomerData(mobileNumber)
      toast.success('Customer deleted Successfully')
      // Refresh the customer list after deletion
      const updatedData = customerData.filter(customer => customer?.mobileNumber !== mobileNumber)
      setCustomerData(updatedData)
      setFilteredData(updatedData)
    } catch (error) {
      console.log('Delete failed:', error)
      toast.error('Failed to delete customer')
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await CustomerData()
      const safeData = Array.isArray(data) 
        ? data.filter(item => item && typeof item === 'object') 
        : []
      setCustomerData(safeData)
      setFilteredData(safeData)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomerData([])
      setFilteredData([])
    }
  }

  return (
    <>
      <CRow className="d-flex align-items-center mb-3">
        <div className="col-md-9 d-flex">
          <CForm className="w-100">
            <CInputGroup>
              <CFormInput
                type="text"
                placeholder="Search by name, mobile, or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
            </CInputGroup>
          </CForm>
        </div>

        <div className="col-md-3 d-flex justify-content-end">
          <CButton className="btn btn-primary w-100">Add New Customer</CButton>
        </div>
      </CRow>

      {loading ? (
        <div style={centeredMessageStyle}>Loading...</div>
      ) : error ? (
        <div style={centeredMessageStyle}>{error}</div>
      ) : filteredData.length === 0 ? (
        <div style={centeredMessageStyle}>No Customer Data Found</div>
      ) : (
        <CTable hover striped responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Full Name</CTableHeaderCell>
              <CTableHeaderCell>Mobile Number</CTableHeaderCell>
              <CTableHeaderCell>Gender</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((customer, index) => (
              customer && (
                <CTableRow key={index}>
                  <CTableDataCell style={{ fontSize: '20px' }}>
                    {customer?.fullName || '-'}
                  </CTableDataCell>
                  <CTableDataCell>{customer?.mobileNumber || '-'}</CTableDataCell>
                  <CTableDataCell>{customer?.gender || '-'}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() => handleCustomerViewDetails(customer?.mobileNumber)}
                    >
                      View
                    </CButton>
                    <CButton
                      className="ms-3 text-white"
                      color="warning"
                      size="sm"
                      onClick={() => handleCustomerViewDetails(customer?.mobileNumber)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      className="ms-3 text-white"
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer?.mobileNumber)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
            ))}
          </CTableBody>
        </CTable>
      )}
    </>
  )
}

export default React.memo(CustomerManagement)