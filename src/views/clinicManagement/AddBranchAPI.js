import axios from 'axios'
import {
  BASE_URL,
  createBranch,
  deleteBranch,
  getBranchByClinicId,
  getBranchById,
  getAllBranches,
  updateBranches,
} from '../../baseUrl'


// ============================================================
// CREATE BRANCH
// POST /api/SuperAdmin/branches/{serverId}/register
// ============================================================
export const createNewBranch = async (serverId, branchData) => {
  console.log('Creating branch')
  console.log('Server ID:', serverId)
  console.log('Branch Data:', branchData)

  const url = `${BASE_URL}/${createBranch}/${serverId}/register`

  console.log('CREATE BRANCH URL:', url)

  try {
    const response = await axios.post(url, branchData)

    console.log('Create branch response:', response.data)

    return response.data
  } catch (error) {
    console.error(
      'Error creating branch:',
      error.response?.data || error.message
    )

    throw error
  }
}


// ============================================================
// GET ALL BRANCHES
// GET /api/SuperAdmin/branches/{serverId}
// ============================================================
export const fetchAllBranches = async (serverId) => {
  console.log('Fetching all branches')
  console.log('Server ID:', serverId)

  const url = `${BASE_URL}/${getAllBranches}/${serverId}`

  console.log('GET ALL BRANCHES URL:', url)

  try {
    const response = await axios.get(url)

    console.log('Branches response:', response.data)

    return response.data
  } catch (error) {
    console.error(
      'Error fetching branches:',
      error.response?.data || error.message
    )

    throw error
  }
}


// ============================================================
// GET BRANCH BY BRANCH ID
// GET /api/SuperAdmin/branches/{serverId}/{branchId}
// ============================================================
export const fetchBranchByBranchId = async (
  serverId,
  branchId
) => {
  console.log('Fetching branch by branch ID')
  console.log('Server ID:', serverId)
  console.log('Branch ID:', branchId)

  const url =
    `${BASE_URL}/${getBranchById}/${serverId}/${branchId}`

  console.log('GET BRANCH BY ID URL:', url)

  try {
    const response = await axios.get(url)

    console.log('Branch response:', response.data)

    return response.data
  } catch (error) {
    console.error(
      'Error fetching branch:',
      error.response?.data || error.message
    )

    throw error
  }
}


// ============================================================
// GET BRANCHES BY CLINIC
// GET /api/SuperAdmin/branches/{serverId}/by-clinic/{clinicId}
// ============================================================
export const fetchBranchById = async (
  serverId,
  clinicId
) => {
  console.log('Fetching branches by clinic')
  console.log('Server ID:', serverId)
  console.log('Clinic ID:', clinicId)

  const url =
    `${BASE_URL}/SuperAdmin/branches/${serverId}/by-clinic/${clinicId}`

  console.log(
    'GET BRANCHES BY CLINIC URL:',
    url
  )

  try {
    const response = await axios.get(url)

    console.log(
      'Branches by clinic response:',
      response.data
    )

    return response.data
  } catch (error) {
    console.error(
      'Error fetching branches by clinic:',
      error.response?.data || error.message
    )

    throw error
  }
}


// ============================================================
// UPDATE BRANCH
// PUT /api/SuperAdmin/branches/{serverId}/{branchId}
// ============================================================
export const updateBranchData = async (
  serverId,
  branchId,
  branchData
) => {
  console.log('Updating branch')
  console.log('Server ID:', serverId)
  console.log('Branch ID:', branchId)
  console.log('Branch Data:', branchData)

  const url =
    `${BASE_URL}/${updateBranches}/${serverId}/${branchId}`

  console.log('UPDATE BRANCH URL:', url)

  try {
    const response = await axios.put(
      url,
      branchData
    )

    console.log(
      'Update branch response:',
      response.data
    )

    return response.data
  } catch (error) {
    console.error(
      'Error updating branch:',
      error.response?.data || error.message
    )

    throw error
  }
}


// ============================================================
// DELETE BRANCH
// DELETE /api/SuperAdmin/branches/{serverId}/{branchId}
// ============================================================
export const deleteBranchById = async (
  serverId,
  branchId
) => {
  console.log('Deleting branch')
  console.log('Server ID:', serverId)
  console.log('Branch ID:', branchId)

  const url =
    `${BASE_URL}/${deleteBranch}/${serverId}/${branchId}`

  console.log('DELETE BRANCH URL:', url)

  try {
    const response = await axios.delete(url)

    console.log(
      'Delete branch response:',
      response.data
    )

    return response.data
  } catch (error) {
    console.error(
      'Error deleting branch:',
      error.response?.data || error.message
    )

    throw error
  }
}


// ============================================================
// UPDATE BRANCH PERMISSIONS
// PUT /api/SuperAdmin/branches/{serverId}/{clinicId}/{branchId}/permissions
// ============================================================
export const updateBranchPermissions = async (
  serverId,
  clinicId,
  branchId,
  permissionsData
) => {
  console.log('Updating branch permissions')

  console.log('Server ID:', serverId)
  console.log('Clinic ID:', clinicId)
  console.log('Branch ID:', branchId)
  console.log('Permissions:', permissionsData)

  const url =
    `${BASE_URL}/${updateBranches}/${serverId}/${clinicId}/${branchId}/permissions`

  console.log(
    'UPDATE PERMISSIONS URL:',
    url
  )

  try {
    const response = await axios.put(
      url,
      permissionsData
    )

    console.log(
      'Update permissions response:',
      response.data
    )

    return response.data
  } catch (error) {
    console.error(
      'Error updating permissions:',
      error.response?.data || error.message
    )

    throw error
  }
}