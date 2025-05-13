import axios from 'axios'
import { SERVICE_URL, GET_ALL_SERVICES, ADD_SERVICE, subService_URL, BASE_URL,DELETE_SERVICE_URL } from '../../baseUrl'

export const getAllServices = async () => {
  try {
    const response = await axios.get(`${subService_URL}/${GET_ALL_SERVICES}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    console.log(response)

    return response
  } catch (error) {
    throw error
  }
}

export const postServiceData = async (serviceData) => {
  console.log(serviceData)
  try {
    const response = await axios.post(`${subService_URL}/${ADD_SERVICE}`, serviceData, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    console.error('Error creating service:', error)
    throw error
  }
}

export const updateServiceData = async (updatedService, serviceId) => {
  //TODO:service api need
  console.log(updatedService)
  console.log(serviceId)
  try {
    const response = await axios.put(`${BASE_URL}/${SERVICE_URL}/${serviceId}`, updatedService, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    console.error('Error updating service:', error)
    throw error
  }
}

export const deleteServiceData = async (serviceId) => {
  try {
    const response = await axios.delete(`${subService_URL}/${DELETE_SERVICE_URL}/${serviceId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting service:', error)
    throw error
  }
}
