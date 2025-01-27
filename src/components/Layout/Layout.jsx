import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { SearchProvider } from '../../context/SearchContext'; // Import SearchProvider
import './Layout.css';

const Layout = () => {
  return (
   <SearchProvider>
      <div className="layout">
        <div className='sidebar'>
        <Sidebar />
        </div>
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>
      </SearchProvider>
  );
};

export default Layout;


