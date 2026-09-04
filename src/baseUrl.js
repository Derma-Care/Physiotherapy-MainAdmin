// export const BASE_URL = 'http://alb-dev-sc-197990416.ap-south-1.elb.amazonaws.com/api'

import axios from "axios"

// const ipUrl = 'localhost'
// const ipUrl = 'physioelite-api.chiselon.online'
const ipUrl = 'http://localhost:9798/api'

export const BASE_URL = `${ipUrl}`
export const CLINIC_ADMIN_URL = `${ipUrl}`
export const MainAdmin_URL = `${BASE_URL}`
export const Procedure_URL = `${ipUrl}`
export const ClinicBase_url = `${BASE_URL}/admin`
// export let wifiUrl = '192.168.1.7'

// export const CUSTOMER_SERVICE_URL = `http://${ipUrl}:8083/api`
export const Booking_service_Url = `${ipUrl}/api`

// export const BOOKING_SERVICE_URL = `http://${ipUrl}:8087/api/v1`
// export const BASE_URLS = `http://${ipUrl}:8080/api/v1`
// export const CLINIC_URL = `http://${ipUrl}:8081`
export const SERVICE_URL = `admin/updateByServiceId`

//sub-service
export const subService_URL = `${ipUrl}/admin`
export const ADD_SERVICE = 'addService'
export const GET_ALL_SERVICES = 'getAllServices'
export const DELETE_SERVICE_URL = `deleteService`
export const updateService = 'updateByServiceId'

export const getService = 'getServiceById'
// export const getServiceByServiceId='getServiceByServiceId'
export const Category = 'category/getServices'

// login
export const endPoint = 'SuperAdmin/auth/login'

// Category Management
export const CategoryAllData = 'admin/getCategories'

export const AddCategory = 'admin/addCategory'

export const UpdateCategory = 'admin/updateCategory'

export const deleteCategory = 'admin/deleteCategory'

// Clinic Management
export const ClinicAllData = 'SuperAdmin/getAllClinics'

export const GetClinicById = 'SuperAdmin/clinics'

export const AddClinic = 'admin/CreateClinic'

export const UpdateClinic = 'SuperAdmin/clinics'

export const DeleteClinic = 'SuperAdmin/clinics'

export const getAllQuestions = 'SuperAdmin/clinicQuestions/getAll'

export const postAllQuestionsAndAnswers = 'SuperAdmin/clinicQA/postQuestionsAndAnswer'
// Doctor Management
export const DoctorAllData = '/clinic-admin/doctors/hospitalById'
export const AddDoctor = 'clinic-admin/addDoctor'

export const UpdateDoctor = 'admin/updateDoctor'

export const deleteDoctor = 'admin/deleteDoctor'
export const GetBranches_ByClinicId = 'SuperAdmin/branches'

export const getDoctorsByHospitalIdAndBranchId = 'admin/getDoctorsByHospitalIdAndBranchId'

// Customer Management
export const CustomerAllData = 'admin/getAllCustomers'

export const AddCustomer = 'admin/saveBasicDetails'

export const updateCustomer = 'admin/updateCustomerBasicDetails'

export const deleteCustomer = 'admin/deleteCustomerBasicDetails'

export const getBasicDetails = 'admin/getBasicDetails'
// export const bookServices ='customers/bookServices'
// export const deleteAppointments ='customers/deleteService'

// Service management
// export const AddService = 'services/addService'
// export const updateService = 'services/updateService'
// export const deleteService = 'services/deleteByServiceID'

//Subservice
export const getSubservices = 'admin/getAllSubServices'
export const addSubservices = 'admin/addSubService'
export const deleteSubservices = 'admin/deleteSubService'
export const updateSubservices = 'admin/updateBySubServiceId'

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
// export const getAllBookingDetails = 'admin/getAllBookingDetails'
// Reassign Appointment
export const getData = 'admin/NotificationToAdminForProviderReassign'

export const postData = 'admin/providerReassign'

// export const allBooking_sevices = getAllBookedServices
// export const GetBookingBy_ClinicId = 'customer/getAllBookedServicesByClinicId'
// export const GetBookingBy_DoctorId = 'admin/getBookingByDoctorId'
//appointments
export const GetBy_DoctorId = 'admin/getDoctorById'
export const getAllBookedServices = 'admin/getAllBookedServices'
export const DeleteBookings = 'admin/deleteServiceByBookedId'

// Service management
// export const getService = 'admin/getAllServices'
export const getServiceByCategory = 'admin/getServiceById'
export const deleteService = 'admin/deleteService'

//categoryAdvertisement
export const getAllCategoryAdvertisement = 'admin/categoryAdvertisement/getAll'
export const AddCategoryAdvertisement = 'admin/categoryAdvertisement/add'
export const deleteCategoryAdvertisement = 'admin/categoryAdvertisement/deleteByCarouselId'

//ads service

//serviceAdvertisement
export const getAllServiceAdvertisement = 'admin/ServiceAdvertisement/getAll'
export const AddServiceAdvertisement = 'admin/ServiceAdvertisement/add'
export const deleteServiceAdvertisement = 'admin/ServiceAdvertisement/deleteByCarouselId'


export const doctorAvailableUrl = 'doctorId'
export const getAllDoctors = `doctors`

export const getDoctorByClinicId = 'doctors/hospitalById'

//opt  SUb Service
export const subservice = 'getSubServicesByServiceId'
export const getSubServicesbyserviceId = 'serviceId'
export const getadminSubServicesbyserviceId = `admin/getSubServicesByServiceId`
export const getSubServiceBySubServiceId = `admin/getSubServiceBySubServiceId`
export const getservice = 'admin/getServiceById'

export const addDoctorUrl = `admin/addDoctor`

export const AddSubService = 'admin/addSubService'

export const getService_ByClinicId = 'admin/getSubServiceByHospitalId'

export const service = 'admin/getAllSubServices'

export const deleteSubService = 'admin/deleteSubService'

//Branch CRUD

export const createBranch = 'SuperAdmin/branches'

export const deleteBranch = 'SuperAdmin/branches'

export const getBranchByClinicId = 'SuperAdmin/branches'

export const getBranchById = 'SuperAdmin/branches'

export const getAllBranches = 'SuperAdmin/branches'

export const updateBranches = 'SuperAdmin/branches'

// export const getBranchByClinicAndBranchId='admin/getBranchByClinicAndBranchId'

//Procedure CRUD

//Procedure_URL

export const addProcedureDetails = 'admin/addSubService'

export const deleteProcedureDetails = 'admin/deleteSubService'

export const updateProcedureDetails = 'admin/updateSubService'



export const getSubService = 'admin/getSubService'


// ─── Status API ───────────────────────────────────────────────────────────────
// These endpoints trigger backend email notifications on status change.
// If emails are not being received, the issue is in the backend email service
// (e.g. SMTP config, email template, or the endpoint not sending emails).
export const statusapi = {
  /**
   * Moves clinic to VERIFICATION_IN_PROGRESS.
   * Backend should send a "verification started" email to clinic's emailAddress.
   */
  startClinic: (id) =>
    axios.put(`${MainAdmin_URL}/start-verification/${id}`),

  /**
   * Moves clinic to VERIFIED.
   * Backend should send a "congratulations, you are verified" email.
   */
  verifyClinic: (id) =>
    axios.put(`${MainAdmin_URL}/verify/${id}`),

  /**
   * Moves clinic to REJECTED with a reason.
   * Backend should send a "your clinic was rejected" email with the reason.
   */
  rejectClinic: (id, reason) =>
    axios.put(`${MainAdmin_URL}/reject/${id}`, null, {
      params: { reason },
    }),
}