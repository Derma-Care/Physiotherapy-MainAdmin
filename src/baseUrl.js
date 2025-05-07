// export const BASE_URL = 'http://alb-dev-sc-197990416.ap-south-1.elb.amazonaws.com/api'
const ipUrl = '192.168.0.107'

export const BASE_URL = `http://${ipUrl}:8081`
export const DOCTOR_URL = `http://${ipUrl}:8080`
export const CUSTOMER_SERVICE_URL = `http://${ipUrl}:8083/api`

// export const BOOKING_SERVICE_URL = `http://${ipUrl}:8087/api/v1`
// export const BASE_URLS = `http://${ipUrl}:8080/api/v1`
// export const CLINIC_URL = `http://${ipUrl}:8081`
export const SERVICE_URL = `http://${ipUrl}:8080/api/v1`

// login
//dss
export const endPoint = 'admin/adminLogin'

// Category Management
export const CategoryAllData = 'admin/getAllCategories'

export const AddCategory = 'admin/addCategory'

export const UpdateCategory = 'admin/updateCategory'

export const deleteCategory = 'admin/deleteCategory'

// Clinic Management
export const ClinicAllData = 'admin/getAllClinics'

export const AddClinic = 'admin/createClinic'

export const UpdateClinic = 'admin/updateClinic'

export const deleteClinic = 'admin/deleteClinic'

// Doctor Management
export const DoctorAllData = '/clinic-admin/doctors/hospitalById'
export const AddDoctor = 'clinic-admin/addDoctor'

export const UpdateDoctor = 'clinic-admin/updateClinic'

export const deleteDoctor = 'clinic-admin/deleteClinic'

// Customer Management
export const CustomerAllData = 'customer/getAllCustomers'

export const AddCustomer = 'customer/saveBasicDetails'

export const updateCustomer = 'customer/updateCustomerBasicDetails'

export const deleteCustomer = 'customer/deleteCustomerBasicDetails'
// export const bookServices ='customers/bookServices'
// export const deleteAppointments ='customers/deleteService'

// Service management

export const service = 'services/getService'

export const Category = 'category/getServices'

export const AddService = 'services/addService'

export const updateService = 'services/updateService'

export const deleteService = 'services/deleteByServiceID'
// Provider Management

export const ProviderAllData = 'admin/getAllProviderDetails'

export const BasicDetails = 'admin/getCaregiverDetails'

export const updateBasic = 'admin/updateCaregiver'

export const BasicProfile = 'admin/getProviderBasicProfile'

export const UpdateBasicProfile = 'admin/updateBasicProfile'

export const qualification = 'admin/getQualificationDetails'

export const updateQualification = 'admin/updateQualification'

export const Experience = 'admin/getExperienceDetails'

export const updateExperience = 'admin/updateExperienceDetails'

export const AddExperience = 'providers/addExperienceDetails'

export const DeleteExperience = 'admin/deleteExperience'

export const courseCertification = 'admin/getCourseCertificationDetails'

export const updateCourse = 'admin/updateCourseCertification'

export const deleteCourse = 'admin/deleteCourseCertification'

export const Bank = 'admin/getBankAccountDetails'

export const updateBank = 'admin/updateBankAccount'

export const Verification = 'admin/getVerficationDetails'

export const updateVerification = 'admin/verfiyProvider'

export const getAppointments = 'admin/appointments'

// Appointment Management

export const getAllBookingDetails = 'admin/getAllBookingDetails'

// Reassign Appointment

export const getData = 'admin/NotificationToAdminForProviderReassign'

export const postData = 'admin/providerReassign'
