import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar  />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;