import { useEffect, useState, useCallback } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const uri = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState({
    totalClicks: 0,
    dateWiseClicks: [],
    deviceClicks: [
      { device: "Mobile", clicks: 0 },
      { device: "Desktop", clicks: 0 },
      { device: "Tablet", clicks: 0 },
    ],
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! Please log in again.");
        return null;
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

      if (!result.success || !result.data) {
        console.error("Error: API returned invalid data", result);
        return;
      }

      const deviceData = result.data.deviceWiseClicks || [];
      const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };

      deviceData.forEach((item) => {
        const deviceName = item.device.toLowerCase();
        if (deviceName.includes("mobile") || deviceName.includes("phone")) {
          deviceCounts.Mobile += item.totalClicks;
        } else if (deviceName.includes("desktop") || deviceName.includes("laptop")) {
          deviceCounts.Desktop += item.totalClicks;
        } else if (deviceName.includes("tablet") || deviceName.includes("ipad")) {
          deviceCounts.Tablet += item.totalClicks;
        }
      });

      const sortedDateClicks = (result.data.dateWiseClicks || [])
        .map((item) => ({
          date: item.date,
          clicks: item.totalClicks,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        totalClicks: result.data.totalClicks || 0,
        dateWiseClicks: sortedDateClicks,
        deviceClicks: [
          { device: "Mobile", clicks: deviceCounts.Mobile },
          { device: "Desktop", clicks: deviceCounts.Desktop },
          { device: "Tablet", clicks: deviceCounts.Tablet },
        ],
      };
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const analyticsData = await fetchAnalyticsData();
      if (analyticsData) {
        setData(analyticsData);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalyticsData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const name = payload[0].payload.device || payload[0].payload.date;
      return (
        <div className="custom-tooltip">
          <p>{`${name}: ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <div className="total-clicks">
        <h2>Total Clicks</h2>
        <span className="click-count">{data.totalClicks}</span>
      </div>

      <div className="charts-container">
        {/* Date-wise Clicks Chart */}
        <div className="chart-card">
          <h3>Date-wise Clicks</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.dateWiseClicks} layout="vertical">
                <XAxis type="number" hide={true} /> {/* Hiding X-axis instead of removing */}
                <YAxis
                  dataKey="date"
                  type="category"
                  tick={{ fontSize: 14, fill: "#181820", fontWeight: 600 }}
                  width={100} // Ensuring proper alignment
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar
                  dataKey="clicks"
                  fill="#1B48DA"
                  radius={[0, 4, 4, 0]}
                  barSize={25} // Ensuring bars are visible
                  label={{
                    position: "right",
                    fill: "#181820",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Click Devices Chart */}
        <div className="chart-card">
          <h3>Click Devices</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.deviceClicks} layout="vertical">
                <XAxis type="number" hide={true} /> {/* Keeping X-axis hidden for proper bar alignment */}
                <YAxis
                  dataKey="device"
                  type="category"
                  tick={{ fontSize: 16, fill: "#181820", fontWeight: 600 }}
                  width={100} // Ensuring labels are aligned properly
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar
                  dataKey="clicks"
                  fill="#1B48DA"
                  radius={[0, 4, 4, 0]}
                  barSize={25} // Making sure bars are properly sized
                  label={{
                    position: "right",
                    fill: "#181820",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}



// import { useEffect, useState, useCallback } from "react"
// import { Bar, BarChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"
// import "./Dashboard.css"

// export default function Dashboard() {
//   const uri = import.meta.env.VITE_BACKEND_URL
//   const [data, setData] = useState({
//     totalClicks: 0,
//     dateWiseClicks: [],
//     deviceClicks: [
//       { device: "Mobile", clicks: 0 },
//       { device: "Desktop", clicks: 0 },
//       { device: "Tablet", clicks: 0 },
//     ],
//   })

//   const fetchAnalyticsData = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         console.error("No token found! Please log in again.")
//         return null
//       }

//       const response = await fetch(`${uri}/api/v1/linkStats/getClickStats`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.statusText} (${response.status})`)
//       }

//       const result = await response.json()

//       if (!result.success || !result.data) {
//         console.error("Error: API returned invalid data", result)
//         return
//       }
//   // Normalize device names and aggregate clicks
//       const deviceData = result.data.deviceWiseClicks || []
      
//       const deviceCounts = {
//         Mobile: 0,
//         Desktop: 0,
//         Tablet: 0,
//       }

//       // Aggregate clicks for each device type
//       deviceData.forEach((item) => {
//         const deviceName = item.device.toLowerCase()
//         if (deviceName.includes("mobile") || deviceName.includes("phone")) {
//           deviceCounts.Mobile += item.totalClicks
//         } else if (deviceName.includes("desktop") || deviceName.includes("laptop")) {
//           deviceCounts.Desktop += item.totalClicks
//         } else if (deviceName.includes("tablet") || deviceName.includes("ipad")) {
//           deviceCounts.Tablet += item.totalClicks
//         }
//       })

//        // Create the final device clicks array maintaining order
//        const transformedDeviceClicks = [
//         { device: "Mobile", clicks: deviceCounts.Mobile },
//         { device: "Desktop", clicks: deviceCounts.Desktop },
//         { device: "Tablet", clicks: deviceCounts.Tablet },
//       ]

//       const transformedData = {
//         totalClicks: result.data.totalClicks || 0,
//         dateWiseClicks: (result.data.dateWiseClicks || []).map((item) => ({
//           date: item.date,
//           clicks: item.totalClicks,
//         })),
//         deviceClicks: transformedDeviceClicks,
//       }

//       return transformedData
//     } catch (error) {
//       console.error("Error fetching analytics:", error.message)
//       return null
//     }
//   }, [])

//   useEffect(() => {
//     const loadData = async () => {
//       const analyticsData = await fetchAnalyticsData()
//       if (analyticsData) {
//         setData(analyticsData)
//       }
//     }

//     loadData()
//     const interval = setInterval(loadData, 5 * 60 * 1000)
//     return () => clearInterval(interval)
//   }, [fetchAnalyticsData])


//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const value = payload[0].value
//       const name = payload[0].payload.device || payload[0].payload.date
//       return (
//         <div className="custom-tooltip">
//           <p>{ `${name}:${value}`}</p>
//           </div>
//       )
//     }
//     return null
//   }


//   return (
//     <div className="dashboard">
//       <div className="total-clicks">
//         <h2>Total Clicks</h2>
//         <span className="click-count">{data.totalClicks}</span>
//       </div>

//       <div className="charts-container">
//         <div className="chart-card">
//           <h3>Date-wise Clicks</h3>
//           <div className="chart-wrapper">
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart
//                 data={data.dateWiseClicks}
//                 layout="vertical"
//                 margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
//               >
//                 <YAxis
//                   dataKey="date"
//                   type="category"
//                   tick={{ fontSize: 16, fill: "181820",fontWeight: 600 }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <Tooltip content={<CustomTooltip />} cursor={false} />
//                 <Bar
//                   dataKey="clicks"
//                   fill="#1B48DA"
//                   radius={[0, 4, 4, 0]}
//                   barSize={20}
//                   label={{
//                     position: "right",
//                     fill: "#181820",
//                     fontSize: 16,
//                   }}
//                 />
//                  </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="chart-card">
//           <h3>Click Devices</h3>
//           <div className="chart-wrapper">
//             <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={data.deviceClicks} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
//                 <YAxis
//                   dataKey="device"
//                   type="category"
//                   tick={{ fontSize: 16, fill: "#181820", fontWeight: 600 }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <Tooltip content={<CustomTooltip />} cursor={false} />
//                 <Bar
//                   dataKey="clicks"
//                   fill="#1B48DA"
//                   radius={[0, 4, 4, 0]}
//                   barSize={20}
//                   label={{
//                     position: "right",
//                     fill: "#181820",
//                     fontSize: 16,
//                     fontWeight: 600
//                   }}
//                 />
//                  </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


