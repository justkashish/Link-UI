import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import "react-toastify/dist/ReactToastify.css";
import "../LinksTable/LinksTable.css";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import EditLinkModal from "../EditLinkModal/EditLinkModal";
import copyIcon from "../../assets/copy.svg";
import deleteIcon from "../../assets/delete.svg";
import editIcon from "../../assets/edit.svg";
import checkIcon from "../../assets/checkIcon.svg";

function LinksTable({ openDeleteModal }) {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [copiedLink, setCopiedLink] = useState(null);
  const [links, setLinks] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = links.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(links.length / itemsPerPage);
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${uri}/api/v1/link/getAllLinks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        console.log(result)
        if (result.success) {
          const linksData = result.data.items.map((item) => ({
            id: item._id,
            timestamp: new Date(item.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false //24-hour format
          }),
            originalLink: item.url,
            shortLink: item.shortUrl,
            remarks: item.remark,
            clicks: item.totalClicks,
            status: item.status,
            rawDate: new Date(item.createdAt),
          }));
          setLinks(linksData);
          console.log("Links Fetched Successfully");
          handleSuccess("Links Fetched Successfully")
        } else {
          handleSuccess(result.message || "Failed to fetch links");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching links:", error);
        handleError("Failed to fetch links");
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedLinks = [...links].sort((a, b) => {
      if (key === "timestamp") {
        return direction === "asc"
          ? a.rawDate - b.rawDate
          : b.rawDate - a.rawDate;
      }
      if (key === "status") {
        return direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    setLinks(sortedLinks);
  };

  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <span className="sort-icons">
        <ChevronUp
          className={`sort-icon ${
            isActive && sortConfig.direction === "asc" ? "active" : ""
          }`}
          size={12}
        />
        <ChevronDown
          className={`sort-icon ${
            isActive && sortConfig.direction === "desc" ? "active" : ""
          }`}
          size={12}
        />{" "}
      </span>
    );
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(text);
      handleSuccess(`${type} copied to clipboard!`);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      handleError("Failed to copy link");
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const handleDeleteClick = (id) => {
    setSelectedLinkId(id);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (id) =>{
    setSelectedLinkId(id);
    setIsModalOpen(true);
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${uri}/api/v1/link/delete/${selectedLinkId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== selectedLinkId));
        handleSuccess("Link deleted successfully");
        console.log("Link deleted successfully");
      } else {
        const result = await response.json();
        handleError(result.message || "Failed to delete the link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      handleError("Failed to delete the link");
      console.log("Failed to delete the link");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    buttons.push(
      <button
        key="prev"
        className="pagination-button"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </button>
    );

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          className={`pagination-button ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        className="pagination-button"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </button>
    );

    return buttons;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-container">
      <ToastContainer
        position="left-bottom"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th
                className="date-column cursor-pointer"
                onClick={() => sortData("timestamp")}
              >
                Date <SortIcon columnKey="timestamp" />
              </th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th className="remarks-column">Remarks</th>
              <th className="clicks-column">Clicks</th>
              <th
                className="status-column cursor-pointer"
                onClick={() => sortData("status")}
              >
                Status <SortIcon columnKey="status" />
              </th>
              <th className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((link) => (
              <tr key={link.id}>
                <td>{link.timestamp}</td>
                <td className="link-cell">
                  <div className="link-cell-content">
                    <span className="original-link" title={link.originalLink}>
                      {truncateText(link.originalLink, 50)}
                    </span>
                  </div>
                </td>
                <td className="link-cell">
                  <div className="link-cell-content">
                    <span
                      className="link-text"
                      onClick={() =>
                        copyToClipboard(link.shortLink, "Short link")
                      }
                      title={link.shortLink} // Show full URL on hover
                    >
                      {truncateText(link.shortLink, 30)}
                    </span>
                    <div className="action-buttons">
                      <img
                        src={
                          copiedLink === link.shortLink ? checkIcon : copyIcon
                        }
                        alt={copiedLink === link.shortLink ? "Copied" : "Copy"}
                        className="h-6 w-6 cursor-pointer"
                        title={
                          copiedLink === link.shortLink
                            ? "Link copied!"
                            : "Copy short link"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(link.shortLink, "Short link");
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="remarks-column">
                  <span title={link.remarks}>
                    {truncateText(link.remarks, 20)}
                  </span>
                </td>
                <td className="clicks-cell">{link.clicks}</td>
                <td>
                  <span
                    className={`status-badge ${
                      link.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {link.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="h-6 w-6 cursor-pointer"
                      title="Edit"
                      onClick={() => handleEditClick(link.id)}
                    />
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="h-6 w-6 cursor-pointer"
                      title="Delete"
                      onClick={() => handleDeleteClick(link.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">{renderPaginationButtons()}</div>

      <EditLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(updatedLink) => {
          // Handle the updated link data
          console.log(updatedLink);
        }}
        linkId={selectedLinkId}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default LinksTable;
