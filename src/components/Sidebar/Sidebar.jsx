import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import cuvette from "../../assets/cuvette.png";
import icon1 from '../../assets/Icons (3).svg';
import icon2 from '../../assets/Icons (1).svg';
import icon3 from '../../assets/Icons (2).svg';
import settings from '../../assets/Frame.svg';
import "./Sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <img className="cuvette-image" src={cuvette} alt="Cuvette" />
        <div className="dash">
          <ul>
            <li>
              <Link to="/home/dashboard">
                <img className="icons" src={icon1} alt="Dashboard Icon" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/home/links">
                <img className="icons" src={icon3} alt="Links Icon" /> Links
              </Link>
            </li>
            <li>
              <Link to="/home/analytics">
                <img className="icons" src={icon2} alt="Analytics Icon" /> Analytics
              </Link>
            </li>
          </ul>
        </div>
        <div className="setting">
          <ul>
            <li>
              <Link to="/home/settings">
                <img className="icons" src={settings} alt="Settings Icon" /> Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <button className="hamburger-menu" onClick={toggleSidebar}>
        <FaBars />
      </button>
    </div>
  );
};

export default Sidebar;
