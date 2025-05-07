import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CForm, CFormInput, CInputGroup, CInputGroupText, CButton, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { CustomerData } from './CustomerAPI'
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

  // Fetching customer data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await CustomerData()
        console.log(data)
        setCustomerData(data)
        setFilteredData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch customer data.')
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
          (customer.fullName || '').toLowerCase().startsWith(trimmedQuery) ||
          (customer.mobileNumber || '').toString().startsWith(trimmedQuery) ||
          (customer.emailId || '').toLowerCase().startsWith(trimmedQuery)
        )
      })

      setFilteredData(filtered)
    }

    handleSearch()
  }, [searchQuery, customerData])

  const columns = [
    {
      name: 'Full Name',
      selector: (row) => row.fullName || '-',
      sortable: true,
      style: {
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    {
      name: 'Mobile Number',
      selector: (row) => row.mobileNumber || '-',
      sortable: true,
    },

    {
      name: 'Gender',
      selector: (row) => row.gender || '-',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <CButton
          color="primary"
          size="sm"
          onClick={() => handleCustomerViewDetails(row.mobileNumber)}
        >
          View
        </CButton>
      ),
    },
  ]

  const handleCustomerViewDetails = (mobileNumber) => {
    navigate(`/customer-management/${mobileNumber}`)
  }

  const centeredMessageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '1.5rem',
    color: '#808080',
  }

  const fetchCustomers = async () => {
    try {
      const data = await CustomerData()
      if (data) {
        setCustomerData(data)
        setFilteredData(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [searchQuery])
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
      ) : (
        <CTable hover striped responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Full Name</CTableHeaderCell>
              <CTableHeaderCell>Mobile Number</CTableHeaderCell>
              {/* <CTableHeaderCell>Email</CTableHeaderCell> */}
              <CTableHeaderCell>Gender</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((customer, index) => (
              <CTableRow key={index}>
                <CTableDataCell style={{ fontSize: '20px' }}>
                  {customer.fullName || '-'}
                </CTableDataCell>

                <CTableDataCell>{customer.mobileNumber || '-'}</CTableDataCell>
                {/* <CTableDataCell>{customer.emailId || '-'}</CTableDataCell> */}
                <CTableDataCell>{customer.gender || '-'}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => handleCustomerViewDetails(customer.mobileNumber)}
                  >
                    View
                  </CButton>
                  <CButton
                    className="ms-3 text-white"
                    color="warning"
                    size="sm"
                    onClick={() => handleCustomerViewDetails(customer.mobileNumber)}
                  >
                    Edit
                  </CButton>
                  <CButton
                    className="ms-3 text-white"
                    color="danger"
                    size="sm"
                    onClick={() => handleCustomerViewDetails(customer.mobileNumber)}
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </>
  )
}

export default React.memo(CustomerManagement)
