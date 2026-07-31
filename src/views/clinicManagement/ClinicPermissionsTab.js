import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL, UpdateClinic } from '../../baseUrl'
import { toast } from 'react-toastify'
import { Save, Edit2, X } from 'lucide-react'

const t = {
  primary: '#1a3a6b',
  text: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  surface: '#f8fafc',
  border: '#e2e8f0',
  danger: '#dc2626',
  success: '#16a34a',
  radiusSm: '6px',
}

const ClinicPermissionsTab = ({ clinicData, fetchClinicDetails }) => {
  const [permissions, setPermissions] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [newFeatureInput, setNewFeatureInput] = useState('')
  const [saving, setSaving] = useState(false)

  // Initialize permissions from clinicData when component mounts or clinicData changes
  useEffect(() => {
    if (clinicData && clinicData.permissions) {
      setPermissions(clinicData.permissions)
    } else {
      setPermissions({})
    }
  }, [clinicData])

  const handleFeatureToggle = (feature) => {
    if (!isEditing) return
    setPermissions(prev => {
      const perms = { ...prev }
      if (perms[feature] && perms[feature].length > 0) {
        perms[feature] = []
      } else {
        perms[feature] = ['create', 'read', 'update', 'delete']
      }
      return perms
    })
  }

  const handleAddNewFeature = () => {
    const featureName = newFeatureInput?.trim()
    if (!featureName) return

    setPermissions(prev => {
      const perms = { ...prev }
      if (!perms[featureName]) {
        perms[featureName] = []
      }
      return perms
    })
    setNewFeatureInput('')
  }

  const handleDeleteFeature = (feature) => {
    setPermissions(prev => {
      const perms = { ...prev }
      delete perms[feature]
      return perms
    })
  }

  const togglePermission = (feature, action) => {
    if (!isEditing) return
    setPermissions(prev => {
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
    if (!isEditing) return
    setPermissions(prev => {
      const perms = { ...prev }
      const availableActions = ['create', 'read', 'update', 'delete']
      if (perms[feature] && perms[feature].length === availableActions.length) {
        perms[feature] = []
      } else {
        perms[feature] = [...availableActions]
      }
      return perms
    })
  }

  const handleSave = async () => {
    if (!clinicData || !clinicData.hospitalId) {
      toast.error('Clinic data is missing')
      return
    }
    
    setSaving(true)
    try {
      // Build the update payload using the existing clinicData and replacing the permissions field
      const payload = {
        ...clinicData,
        permissions: permissions
      }

      await axios.put(`${BASE_URL}/${UpdateClinic}/${clinicData.hospitalId}`, payload)
      toast.success('Permissions updated successfully')
      setIsEditing(false)
      
      // Refresh the main clinic data so everything stays in sync
      if (fetchClinicDetails) {
        fetchClinicDetails()
      }
    } catch (err) {
      console.error('Failed to save permissions', err)
      toast.error('Failed to save permissions')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Revert back to original permissions from clinicData
    if (clinicData && clinicData.permissions) {
      setPermissions(clinicData.permissions)
    } else {
      setPermissions({})
    }
    setIsEditing(false)
  }

  const backendFeatures = Object.keys(permissions)
  const hasPermissions = backendFeatures.length > 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', marginTop: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '3px', height: '18px', background: '#1a3a6b', borderRadius: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>Permissions</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '8px',
                  background: '#1a3a6b', color: '#fff', border: 'none',
                  fontWeight: '600', fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: '#fff', color: '#374151',
                  border: '1.5px solid #e5e7eb',
                  fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                }}
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={14} /> Cancel
              </button>
            </>
          ) : (
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '8px',
                background: '#1a3a6b', color: '#fff', border: 'none',
                fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              }}
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>
      </div>

      <div>
        {isEditing && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: t.surface, borderRadius: t.radiusSm, border: `1px solid ${t.border}` }}>
            <div style={{ fontWeight: '600', marginBottom: '10px', fontSize: '14px' }}>Add New Module / Feature</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Billing, Reports, Dashboard"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewFeature())}
                style={{ maxWidth: '300px', fontSize: '13px', padding: '7px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
              <button 
                type="button" 
                style={{
                  padding: '7px 14px', borderRadius: '6px', background: '#1a3a6b', color: '#fff', 
                  border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                }} 
                onClick={handleAddNewFeature}
              >
                Add Feature
              </button>
            </div>
          </div>
        )}

        {!hasPermissions ? (
          <div style={{ padding: '30px', textAlign: 'center', backgroundColor: t.surface, borderRadius: t.radiusSm, border: `1px dashed ${t.border}`, marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: t.textMuted }}>No permissions added yet</div>
            {isEditing && <div style={{ fontSize: '12px', color: t.textLight, marginTop: '4px' }}>Type a feature name above to add it to this clinic's permissions.</div>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
            {backendFeatures.map(feature => {
              const assignedActions = permissions[feature] || []
              const featureAvailableActions = ['create', 'read', 'update', 'delete']
              const actionsToRender = featureAvailableActions

              const isFeatureChecked = assignedActions.length > 0
              const allSelected = isFeatureChecked && assignedActions.length === actionsToRender.length
              return (
                <div key={feature} style={{ width: '48%', padding: '12px', border: `1px solid ${t.border}`, borderRadius: t.radiusSm, backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', cursor: isEditing ? 'pointer' : 'default', margin: 0 }}>
                      <input type="checkbox" checked={isFeatureChecked} onChange={() => handleFeatureToggle(feature)} disabled={!isEditing} style={{ accentColor: t.primary, width: '16px', height: '16px' }} />
                      {feature}
                    </label>
                    {isEditing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isFeatureChecked && (
                          <label style={{ fontSize: '12px', color: t.textMuted, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                            <input type="checkbox" checked={allSelected} onChange={() => toggleAllActions(feature)} style={{ accentColor: t.primary }} />
                            Select All
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(feature)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                          title="Remove Feature"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  {isFeatureChecked && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {actionsToRender.map(action => (
                        <label key={action} style={{ fontSize: '12px', color: t.text, display: 'flex', alignItems: 'center', gap: '4px', cursor: isEditing ? 'pointer' : 'default', margin: 0 }}>
                          <input type="checkbox" checked={assignedActions.includes(action)} onChange={() => togglePermission(feature, action)} disabled={!isEditing} style={{ accentColor: t.primary }} />
                          <span style={{ textTransform: 'capitalize' }}>{action}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClinicPermissionsTab
