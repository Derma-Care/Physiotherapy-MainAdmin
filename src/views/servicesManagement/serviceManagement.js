// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CButton,
//   CModal,
//   CModalHeader,
//   CFormText,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CHeader,
//   CRow,
//   CCol,CFormSelect,CFormTextarea,
// } from '@coreui/react'
// import DataTable from 'react-data-table-component'
// import CIcon from '@coreui/icons-react'
// import { cilSearch } from '@coreui/icons'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import {
//   CategoryData,
//   postCategoryData,
//   updateCategoryData,
//   deleteCategoryData,
// } from './ServiceAPI'

// const ServiceManagement = () => {
//   const [editServiceMode, setEditServiceMode] = useState(false);
//   const [serviceToEdit, setServiceToEdit] = useState(null);

//   const [categories, setCategories] = useState([])

//   const [searchQuery, setSearchQuery] = useState('')
//   const [category, setCategory] = useState([])
//   const [filteredData, setFilteredData] = useState([])
//   const [loading, setLoading] = useState(false)

//   const [modalVisible, setModalVisible] = useState(false)
//   const [viewCategory, setViewCategory] = useState(null)
//   const [editCategoryMode, setEditCategoryMode] = useState(false)

//   const [newService, setNewService] = useState({
//     serviceName: '',
//     categoryName: '', // this will be selected from dropdown
//     description: '',
//     status: 'Active', // default to 'Active'
//     pricing: '',
//     discount: '',
//     tax: '',
//   });
//   const [error, setError] = useState(null)
//   const [errors, setErrors] = useState({
//     serviceName: '',
//     categoryName: '',
//     description: '',
//     status: '',
//     pricing: '',
//     discount: '',
//     tax: '',
//   });


//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [categoryIdToDelete, setCategoryIdToDelete] = useState(null)
//   const [updatedCategory, setUpdatedCategory] = useState({
//     serviceName: '',
//     categoryName: '',
//     description: '',
//     status: '',
//     pricing: '',
//     discount: '',
//     tax: '',
//   })
 
//   const fetchData = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const data = await CategoryData()
//       setCategory(data.data)
//     } catch (error) {
//       setError('Failed to fetch Service data.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   useEffect(() => {
//     const handleSearch = () => {
//       const trimmedQuery = searchQuery.toLowerCase().trim()

//       if (!trimmedQuery) {
//         setFilteredData([]) // If no search query, reset the filtered data
//         return
//       }

//       const filtered = category.filter((category) => {
//         const categoryMatch = category.categoryName?.toLowerCase().includes(trimmedQuery)
//         return categoryMatch
//       })

//       setFilteredData(filtered) // Set the filtered data
//     }

//     handleSearch()
//   }, [searchQuery, category])

//   const columns = [
//     {
//       name: 'Service Name',
//       selector: (row) => row.serviceName,
//       sortable: true,
//       width: '200px',
//       cell: (row) => <div style={{ textAlign: 'center' }}>{row.serviceName}</div>,
//       headerStyle: { textAlign: 'center' },
//     },
//     {
//       name: 'Actions',
//       cell: (row) => (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             width: '230px',
//           }}
//         >
//           <CButton
//             color="primary"
//             onClick={() => setViewCategory(row)}
//             style={{ marginRight: '5px', width: '80px' }}
//           >
//             View
//           </CButton>
//           <CButton
//             color="primary"
//             onClick={() => handleServiceEdit(row)}
//             style={{ marginRight: '5px', width: '80px' }}
//           >
//             Edit
//           </CButton>
//           <CButton
//             color="danger"
//             onClick={() => handleCategoryDelete(row.categoryId)}
//             style={{ width: '80px' }}
//           >
//             Delete
//           </CButton>

//           <ConfirmationModal
//             isVisible={isModalVisible}
//             message="Are you sure you want to delete this category?"
//             onConfirm={handleConfirmDelete}
//             onCancel={handleCancelDelete}
//           />
//         </div>
//       ),
//       width: '150px',
//       headerStyle: { textAlign: 'center' },
//     },
//   ]

//   const ConfirmationModal = ({ isVisible, message, onConfirm, onCancel }) => {
//     return (
//       <CModal
//         visible={isVisible}
//         onClose={onCancel}
//         style={{
//           maxWidth: '500px',
//           height: 'auto',
//           marginTop: '10%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginLeft: '500px',
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             textAlign: 'center',
//           }}
//         >
//           <CHeader style={{ marginBottom: '10px' }}>!Alert</CHeader>
//           <CModalBody>{message}</CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={onCancel}>
//               Cancel
//             </CButton>
//             <CButton color="danger" onClick={onConfirm}>
//               Confirm
//             </CButton>
//           </CModalFooter>
//         </div>
//       </CModal>
//     )
//   }

 
//   const handleServiceChange = (e) => {
//     const { name, value } = e.target
//     setNewService({
//       ...newService,
//       [name]: value,
//     })
//     if (name === 'serviceName') {
//       const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
//       setNewService({
//         ...newService,
//         [name]: capitalizedValue,
//       })
//     }
//   }
//   const validateForm = () => {
//     const newErrors = {}

