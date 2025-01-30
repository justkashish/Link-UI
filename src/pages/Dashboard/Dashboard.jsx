import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const uri = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState({
    totalClicks: 0,
    dateWiseClicks: [],
    deviceClicks: [],
  });

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      if (!token) {
        console.error("No token found! Please log in again.");
        return null; // Prevent API call if no token is present
      }

      const response = await fetch(`${uri}/api/v1/linkStats/getClickStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText} (${response.status})`);
      }

      const result = await response.json();
      console.log("Fetched Click Status:", result); // Properly logs the data

      if (!result.success || !result.data || !Array.isArray(result.data.items)) {
        console.error("Error: API returned invalid data", result);
        return; // Exit early if data is not valid
      }

      if (result.success) {
        const linksData = result.data.items.map((item) => ({
          id: item._id,
          timestamp: new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24-hour format
          }),
          originalLink: item.url,
          shortLink: item.shortUrl,
          remarks: item.remark,
          clicks: item.totalClicks || 0,// ✅ Ensure 'clicks' are correctly mapped
          status: item.status,
          rawDate: new Date(item.createdAt),
        }));

        setLinks(linksData); // ✅ Update state
      } else {
        handleError(result.message || "Failed to fetch links");
      }
      
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const analyticsData = await fetchAnalyticsData();
      if (analyticsData) {
        setData(analyticsData);
      }
    };

    loadData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
                data={data.dateWiseClicks || []} // Ensure no crash if undefined
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
              <BarChart
                data={data.deviceClicks || []} // Ensure no crash if undefined
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
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
  );
}
