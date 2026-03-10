"use client";

import React, { useEffect } from 'react';
import './Notification.css';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type NotificationProps = {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
};

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
      <div className="notification-progress"></div>
    </div>
  );
};

export default Notification; 