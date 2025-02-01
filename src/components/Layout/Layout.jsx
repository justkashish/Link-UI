import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import Sidebar from "../Sidebar/Sidebar"
import { SearchProvider } from "../../context/SearchContext"
import { toast } from "react-toastify"
import "./Layout.css"

const Layout = () => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser")
    if (user) {
      setUserName(user)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("loggedInUser")
    toast.success("Successfully logged out")
    setIsMobileMenuOpen(false);
    navigate("/login")
  }

  return (
    <SearchProvider>
     <div className="layout">
      <div className="navbar-content">
        <Navbar 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={handleLogout}
        />
        </div>
        <div className="main-content">
          <div className="sidebar-content">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onLogout={handleLogout}
          />
          </div>
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>
    </SearchProvider>
  )
}

export default Layout



// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';
// import Sidebar from '../Sidebar/Sidebar';
// import { SearchProvider } from '../../context/SearchContext'; // Import SearchProvider
// import './Layout.css';

// const Layout = () => {
//   return (
//    <SearchProvider>
//       <div className="layout">
//         <div className='navbar-content'>
//           <Navbar />
//         </div>
//         <div className='main-content'>
//           <div className='sidebar-content'>
//            <Sidebar />
//            </div>
//           <div className="page-content">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//       </SearchProvider>
//   );
// };

// export default Layout;


