import React from "react";
import { Link } from "react-router-dom";
import icon1 from "../../assets/Icons (3).svg";
import icon2 from "../../assets/Icons (1).svg";
import icon3 from "../../assets/Icons (2).svg";
import settings from "../../assets/Frame.svg";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <nav className="resNavbar">
        <ul className="navbar-list">
          <li>
            <Link to="/home/dashboard">
              <img className="icons" src={icon1} alt="Dashboard Icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/home/links">
              <img className="icons" src={icon3} alt="Links Icon" />
              <span>Links</span>
            </Link>
          </li>
          <li>
            <Link to="/home/analytics">
              <img className="icons" src={icon2} alt="Analytics Icon" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link to="/home/settings">
              <img className="icons" src={settings} alt="Settings Icon" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