//     if (!newService.serviceName) {
//       newErrors.serviceName = 'Service name is required.';
//     } else if (!/^[A-Za-z\s]+$/.test(newService.serviceName)) {
//       newErrors.serviceName = 'Service name must only contain alphabets and spaces.';
//     }

//     if (!newService.categoryName) {
//       newErrors.categoryName = 'Category is required.';
//     }

//     if (!newService.status) {
//       newErrors.status = 'Status is required.';
//     }

//     if (!newService.pricing) {
//       newErrors.pricing = 'Pricing is required.';
//     } else if (isNaN(Number(newService.pricing)) || Number(newService.pricing) < 0) {
//       newErrors.pricing = 'Enter a valid pricing amount.';
//     }

//     if (newService.discount && (isNaN(Number(newService.discount)) || Number(newService.discount) < 0)) {
//       newErrors.discount = 'Enter a valid discount percentage.';
//     }

//     if (newService.tax && (isNaN(Number(newService.tax)) || Number(newService.tax) < 0)) {
//       newErrors.tax = 'Enter a valid tax percentage.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleAddService = async () => {
//     if (!validateForm()) return;

//     try {
//       const payload = {
//         serviceName: newService.serviceName.trim(),
//         categoryName: newService.categoryName,
//         description: newService.description.trim(),
//         status: newService.status,
//         pricing: parseFloat(newService.pricing),
//         discount: parseFloat(newService.discount || '0'),
//         tax: parseFloat(newService.tax || '0'),
//       };

//       const response = await postServiceData(payload);

//       toast.success('Service added successfully!', { position: 'top-right' });
//       fetchServiceData(); // refresh the service list

//       // Reset form fields
//       setNewService({
//         serviceName: '',
//         categoryName: '',
//         description: '',
//         status: 'Active',
//         pricing: '',
//         discount: '',
//         tax: '',
//       });

//       setErrors({});
//       setServiceModalVisible(false); // or setModalVisible(false) based on your modal
//     } catch (error) {
//       console.error('Error adding service:', error);
//       toast.error(error?.message || 'Something went wrong.', { position: 'top-right' });
//     }
//   };
//   const handleServiceEdit = (service) => {
//     setServiceToEdit(service); // Set the service object you're editing

//     setNewService({
//       serviceName: service.serviceName || '',
//       categoryName: service.categoryName || '',
//       description: service.description || '',
//       status: service.status || 'Active',
//       pricing: service.pricing?.toString() || '',
//       discount: service.discount?.toString() || '',
//       tax: service.tax?.toString() || '',
//     });

//     setEditServiceMode(true); // flag to toggle edit mode
//   };

//   const handleUpdateService = async () => {
//     if (!newService.serviceName.trim()) {
//       toast.error('Service name is required', { position: 'top-right' });
//       return;
//     }

//     try {
//       const updatedPayload = {
//         serviceName: newService.serviceName.trim(),
//         categoryName: newService.categoryName,
//         description: newService.description.trim(),
//         status: newService.status,
//         pricing: parseFloat(newService.pricing),
//         discount: parseFloat(newService.discount || '0'),
//         tax: parseFloat(newService.tax || '0'),
//       };

//       const response = await updateServiceData(serviceToEdit.serviceId, updatedPayload);

//       toast.success('Service updated successfully!', { position: 'top-right' });
//       setEditServiceMode(false);
//       fetchServiceData();
//     } catch (error) {
//       console.error('Error updating service:', error);
//       toast.error(error?.message || 'Something went wrong.', { position: 'top-right' });
//     }
//   };

//   const handleCancelService = () => {
//     setNewService({
//       serviceName: '',
//       categoryName: '',
//       description: '',
//       status: 'Active',
//       pricing: '',
//       discount: '',
//       tax: '',
//     });
//     setEditServiceMode(false); // Exit edit mode
//     setServiceToEdit(null);    // Clear any selected service
//   };

//   const handleCategoryDelete = (categoryId) => {
//     setCategoryIdToDelete(categoryId)
//     setIsModalVisible(true)
//   }

//   const handleConfirmDelete = async () => {
//     try {
//       await deleteCategoryData(categoryIdToDelete)
//       setIsModalVisible(false)
//       toast.success('Category deleted successfully!', { position: 'top-right' })
//       fetchData()
//     } catch (error) {
//       alert('Failed to delete category.')
//     }
//   }

//   const handleCancelAddService = () => {
//     setNewService({
//       serviceName: '',
//       categoryName: '',
//       description: '',
//       status: 'Active',
//       pricing: '',
//       discount: '',
//       tax: '',
//     });
//     setErrors({});
//     setModalVisible(false); // assuming you're using the same modal visibility flag
//   };


//   const handleCancelDelete = () => {
//     setIsModalVisible(false)
//   }

//   return (
//     <div style={{ overflow: 'hidden' }}>
//       <ToastContainer />
//       <div>
//         <CForm className="d-flex justify-content-between mb-3">
//           <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '40px' }}>
//             <CInputGroup className="mb-3" style={{ width: '300px' }}>
//               <CFormInput
//                 type="text"
//                 placeholder="Search by Service Name"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ height: '40px' }}
//               />
//               <CInputGroupText style={{ height: '40px' }}>
//                 <CIcon icon={cilSearch} />
//               </CInputGroupText>
//             </CInputGroup>
//           </div>

//           <CButton
//             color="primary"
//             style={{ height: '40px', marginRight: '100px' }}
//             onClick={() => setModalVisible(true)}
//           >
//             Add Service
//           </CButton>
//         </CForm>
//       </div>

//       {viewCategory && (
//         <CModal visible={!!viewCategory} onClose={() => setViewCategory(null)} size="md">
//           <CModalHeader>
//             <CModalTitle>Service  Details</CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Service Name:</strong></CCol>
//               <CCol sm={8}>{viewService.serviceName}</CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Category Name:</strong></CCol>
//               <CCol sm={8}>{viewService.categoryName}</CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Description:</strong></CCol>
//               <CCol sm={8}>{viewService.description}</CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Status:</strong></CCol>
//               <CCol sm={8}>{viewService.status}</CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Pricing:</strong></CCol>
//               <CCol sm={8}>{viewService.pricing}</CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Discount %:</strong></CCol>
//               <CCol sm={8}>{viewService.discount}</CCol>
//             </CRow>

//             <CRow className="mb-3">
//               <CCol sm={4}><strong>Tax %:</strong></CCol>
//               <CCol sm={8}>{viewService.tax}</CCol>
//             </CRow>
//           </CModalBody>


//           <CModalFooter></CModalFooter>
//         </CModal>
//       )}

//       <CModal visible={modalVisible} onClose={handleCancelAddService}>
//         <CModalHeader>
//           <CModalTitle>Add New Service</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             {/* Service Name */}
//             <h6>
//               Service Name <span style={{ color: 'red' }}>*</span>
//             </h6>
//             <CFormInput
//               type="text"
//               placeholder="Service Name"
//               value={newService.serviceName || ''}
//               name="serviceName"
//               onChange={handleServiceChange}
//             />
//             {errors.serviceName && (
//               <CFormText className="text-danger">{errors.serviceName}</CFormText>
//             )}

//             {/* Category Name (Dropdown) */}
//             <h6 className="mt-3">
//               Category Name <span style={{ color: 'red' }}>*</span>
//             </h6>
//             <CFormSelect
//               value={newService.categoryName || ''}
//               name="categoryName"
//               onChange={handleServiceChange}
//             >
//               <option value="">-- Select Category --</option>
//               {categories.map((cat) => (
//                 <option key={cat.categoryId} value={cat.categoryName}>
//                   {cat.categoryName}
//                 </option>
//               ))}
//             </CFormSelect>
//             {errors.categoryName && (
//               <CFormText className="text-danger">{errors.categoryName}</CFormText>
//             )}

//             {/* Description */}
//             <h6 className="mt-3">Description</h6>
//             <CFormTextarea
//               rows={3}
//               placeholder="Enter Description"
//               name="description"
//               value={newService.description || ''}
//               onChange={handleServiceChange}
//             />
//             {errors.description && (
//               <CFormText className="text-danger">{errors.description}</CFormText>
//             )}

//             {/* Status Dropdown */}
//             <h6 className="mt-3">Status</h6>
//             <CFormSelect
//               name="status"
//               value={newService.status || 'Active'}
//               onChange={handleServiceChange}
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </CFormSelect>
//             {errors.status && (
//               <CFormText className="text-danger">{errors.status}</CFormText>
//             )}

//             {/* Pricing */}
//             <h6 className="mt-3">Pricing</h6>
//             <CFormInput
//               type="number"
//               placeholder="Enter Pricing"
//               name="pricing"
//               value={newService.pricing || ''}
//               onChange={handleServiceChange}
//             />
//             {errors.pricing && (
//               <CFormText className="text-danger">{errors.pricing}</CFormText>
//             )}

