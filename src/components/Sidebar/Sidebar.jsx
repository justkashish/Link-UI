import { useState } from "react"
import { Link } from "react-router-dom"
import { LayoutDashboard, LinkIcon, BarChart, Settings, LogOut, X } from 'lucide-react'
import "./Sidebar.css"
import dashboardIcon from "../../assets/dashboard.svg";
import analyticIcon from "../../assets/analytic.svg";
import linkIcon from "../../assets/link.svg";
import settingsIcon from "../../assets/setting.svg";

const navItems = [
  {
    path: "/home/dashboard",
    icon: <img src={dashboardIcon} className="nav-icon" alt="Dashboard" />,
    label: "Dashboard",
  },
  {
    path: "/home/links",
    icon: <img src={linkIcon} className="nav-icon" alt="Links" />,
    label: "Links",
  },
  {
    path: "/home/analytics",
    icon: <img src={analyticIcon} className="nav-icon" alt="Analytics" />,
    label: "Analytics",
  },
  {
    path: "/home/settings",
    icon: <img src={settingsIcon} className="nav-icon" alt="Settings" />,
    label: "Settings",
  },
];


const Sidebar = ({ isMobileMenuOpen, onClose, onLogout }) => {
  const NavContent = () => (
    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <Link key={item.path} to={item.path} className="nav-item">
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
      <button className="logout-button" onClick={onLogout}>
        <LogOut className="nav-icon" />
        <span>Logout</span>
      </button>
    </nav>
  )

  return (
    <>
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>
          <button className="close-button" onClick={onClose}>
            <X />
          </button>
        </div>
        <NavContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="sidebar-container">
        <NavContent />
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={onClose} />}
    </>
  )
}

export default Sidebar



// import React from "react";
// import { Link } from "react-router-dom";
// import icon1 from "../../assets/Icons (3).svg";
// import icon2 from "../../assets/Icons (1).svg";
// import icon3 from "../../assets/Icons (2).svg";
// import settings from "../../assets/Frame.svg";
// import "./Sidebar.css";

// const Sidebar = () => {
//   return (
//     <div className="sidebar-container">
//       <nav className="resNavbar">
//         <ul className="navbar-list">
//           <li className="navbar-component">
//             <Link to="/home/dashboard">
//               <img className="icons" src={icon1} alt="Dashboard Icon" />
//               <div>Dashboard</div>
//             </Link>
//           </li>
//           <li className="navbar-component">
//             <Link to="/home/links">
//               <img className="icons" src={icon3} alt="Links Icon" />
//               <div>Links</div>
//             </Link>
//           </li>
//           <li className="navbar-component">
//             <Link to="/home/analytics">
//               <img className="icons" src={icon2} alt="Analytics Icon" />
//               <div>Analytics</div>
//             </Link>
//           </li>
//           <li className="navbar-component">
//             <Link to="/home/settings">
//               <img className="icons" src={settings} alt="Settings Icon" />
//               <div>Settings</div>
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
