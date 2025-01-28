import React from "react";
import cross from "../../assets/cross.svg";
import "../DeleteConfirmationModal/DeleteConfirmationModal.css";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
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
          <button className="modal-button-secondary" onClick={onConfirm}>
            N0
          </button>
          <button className="modal-button-primary" onClick={onClose}>
            YES
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
