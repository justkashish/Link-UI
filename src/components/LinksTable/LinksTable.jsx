import { useState , useEffect } from "react"
import { Pencil, Trash2, Copy, Check } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../LinksTable/LinksTable.css"

function LinksTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [copiedLink, setCopiedLink] = useState(null)
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        console.log(token)
        const response = await fetch("http://localhost:8080/api/v1/link/getAllLinks", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Add the token to the headers
          }
        });

        const result = await response.json();

        if (result.success) {
          const linksData = result.data.items.map((item) => ({
            id: item._id,
            timestamp: new Date(item.createdAt).toLocaleDateString(),
            originalLink: item.url,
            shortLink: item.shortUrl,
            remarks: item.remark,
            clicks: item.totalClicks,
            status: item.status,
          }));
          setLinks(linksData);
          console.log("Links fetched succesfully")
          console.log(linksData)
        } else {
          toast.error(result.message || "Failed to fetch links");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching links:", error);
        toast.error("Failed to fetch links");
        setLoading(false);
      }
    };

    fetchLinks();
}, []);


  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = links.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(links.length / itemsPerPage)

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLink(text)
      toast.success(`${type} copied to clipboard!`)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/link/delete/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== id))
        toast.success("Link deleted successfully")
      }
    } catch (error) {
      toast.error("Failed to delete link")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="table-container">
      <ToastContainer
        position="top-right"
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
              <th className="date-column">Date</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>Remarks</th>
              <th className="clicks-column">Clicks</th>
              <th className="status-column">Status</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((link) => (
              <tr key={link.id}>
                <td>{link.timestamp}</td>
                <td className="link-cell">
                  <div className="link-cell-content">
                    {link.originalLink}
                    <button
                      className="button-ghost h-8 w-8"
                      onClick={() => copyToClipboard(link.originalLink, "Original link")}
                    >
                      {copiedLink === link.originalLink ? (
                        <Check className="h-4 w-4 copy-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="link-cell">
                  <div className="link-cell-content">
                    {link.shortLink}
                    <button
                      className="button-ghost h-8 w-8"
                      onClick={() => copyToClipboard(link.shortLink, "Short link")}
                    >
                      {copiedLink === link.shortLink ? (
                        <Check className="h-4 w-4 copy-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td>{link.remarks}</td>
                <td className="clicks-cell">{link.clicks}</td>
                <td>
                  <span className={`status-badge ${link.status === "Active" ? "status-active" : "status-inactive"}`}>
                    {link.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="button-ghost h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="button-ghost h-8 w-8"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          className="button-outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`button-outline ${currentPage === page ? "button-default" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="button-outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default LinksTable



// import { useState , useEffect } from "react"
// import { Pencil, Trash2, Copy, Check } from "lucide-react"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import "../LinksTable/LinksTable.css"

// function LinksTable() {
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)
//   const [copiedLink, setCopiedLink] = useState(null)
//   const [links, setLinks] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchLinks = async () => {
//       try {
//         const token = localStorage.getItem('token'); // Retrieve the token from local storage

//         const response = await fetch("http://localhost:8080/api/v1/link/getAllLinks", {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}` // Add the token to the headers
//           }
//         });

//         const result = await response.json();

//         if (result.success) {
//           const linksData = result.data.items.map((item) => ({
//             id: item._id,
//             timestamp: new Date(item.createdAt).toLocaleDateString(),
//             originalLink: item.url,
//             shortLink: item.shortUrl,
//             remarks: item.remark,
//             clicks: item.totalClicks,
//             status: item.status,
//           }));
//           setLinks(linksData);
//           console.log("Links fetched succesfully")
//           console.log(linksData)
//         } else {
//           toast.error(result.message || "Failed to fetch links");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching links:", error);
//         toast.error("Failed to fetch links");
//         setLoading(false);
//       }
//     };

//     fetchLinks();
// }, []);

//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = links.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(links.length / itemsPerPage)

//   const copyToClipboard = async (text, type) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedLink(text)
//       toast.success(`${type} copied to clipboard!`)
//       setTimeout(() => setCopiedLink(null), 2000)
//     } catch (err) {
//       toast.error("Failed to copy link")
//     }
//   }

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/v1/link/delete/${id}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setLinks(links.filter((link) => link.id !== id))
//         toast.success("Link deleted successfully")
//       }
//     } catch (error) {
//       toast.error("Failed to delete link")
//     }
//   }

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="table-container">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th className="date-column">Date</th>
//               <th>Original Link</th>
//               <th>Short Link</th>
//               <th>Remarks</th>
//               <th className="clicks-column">Clicks</th>
//               <th className="status-column">Status</th>
//               <th className="action-column">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map((link) => (
//               <tr key={link.id}>
//                 <td>{link.timestamp}</td>
//                 <td className="link-cell">
//                   <div className="link-cell-content">
//                     {link.originalLink}
//                     <button
//                       className="button-ghost h-8 w-8"
//                       onClick={() => copyToClipboard(link.originalLink, "Original link")}
//                     >
//                       {copiedLink === link.originalLink ? (
//                         <Check className="h-4 w-4 copy-success" />
//                       ) : (
//                         <Copy className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </td>
//                 <td className="link-cell">
//                   <div className="link-cell-content">
//                     {link.shortLink}
//                     <button
//                       className="button-ghost h-8 w-8"
//                       onClick={() => copyToClipboard(link.shortLink, "Short link")}
//                     >
//                       {copiedLink === link.shortLink ? (
//                         <Check className="h-4 w-4 copy-success" />
//                       ) : (
//                         <Copy className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </td>
//                 <td>{link.remarks}</td>
//                 <td className="clicks-cell">{link.clicks}</td>
//                 <td>
//                   <span className={`status-badge ${link.status === "Active" ? "status-active" : "status-inactive"}`}>
//                     {link.status}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     <button className="button-ghost h-8 w-8">
//                       <Pencil className="h-4 w-4" />
//                     </button>
//                     <button
//                       className="button-ghost h-8 w-8"
//                       onClick={() => handleDelete(link.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination-container">
//         <button
//           className="button-outline"
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             className={`button-outline ${currentPage === page ? "button-default" : ""}`}
//             onClick={() => setCurrentPage(page)}
//           >
//             {page}
//           </button>
//         ))}
//         <button
//           className="button-outline"
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   )
// }

// export default LinksTable
