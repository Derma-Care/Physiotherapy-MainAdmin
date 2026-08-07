import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../baseUrl'
import { fetchBranchById } from './AddBranchAPI'
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

const AVAILABLE_ACTIONS = ['create', 'read', 'update', 'delete']

const ClinicPermissionsTab = ({ clinicData, fetchClinicDetails }) => {
  // permissions: sparse-ish map of feature -> actions[]. A feature can exist here
  // with an empty array (unchecked) — it is NOT deleted just because it's unchecked.
  const [permissions, setPermissions] = useState({})
  // featureList: the stable, ordered list of feature names to render.
  // This is what drives the UI — NOT Object.keys(permissions) — so unchecking a
  // feature never makes its card disappear.
  const [featureList, setFeatureList] = useState([])

  // Snapshots used to restore state on Cancel.
  const [originalPermissions, setOriginalPermissions] = useState({})
  const [originalFeatureList, setOriginalFeatureList] = useState([])

  const [isEditing, setIsEditing] = useState(false)
  const [newFeatureInput, setNewFeatureInput] = useState('')
  const [saving, setSaving] = useState(false)

  const extractPermissions = (response) => {
    const body = response?.data?.data ?? response?.data ?? response
    if (!body || typeof body !== 'object') return {}
    if (Array.isArray(body)) {
      const first = body[0]
      if (first && typeof first === 'object') {
        if (first.permissions && typeof first.permissions === 'object') return first.permissions
        if (first.data && typeof first.data === 'object') return first.data.permissions ?? first.data
        const looksLikeMap = Object.values(first).every(v => Array.isArray(v))
        return looksLikeMap ? first : {}
      }
      return {}
    }
    if (body.permissions && typeof body.permissions === 'object') return body.permissions
    if (body.data && typeof body.data === 'object') {
      if (body.data.permissions && typeof body.data.permissions === 'object') return body.data.permissions
      const looksLikeMap = Object.values(body.data).every(v => Array.isArray(v))
      return looksLikeMap ? body.data : {}
    }
    const looksLikeMap = Object.values(body).every(v => Array.isArray(v))
    return looksLikeMap ? body : {}
  }

  // Filters out features with no actions — used ONLY when building the save
  // payload / snapshots, never to drive what's rendered while editing.
  const sanitizePermissions = (perms) =>
    Object.fromEntries(
      Object.entries(perms || {}).filter(([, actions]) => Array.isArray(actions) && actions.length > 0),
    )

  useEffect(() => {
    const loadPermissions = async () => {
      if (!clinicData) {
        setPermissions({})
        setFeatureList([])
        setOriginalPermissions({})
        setOriginalFeatureList([])
        return
      }

      const clinicId = clinicData.clinicId || clinicData.hospitalId
      if (!clinicId) {
        const fallback = clinicData.permissions && Object.keys(clinicData.permissions).length > 0 ? clinicData.permissions : {}
        setPermissions(fallback)
        setFeatureList(Object.keys(fallback))
        setOriginalPermissions(fallback)
        setOriginalFeatureList(Object.keys(fallback))
        return
      }

      let branchId = clinicData.branchId
      if (!branchId && clinicData.branch) {
        if (typeof clinicData.branch === 'string') {
          try {
            const branchRes = await fetchBranchById(clinicId)
            const branches = Array.isArray(branchRes)
              ? branchRes
              : Array.isArray(branchRes?.data)
                ? branchRes.data
                : []
            const match = branches.find((b) => b.branchName === clinicData.branch || b.branchName === clinicData.branch.trim())
            branchId = match?.branchId
          } catch (error) {
            console.error('Failed to derive branchId from clinic branch name', error)
          }
        } else if (clinicData.branch?.branchId) {
          branchId = clinicData.branch.branchId
        }
      }

      if (!branchId) {
        const fallback = clinicData.permissions && Object.keys(clinicData.permissions).length > 0 ? clinicData.permissions : {}
        setPermissions(fallback)
        setFeatureList(Object.keys(fallback))
        setOriginalPermissions(fallback)
        setOriginalFeatureList(Object.keys(fallback))
        return
      }

      try {
        // 1. Get the full list of available features/modules
        const allPermsRes = await axios.get(`${BASE_URL}/admin/getAllPermisssions`)
        const allFeatures = extractPermissions(allPermsRes)

        // 2. Get this clinic's own saved permissions
        const clinicRes = await axios.get(`${BASE_URL}/admin/getClinicById/${clinicId}`)
        const clinicBody = clinicRes?.data?.data ?? clinicRes?.data ?? {}
        const clinicPermissions = clinicBody.permissions && typeof clinicBody.permissions === 'object'
          ? clinicBody.permissions
          : {}

        // 3. Merge: every feature from allFeatures appears,
        //    checked with clinic's actions if assigned, otherwise empty (unchecked)
        const merged = {}
        Object.keys(allFeatures).forEach((feature) => {
          merged[feature] = clinicPermissions[feature] && clinicPermissions[feature].length > 0
            ? clinicPermissions[feature]
            : []
        })

        // Include any feature the clinic has saved that isn't in the master list too,
        // so nothing the clinic already has assigned silently disappears.
        Object.keys(clinicPermissions).forEach((feature) => {
          if (!(feature in merged)) {
            merged[feature] = clinicPermissions[feature] || []
          }
        })

        const featureNames = Object.keys(merged)

        setPermissions(merged)
        setFeatureList(featureNames)
        setOriginalPermissions(merged)
        setOriginalFeatureList(featureNames)
      } catch (error) {
        console.error('Failed to load clinic permissions', error)
        const fallback = clinicData.permissions && Object.keys(clinicData.permissions).length > 0 ? clinicData.permissions : {}
        setPermissions(fallback)
        setFeatureList(Object.keys(fallback))
        setOriginalPermissions(fallback)
        setOriginalFeatureList(Object.keys(fallback))
      }
    }

    loadPermissions()
  }, [clinicData])

  // Toggle a feature's checkbox on/off. On/off means "all actions" vs "no actions",
  // but the feature card ALWAYS stays visible — we never remove it from featureList,
  // and we never delete its key from permissions.
  const handleFeatureToggle = (feature) => {
    if (!isEditing) return
    setPermissions(prev => {
      const current = prev[feature] || []
      return {
        ...prev,
        [feature]: current.length > 0 ? [] : [...AVAILABLE_ACTIONS],
      }
    })
  }

  const handleAddNewFeature = () => {
    const featureName = newFeatureInput?.trim()
    if (!featureName) return

    setFeatureList(prev => (prev.includes(featureName) ? prev : [...prev, featureName]))
    setPermissions(prev => (prev[featureName] ? prev : { ...prev, [featureName]: [] }))
    setNewFeatureInput('')
  }

  // This actually removes the feature from the tab entirely (not just unchecks it).
  const handleDeleteFeature = (feature) => {
    setFeatureList(prev => prev.filter(f => f !== feature))
    setPermissions(prev => {
      const perms = { ...prev }
      delete perms[feature]
      return perms
    })
  }

  const togglePermission = (feature, action) => {
    if (!isEditing) return
    setPermissions(prev => {
      const current = prev[feature] || []
      const next = current.includes(action)
        ? current.filter(a => a !== action)
        : [...current, action]
      return { ...prev, [feature]: next }
    })
  }

  const toggleAllActions = (feature) => {
    if (!isEditing) return
    setPermissions(prev => {
      const current = prev[feature] || []
      const allSelected = current.length === AVAILABLE_ACTIONS.length
      return {
        ...prev,
        [feature]: allSelected ? [] : [...AVAILABLE_ACTIONS],
      }
    })
  }

  const resolveBranchId = async (clinicId) => {
    if (!clinicId) return null

    const directBranchId = clinicData?.branchId || clinicData?.branch?.branchId || clinicData?.branch?.id
    if (directBranchId) return directBranchId

    const branchCandidates = []
    if (Array.isArray(clinicData?.branches)) branchCandidates.push(...clinicData.branches)
    if (Array.isArray(clinicData?.branchList)) branchCandidates.push(...clinicData.branchList)
    if (clinicData?.branch && typeof clinicData.branch === 'object' && !Array.isArray(clinicData.branch)) {
      branchCandidates.push(clinicData.branch)
    }

    const branchName = clinicData?.branchName || clinicData?.branch?.branchName || (typeof clinicData.branch === 'string' ? clinicData.branch : '')

    if (branchCandidates.length > 0) {
      const namedMatch = branchCandidates.find((branch) => {
        if (!branch) return false
        const branchLabel = branch?.branchName || branch?.name || branch?.branch_name
        return branchLabel && String(branchLabel).trim() === String(branchName).trim()
      })
      if (namedMatch) {
        return namedMatch.branchId || namedMatch.id || namedMatch.branch_id
      }

      if (branchCandidates.length === 1) {
        return branchCandidates[0]?.branchId || branchCandidates[0]?.id || branchCandidates[0]?.branch_id
      }
    }

    try {
      const branchRes = await fetchBranchById(clinicId)
      const branches = Array.isArray(branchRes)
        ? branchRes
        : Array.isArray(branchRes?.data)
          ? branchRes.data
          : Array.isArray(branchRes?.data?.data)
            ? branchRes.data.data
            : []

      if (branches.length === 1) {
        return branches[0]?.branchId || branches[0]?.id || branches[0]?.branch_id
      }

      if (branchName) {
        const namedMatch = branches.find((branch) => {
          const branchLabel = branch?.branchName || branch?.name || branch?.branch_name
          return branchLabel && String(branchLabel).trim() === String(branchName).trim()
        })
        if (namedMatch) {
          return namedMatch.branchId || namedMatch.id || namedMatch.branch_id
        }
      }
    } catch (error) {
      console.error('Failed to derive branchId from branch list', error)
    }

    return null
  }

  const handleSave = async () => {
    const clinicId = clinicData?.clinicId || clinicData?.hospitalId
    if (!clinicId) {
      toast.error('Clinic data is missing')
      return
    }

    const branchId = await resolveBranchId(clinicId)
    if (!branchId) {
      toast.error('Branch ID is missing, cannot save permissions')
      return
    }

    setSaving(true)
    try {
      // Only send features that actually have at least one action checked.
      const filteredPermissions = sanitizePermissions(permissions)
      const payload = { permissions: filteredPermissions }
      await axios.put(`${BASE_URL}/admin/updatePermissions/${clinicId}/${branchId}`, payload)
      toast.success('Permissions updated successfully')

      // Keep the full featureList so unchecked cards remain visible after save.
      setOriginalPermissions(permissions)
      setOriginalFeatureList(featureList)
      setIsEditing(false)
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
    // Revert back to the last-loaded/last-saved snapshot, including the feature list,
    // so anything added/removed/unchecked mid-edit is undone.
    setPermissions(originalPermissions)
    setFeatureList(originalFeatureList)
    setIsEditing(false)
  }

  const hasPermissions = featureList.length > 0

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
        

        {!hasPermissions ? (
          <div style={{ padding: '30px', textAlign: 'center', backgroundColor: t.surface, borderRadius: t.radiusSm, border: `1px dashed ${t.border}`, marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: t.textMuted }}>No permissions added yet</div>
            {isEditing && <div style={{ fontSize: '12px', color: t.textLight, marginTop: '4px' }}>Type a feature name above to add it to this clinic's permissions.</div>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
            {featureList.map(feature => {
              const assignedActions = permissions[feature] || []
              const actionsToRender = AVAILABLE_ACTIONS

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