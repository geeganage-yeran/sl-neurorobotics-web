import React, { useState, Fragment } from "react";
import { Plus, Home, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import ButtonPrimary from "../../components/Button";
import SecondaryButton from "../../components/SecondaryButton";

export default function Shipping() {
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = [
    {
      id: 1,
      name: "Sophia Clark",
      address: "123 Maple Street, Anytown, CA, 91234",
      isDefault: true,
    },
    {
      id: 2,
      name: "Liam Carter",
      address: "456 Oak Avenue, Anytown, CA, 91234",
      isDefault: false,
    },
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
          defaultValue={address?.name || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          defaultValue={address?.address.split(",")[0] || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent"
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
            defaultValue={address?.address.split(",")[1] || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent"
            placeholder="Enter city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            defaultValue={address?.address.split(",")[2] || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent"
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
          defaultValue={address?.address.split(",")[3] || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent"
          placeholder="Enter ZIP code"
        />
      </div>

      {isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="setDefault"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="setDefault"
            className="ml-2 block text-sm text-gray-700"
          >
            Set as default address
          </label>
        </div>
      )}
    </form>
  );

  return (
    <div className="max-w-4xl lg:ml-25 mx-auto bg-[#F5F5F5] min-h-screen">
      <div className="mb-2 mt-2">
        <h1 className="text-2xl font-semibold text-[#003554]">Saved Address</h1>
        <h3 className="text-gray-600">Manage your shipping addresses</h3>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* New Address Button */}
        <button
          onClick={() => setIsNewAddressOpen(true)}
          className="flex items-center gap-2 px-3 py-1 border border-[#003554] text-[#003554] rounded-md hover:bg-[#bac1c54e] cursor-pointer transition-colors mb-6"
        >
          <Plus size={16} />
          New Address
        </button>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="p-2 bg-white rounded-md shadow-sm">
                <Home size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {address.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full mb-2">
                  {address.isDefault ? "Default" : "Not Default"}
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
        <Dialog as="div" className="relative z-50" onClose={closeModals}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#0808097e] backdrop-blur-sm" />
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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Add New Address
                    </Dialog.Title>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <AddressForm />

                  <div className="flex gap-3 mt-6">
                    <SecondaryButton
                      text="Cancel"
                      py="py-3"
                      px="px-17"
                      variant="outline"
                      onClick={closeModals}
                    />
                    <SecondaryButton text="Save Address" py="py-3" px="px-13" />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Address Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModals}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#0808097e] backdrop-blur-sm" />
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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Edit Address
                    </Dialog.Title>
                    <button
                      onClick={closeModals}
                      className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <AddressForm address={editingAddress} isEdit={true} />

                  <div className="flex gap-2 mt-6">
                    <SecondaryButton
                      text="Cancel"
                      py="py-3"
                      px="px-14"
                      variant="outline"
                      onClick={closeModals}
                    />
                    <SecondaryButton text="Update Address" py="py-3" px="px-14" />
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
