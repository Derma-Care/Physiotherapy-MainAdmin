import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CAlert,
  CInputGroup,
  CFormSelect,
  CInputGroupText,
  CFormTextarea
} from '@coreui/react';
import {
  fetchAllBranches,
  fetchBranchById,
  createNewBranch,
  updateBranchData,
  deleteBranchById
} from './AddBranchAPI'; // Import the API function
const AddBranchForm = ({ clinicId }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [viewingBranch, setViewingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const [formData, setFormData] = useState({
    clinicId: clinicId || '',
    branchName: '',
    address: '',
    city: '',
    contactNumber: '',
    email: '',
    latitude: '',
    longitude: '',
    virtualClinicTour: '',
  });

  // Load branches on component mount
  useEffect(() => {
    loadBranches();
  }, []);
React.useEffect(() => {
  if (clinicId) {
    setFormData(prev => ({ ...prev, clinicId }));
  }
}, [clinicId]);
const loadBranches = async () => {
  try {
    setLoading(true);
    const response = await fetchAllBranches();

    // Extract the array from API response
    const branchArray = Array.isArray(response.data) ? response.data : [];
    setBranches(branchArray);

    setError('');
  } catch (err) {
    setError('Failed to load branches. Please try again.');
    console.error('Error loading branches:', err);
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingBranch) {
        await updateBranchData(editingBranch.branchId, formData);
        setSuccess('Branch updated successfully!');
      } else {
        await createNewBranch(formData);
        setSuccess('Branch created successfully!');
      }
          setTimeout(() => setSuccess(''), 3000);

      setModalVisible(false);
      resetForm();
      loadBranches();
    } catch (error) {
      setError(`Error ${editingBranch ? 'updating' : 'creating'} branch: ${error.message}`);
      console.error(`Error ${editingBranch ? 'updating' : 'creating'} branch:`, error);
          setTimeout(() => setError(''), 3000);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteBranchById(deletingBranch.branchId);
                setTimeout(() => setSuccess(''), 3000);

      setSuccess('Branch deleted successfully!');
      setDeleteModalVisible(false);
      loadBranches();
    } catch (error) {
      setError(`Error deleting branch: ${error.message}`);
      console.error('Error deleting branch:', error);
      setTimeout(() => setError(''), 3000);

    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    console.log('Editing branch:', branch)
    setEditingBranch(branch);
    setFormData({
      clinicId: formData.clinicId || '',
      branchName: branch.branchName || '',
      address: branch.address || '',
      city: branch.city || '',
      contactNumber: branch.contactNumber || '',
      email: branch.email || '',
      latitude: branch.latitude || '',
      longitude: branch.longitude || '',
      virtualClinicTour: branch.virtualClinicTour || '',
    });
    setModalVisible(true);
  };

  const handleView = async (branchId) => {
    try {
      setLoading(true);
      const branch = await fetchBranchById(branchId);
      setViewingBranch(branch.data);
      setViewModalVisible(true);
    } catch (error) {
      setError('Error fetching branch details');
      console.error('Error fetching branch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    resetForm();
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      clinicId: clinicId || '',
      branchName: '',
      address: '',
      city: '',
      contactNumber: '',
      email: '',
      latitude: '',
      longitude: '',
      virtualClinicTour: '',
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingBranch(null);
    resetForm();
  };

  // Filter branches based on search term and city filter
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.branchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity ? branch.city === filterCity : true;
    return matchesSearch && matchesCity;
  });

  // Get unique cities for filter dropdown
  const cities = [...new Set(branches.map(branch => branch.city).filter(city => city))];

  return (
    <div>
      <CCard>
        <CCardHeader className='d-flex justify-content-between'>
          <h3>Branch Management</h3>
          <CButton color="primary" onClick={handleAddNew}>
            Add New Branch
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" onDismiss={() => setError('')}>
              {error}
            </CAlert>
          )}
          {success && (
            <CAlert color="success" onDismiss={() => setSuccess('')}>
              {success}
            </CAlert>
          )}

          {/* Search and Filter Controls */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>Search</CInputGroupText>
                <CFormInput
                  placeholder="Search by name, address, or city"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>Filter by City</CInputGroupText>
                <CFormSelect
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Branches Table */}
          {loading ? (
            <div className="text-center">
              <CSpinner />
            </div>
          ) : (
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Branch Name</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>City</CTableHeaderCell>
                  <CTableHeaderCell>Contact</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredBranches.length > 0 ? (
                  filteredBranches.map(branch => (
                    <CTableRow key={branch.branchId}>
                      <CTableDataCell>{branch.branchName}</CTableDataCell>
                      <CTableDataCell>{branch.address}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary">{branch.city}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{branch.contactNumber}</CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() =>{
                             handleView(branch.branchId)}
                          }
                        >
                          View
                        </CButton>
                        <CButton 
                          color="warning" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleEdit(branch)}
                        >
                          Edit
                        </CButton>
                        <CButton 
                          color="danger" 
                          size="sm"
                          onClick={() => {
                            setDeletingBranch(branch);
                            setDeleteModalVisible(true);
                          }}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">
                      No branches found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
        <CCardFooter>
          <div className="text-muted">
            Showing {filteredBranches.length} of {branches.length} branches
          </div>
        </CCardFooter>
      </CCard>

      {/* Add/Edit Branch Modal */}
      <CModal visible={modalVisible} onClose={handleCloseModal} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
             <CCol md={6}>
  <CFormInput
    label="Clinic ID"
    name="clinicId"
    value={formData.clinicId}  // pre-filled from state
    onChange={handleChange}
    className="mb-3"
    disabled                   // makes it read-only
  />
</CCol>
              <CCol md={6}>
                <CFormInput
                  label="Branch Name"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
            </CRow>
            <CFormTextarea
              label="Virtual Clinic Tour"
              name="virtualClinicTour"
              value={formData.virtualClinicTour}
              onChange={handleChange}
              className="mb-3"
              rows={3}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : (editingBranch ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the branch "{deletingBranch?.branchName}"? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Branch Details Modal */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Branch Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewingBranch ? (
            <CRow>
              <CCol md={6}>
                <p><strong>Branch Name:</strong> {viewingBranch.branchName}</p>
                <p><strong>Clinic ID:</strong> {formData.clinicId}</p>
                <p><strong>Address:</strong> {viewingBranch.address}</p>
                <p><strong>City:</strong> {viewingBranch.city}</p>
              </CCol>
              <CCol md={6}>
                <p><strong>Contact Number:</strong> {viewingBranch.contactNumber}</p>
                <p><strong>Email:</strong> {viewingBranch.email}</p>
                <p><strong>Coordinates:</strong> {viewingBranch.latitude}, {viewingBranch.longitude}</p>
                <p><strong>Virtual Tour:</strong> {viewingBranch.virtualClinicTour || 'N/A'}</p>
              </CCol>
            </CRow>
          ) : (
            <CSpinner />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AddBranchForm;