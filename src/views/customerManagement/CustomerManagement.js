import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';
import { CustomerData, deleteCustomerData, addCustomer, getCustomerByMobile, updateCustomerData } from './CustomerAPI';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMobile, setCurrentMobile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    gender: '',
    emailId: '',
    dateOfBirth: '',
    referCode: '',
  });

  const centeredMessageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '1.5rem',
    color: '#808080',
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerData();
      const safeData = Array.isArray(data)
        ? data.filter(item => item && typeof item === 'object')
        : [];
      setCustomerData(safeData);
      setFilteredData(safeData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customer data.');
      setCustomerData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const trimmedQuery = searchQuery.toLowerCase().trim();
    if (!trimmedQuery) {
      setFilteredData(customerData);
      setCurrentPage(1);
      return;
    }

    const filtered = customerData.filter((customer) => {
      return (
        (customer?.fullName || '').toLowerCase().includes(trimmedQuery) ||
        (customer?.mobileNumber || '').toString().includes(trimmedQuery) ||
        (customer?.emailId || '').toLowerCase().includes(trimmedQuery)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, customerData]);

  const handleCustomerViewDetails = (mobileNumber) => {
    navigate(`/customer-management/${mobileNumber}`);
  };

  const handleDeleteCustomer = async (mobileNumber) => {
    const confirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;

    try {
      await deleteCustomerData(mobileNumber);
      toast.success('Customer deleted successfully');
      const updatedData = customerData.filter(customer => customer?.mobileNumber !== mobileNumber);
      setCustomerData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleEditCustomer = async (mobileNumber) => {
    try {
      setLoading(true);
      const response = await getCustomerByMobile(mobileNumber);
      const customer = response.data || response;
      
      console.log('Customer data:', customer); // Debug: Check what's actually being returned
  
      // Safely handle date formatting
      let formattedDate = '';
      if (customer.dateOfBirth) {
        try {
          // Check if date is already in YYYY-MM-DD format (what input type="date" expects)
          if (/^\d{4}-\d{2}-\d{2}$/.test(customer.dateOfBirth)) {
            formattedDate = customer.dateOfBirth;
          } 
          // Handle DD/MM/YYYY format
          else if (customer.dateOfBirth.includes('/')) {
            const parts = customer.dateOfBirth.split('/');
            if (parts.length === 3) {
              const [day, month, year] = parts;
              formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
          }
        } catch (e) {
          console.warn('Failed to format date:', e);
        }
      }
      
      setFormData({
        fullName: customer.fullName || '',
        mobileNumber: customer.mobileNumber || '',
        gender: customer.gender || '',
        emailId: customer.emailId || '',
        dateOfBirth: formattedDate,
        referCode: customer.referCode || '',
      });
      
      setCurrentMobile(mobileNumber);
      setIsEditing(true);
      setIsAdding(true);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      toast.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCustomerData(currentMobile, formData);
        toast.success('Customer updated successfully!');
      } else {
        await addCustomer(formData);
        toast.success('Customer added successfully!');
      }
      
      setIsAdding(false);
      setIsEditing(false);
      setCurrentMobile(null);
      setFormData({
        fullName: '',
        mobileNumber: '',
        gender: '',
        emailId: '',
        dateOfBirth: '',
        referCode: '',
      });
      await fetchCustomers(); // Refresh data after update
    } catch (error) {
      console.error('Operation failed:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} customer: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentMobile(null);
    setFormData({
      fullName: '',
      mobileNumber: '',
      gender: '',
      emailId: '',
      dateOfBirth: '',
      referCode: '',
    });
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {!isAdding ? (
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
              <CButton className="btn btn-primary w-auto" onClick={() => setIsAdding(true)}>
                Add New Customer
              </CButton>
            </div>
          </CRow>

          {loading ? (
            <div style={centeredMessageStyle}>Loading...</div>
          ) : error ? (
            <div style={centeredMessageStyle}>{error}</div>
          ) : filteredData.length === 0 ? (
            <div style={centeredMessageStyle}>No Customer Data Found</div>
          ) : (
            <>
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
                  {paginatedData.map((customer, index) => (
                    <CTableRow key={customer.mobileNumber || index}>
                      <CTableDataCell>{customer?.fullName || '-'}</CTableDataCell>
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
                          onClick={() => handleEditCustomer(customer?.mobileNumber)}
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
                  ))}
                </CTableBody>
              </CTable>

              {Math.ceil(filteredData.length / itemsPerPage) > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <CPagination align="center">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>

                    {Array.from(
                      { length: Math.ceil(filteredData.length / itemsPerPage) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}

                    <CPaginationItem
                      disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <h4 className="mb-4">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h4>
          <CForm onSubmit={handleFormSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Full Name</CFormLabel>
                <CFormInput 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  required 
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Mobile Number</CFormLabel>
                <CFormInput 
                  name="mobileNumber" 
                  value={formData.mobileNumber} 
                  onChange={handleInputChange} 
                  required 
                  disabled={isEditing}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Email ID</CFormLabel>
                <CFormInput 
                  name="emailId" 
                  value={formData.emailId} 
                  onChange={handleInputChange} 
                  type="email"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Date of Birth</CFormLabel>
                <CFormInput 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange} 
                  type="date" 
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Gender</CFormLabel>
                <CFormSelect 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Refer Code</CFormLabel>
                <CFormInput 
                  name="referCode" 
                  value={formData.referCode} 
                  onChange={handleInputChange} 
                />
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end">
              <CButton type="submit" color="success" className="me-2">
                {isEditing ? 'Update' : 'Submit'}
              </CButton>
              <CButton color="secondary" onClick={handleCancel}>
                Cancel
              </CButton>
            </div>
          </CForm>
        </>
      )}
    </>
  );
};

export default React.memo(CustomerManagement);