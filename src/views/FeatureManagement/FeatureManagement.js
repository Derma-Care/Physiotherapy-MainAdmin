import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL, MainAdmin_URL } from '../../baseUrl'

const FeatureManagement = () => {
  const staticClinicId = '0001'
  const staticBranchId = '000101'

  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [permissionsData, setPermissionsData] = useState({})
  const [activePermissionTab, setActivePermissionTab] = useState('')
  const [newFeatureName, setNewFeatureName] = useState('')

  const availableActions = ['create', 'read', 'update', 'delete']

  // Fetch permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true)
      console.log('Fetching permissions for:', staticClinicId, staticBranchId)
      try {
        const res = await axios.get(`${MainAdmin_URL}/getPermissionsByClinicIdAndBranchId/${staticClinicId}/${staticBranchId}`)
        console.log('GET Permissions API Response:', res.data)
        if (res.data.success && res.data.data?.permissions) {
          if (Object.keys(res.data.data.permissions).length > 0 || res.data.data.id) {
            setPermissionsData(res.data.data.permissions)
            setIsEditMode(true)
            const keys = Object.keys(res.data.data.permissions)
            if (keys.length > 0) setActivePermissionTab(keys[0])
          } else {
            setPermissionsData({})
            setIsEditMode(false)
          }
        } else {
          setPermissionsData({})
          setIsEditMode(false)
        }
      } catch (err) {
        console.error('Error fetching permissions', err)
        setPermissionsData({})
        setIsEditMode(false)
      } finally {
        setLoading(false)
      }
    }
    fetchPermissions()
  }, [staticClinicId, staticBranchId])

  const handleAddFeature = () => {
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
  }

  const handleDeleteFeature = (feature) => {
    setPermissionsData(prev => {
      const perms = { ...prev }
      delete perms[feature]
      return perms
    })
    if (activePermissionTab === feature) {
      setActivePermissionTab('')
    }
  }

  const togglePermission = (feature, action) => {
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
  }

  const toggleAllActions = (feature) => {
    setPermissionsData(prev => {
      const perms = { ...prev }
      if (perms[feature] && perms[feature].length === availableActions.length) {
        perms[feature] = []
      } else {
        perms[feature] = [...availableActions]
      }
      return perms
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8081/admin/updatePermissionsByClinicIdAndBranchId/${staticClinicId}/${staticBranchId}`, {
          permissions: permissionsData
        })
        toast.success('Permissions updated successfully!')
      } else {
        await axios.post(`http://localhost:8081/admin/createPermisssions`, {
          clinicId: staticClinicId,
          branchId: staticBranchId,
          permissions: permissionsData
        })
        toast.success('Permissions created successfully!')
        setIsEditMode(true)
      }
    } catch (err) {
      console.error('Failed to save permissions', err)
      toast.error('Failed to save permissions. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '4px' }}>
            Clinic ID: {staticClinicId} | Branch ID: {staticBranchId}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary"
          style={{ backgroundColor: t.primary, borderColor: t.primary }}
        >
          {loading ? 'Saving...' : 'Save Permissions'}
        </button>
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
    </div>
  )
}

export default FeatureManagement
