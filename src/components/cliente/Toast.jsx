import React from "react";
import "./Toast.css";
import { FiCheckCircle } from "react-icons/fi"; 

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <div className="toast-icon">
        <FiCheckCircle />
      </div>
      <div className="toast-content">
        <span className="toast-title">Sucesso!</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
}