//             {/* Discount % */}
//             <h6 className="mt-3">Discount %</h6>
//             <CFormInput
//               type="number"
//               placeholder="Enter Discount %"
//               name="discount"
//               value={newService.discount || ''}
//               onChange={handleServiceChange}
//             />
//             {errors.discount && (
//               <CFormText className="text-danger">{errors.discount}</CFormText>
//             )}

//             {/* Tax % */}
//             <h6 className="mt-3">Tax %</h6>
//             <CFormInput
//               type="number"
//               placeholder="Enter Tax %"
//               name="tax"
//               value={newService.tax || ''}
//               onChange={handleServiceChange}
//             />
//             {errors.tax && (
//               <CFormText className="text-danger">{errors.tax}</CFormText>
//             )}
//           </CForm>

//         </CModalBody>
//         <CModalFooter>
//           <CButton color="primary" onClick={handleAddService}>
//             Add
//           </CButton>
//           <CButton color="secondary" onClick={handleCancelAddService}>
//             Cancel
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <CModal visible={editCategoryMode} onClose={() => setEditCategoryMode(false)}>
//         <CModalHeader>
//           <CModalTitle>Edit Service Category</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             {/* Service Name */}
//             <h6>
//               Service Name <span style={{ color: 'red' }}>*</span>
//             </h6>
//             <CFormInput
//               type="text"
//               placeholder="Service Name"
//               value={updatedCategory?.serviceName || ''}
//               onChange={(e) => {
//                 const capitalizedValue =
//                   e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   serviceName: capitalizedValue,
//                 })
//               }}
//             />

//             {/* Category Name Dropdown */}
//             <h6 className="mt-3">
//               Category Name <span style={{ color: 'red' }}>*</span>
//             </h6>
//             <CFormSelect
//               value={updatedCategory?.categoryName || ''}
//               onChange={(e) =>
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   categoryName: e.target.value,
//                 })
//               }
//             >
//               <option value="">-- Select Category --</option>
//               {categories.map((cat) => (
//                 <option key={cat.categoryId} value={cat.categoryName}>
//                   {cat.categoryName}
//                 </option>
//               ))}
//             </CFormSelect>

//             {/* Description */}
//             <h6 className="mt-3">Description</h6>
//             <CFormTextarea
//               rows={3}
//               placeholder="Enter Description"
//               value={updatedCategory?.description || ''}
//               onChange={(e) =>
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   description: e.target.value,
//                 })
//               }
//             />

//             {/* Status Dropdown */}
//             <h6 className="mt-3">Status</h6>
//             <CFormSelect
//               value={updatedCategory?.status || 'Active'}
//               onChange={(e) =>
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   status: e.target.value,
//                 })
//               }
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </CFormSelect>

//             {/* Pricing */}
//             <h6 className="mt-3">Pricing</h6>
//             <CFormInput
//               type="number"
//               placeholder="Enter Pricing"
//               value={updatedCategory?.pricing || ''}
//               onChange={(e) =>
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   pricing: e.target.value,
//                 })
//               }
//             />

//             {/* Discount % */}
//             <h6 className="mt-3">Discount %</h6>
//             <CFormInput
//               type="number"
//               placeholder="Enter Discount %"
//               value={updatedCategory?.discount || ''}
//               onChange={(e) =>
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   discount: e.target.value,
//                 })
//               }
//             />

//             {/* Tax % */}
//             <h6 className="mt-3">Tax %</h6>
//             <CFormInput
//               type="number"
//               placeholder="Enter Tax %"
//               value={updatedCategory?.tax || ''}
//               onChange={(e) =>
//                 setUpdatedCategory({
//                   ...updatedCategory,
//                   tax: e.target.value,
//                 })
//               }
//             />
//           </CForm>

//         </CModalBody>
//         <CModalFooter>
//           <CButton color="primary" onClick={handleUpdateService}>
//             Update
//           </CButton>
//           <CButton color="secondary" onClick={handleCancelService}>
//             Cancel
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {loading ? (
//         <div
//           style={{ display: 'flex', justifyContent: 'center', height: '300px', fontSize: '22px' }}
//         >
//           <span>Loading...</span>
//         </div>
//       ) : error ? (
//         <div>{error}</div>
//       ) : (
//         <div>
//           {filteredData.length > 0 ? (
//             <DataTable columns={columns} data={filteredData} pagination />
//           ) : searchQuery ? (
//             <div style={{ textAlign: 'center', fontSize: '20px', color: 'gray' }}>
//               No data found
//             </div>
//           ) : (
//             <DataTable columns={columns} data={category} pagination />
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default ServiceManagement
