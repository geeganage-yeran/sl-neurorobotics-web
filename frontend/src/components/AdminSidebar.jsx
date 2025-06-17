import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Settings,
  PackagePlus,
  FileText,
  HelpCircle,
  ChevronRight,
  LayoutDashboard,
  UserCog,
  Package,
} from "lucide-react";
import Logo from "../assets/image5.png";

const AdminSidebar = ({ activePage, setActivePage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      description: "System summary view",
    },
    {
      name: "Add Product",
      icon: PackagePlus,
      path: "/admin/addproduct",
      description: "Add your products",
    },
    {
      name: "Manage Product",
      icon: Package,
      path: "/admin/manageproduct",
      description: "Manage your products",
    },
    {
      name: "Manage Users",
      icon: UserCog,
      path: "/admin/users",
      description: "Manage site users",
    },
    {
      name: "Quotations",
      icon: FileText,
      path: "/admin/quotations",
      description: "Quotation requests",
    },
    {
      name: "FAQ's",
      icon: HelpCircle,
      path: "/admin/FAQ",
      description: "Update FAQ's section",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
      description: "Account prefferences",
    },
  ];

  const handleItemClick = (itemName, itemPath) => {
    setActivePage(itemName);
    navigate(itemPath);
  };

  const isActive = (itemPath) => {
    if (location.pathname === "/admin" && itemPath === "/admin/dashboard") {
      return true;
    }
    return location.pathname === itemPath;
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 h-full z-40 bg-[#003554] w-20 shadow-xl flex flex-col">
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
      <div className="hidden lg:flex fixed top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 w-75 xl:w-85 shadow-none flex-col z-30">
        <div className="pt-6 bg-[#003554] mb-5 pl-6">
          <Link to="/">
            <img
              src={Logo}
              alt="SL Neurorobotics Logo"
              className="h-8 mb-2 ml-7"
            />
          </Link>
          <span className="inline-flex items-center rounded-md bg-gray-50 ml-16 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-gray-500/10 mb-4 ring-inset">
            Admin Panel
          </span>
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
                  transition-all duration-200 group cursor-pointer
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

export default AdminSidebar;
