import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import "./Dashboard.css"

export default function Dashboard() {
  const [data, setData] = useState({
    totalClicks: 0,
    dateWiseClicks: [],
    deviceClicks: [],
  })

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  
      const response = await fetch("http://localhost:8080/api/v1/linkStats/getClickStats", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the authorization token
        }
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return {
        totalClicks: 0,
        dateWiseClicks: [],
        deviceClicks: [],
      };
    }
  };
  
  

  useEffect(() => {
    const loadData = async () => {
      const analyticsData = await fetchAnalyticsData()
      setData(analyticsData)
    }

    loadData()
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard">
      <div className="total-clicks">
        <h2>Total Clicks</h2>
        <span className="click-count">{data.totalClicks}</span>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Date-wise Clicks</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={data.dateWiseClicks}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="date" type="category" tick={{ fontSize: 14 }} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#0066FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Click Devices</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.deviceClicks} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="device" type="category" tick={{ fontSize: 14 }} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#0066FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}


