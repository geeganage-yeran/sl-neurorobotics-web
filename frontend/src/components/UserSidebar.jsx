import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Package,
  Settings,
  MapPin,
  FileText,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const UserSidebar = ({ activePage, setActivePage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: "My Orders",
      icon: Package,
      path: "/dashboard/account/myorders",
      description: "View your order history",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/account/settings",
      description: "Account preferences",
    },
    {
      name: "Shipping Address",
      icon: MapPin,
      path: "/dashboard/account/shipping",
      description: "Manage delivery addresses",
    },
    {
      name: "Quotations",
      icon: FileText,
      path: "/dashboard/account/quotations",
      description: "Price estimates",
    },
    {
      name: "Help Center",
      icon: HelpCircle,
      path: "/dashboard/account/help",
      description: "Support and FAQ",
    },
  ];

  const handleItemClick = (itemName, itemPath) => {
    setActivePage(itemName);
    navigate(itemPath);
  };

  // Check if current path matches the item path
  const isActive = (itemPath) => {
    return location.pathname === itemPath;
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden mt-14 fixed top-0 left-0 h-full z-40 bg-[#003554] w-16 shadow-xl flex flex-col">
        <nav className="flex-1 pt-6 px-2 space-y-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const itemIsActive = isActive(item.path);

            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name, item.path)}
                className={`
                  w-full flex items-center justify-center p-3 rounded-lg
                  transition-all duration-200 group relative
                  ${
                    itemIsActive
                      ? "bg-white text-[#003554]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
                title={item.name}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed top-0 left-22 h-screen bg-gray-50 border-r border-gray-200 w-72 xl:w-80 shadow-none flex-col z-30">
        <div className="pt-6 pl-6">
          <h2 className="text-2xl ml-3 mt-15 mb-4 font-semibold text-[#003554]">
            Account
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const itemIsActive = isActive(item.path);

            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name, item.path)}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl
                  transition-all duration-200 group
                  ${
                    itemIsActive
                      ? "bg-[#003554] text-white shadow-lg shadow-blue-900/25"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`
                    p-2 rounded-lg transition-colors
                    ${
                      itemIsActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700"
                    }
                  `}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <div
                      className={`
                      font-medium transition-colors
                      ${
                        itemIsActive
                          ? "text-white"
                          : "text-gray-700 group-hover:text-gray-900"
                      }
                    `}
                    >
                      {item.name}
                    </div>
                    <div
                      className={`
                      text-xs transition-colors
                      ${
                        itemIsActive
                          ? "text-white/80"
                          : "text-gray-500 group-hover:text-gray-600"
                      }
                    `}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className={`
                    transition-all duration-200
                    ${
                      itemIsActive
                        ? "text-white/80 rotate-90"
                        : "text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1"
                    }
                  `}
                />
              </button>
            );
          })}
        </nav>

        <div className="h-6"></div>
      </div>
    </>
  );
};

export default UserSidebar;