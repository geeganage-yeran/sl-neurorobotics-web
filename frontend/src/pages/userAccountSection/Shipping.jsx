import React, { useState, Fragment } from 'react';
import { Plus, Home, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

export default function Shipping() {
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = [
    {
      id: 1,
      name: 'Sophia Clark',
      address: '123 Maple Street, Anytown, CA 91234',
      isDefault: true
    },
    {
      id: 2,
      name: 'Liam Carter',
      address: '456 Oak Avenue, Anytown, CA 91234',
      isDefault: false
    }
  ];

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsNewAddressOpen(false);
    setIsEditModalOpen(false);
    setEditingAddress(null);
  };

  const AddressForm = ({ address = null, isEdit = false }) => (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          defaultValue={address?.name || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter full name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          defaultValue={address?.address.split(',')[0] || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            defaultValue="Anytown"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            defaultValue="CA"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="State"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code
        </label>
        <input
          type="text"
          defaultValue="91234"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter ZIP code"
        />
      </div>

      {!isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="setDefault"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="setDefault" className="ml-2 block text-sm text-gray-700">
            Set as default address
          </label>
        </div>
      )}
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Address</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>

        {/* New Address Button */}
        <button 
          onClick={() => setIsNewAddressOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors mb-6"
        >
          <Plus size={16} />
          New Address
        </button>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <Home size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
                <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full mb-2">
                  {address.isDefault ? 'Default' : 'Not Default'}
                </span>
                <p className="text-gray-600">{address.address}</p>
              </div>
              <button 
                onClick={() => handleEditClick(address)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Address Modal */}
      <Transition appear show={isNewAddressOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModals}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      Add New Address
                    </Dialog.Title>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <AddressForm />

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModals}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModals}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Address
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Address Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModals}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      Edit Address
                    </Dialog.Title>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <AddressForm address={editingAddress} isEdit={true} />

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModals}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModals}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Address
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}