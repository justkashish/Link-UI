import React,{useEffect} from "react";
import cross from "../../assets/cross.svg";
import "../DeleteConfirmationModal/DeleteConfirmationModal.css";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  // useEffect(() => {
  //   const root = document.getElementById("root");

  //   if (isOpen) {
  //     root.setAttribute("inert", "true"); // Disable background interactions
  //     document.getElementById("modalCloseButton")?.focus(); // Move focus to modal
  //   } else {
  //     root.removeAttribute("inert");
  //   }

  //   return () => root.removeAttribute("inert"); // Cleanup when closing
  // }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img
          onClick={onClose}
          className="crossIcon"
          src={cross}
          alt="Close"
          height={18}
        />
        <div className="modal-body">Are you sure, you want to remove it?</div>
        <div className="modal-footer">
          <button className="modal-button-secondary" onClick={onClose}>
            N0
          </button>
          <button className="modal-button-primary" onClick={onConfirm}>
            YES
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
