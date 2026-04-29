import React from 'react'
import { CModal, CModalBody, CModalFooter, CButton, CModalHeader, CModalTitle } from '@coreui/react'

const ConfirmationModal = ({
  isVisible,
  message,
  onConfirm,
  onCancel,
  title = 'Confirmation',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'danger',
  cancelColor = 'secondary',
  isLoading = false,   // ✅ added
}) => {
  return (
    <CModal 
      visible={isVisible} 
      onClose={onCancel} 
      alignment="center" 
      backdrop="static" 
      className="custom-modal"
    >
      {/* Header */}
      <CModalHeader>
        <CModalTitle style={{ color: 'var(--color-black)' }}>
          ⚠ {title}
        </CModalTitle>
      </CModalHeader>

      {/* Body */}
      <CModalBody 
        style={{ color: 'var(--color-black)', textAlign: 'center' }}
      >
        {message}
      </CModalBody>

      {/* Footer */}
      <CModalFooter 
        style={{ justifyContent: 'center' }}
      >
        <CButton 
          color={cancelColor} 
          onClick={onCancel} 
          disabled={isLoading}   // ✅ prevent cancel while loading
          style={{ minWidth: '100px' }}
        >
          {cancelText}
        </CButton>

        <CButton
          color={confirmColor}
          onClick={onConfirm}
          disabled={isLoading}   // ✅ prevent double click
          style={{
            minWidth: '100px',
            color: 'white',
            backgroundColor: 'var(--color-black)',
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Deleting...
            </>
          ) : (
            confirmText
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmationModal