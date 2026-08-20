
import axios from 'axios'
import { toast } from 'react-toastify'
import { BASE_URL } from '../baseUrl'

/* --------------------- Axios instances --------------------- */
export const http = axios.create({
  baseURL: BASE_URL, // 🔒 Secured APIs
  timeout: 20000,
})

export const httpPublic = axios.create({
  baseURL: BASE_URL, // 🌐 Public APIs
  timeout: 20000,
})

/* --------------------- Interceptors --------------------- */
export function attachInterceptors(getAuthToken) {
  // ✅ Request interceptor → attach token automatically
  const reqInterceptor = http.interceptors.request.use(
    (config) => {
      // const token = getAuthToken?.() || localStorage.getItem('token')
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }
      return config
    },
    (error) => Promise.reject(error),
  )

  // ✅ Response interceptor → handle errors
  const resHandler = (response) => response
  const errHandler = (error) => {
    const status = error.response?.status

    // Distinguish between true offline vs server crash (CORS network error)
    const isNetworkError = error.message === 'Network Error' || error.code === 'ERR_NETWORK'
    const isServerCrash = isNetworkError && navigator.onLine

    // Trigger maintenance screen on explicit 502/503 OR a server crash (hidden 502s)
    if (status === 502 || status === 503 || isServerCrash) {
      window.dispatchEvent(new Event('maintenance-mode'))
      return new Promise(() => {}) // pending promise so app stops executing
    }

    if (!navigator.onLine) {
      toast.error('No internet connection.')
      return Promise.reject(error)
    }

    if (status === 401) {
      toast.error('Session expired. Please login again.')
      // optional: log out user
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Request failed.')
    }
    return Promise.reject(error)
  }

  const resInterceptor = http.interceptors.response.use(resHandler, errHandler)
  const globalAxiosInterceptor = axios.interceptors.response.use(resHandler, errHandler)

  // Return a function to eject interceptors if needed
  return () => {
    http.interceptors.request.eject(reqInterceptor)
    http.interceptors.response.eject(resInterceptor)
    axios.interceptors.response.eject(globalAxiosInterceptor)
  }
}