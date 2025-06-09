import React, { useState } from "react";
import Footer from "../components/Footer";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function Userdashboard() {
  function renderTabContent(tab) {
    switch (tab) {
      case "Orders":
        return <div>Order history and tracking info...</div>;
      case "Settings":
        return (
          <div className="setting">
            <div className="sm:pe-48">
              <h2 className="font-semibold text-[#003554] text-[30px]">
                Personal Information
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    Contact
                  </label>
                  <div className="mt-2">
                    <input
                      id="contact"
                      name="contact"
                      type="tel"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    Country
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button className="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white">
                  Cancel
                </button>
                <button className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]">
                  Update
                </button>
              </div>
            </div>
            {/* update password */}
            <div className="sm:pe-48 mt-10">
              <h2 className="font-semibold text-[#003554] text-[30px]">
                Update your password
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="oldpassword"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    Old Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="oldpassword"
                      name="oldpassword"
                      type="password"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3"></div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="New Password"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    New Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="New Password"
                      name="New Password"
                      type="password"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="Confirm New Password"
                    className="block text-lg font-medium text-[#003554]"
                  >
                    Confirm New Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="Confirm New Password"
                      name="Confirm New Password"
                      type="password"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#003554] sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button className="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white">
                  Cancel
                </button>
                <button className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]">
                  Update
                </button>
              </div>
            </div>
            {/* delete ac */}
            <div className="sm:pe-48 my-10">
              <h2 className="font-semibold text-[#003554] text-[30px]">
                Delete Your Account
              </h2>
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => setOpen(true)}
                  className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 border hover:border-red hover:bg-red-700"
                >
                  Delete Your Account
                </button>
              </div>
            </div>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                          <ExclamationTriangleIcon
                            aria-hidden="true"
                            className="size-6 text-red-600"
                          />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold text-gray-900"
                          >
                            Deactivate account
                          </DialogTitle>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to deactivate your account?
                              All of your data will be permanently removed. This
                              action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </div>
        );
      case "Shipping Address":
        return <div>Manage shipping addresses here...</div>;
      case "Quotations":
        return(
        <div class="relative">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border dark:border-gray-700">
            <thead class="text-xs text-[#003554] uppercase ">
              <tr className="border-b dark:border-gray-700">
                <th scope="col" class="px-6 py-3">
                  Id
                </th>
                <th scope="col" class="px-6 py-3">
                  Date
                </th>
                <th scope="col" class="px-6 py-3">
                  Status
                </th>
                <th scope="col" class="px-6 py-3">
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b dark:border-gray-700  text-[#514B4B]">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-[#514B4B] whitespace-nowrap"
                >
                  Q123KLI
                </th>
                <td class="px-6 py-4">05/12/2025</td>
                <td class="px-6 py-4">Sent</td>
                <td class="px-6 py-4">
                  <a
                    href="#"
                    class="font-medium text-[#003554] hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
               <tr class="border-b dark:border-gray-700  text-[#514B4B]">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-[#514B4B] whitespace-nowrap"
                >
                  Q123KLI
                </th>
                <td class="px-6 py-4">05/12/2025</td>
                <td class="px-6 py-4">Sent</td>
                <td class="px-6 py-4">
                  <a
                    href="#"
                    class="font-medium text-[#003554] hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>);
      case "Help Center":
        return <div>FAQ and contact support...</div>;
      default:
        return null;
    }
  }

  const [activeTab, setActiveTab] = useState("Orders");
  const tabs = [
    "Orders",
    "Settings",
    "Shipping Address",
    "Quotations",
    "Help Center",
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:px-12">
        <div className="flex flex-col md:flex-row p-4">
          <aside className="bg-[#F2F2F2] md:w-64 w-full p-4 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 text-[#003554]">
              Account
            </h2>
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer px-3 py-2 rounded ${
                    activeTab === tab
                      ? "bg-[#003554] text-white font-medium"
                      : "text-[#003554] hover:bg-blue-100 font-medium"
                  }`}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </aside>
          <main className="flex-1 px-4">
            <h2 className="text-lg font-semibold mb-4 text-[#003554] bg-[#F2F2F2] px-2.5 py-3 rounded-t-[15px]">
              {activeTab}
            </h2>
            <div className="bg-[#F2F2F2] h-[calc(100vh-6rem)] rounded-lg p-4 overflow-y-auto">
              {/* Dynamic content goes here */}
              {renderTabContent(activeTab)}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Userdashboard;
