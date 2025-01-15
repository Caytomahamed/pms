import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <div
    className={`toast ${type}`}
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: 1000,
      color: 'white',
    }}
  >
    {message}
    <button
      onClick={onClose}
      style={{
        marginLeft: '10px',
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      ✖
    </button>
  </div>
);

export default Toast;
