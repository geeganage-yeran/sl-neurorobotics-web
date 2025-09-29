import React from "react";
import Sidebar from "../components/UserSidebar";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MyOrders from "./userAccountSection/MyOrders";
import Settings from "./userAccountSection/Settings";
import ShippingAddress from "./userAccountSection/Shipping";
import HelpCenter from "./userAccountSection/HelpCenter";

function UserAccountOverview({user}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map URL paths to page names
  const urlToPageMap = {
    '/dashboard/account/myorders': 'My Orders',
    '/dashboard/account/settings': 'Settings',
    '/dashboard/account/shipping': 'Shipping Address',
    '/dashboard/account/help': 'Help Center'
  };

  const getCurrentPage = () => {
    return urlToPageMap[location.pathname] || 'My Orders';
  };

  const [activePage, setActivePage] = useState(getCurrentPage());

  // Update active page when location changes
  useEffect(() => {
    const currentPage = getCurrentPage();
    setActivePage(currentPage);
  }, [location.pathname]);

  // Redirect to default account page if on base /account path
  useEffect(() => {
    if (location.pathname === '/dashboard/account' || location.pathname === '/dashboard/account/') {
      navigate('/dashboard/account/myorders', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <div className="flex">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage} // Just for state management, navigation handled in sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <div className="flex-1 ml-16 lg:ml-72 xl:ml-80 mt-12">
        <div className="p-6 lg:p-6">
          <div className="lg:max-w-none">
            <Routes>
              <Route path="myorders" element={<MyOrders user={user} />} />
              <Route path="settings" element={<Settings user={user}/>} />
              <Route path="shipping" element={<ShippingAddress  user={user}/>} />
              <Route path="help" element={<HelpCenter />} />
              <Route index element={<MyOrders />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccountOverview;