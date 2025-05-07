// import axios from 'axios'
// import { servicesEndPoint, BASE_URL } from '../config/baseUrl'

// // Service API endpoints
// const endpoints = {
//   getAll: `${SERVICE_URL}/services/getService`,
//   add: `${SERVICE_URL}/services/addService`,
//   update: `${SERVICE_URL}/services/updateService`,
//   delete: `${SERVICE_URL}/services/deleteByServiceID`
// }

// // Get all services
// export const getServices = async () => {
//   try {
//     const response = await axios.get(endpoints.getAll)
//     return response.data
//   } catch (error) {
//     console.error('Error fetching services:', error)
//     throw error
//   }
// }

// // Add new service
// export const addService = async (serviceData) => {
//   try {
//     const response = await axios.post(endpoints.add, serviceData, {
//       headers: { 'Content-Type': 'application/json' }
//     })
//     return response.data
//   } catch (error) {
//     console.error('Error adding service:', error)
//     throw error
//   }
// }

// // Update service
// export const updateService = async (serviceId, serviceData) => {
//   try {
//     const response = await axios.put(`${endpoints.update}/${serviceId}`, serviceData, {
//       headers: { 'Content-Type': 'application/json' }
//     })
//     return response.data
//   } catch (error) {
//     console.error('Error updating service:', error)
//     throw error
//   }
// }

// // Delete service
// export const deleteService = async (serviceId) => {
//   try {
//     const response = await axios.delete(`${endpoints.delete}/${serviceId}`, {
//       headers: { 'Content-Type': 'application/json' }
//     })
//     return response.data
//   } catch (error) {
//     console.error('Error deleting service:', error)
//     throw error
//   }
// }