import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL, MainAdmin_URL } from '../../baseUrl'
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
const KNOWN_PLANS = ['Basic', 'Pro', 'Elite', 'Enterprise']
// Same plan -> planId mapping FeatureManagement.jsx uses for its
// updatePermissionsByIdAndPlaneId calls, so a feature added here lands under
// the correct planId in the master permissions record.
const PLAN_ID_MAP = { Basic: 1, Pro: 2, Elite: 3, Enterprise: 4 }

// clinicData: the saved clinic record (from ClinicDetails' `clinicData` state)
// selectedPlan: the LIVE, possibly-unsaved subscription value from the
//               Additional Details tab (ClinicDetails' `editableClinicData.subscription`).
//               When the user changes the dropdown there, this prop changes too,
//               even before they hit Save — so the Permissions tab can preview
//               the new plan's feature template right away.
const ClinicPermissionsTab = ({ clinicData, selectedPlan, fetchClinicDetails }) => {
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

  // The plan this clinic is actually subscribed to — drives which slice of the
  // master permissions template we pull from getAllPermisssions.
  const [activePlan, setActivePlan] = useState('')

  // True when the plan currently driving this view (selectedPlan) differs from
  // what's actually saved on the clinic record — i.e. the user picked a new
  // plan in Additional Details but hasn't hit Save yet.
  const [isPreviewingUnsavedPlan, setIsPreviewingUnsavedPlan] = useState(false)

  // FIX: getAllPermisssions is the SAME master-template endpoint FeatureManagement.jsx
  // reads/writes (there via MainAdmin_URL). It was previously being called here via
  // BASE_URL/admin/getAllPermisssions instead — a different base — so whatever plan
  // permissions were configured in Feature Management could silently fail to show up
  // here. Now both components call it through MainAdmin_URL and parse the response
  // the same way, so "Basic" here is always exactly "Basic" as defined there.
  //
  // Response shape (matches FeatureManagement.extractPermissions):
  //   { data: { permissions: { Basic: {...}, Pro: {...}, Elite: {...}, Enterprise: {...} } } }
  //   or a flattened variant of the same.
  const extractPlanPermissions = (response) => {
    const body = response?.data ?? response
    if (!body) return {}

    const data = body.data ?? body
    const record = Array.isArray(data) ? data[0] : data
    if (!record || typeof record !== 'object') return {}

    if (record.permissions && typeof record.permissions === 'object') {
      return record.permissions
    }

    // Fallback: response IS already the plan-keyed map (no wrapper object).
    const looksLikePlanMap = Object.values(record).every(
      (v) => v && typeof v === 'object' && !Array.isArray(v),
    )
    if (looksLikePlanMap && Object.keys(record).length > 0) {
      return record
    }

    return {}
  }

  // Filters out features with no actions — used ONLY when building the save
  // payload / snapshots, never to drive what's rendered while editing.
  const sanitizePermissions = (perms) =>
    Object.fromEntries(
      Object.entries(perms || {}).filter(([, actions]) => Array.isArray(actions) && actions.length > 0),
    )

  // Pulls the master permissions record's id (whatever key the backend uses)
  // out of a getAllPermisssions response — mirrors FeatureManagement's
  // getPermissionsId so both components agree on where the id lives.
  const extractMasterRecordId = (response) => {
    const body = response?.data ?? response
    if (!body) return ''
    const data = body.data ?? body
    const record = Array.isArray(data) ? data[0] : data
    if (!record || typeof record !== 'object') return ''
    return record._id || record.id || record.permissionsId || record.permissionId || ''
  }

  // NEW: after a clinic's own permissions save succeeds, register any
  // BRAND-NEW feature the clinic just added (via "Add Feature" here) into
  // Feature Management's plan template too — so it becomes a real, visible
  // feature for that plan going forward, not just a one-off stuck on this
  // clinic. This only ever ADDS a missing feature key to the template using
  // this clinic's current actions for it as the starting default; it never
  // touches a feature that already exists in the template (features that
  // came FROM the template are already present, so they're skipped here —
  // other clinics' saved values are never affected).
  //
  // Best-effort: failures here are logged but never surfaced as an error to
  // the user and never block/undo the clinic save that already succeeded.
  const syncNewFeaturesToPlanTemplate = async (plan, finalPermissions, finalFeatureList) => {
    if (!plan || !KNOWN_PLANS.includes(plan)) return

    try {
      const allPermsRes = await axios.get(`${MainAdmin_URL}/getAllPermisssions`)
      const masterId = extractMasterRecordId(allPermsRes)
      const allPlans = extractPlanPermissions(allPermsRes)
      const currentPlanFeatures = allPlans[plan] || {}

      const missingFeatures = finalFeatureList.filter(
        (feature) => !Object.prototype.hasOwnProperty.call(currentPlanFeatures, feature),
      )

      if (missingFeatures.length === 0) {
        console.log(`[ClinicPermissionsTab] No new features to register in Feature Management for plan "${plan}".`)
        return
      }

      // Full feature map for the plan — existing template features kept
      // exactly as they are, missing ones added in with the clinic's current
      // values as their starting default.
      const updatedPlanFeatures = { ...currentPlanFeatures }
      missingFeatures.forEach((feature) => {
        updatedPlanFeatures[feature] = finalPermissions[feature] || []
      })

      console.log(
        `[ClinicPermissionsTab] Registering new feature(s) in Feature Management for plan "${plan}":`,
        missingFeatures,
      )

      if (masterId) {
        const planId = PLAN_ID_MAP[plan] || 1
        await axios.put(
          `${MainAdmin_URL}/updatePermissionsByIdAndPlaneId/${masterId}/${planId}`,
          { permissions: { [plan]: updatedPlanFeatures } },
        )
      } else {
        // No master permissions record exists yet at all — create one,
        // seeding every known plan so the shape matches what
        // FeatureManagement.jsx expects, with only this plan populated.
        const seededPermissions = {}
        KNOWN_PLANS.forEach((p) => {
          seededPermissions[p] = p === plan ? updatedPlanFeatures : {}
        })
        await axios.post(`${MainAdmin_URL}/createPermissions`, { permissions: seededPermissions })
      }
    } catch (error) {
      console.error('[ClinicPermissionsTab] Failed to register new feature(s) in Feature Management (clinic save is unaffected)', error)
    }
  }

  useEffect(() => {
    const loadPermissions = async () => {
      console.log('[ClinicPermissionsTab] loadPermissions triggered — selectedPlan prop:', selectedPlan)

      if (!clinicData) {
        console.log('[ClinicPermissionsTab] No clinicData yet — clearing state.')
        setPermissions({})
        setFeatureList([])
        setOriginalPermissions({})
        setOriginalFeatureList([])
        setActivePlan('')
        setIsPreviewingUnsavedPlan(false)
        return
      }

      const clinicId = clinicData.clinicId || clinicData.hospitalId

      // The plan actually saved on the clinic record.
      const savedPlan = clinicData.subscription || ''
      // The plan we should render permissions FOR. Prefer the live, unsaved
      // selection (selectedPlan) if one was passed in.
      const planToRender = selectedPlan !== undefined ? (selectedPlan || '') : savedPlan

      console.log('[ClinicPermissionsTab] savedPlan (on clinic record):', savedPlan, '| planToRender:', planToRender)

      setIsPreviewingUnsavedPlan(Boolean(planToRender) && planToRender !== savedPlan)

      if (!clinicId) {
        console.warn('[ClinicPermissionsTab] No clinicId found — falling back to clinicData.permissions only, no plan template merge.')
        const fallback = clinicData.permissions && Object.keys(clinicData.permissions).length > 0 ? clinicData.permissions : {}
        setPermissions(fallback)
        setFeatureList(Object.keys(fallback))
        setOriginalPermissions(fallback)
        setOriginalFeatureList(Object.keys(fallback))
        setActivePlan(planToRender)
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
        console.warn('[ClinicPermissionsTab] No branchId resolved — falling back to clinicData.permissions only, no plan template merge.')
        const fallback = clinicData.permissions && Object.keys(clinicData.permissions).length > 0 ? clinicData.permissions : {}
        setPermissions(fallback)
        setFeatureList(Object.keys(fallback))
        setOriginalPermissions(fallback)
        setOriginalFeatureList(Object.keys(fallback))
        setActivePlan(planToRender)
        return
      }

      try {
        // 1. Get this clinic's own saved permissions (already-granted actions
        //    per feature — this is the SOURCE OF TRUTH for what's checked,
        //    so it's never blown away by edits made in Feature Management).
        const clinicRes = await axios.get(`${BASE_URL}/admin/getClinicById/${clinicId}`)
        const clinicBody = clinicRes?.data?.data ?? clinicRes?.data ?? {}
        const clinicPermissions = clinicBody.permissions && typeof clinicBody.permissions === 'object'
          ? clinicBody.permissions
          : {}

        // Use the live/unsaved plan for the template if provided, otherwise
        // fall back to whatever the freshly-fetched record says.
        const plan = selectedPlan !== undefined
          ? (selectedPlan || '')
          : (clinicBody.subscription || clinicData.subscription || '')
        setActivePlan(plan)

        // The plan actually saved on the clinic record — use the freshest
        // source (this just-fetched clinicBody) rather than the possibly
        // stale clinicData prop, so this check is accurate right after a
        // plan change made elsewhere (Additional Details) in the same
        // render pass.
        const trueSavedPlan = clinicBody.subscription || clinicData.subscription || ''
        const isShowingSavedPlan = Boolean(plan) && plan === trueSavedPlan

        // Keep the "previewing unsaved plan" banner/guard in sync with this
        // same freshest-data check (the earlier setIsPreviewingUnsavedPlan
        // call above used clinicData, which can be stale).
        setIsPreviewingUnsavedPlan(Boolean(plan) && !isShowingSavedPlan)

        console.log(
          '[ClinicPermissionsTab] Resolved plan to render:', plan,
          '| is a KNOWN_PLAN:', KNOWN_PLANS.includes(plan),
          '| trueSavedPlan:', trueSavedPlan,
          '| isShowingSavedPlan:', isShowingSavedPlan,
        )

        // 2. Pull the master template for exactly this plan from the SAME
        //    endpoint FeatureManagement.jsx uses (MainAdmin_URL). This is
        //    used ONLY to know which features belong to the plan (the
        //    feature LIST) — not to decide which actions are checked.
        let planTemplate = {}
        if (plan && KNOWN_PLANS.includes(plan)) {
          const allPermsRes = await axios.get(`${MainAdmin_URL}/getAllPermisssions`)
          console.log('[ClinicPermissionsTab] Raw getAllPermisssions response:', allPermsRes?.data)

          const allPlans = extractPlanPermissions(allPermsRes)
          console.log('[ClinicPermissionsTab] Extracted all-plans map:', allPlans)

          planTemplate = allPlans[plan] || {}
          console.log(`[ClinicPermissionsTab] Template for plan "${plan}":`, planTemplate)

          if (Object.keys(planTemplate).length === 0) {
            console.warn(
              `[ClinicPermissionsTab] Plan "${plan}" resolved to an EMPTY template. Either ` +
                `Feature Management has no features saved for this plan yet, or the save from ` +
                `Feature Management never actually persisted (check the [UPDATE API]/[SAVE] logs ` +
                `there for a "permissionsId is empty" skip).`,
            )
          }
        }

        // 3. Merge — the feature LIST is scoped to the selected plan's
        //    template (so a clinic only ever sees features that belong to
        //    its plan). Each feature's CHECKED ACTIONS come from this
        //    clinic's own saved permissions — BUT ONLY when the plan being
        //    rendered is the plan actually saved on the clinic record.
        //
        //    FIX (previous): this mirrored Feature Management's checked
        //    state directly, which meant editing/unchecking a box in
        //    Feature Management retroactively changed what was already
        //    granted to every clinic on that plan. That was fixed by
        //    sourcing checked actions from clinicPermissions instead of
        //    planTemplate.
        //
        //    FIX (this pass): that clinicPermissions merge was still being
        //    applied even while PREVIEWING an unsaved plan change (user
        //    picked a new plan in Additional Details but hasn't saved it
        //    yet). Since clinicPermissions holds actions granted against
        //    the OLD/currently-saved plan, any feature name that happened
        //    to exist in both plans' templates would silently show the old
        //    plan's actions under the new plan. Now: while previewing an
        //    unsaved plan, we show ONLY that plan's own template feature
        //    list, entirely unchecked — never merged with clinicPermissions.
        //    The clinicPermissions merge only runs once the plan being
        //    shown is the plan that's actually saved.
        const merged = {}

        if (plan && KNOWN_PLANS.includes(plan)) {
          if (isShowingSavedPlan) {
            // Start with the features currently configured in Feature Management.
            Object.keys(planTemplate).forEach((feature) => {
              // IMPORTANT:
              // If this clinic already has its own saved permission,
              // ALWAYS keep the clinic's saved actions.
              //
              // Feature Management changes must NOT overwrite them.
              if (Object.prototype.hasOwnProperty.call(clinicPermissions, feature)) {
                merged[feature] = Array.isArray(clinicPermissions[feature])
                  ? [...clinicPermissions[feature]]
                  : []
              } else {
                // New feature added in Feature Management:
                // show it unchecked for this clinic.
                merged[feature] = []
              }
            })

            // IMPORTANT:
            // Keep previously saved clinic features even if they were later
            // changed/removed in Feature Management.
            //
            // This prevents Feature Management changes from automatically
            // changing existing clinic permissions.
            Object.keys(clinicPermissions).forEach((feature) => {
              if (!Object.prototype.hasOwnProperty.call(merged, feature)) {
                merged[feature] = Array.isArray(clinicPermissions[feature])
                  ? [...clinicPermissions[feature]]
                  : []
              }
            })
          } else {
            // Previewing an unsaved plan change: show ONLY this plan's own
            // template, entirely unchecked. Do NOT merge in clinicPermissions
            // here — those actions were granted against the plan that's
            // actually saved, and have no bearing on a plan the user has
            // only tentatively selected.
            Object.keys(planTemplate).forEach((feature) => {
              merged[feature] = []
            })
            console.log(
              `[ClinicPermissionsTab] Previewing unsaved plan "${plan}" (saved plan is "${trueSavedPlan}") — ` +
                `showing template features unchecked, clinicPermissions NOT merged in.`,
            )
          }
        } else {
          // No subscription plan:
          // show the clinic's saved permissions exactly as they are.
          Object.keys(clinicPermissions).forEach((feature) => {
            merged[feature] = Array.isArray(clinicPermissions[feature])
              ? [...clinicPermissions[feature]]
              : []
          })
        }

        const featureNames = Object.keys(merged)
        console.log(`[ClinicPermissionsTab] Final merged feature list for UI (scoped to "${plan || '(no plan)'}"):`, merged)

        setPermissions(merged)
        setFeatureList(featureNames)
        setOriginalPermissions(merged)
        setOriginalFeatureList(featureNames)
      } catch (error) {
        console.error('[ClinicPermissionsTab] Failed to load clinic permissions', error)
        const fallback = clinicData.permissions && Object.keys(clinicData.permissions).length > 0 ? clinicData.permissions : {}
        setPermissions(fallback)
        setFeatureList(Object.keys(fallback))
        setOriginalPermissions(fallback)
        setOriginalFeatureList(Object.keys(fallback))
        setActivePlan(planToRender)
      }
    }

    loadPermissions()
    // Re-run whenever the clinic record changes OR the live/unsaved plan
    // selection changes, so switching plans updates the visible feature set.
  }, [clinicData, selectedPlan])

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

    // Guard: if the user is previewing an unsaved plan change, block saving
    // permissions here and tell them to save the plan first — otherwise we'd
    // persist permissions against a plan the clinic record doesn't actually
    // have saved yet.
    if (isPreviewingUnsavedPlan) {
      toast.error('Save the subscription plan change in Additional Details before saving permissions.')
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
      console.log('[ClinicPermissionsTab] Saving clinic permissions — PUT', `${BASE_URL}/admin/updatePermissions/${clinicId}/${branchId}`, payload)
      const res = await axios.put(`${BASE_URL}/admin/updatePermissions/${clinicId}/${branchId}`, payload)
      console.log('[ClinicPermissionsTab] Save success — response:', res?.data)
      toast.success('Permissions updated successfully')

      // Keep the full featureList so unchecked cards remain visible after save.
      setOriginalPermissions(permissions)
      setOriginalFeatureList(featureList)
      setIsEditing(false)

      // Best-effort: register any brand-new feature this clinic just added
      // with Feature Management's plan template. Fire-and-forget — doesn't
      // block the UI and never undoes the clinic save above if it fails.
      syncNewFeaturesToPlanTemplate(activePlan, permissions, featureList)

      if (fetchClinicDetails) {
        fetchClinicDetails()
      }
    } catch (err) {
      console.error('[ClinicPermissionsTab] Failed to save permissions — status:', err?.response?.status, 'body:', err?.response?.data, err)
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
          <div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>Permissions</span>
            {activePlan && (
              <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px' }}>
                For <strong>{activePlan}</strong> Plan
              </div>
            )}
            {!activePlan && (
              <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px' }}>
                No subscription plan set on this clinic — showing saved permissions only
              </div>
            )}
            {isPreviewingUnsavedPlan && (
              <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px', fontWeight: '600' }}>
                Previewing unsaved plan change — save it in Additional Details to apply
              </div>
            )}
          </div>
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