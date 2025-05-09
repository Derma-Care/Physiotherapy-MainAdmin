// src/apiService/customerApi.js
import axios from 'axios'
import {
  CUSTOMER_SERVICE_URL,
  CustomerAllData,
  // CustomerByMbNum,
  // saveBasicDetails,
  // updateCustomerBasicDetails,
  deleteCustomer
} from '../../baseUrl'

// Fetch all customers
export const CustomerData = async () => {
  try {
    const url = `${CUSTOMER_SERVICE_URL}/${CustomerAllData}`
    const response = await axios.get(url)
    // Assuming backend wraps list in response.data.data
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data]
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    throw error
  }
}

// Add a new customer
export const addCustomer = async (customerDTO) => {
  try {
    const url = `${CUSTOMER_SERVICE_URL}/${saveBasicDetails}`
    const response = await axios.post(url, customerDTO, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (error) {
    console.error('Failed to add customer:', error)
    throw error
  }
}

// Get one customer by mobile number
export const getCustomerByMobile = async (mobileNumber) => {
  try {
    const url = `${CUSTOMER_SERVICE_URL}/${CustomerByMbNum}/${mobileNumber}`
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Failed to fetch customer:', error)
    throw error
  }
}

// Update existing customer
export const updateCustomerData = async (mobileNumber, customerDTO) => {
  try {
    const url = `${CUSTOMER_SERVICE_URL}/${updateCustomerBasicDetails}/${mobileNumber}`
    const response = await axios.put(url, customerDTO, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (error) {
    console.error('Failed to update customer:', error)
    throw error
  }
}

// Delete a customer
export const deleteCustomerData = async (mobileNumber) => {
  try {
    const url = `${CUSTOMER_SERVICE_URL}/${deleteCustomer}/${mobileNumber}`
    const response = await axios.delete(url)
    return response.data
  } catch (error) {
    console.error('Failed to delete customer:', error)
    throw error
  }
}
