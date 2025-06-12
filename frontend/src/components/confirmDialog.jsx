import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmDialog({
  isOpen,
  onClose,
  title = "Deactivate account",
  message = "Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.",
  confirmText = "Deactivate",
  cancelText = "Cancel",
  onConfirm,
  confirmButtonClass = "bg-red-600 hover:bg-red-500",
  icon: CustomIcon = ExclamationTriangleIcon,
  iconBgColor = "bg-red-100",
  iconColor = "text-red-600",
}) {
  React.useEffect(() => {
    if (isOpen) {
      const mainContent = document.querySelector("#root") || document.body;
      const sidebar =
        document.querySelector("[data-sidebar]") ||
        document.querySelector(".sidebar") ||
        document.querySelector("aside");

      mainContent.style.filter = "blur(2px)";
      if (sidebar) {
        sidebar.style.filter = "blur(2px)";
      }

      document.body.style.overflow = "hidden";
    } else {
      const mainContent = document.querySelector("#root") || document.body;
      const sidebar =
        document.querySelector("[data-sidebar]") ||
        document.querySelector(".sidebar") ||
        document.querySelector("aside");

      mainContent.style.filter = "none";
      if (sidebar) {
        sidebar.style.filter = "none";
      }
      document.body.style.overflow = "unset";
    }

    return () => {
      const mainContent = document.querySelector("#root") || document.body;
      const sidebar =
        document.querySelector("[data-sidebar]") ||
        document.querySelector(".sidebar") ||
        document.querySelector("aside");

      mainContent.style.filter = "none";
      if (sidebar) {
        sidebar.style.filter = "none";
      }
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div
                  className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full ${iconBgColor} sm:mx-0 sm:size-10`}
                >
                  <CustomIcon
                    aria-hidden="true"
                    className={`size-6 ${iconColor}`}
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleConfirm}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto ${confirmButtonClass}`}
              >
                {confirmText}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                {cancelText}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
