import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL, MainAdmin_URL } from '../../baseUrl'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'

const FeatureManagement = () => {
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalPermissions, setOriginalPermissions] = useState({})
  const [permissionsId, setPermissionsId] = useState('')

  const [permissionsData, setPermissionsData] = useState({})
  const [activePermissionTab, setActivePermissionTab] = useState('')
  const [newFeatureName, setNewFeatureName] = useState('')

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [featureToDelete, setFeatureToDelete] = useState('')
  const [deleting, setDeleting] = useState(false)

  const availableActions = ['create', 'read', 'update', 'delete']

  // Helper: pull the permissions object out of the API response
  // regardless of which shape the backend actually sends back.
  const extractPermissions = (body) => {
    if (!body) return null

    if (body.data && typeof body.data === 'object' && body.data.permissions) {
      return body.data.permissions
    }
    if (body.permissions && typeof body.permissions === 'object') {
      return body.permissions
    }
    if (
      body.data &&
      typeof body.data === 'object' &&
      !('permissions' in body.data) &&
      Object.keys(body.data).length > 0
    ) {
      return body.data
    }
    const looksLikePermissionsMap = Object.values(body).every(v => Array.isArray(v))
    if (looksLikePermissionsMap && Object.keys(body).length > 0) {
      return body
    }
    return null
  }

  const getResponseData = (body) => {
    if (!body) return null
    return body.data ?? body
  }

  const getPermissionsItems = (body) => {
    const data = getResponseData(body)
    if (!data) return []
    if (Array.isArray(data)) return data
    if (typeof data === 'object') return [data]
    return []
  }

  const getPermissionsId = (record) => {
    if (!record || typeof record !== 'object') return ''
    return record._id || record.id || record.permissionsId || record.permissionId || ''
  }

  // Fetch permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true)
      try {
        const listRes = await axios.get(`${MainAdmin_URL}/getAllPermisssions`)
        const items = getPermissionsItems(listRes.data)
        const firstItem = items.length > 0 ? items[0] : null
        const permissionsRecord = firstItem || null
        const fetchedId = getPermissionsId(permissionsRecord)
        const perms = extractPermissions(permissionsRecord)

        if (perms && Object.keys(perms).length > 0) {
          setPermissionsData(perms)
          setOriginalPermissions(perms)
          setPermissionsId(fetchedId)
          setIsEditMode(true)
          setIsEditing(false)
          setHasChanges(false)
          setActivePermissionTab(Object.keys(perms)[0])
          return
        }

        setPermissionsData({})
        setOriginalPermissions({})
        setPermissionsId('')
        setIsEditMode(false)
        setIsEditing(true)
        setHasChanges(false)
      } catch (err) {
        console.error('Error fetching permissions', err)
        setPermissionsData({})
        setOriginalPermissions({})
        setPermissionsId('')
        setIsEditMode(false)
        setIsEditing(true)
        setHasChanges(false)
      } finally {
        setLoading(false)
      }
    }
    fetchPermissions()
  }, [])

  const ensureEditing = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true)
    }
  }

  const handleAddFeature = () => {
    ensureEditing()

    const feature = newFeatureName.trim()
    if (!feature) return

    if (permissionsData[feature]) {
      toast.warning('Feature already exists!')
      return
    }

    setPermissionsData(prev => ({
      ...prev,
      [feature]: []
    }))
    setActivePermissionTab(feature)
    setNewFeatureName('')
    setHasChanges(true)
  }

  // Open the confirmation popup instead of deleting immediately
  const handleDeleteFeature = (feature) => {
    ensureEditing()
    setFeatureToDelete(feature)
    setDeleteModalVisible(true)
  }

  // Called when the user confirms deletion in the popup
  const confirmDeleteFeature = async () => {
    if (!featureToDelete) return
    setDeleting(true)

    const updatedPermissions = { ...permissionsData }
    delete updatedPermissions[featureToDelete]

    const afterDelete = () => {
      setPermissionsData(updatedPermissions)
      if (activePermissionTab === featureToDelete) {
        setActivePermissionTab('')
      }
      setHasChanges(true)
      toast.success(`'${featureToDelete}' removed from permissions.`)
      setDeleting(false)
      setDeleteModalVisible(false)
      setFeatureToDelete('')
    }

    if (isEditMode && permissionsId) {
      try {
        const res = await axios.put(`${MainAdmin_URL}/updatePermissions/${permissionsId}`, {
          permissions: updatedPermissions
        })
        const savedPerms = extractPermissions(res?.data)
        if (savedPerms && Object.keys(savedPerms).length > 0) {
          setPermissionsData(savedPerms)
          setOriginalPermissions(savedPerms)
        } else {
          setPermissionsData(updatedPermissions)
        }
        setHasChanges(false)
        toast.success(`'${featureToDelete}' deleted successfully.`)
      } catch (err) {
        console.error('Failed to delete feature from API', err)
        toast.error('Failed to delete feature. Please try again.')
      } finally {
        setDeleting(false)
        setDeleteModalVisible(false)
        setFeatureToDelete('')
        if (activePermissionTab === featureToDelete) {
          setActivePermissionTab('')
        }
      }
    } else {
      afterDelete()
    }
  }

  const togglePermission = (feature, action) => {
    if (isEditMode && !isEditing) return
    setPermissionsData(prev => {
      const perms = { ...prev }
      if (!perms[feature]) perms[feature] = []
      if (perms[feature].includes(action)) {
        perms[feature] = perms[feature].filter(a => a !== action)
      } else {
        perms[feature] = [...perms[feature], action]
      }
      return perms
    })
    setHasChanges(true)
  }

  const toggleAllActions = (feature) => {
    if (isEditMode && !isEditing) return
    setPermissionsData(prev => {
      const perms = { ...prev }
      if (perms[feature] && perms[feature].length === availableActions.length) {
        perms[feature] = []
      } else {
        perms[feature] = [...availableActions]
      }
      return perms
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      let res
      if (isEditMode && permissionsId) {
        res = await axios.put(`${MainAdmin_URL}/updatePermissions/${permissionsId}`, {
          permissions: permissionsData
        })
        toast.success('Permissions updated successfully!')
      } else {
        res = await axios.post(`${MainAdmin_URL}/createPermissions`, {
          permissions: permissionsData
        })
        toast.success('Permissions created successfully!')
        setIsEditMode(true)
      }

      const savedPerms = extractPermissions(res?.data)
      if (savedPerms && Object.keys(savedPerms).length > 0) {
        setPermissionsData(savedPerms)
        setOriginalPermissions(savedPerms)
      }

      const responseData = getResponseData(res?.data)
      const responseId = getPermissionsId(responseData)
      if (responseId) {
        setPermissionsId(responseId)
      }
      setHasChanges(false)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save permissions', err)
      toast.error('Failed to save permissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setPermissionsData(originalPermissions)
    setIsEditing(false)
    setHasChanges(false)
  }

  const t = {
    primary: '#0c447c',
    surface: '#f9fafb',
    border: '#e5e7eb',
    text: '#1f2937',
    textMuted: '#6b7280',
    success: '#10b981',
    danger: '#ef4444',
    radius: '8px'
  }

  const currentFeatures = Object.keys(permissionsData)

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: t.radius, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <ToastContainer position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ color: t.primary, margin: 0, fontWeight: '700' }}>Features & Permissions Management</h4>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {(!isEditMode || hasChanges || isEditing) ? (
            <>
              {isEditMode && (hasChanges || isEditing) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-light"
                  style={{ color: t.text, borderColor: t.border, background: '#fff' }}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary"
                style={{ backgroundColor: t.primary, borderColor: t.primary }}
              >
                {loading ? 'Saving...' : 'Save Permissions'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="btn btn-primary"
              style={{ backgroundColor: t.primary, borderColor: t.primary }}
            >
              Edit Permissions
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', border: `1px solid ${t.border}`, borderRadius: t.radius, overflow: 'hidden' }}>
        {/* Sidebar List of Features */}
        <div style={{ width: '320px', backgroundColor: t.surface, borderRight: `1px solid ${t.border}`, height: '600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontWeight: '700', color: t.textMuted, marginBottom: '12px' }}>Add New Feature</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Feature Name (e.g. Billing)"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddFeature}>Add</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {currentFeatures.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: t.textMuted, fontSize: '14px' }}>
                No features added yet. Type a name above to add one.
              </div>
            ) : (
              currentFeatures.map(feature => {
                const isSelected = activePermissionTab === feature
                const isConfigured = permissionsData[feature]?.length > 0
                return (
                  <div
                    key={feature}
                    onClick={() => setActivePermissionTab(feature)}
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#fff' : 'transparent',
                      borderLeft: isSelected ? `4px solid ${t.primary}` : '4px solid transparent',
                      borderBottom: `1px solid ${t.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: isSelected ? '700' : '500', color: isSelected ? t.primary : t.text }}>{feature}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isConfigured && <span style={{ color: t.success, fontSize: '16px' }} title="Configured">✓</span>}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFeature(feature); }}
                        style={{ border: 'none', background: 'transparent', color: t.danger, cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
                        title="Delete Feature"
                      >×</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Main Permission Area */}
        <div style={{ flex: 1, padding: '32px', backgroundColor: '#fff', height: '600px', overflowY: 'auto' }}>
          {!activePermissionTab ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: t.textMuted, fontStyle: 'italic' }}>
              Select a feature from the left sidebar to configure its permissions.
            </div>
          ) : (
            <>
              <div style={{ fontSize: '18px', fontWeight: '700', color: t.primary, marginBottom: '24px', borderBottom: `1px solid ${t.border}`, paddingBottom: '12px' }}>
                Configure Access: <span style={{ color: t.text }}>{activePermissionTab}</span>
              </div>

              {(() => {
                const assignedActions = permissionsData[activePermissionTab] || []
                const allSelected = assignedActions.length === availableActions.length

                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '24px', padding: '16px', backgroundColor: t.surface, borderRadius: t.radius, border: `1px solid ${t.border}` }}>
                      <label style={{ fontSize: '14px', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, fontWeight: '600' }}>
                        <input type="checkbox" checked={allSelected} onChange={() => toggleAllActions(activePermissionTab)} style={{ accentColor: t.primary, width: '16px', height: '16px' }} />
                        Select All Permissions
                      </label>
                    </div>

                    <div>
                      <h6 style={{ fontWeight: '600', color: t.textMuted, marginBottom: '16px' }}>Specific Actions for {activePermissionTab}</h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '12px' }}>
                        {availableActions.map(action => (
                          <label key={action} style={{ fontSize: '15px', color: t.text, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: 0 }}>
                            <input type="checkbox" checked={assignedActions.includes(action)} onChange={() => togglePermission(activePermissionTab, action)} style={{ accentColor: t.primary, width: '18px', height: '18px' }} />
                            <span style={{ textTransform: 'capitalize' }}>{action} Access</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isVisible={deleteModalVisible}
        message={`Delete the feature '${featureToDelete}'? This action cannot be undone.`}
        onConfirm={confirmDeleteFeature}
        onCancel={() => { setDeleteModalVisible(false); setFeatureToDelete('') }}
        confirmDisabled={deleting}
      />
    </div>
  )
}

export default FeatureManagement