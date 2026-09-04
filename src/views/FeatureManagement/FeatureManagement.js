import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MainAdmin_URL } from '../../baseUrl'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import { ChevronRight, Trash2 } from 'lucide-react'

const FeatureManagement = () => {
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalPermissions, setOriginalPermissions] = useState({})
  const [permissionsId, setPermissionsId] = useState('')

  const [fullPermissionsData, setFullPermissionsData] = useState({
    Basic: {},
    Pro: {},
    Elite: {},
    Enterprise: {},
  })

  const [activePlanTab, setActivePlanTab] = useState('Basic')
  const [newFeatureName, setNewFeatureName] = useState('')
  const [fetchedPlans, setFetchedPlans] = useState([])

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [featureToDelete, setFeatureToDelete] = useState('')
  const [deleting, setDeleting] = useState(false)

  // NEW: tracks in-flight auto-save calls per plan so a burst of rapid
  // checkbox clicks doesn't fire an overlapping request for the same plan.
  const [autoSaving, setAutoSaving] = useState(false)

  const availableActions = ['create', 'read', 'update', 'delete']
  const plans = ['Basic', 'Pro', 'Elite', 'Enterprise']

  // Helper: pull the permissions object out of the API response
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
    const looksLikePermissionsMap = Object.values(body).every(
      (v) => Array.isArray(v) || typeof v === 'object',
    )
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

  const planMap = {
    Basic: 1,
    Pro: 2,
    Elite: 3,
    Enterprise: 4,
  }

  // Only features with at least one action checked get persisted — same rule
  // used everywhere else in this flow (handleSave, ClinicPermissionsTab, AddClinic).
  const sanitizePlanPermissions = (planFeatures) =>
    Object.fromEntries(
      Object.entries(planFeatures || {}).filter(
        ([, actions]) => Array.isArray(actions) && actions.length > 0,
      ),
    )

  const fetchAllPermissions = async (force = false) => {
    setLoading(true)
    try {
      // User requested to strictly use this exact endpoint
      const listRes = await axios.get(`${MainAdmin_URL}/SuperAdmin/getAllPermisssions`)

      const items = getPermissionsItems(listRes.data)
      const record = items.length > 0 ? items[0] : null

      if (record) {
        setPermissionsId(getPermissionsId(record))
        const perms = extractPermissions(record) || {}

        setFullPermissionsData(perms)
        setOriginalPermissions(perms)

        if (!isEditMode) {
          setIsEditMode(true)
          setIsEditing(false)
        }
      } else {
        if (!isEditMode) {
          setIsEditMode(false)
          setIsEditing(true)
        }
      }
    } catch (err) {
      console.error(`Error fetching all permissions`, err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ensureEditing = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true)
    }
  }

  // Get only the features that belong to the current active plan
  const currentFeatures = Object.keys(fullPermissionsData[activePlanTab] || {})

  const handleAddFeature = () => {
    ensureEditing()

    const feature = newFeatureName.trim()
    if (!feature) return

    if (currentFeatures.includes(feature)) {
      toast.warning('Feature already exists in this plan!')
      return
    }

    // Explicitly add the new feature to fullPermissionsData for the active plan
    setFullPermissionsData((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      if (!next[activePlanTab]) next[activePlanTab] = {}
      if (!next[activePlanTab][feature]) next[activePlanTab][feature] = []
      return next
    })

    setNewFeatureName('')
    setHasChanges(true)
    // Not auto-saved here on purpose — a brand-new feature has no actions
    // checked yet, so sanitizePlanPermissions would strip it out of the
    // payload anyway. It gets persisted once an action is actually toggled on.
  }

  const handleDeleteFeature = (feature) => {
    ensureEditing()
    setFeatureToDelete(feature)
    setDeleteModalVisible(true)
  }

  // Persists the deletion via the update endpoint (PUT) instead of a
  // dedicated delete endpoint. We send the active plan's feature map with
  // `featureToDelete` removed — the backend overwrites the plan with
  // whatever we send, so omitting the feature deletes it. This reuses the
  // exact same `updatePermissionsByIdAndPlaneId` endpoint that toggles and
  // "Save Permissions" already use.
  const confirmDeleteFeature = async () => {
    if (!featureToDelete) return
    setDeleting(true)

    try {
      if (permissionsId) {
        const planId = planMap[activePlanTab] || 1

        // Build the plan's feature map with the deleted feature removed
        const updatedPlanFeatures = { ...(fullPermissionsData[activePlanTab] || {}) }
        delete updatedPlanFeatures[featureToDelete]

        const updatePayload = {
          permissions: {
            [activePlanTab]: updatedPlanFeatures,
          },
        }

        await axios.put(
          `${MainAdmin_URL}/updatePermissionsByIdAndPlaneId/${permissionsId}/${planId}`,
          updatePayload,
        )

        setFullPermissionsData((prev) => ({
          ...prev,
          [activePlanTab]: updatedPlanFeatures,
        }))
        setOriginalPermissions((prev) => ({
          ...prev,
          [activePlanTab]: updatedPlanFeatures,
        }))

        toast.success(`'${featureToDelete}' removed from ${activePlanTab} plan.`)
      } else {
        // No saved permissions record exists yet on the backend — nothing to
        // call the update endpoint on. Just drop it locally; it simply won't
        // be included the next time "Save Permissions" creates the record.
        setFullPermissionsData((prev) => {
          const next = JSON.parse(JSON.stringify(prev))
          if (next[activePlanTab]) delete next[activePlanTab][featureToDelete]
          return next
        })
        setHasChanges(true)
        toast.success(`'${featureToDelete}' removed from ${activePlanTab} plan.`)
      }
    } catch (err) {
      console.error('Failed to delete feature', err)
      toast.error('Failed to delete feature. Please try again.')
    } finally {
      setDeleting(false)
      setDeleteModalVisible(false)
      setFeatureToDelete('')
    }
  }

  // Persists the CURRENT state of the active plan's permissions via the
  // update endpoint immediately after a checkbox toggle, instead of only on
  // the big "Save Permissions" button. `updatedPlanFeatures` is the freshly
  // computed feature map for `plan` — the caller must pass the POST-toggle
  // value (never read fullPermissionsData here, since setState is async).
  //
  // FIX: this used to run updatedPlanFeatures through sanitizePlanPermissions,
  // which drops any feature whose actions array is empty. That meant
  // unchecking every action (Create/Read/Update/Delete) on a feature made it
  // disappear from the PUT payload entirely instead of being sent as `[]` —
  // so the backend was never told to clear it, and the old checked value
  // stayed saved even though the UI showed it unchecked. A feature that is
  // actively being toggled already exists on the plan, so its current state
  // (including empty) must always be sent as-is.
  const persistPlanPermissions = async (plan, updatedPlanFeatures) => {
    if (!permissionsId) {
      // No saved record yet — nothing to PUT against. The toggle is still
      // reflected locally; it gets created the first time "Save Permissions"
      // (POST createPermissions) runs.
      return
    }

    const planId = planMap[plan] || 1

    const updatePayload = {
      permissions: {
        [plan]: updatedPlanFeatures,
      },
    }

    setAutoSaving(true)
    try {
      await axios.put(
        `${MainAdmin_URL}/updatePermissionsByIdAndPlaneId/${permissionsId}/${planId}`,
        updatePayload,
      )
      // Keep the "last saved" snapshot in sync so Cancel reverts to this,
      // not to a now-stale earlier state.
      setOriginalPermissions((prev) => ({
        ...prev,
        [plan]: updatedPlanFeatures,
      }))
    } catch (err) {
      console.error('Failed to auto-save permission change', err)
      toast.error('Failed to save permission change. Please try again.')
    } finally {
      setAutoSaving(false)
    }
  }

  // FIX: persistPlanPermissions is now called AFTER setFullPermissionsData,
  // not from inside its updater callback. State updater functions must stay
  // pure — React can (and in React 18 StrictMode dev builds, DOES) invoke an
  // updater more than once per click to help surface exactly this kind of
  // bug. With the PUT call living inside the updater, a single checkbox
  // click could fire two overlapping requests; whichever response landed
  // last "won," which is what made toggles look like they weren't saving /
  // silently reverted. Capturing the computed value in `updatedPlanFeatures`
  // and persisting it once, outside the updater, guarantees exactly one
  // network call per toggle with the correct final value.
  const togglePermission = (plan, feature, action) => {
    if (isEditMode && !isEditing) return

    let updatedPlanFeatures = null

    setFullPermissionsData((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      if (!next[plan]) next[plan] = {}
      if (!next[plan][feature]) next[plan][feature] = []

      const hasAction = next[plan][feature].includes(action)
      if (hasAction) {
        next[plan][feature] = next[plan][feature].filter((a) => a !== action)
      } else {
        next[plan][feature] = [...next[plan][feature], action]
      }

      updatedPlanFeatures = next[plan]
      return next
    })

    setHasChanges(true)

    if (updatedPlanFeatures) {
      persistPlanPermissions(plan, updatedPlanFeatures)
    }
  }

  // FIX: same treatment as togglePermission — compute inside the updater,
  // persist outside it, exactly once.
  const toggleAllActionsForFeature = (plan, feature) => {
    if (isEditMode && !isEditing) return

    let updatedPlanFeatures = null

    setFullPermissionsData((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      if (!next[plan]) next[plan] = {}

      const currentActions = next[plan][feature] || []
      const allSelected = currentActions.length === availableActions.length

      if (allSelected) {
        next[plan][feature] = []
      } else {
        next[plan][feature] = [...availableActions]
      }

      updatedPlanFeatures = next[plan]
      return next
    })

    setHasChanges(true)

    if (updatedPlanFeatures) {
      persistPlanPermissions(plan, updatedPlanFeatures)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Clean up the data: only send features that have at least one selected action
      const cleanedData = {}
      plans.forEach((plan) => {
        cleanedData[plan] = {}
        const features = fullPermissionsData[plan] || {}
        Object.keys(features).forEach((feature) => {
          if (features[feature] && features[feature].length > 0) {
            cleanedData[plan][feature] = features[feature]
          }
        })
      })

      const payload = { permissions: cleanedData }

      // Check if there's at least one feature across ALL plans
      const hasAnyFeatures = Object.values(cleanedData).some(
        (planFeatures) => Object.keys(planFeatures).length > 0,
      )

      // If there's an ID AND at least one feature exists anywhere, we UPDATE.
      // Otherwise (if completely empty like {"Basic": {}, "Pro": {}}), we CREATE.
      if (permissionsId && hasAnyFeatures) {
        // Use the update endpoint (only updates the active plan tab's data)
        const planId = planMap[activePlanTab] || 1

        // ONLY send the currently active plan's data for the update API
        const updatePayload = {
          permissions: {
            [activePlanTab]: cleanedData[activePlanTab] || {},
          },
        }

        await axios.put(
          `${MainAdmin_URL}/updatePermissionsByIdAndPlaneId/${permissionsId}/${planId}`,
          updatePayload,
        )
        toast.success(`Permissions updated successfully!`)
      } else {
        await axios.post(`${MainAdmin_URL}/SuperAdmin/createPermissions`, payload)
        toast.success(`Permissions created successfully!`)
      }

      await fetchAllPermissions(true)
      setIsEditing(false)
      setHasChanges(false)
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
    setFullPermissionsData(originalPermissions)
    setIsEditing(false)
    setHasChanges(false)
  }

  const t = {
    primary: '#1e3a8a',
    primaryHover: '#1e40af',
    surface: '#ffffff',
    background: '#f8fafc',
    border: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    success: '#10b981',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    radius: '12px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }

  return (
    <>
    <style>{`
      .premium-btn {
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);
      }
      .premium-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(30, 58, 138, 0.3);
      }
      .feature-card {
        transition: all 0.3s ease;
      }
      .feature-card:hover {
        transform: translateY(-2px);
        box-shadow: ${t.shadowHover};
        border-color: #cbd5e1 !important;
      }
      .plan-tab {
        transition: all 0.2s ease;
      }
      .plan-tab:hover:not(.active-tab) {
        background-color: #f1f5f9 !important;
      }
      .custom-checkbox {
        width: 18px;
        height: 18px;
        cursor: inherit;
        accent-color: ${t.primary};
        transition: transform 0.1s;
      }
      .custom-checkbox:active:not(:disabled) {
        transform: scale(0.9);
      }
      .delete-btn {
        transition: all 0.2s ease;
      }
      .delete-btn:hover:not(:disabled) {
        color: ${t.dangerHover} !important;
        transform: scale(1.05);
      }
      .smooth-input {
        transition: all 0.2s ease;
      }
      .smooth-input:focus {
        border-color: ${t.primary} !important;
        box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1) !important;
        outline: none;
      }
    `}</style>
    <div
      style={{
        padding: '28px',
        backgroundColor: t.background,
        borderRadius: t.radius,
        boxShadow: t.shadow,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <ToastContainer position="top-right" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h4 style={{ color: t.primary, margin: 0, fontWeight: '700' }}>
            Plan Permissions Management
          </h4>
          {autoSaving && (
            <span style={{ fontSize: '12px', color: t.textMuted, fontWeight: '600' }}>
              Saving…
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isEditMode || hasChanges || isEditing ? (
            <>
              {isEditMode && (hasChanges || isEditing) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline-secondary premium-btn"
                  style={{ borderRadius: '8px', fontWeight: '500' }}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary premium-btn"
                style={{ 
                  backgroundColor: t.success, 
                  borderColor: t.success, 
                  borderRadius: '8px', 
                  fontWeight: '600',
                  padding: '8px 20px'
                }}
              >
                {loading ? 'Saving...' : 'Save Permissions'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="btn btn-primary premium-btn"
              style={{ 
                backgroundColor: t.primary, 
                borderColor: t.primary, 
                borderRadius: '8px', 
                fontWeight: '600',
                padding: '8px 20px'
              }}
            >
              Edit Permissions
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          border: `1px solid ${t.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: t.surface,
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        {/* Sidebar List of Plans */}
        <div
          style={{
            width: '280px',
            backgroundColor: '#f8fafc',
            borderRight: `1px solid ${t.border}`,
            height: '700px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '24px 20px',
              backgroundColor: '#f1f5f9',
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '18px', letterSpacing: '-0.5px' }}>
              Subscription Plans
            </div>
            <div style={{ color: t.textMuted, fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
              Select a plan to configure permissions
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {plans.map((plan) => {
              const isSelected = activePlanTab === plan
              return (
                <div
                  key={plan}
                  className={`plan-tab ${isSelected ? 'active-tab' : ''}`}
                  onClick={() => setActivePlanTab(plan)}
                  style={{
                    padding: '18px 24px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? t.surface : 'transparent',
                    borderLeft: `4px solid ${isSelected ? t.primary : 'transparent'}`,
                    borderBottom: `1px solid ${t.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: isSelected ? '700' : '600',
                      color: isSelected ? t.primary : t.textMuted,
                    }}
                  >
                    {plan} Plan
                  </span>
                  <ChevronRight size={18} color={isSelected ? t.primary : '#cbd5e1'} style={{ transform: isSelected ? 'translateX(2px)' : 'none', transition: 'all 0.2s' }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Permission Area */}
        <div
          style={{
            flex: 1,
            padding: '32px 40px',
            backgroundColor: t.surface,
            height: '700px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              borderBottom: `2px solid #f1f5f9`,
              paddingBottom: '20px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {activePlanTab} Permissions
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="New Feature (e.g. Settings)"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                className="form-control smooth-input"
                style={{ width: '240px', borderRadius: '8px', border: `1px solid ${t.border}`, padding: '10px 16px' }}
                disabled={!isEditing && isEditMode}
              />
              <button
                className="btn btn-primary premium-btn"
                onClick={handleAddFeature}
                disabled={!isEditing && isEditMode}
                style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', borderRadius: '8px', fontWeight: '600', padding: '0 20px' }}
              >
                + Add
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentFeatures.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: t.textMuted }}>
                No features defined yet. Add a new feature above.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {currentFeatures.map((feature) => {
                  const planPermissions = fullPermissionsData[activePlanTab]?.[feature] || []
                  const allSelected = planPermissions.length === availableActions.length

                  return (
                    <div
                      key={feature}
                      className="feature-card"
                      style={{
                        padding: '16px',
                        border: `1px solid ${t.border}`,
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #f1f5f9'
                        }}
                      >
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }} title={feature}>
                          {feature}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <label
                            style={{
                              fontSize: '12px',
                              color: t.textMuted,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: isEditing || !isEditMode ? 'pointer' : 'not-allowed',
                              margin: 0,
                              fontWeight: '500'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => toggleAllActionsForFeature(activePlanTab, feature)}
                              disabled={!isEditing && isEditMode}
                              className="custom-checkbox"
                            />
                            All
                          </label>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteFeature(feature)}
                            disabled={!isEditing && isEditMode}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: !isEditing && isEditMode ? '#fca5a5' : t.dangerHover,
                              cursor: !isEditing && isEditMode ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '4px'
                            }}
                            title="Delete Feature from all plans"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {availableActions.map((action) => {
                          const isChecked = planPermissions.includes(action)
                          return (
                            <label
                              key={action}
                              style={{
                                fontSize: '13px',
                                color: isChecked ? '#0f172a' : t.textMuted,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: isEditing || !isEditMode ? 'pointer' : 'not-allowed',
                                margin: 0,
                                fontWeight: isChecked ? '600' : '500',
                                transition: 'color 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(activePlanTab, feature, action)}
                                disabled={!isEditing && isEditMode}
                                className="custom-checkbox"
                                style={{ width: '16px', height: '16px' }}
                              />
                              <span style={{ textTransform: 'capitalize' }}>{action}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isVisible={deleteModalVisible}
        message={`Are you sure you want to delete the feature '${featureToDelete}' from the ${activePlanTab} plan?`}
        onConfirm={confirmDeleteFeature}
        onCancel={() => {
          setDeleteModalVisible(false)
          setFeatureToDelete('')
        }}
        confirmDisabled={deleting}
      />
    </div>
    </>
  )
}

export default FeatureManagement