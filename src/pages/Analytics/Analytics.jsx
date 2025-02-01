import { useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import "./Analytics.css";

export default function Analytics() {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`; // Base URL for API requests
  const { searchQuery } = useSearch(); // Get the search query from context
  const [data, setData] = useState([]); // To store analytics data
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [sortOrder, setSortOrder] = useState("desc"); // Sorting order (ascending/descending)
  const itemsPerPage = 10; // Items per page (pagination)
  const token = localStorage.getItem("token"); // Get token from localStorage to authenticate the request

  // Fetch analytics data from the backend
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `${uri}/api/v1/link/getAnalytics?timestampOrder=${sortOrder}&search=${searchQuery}&page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with token
          },
        }
      );
      const result = await response.json();
      console.log("Analytics Fetched Sucessfully...");

      // Check if the response is valid and contains the expected data structure
      if (result.success && result.data && Array.isArray(result.data.items)) {
        setData(result.data.items); // Set the items array to state
        setTotalPages(Math.ceil(result.data.totalCount / itemsPerPage)); // Set total pages based on total count
      } else {
        console.error("Unexpected data format:", result); // Log error if data format is unexpected
        setData([]); // Clear data if the response format is unexpected
      }
    } catch (error) {
      console.error("Error fetching analytics:", error); // Handle errors in API call
    }
  };

  // Effect to fetch analytics data when component mounts or dependencies change
  useEffect(() => {
    fetchAnalytics();
    // Set up polling for updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000); // Poll every 30 seconds for fresh data
    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, [currentPage, sortOrder, searchQuery]); // Fetch data whenever page, sort order, or search query changes

  // Handle sorting by toggling sort order between ascending and descending
  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page); // Change the current page
  };

  // Format the timestamp to a readable date string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="analytics-container">
      <div className="table-container">
        <table className="analytics-table">
          <thead>
            <tr>
              {/* Sorting the timestamp column */}
              <th onClick={handleSort} className="sortable">
                Timestamp {sortOrder === "asc" ? "↑" : "↓"} {/* Display sort icon */}
              </th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>IP Address</th>
              <th>User Device</th>
            </tr>
          </thead>
          <tbody>
           {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.createdAt)}</td>
                  <td className="link-cell">{item.url}</td>
                  <td className="link-cell">{item.shortUrl}</td>
                  <td>{item.ipAddress}</td>
                  <td>{item.userDevice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td> 
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {/* Pagination controls */}
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ← {/* Previous page button */}
        </button>
        {/* Page number buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""} //
          >
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          → {/* Next page button */}
        </button>
      </div>
    </div>
  );
}
