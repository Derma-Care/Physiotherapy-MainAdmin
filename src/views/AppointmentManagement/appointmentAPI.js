import axios from 'axios'

import { BASE_URL, 
  getAllBookingDetails 
} from '../../baseUrl'

export const AppointmentData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/${getAllBookingDetails}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching service data:', error.message)
    if (error.response) {
      console.error('Error Response Data:', error.response.data)
      console.error('Error Response Status:', error.response.status)
    }
    throw error
  }
}
