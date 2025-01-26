import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Total Clicks</h2>
      <p>1234</p>
      <div className="stats">
        <div className="stat">
          <h3>Date-wise Clicks</h3>
          <ul>
            <li>21-01-25: 1234 clicks</li>
            <li>20-01-25: 1140 clicks</li>
            <li>19-01-25: 134 clicks</li>
            <li>18-01-25: 34 clicks</li>
          </ul>
        </div>
        <div className="stat">
          <h3>Click Devices</h3>
          <ul>
            <li>Mobile: 134 clicks</li>
            <li>Desktop: 40 clicks</li>
            <li>Tablet: 3 clicks</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
