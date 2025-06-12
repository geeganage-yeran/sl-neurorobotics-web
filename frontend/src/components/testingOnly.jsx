// Example usage component
// ExampleUsage.jsx
import { useState } from 'react'
import { TrashIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export function ExampleUsage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)

  const handleDeleteAccount = () => {
    console.log('Account deleted!')
    // Add your delete logic here
  }

  const handleSaveSettings = () => {
    console.log('Settings saved!')
    // Add your save logic here
  }

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold mb-6">Dialog Examples</h2>
      
      <div className="space-x-4">
        <button
          type="button"
          onClick={() => setDeleteDialogOpen(true)}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Delete Account
        </button>
        
        <button
          type="button"
          onClick={() => setSuccessDialogOpen(true)}
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
        >
          Save Settings
        </button>
        
        <button
          type="button"
          onClick={() => setInfoDialogOpen(true)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Show Info
        </button>
      </div>

      {/* Delete Account Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Deactivate account"
        message="Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone."
        confirmText="Deactivate"
        cancelText="Cancel"
      />

      {/* Success Dialog */}
      <ConfirmDialog
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        onConfirm={handleSaveSettings}
        title="Save Settings"
        message="Are you sure you want to save these settings? This will update your preferences."
        confirmText="Save"
        cancelText="Cancel"
        confirmButtonClass="bg-green-600 hover:bg-green-500"
        icon={CheckCircleIcon}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />

      {/* Info Dialog */}
      <ConfirmDialog
        isOpen={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        title="Information"
        message="This is an informational dialog. You can customize the content, icon, and styling as needed."
        confirmText="Got it"
        cancelText="Close"
        confirmButtonClass="bg-blue-600 hover:bg-blue-500"
        icon={InformationCircleIcon}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
    </div>
  )
}