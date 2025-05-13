import { element } from 'prop-types'
import React from 'react'
import AddDoctors from './views/clinicManagement/AddDoctors'

const Login = React.lazy(() => import('./views/pages/login/Login'))
const serviceManagement = React.lazy(() => import('./views/servicesManagement/ServiceManagement'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CustomerViewDetails = React.lazy(
  () => import('./views/customerManagement/CustomerViewDetails'),
)
const ClinicManagement = React.lazy(() => import('./views/clinicManagement/ClinicManagement'))
const ClinicManagementDetails = React.lazy(() => import('./views/clinicManagement/ClinicDetails'))
const Registration = React.lazy(() => import('./views/clinicManagement/ClinicAPI'))
const AddClinic = React.lazy(() => import('./views/clinicManagement/AddClinic'))

const categoryManagement = React.lazy(() => import('./views/categoryManagement/categoryManagement'))
const customerManagement = React.lazy(() => import('./views/customerManagement/CustomerManagement'))

const PatientManagement = React.lazy(() => import('./views/providerManagement/ProviderManagement'))
const PatientViewDetails = React.lazy(
  () => import('./views/providerManagement/ProviderViewDetails'),
)

const AddDoctor = React.lazy(() => import('./views/clinicManagement/AddDoctors'))

const AppointmentManagement = React.lazy(
  () => import('./views/AppointmentManagement/appointmentManagement'),
)

const ReassignAppointment = React.lazy(
  () => import('./views/ReassignAppointmnet/reassginAppointemnt'),
)

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/category-management', name: 'Category Management', element: categoryManagement },
  {
    path: '/service-management',
    name: 'Service Management',
    element: serviceManagement,
  },
  {
    path: '/customer-management/:mobileNumber',
    name: 'Customer View Details',
    element: CustomerViewDetails,
  },
  { path: '/customer-management', name: 'Customer Management', element: customerManagement },
  { path: '/service-management', name: 'Service Management', element: serviceManagement },

  { path: '/clinic-Management', name: 'Clinic Management ', element: ClinicManagement },
  { path: '/add-clinic', name: 'Add Clinic', element: AddClinic },
  { path: '/clinic-Management/:hospitalId', name: 'Clinic Details', element: ClinicManagementDetails },

  { path: '/add-doctor', name: 'Add Doctor', element: AddDoctors },

  { path: '/patients-management', name: 'Patient Management', element: PatientManagement },
  // { path: '/Doctors-Management', name: 'Doctor Management', element: DoctorManagement },
  {
    path: '/appointment-management',
    name: 'Appointment Management',
    element: AppointmentManagement,
  },
  { path: '/reassign-Appointment', name: 'Reassign Appointment', element: ReassignAppointment },

  { path: '/provider-management/:id', name: 'Patient View Details', element: PatientViewDetails },
]

export default routes
