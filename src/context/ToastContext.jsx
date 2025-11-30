import React, { createContext, useContext, useState } from "react";
import Toast from "../components/cliente/Toast"; 

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {notification && <Toast message={notification} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}