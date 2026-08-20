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
  const [selectedPlan, setSelectedPlan] = useState('Basic')
  
  // New state to hold permissions for ALL plans
  const [fullPermissionsData, setFullPermissionsData] = useState({
    Basic: {},
    Pro: {},
    Elite: {},
    Enterprise: {}
  })

  const [activePermissionTab, setActivePermissionTab] = useState('')
  const [newFeatureName, setNewFeatureName] = useState('')
  const [customFeatures, setCustomFeatures] = useState([]) // newly added features in this session

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

  const loadData = (body, plan) => {
    const items = getPermissionsItems(body)
    const record = items.length > 0 ? items[0] : null
    
    if (record) {
      setPermissionsId(getPermissionsId(record))
      const perms = extractPermissions(record) || {}
      
      // Determine if this is the new structured format or the old flat format
      const hasPlanKeys = Object.keys(perms).some(key => ['Basic', 'Pro', 'Elite', 'Enterprise'].includes(key))
      
      let parsedFullData = {
        Basic: {},
        Pro: {},
        Elite: {},
        Enterprise: {}
      }

      if (hasPlanKeys) {
        parsedFullData = { ...parsedFullData, ...perms }
      } else if (Object.keys(perms).length > 0) {
        // It's the old flat format, map everything to Basic
        parsedFullData.Basic = perms
      }
      
      setFullPermissionsData(parsedFullData)
      
      // Set Original Permissions to the full parsed data
      setOriginalPermissions(parsedFullData)
      
      const allFeatures = ['Basic', 'Pro', 'Elite', 'Enterprise'].flatMap(p => Object.keys(parsedFullData[p] || {}))
      
      if (allFeatures.length > 0) {
        setIsEditMode(true)
        setIsEditing(false)
        setHasChanges(false)
        setActivePermissionTab(allFeatures[0])
        return
      }
    }

    setFullPermissionsData({ Basic: {}, Pro: {}, Elite: {}, Enterprise: {} })
    setOriginalPermissions({})
    setIsEditMode(false)
    setIsEditing(true)
    setHasChanges(false)
    setActivePermissionTab('')

  }

  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const listRes = await axios.get(`${MainAdmin_URL}/getAllPermisssions`)
      loadData(listRes.data)
    } catch (err) {
      console.error('Error fetching permissions', err)
      setFullPermissionsData({ Basic: {}, Pro: {}, Elite: {}, Enterprise: {} })
      setOriginalPermissions({})
      setPermissionsId('')
      setIsEditMode(false)
      setIsEditing(true)
      setHasChanges(false)
    } finally {
      setLoading(false)
    }
  }

  // Fetch permissions on mount
  useEffect(() => {
    fetchPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ensureEditing = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true)
    }
  }

  const allExistingFeatures = ['Basic', 'Pro', 'Elite', 'Enterprise'].flatMap(plan => {
    return Object.keys(fullPermissionsData[plan] || {})
  })
  const currentFeatures = Array.from(new Set([
    ...allExistingFeatures,
    ...customFeatures
  ]))

  const handleAddFeature = () => {
    ensureEditing()

    const feature = newFeatureName.trim()
    if (!feature) return

    if (currentFeatures.includes(feature)) {
      toast.warning('Feature already exists in the list!')
      return
    }

    setCustomFeatures(prev => Array.from(new Set([...prev, feature])))
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

    const updatedFullData = JSON.parse(JSON.stringify(fullPermissionsData))
    ['Basic', 'Pro', 'Elite', 'Enterprise'].forEach(plan => {
      if (updatedFullData[plan] && updatedFullData[plan][featureToDelete] !== undefined) {
        delete updatedFullData[plan][featureToDelete]
      }
    })

    const afterDelete = () => {
      setFullPermissionsData(updatedFullData)
      if (activePermissionTab === featureToDelete) {
        setActivePermissionTab('')
      }
      setCustomFeatures(prev => prev.filter(f => f !== featureToDelete))
      
      setHasChanges(true)
      toast.success(`'${featureToDelete}' removed from permissions.`)
      setDeleting(false)
      setDeleteModalVisible(false)
      setFeatureToDelete('')
    }

    if (isEditMode && permissionsId) {
      try {
        await axios.put(`${MainAdmin_URL}/updatePermissions/${permissionsId}`, {
          permissions: updatedFullData
        })
        
        setHasChanges(false)
        fetchPermissions() // Re-fetch to sync
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

  const getPlansWithFeature = (feature) => {
    return ['Basic', 'Pro', 'Elite', 'Enterprise'].filter(plan => 
      fullPermissionsData[plan] && fullPermissionsData[plan][feature] !== undefined
    )
  }

  const getAssignedActions = (feature) => {
    const plansWithFeature = getPlansWithFeature(feature)
    const currentPermissions = new Set()
    plansWithFeature.forEach(plan => {
      const perms = fullPermissionsData[plan][feature] || []
      perms.forEach(p => currentPermissions.add(p))
    })
    return Array.from(currentPermissions)
  }

  const togglePlanForFeature = (plan, feature) => {
    if (isEditMode && !isEditing) return
    const assignedActions = getAssignedActions(feature)
    
    setFullPermissionsData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      if (!next[plan]) next[plan] = {}
      
      if (next[plan][feature] !== undefined) {
        delete next[plan][feature]
      } else {
        next[plan][feature] = [...assignedActions]
      }
      return next
    })
    setHasChanges(true)
  }

  const togglePermission = (feature, action) => {
    if (isEditMode && !isEditing) return
    const plansWithFeature = getPlansWithFeature(feature)
    if (plansWithFeature.length === 0) {
      toast.warning('Please select at least one plan before configuring permissions.')
      return
    }

    const assignedActions = getAssignedActions(feature)
    const isAdding = !assignedActions.includes(action)

    setFullPermissionsData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      plansWithFeature.forEach(plan => {
        if (!next[plan]) next[plan] = {}
        if (!next[plan][feature]) next[plan][feature] = []
        
        if (!isAdding) {
          next[plan][feature] = next[plan][feature].filter(a => a !== action)
        } else {
          next[plan][feature] = Array.from(new Set([...next[plan][feature], action]))
        }
      })
      return next
    })
    setHasChanges(true)
  }

  const toggleAllActions = (feature) => {
    if (isEditMode && !isEditing) return
    const plansWithFeature = getPlansWithFeature(feature)
    if (plansWithFeature.length === 0) {
      toast.warning('Please select at least one plan before configuring permissions.')
      return
    }

    const assignedActions = getAssignedActions(feature)
    const allSelected = assignedActions.length === availableActions.length

    setFullPermissionsData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      plansWithFeature.forEach(plan => {
        if (!next[plan]) next[plan] = {}
        if (allSelected) {
          next[plan][feature] = []
        } else {
          next[plan][feature] = [...availableActions]
        }
      })
      return next
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (permissionsId) {
        await axios.put(`${MainAdmin_URL}/updatePermissions/${permissionsId}`, {
          permissions: fullPermissionsData
        })
        toast.success(`Permissions updated successfully!`)
      } else {
        await axios.post(`${MainAdmin_URL}/createPermissions`, {
          permissions: fullPermissionsData
        })
        toast.success(`Permissions created successfully!`)
      }

      await fetchPermissions()
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
    setFullPermissionsData(originalPermissions) // originalPermissions is now the full payload
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

  // We don't need currentFeatures here since it's defined above


  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: t.radius, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <ToastContainer position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                const plans = getPlansWithFeature(feature)
                const isConfigured = plans.length > 0
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
                const plansWithFeature = getPlansWithFeature(activePermissionTab)
                const assignedActions = getAssignedActions(activePermissionTab)
                const allSelected = assignedActions.length === availableActions.length

                return (
                  <div>
                    {/* Multi-select for Plans */}
                    <div style={{ marginBottom: '32px' }}>
                      <h6 style={{ fontWeight: '600', color: t.textMuted, marginBottom: '16px' }}>Apply feature to Plans</h6>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {['Basic', 'Pro', 'Elite', 'Enterprise'].map(plan => (
                          <label key={plan} style={{ fontSize: '15px', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, padding: '8px 16px', backgroundColor: t.surface, borderRadius: '20px', border: `1px solid ${plansWithFeature.includes(plan) ? t.primary : t.border}` }}>
                            <input 
                              type="checkbox" 
                              checked={plansWithFeature.includes(plan)} 
                              onChange={() => togglePlanForFeature(plan, activePermissionTab)} 
                              style={{ accentColor: t.primary, width: '16px', height: '16px' }} 
                            />
                            <span style={{ fontWeight: plansWithFeature.includes(plan) ? '600' : '500', color: plansWithFeature.includes(plan) ? t.primary : t.text }}>{plan}</span>
                          </label>
                        ))}
                      </div>
                    </div>

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