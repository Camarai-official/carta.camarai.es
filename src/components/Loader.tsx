"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Loader.css';

type LoaderProps = {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  showText = true, 
  className = '' 
}) => {
  const { t, language } = useLanguage();

  const getLoadingText = () => {
    switch (language) {
      case 'es':
        return 'Cargando...';
      case 'en':
        return 'Loading...';
      case 'jp':
        return '読み込み中...';
      case 'zh':
        return '加载中...';
      case 'fr':
        return 'Chargement...';
      case 'al':
        return 'Laden...';
      default:
        return 'Cargando...';
    }
  };

  return (
    <div className={`loader-container ${size} ${className}`}>
      <div className="loader-spinner">
        <div className="loader-images">
          <img 
            src="/img/up.png" 
            alt="Loading Up" 
            className="loader-image-up"
          />
          <img 
            src="/img/down.png" 
            alt="Loading Down" 
            className="loader-image-down"
          />
        </div>
      </div>
      {showText && (
        <div className="loader-text">
          {getLoadingText()}
        </div>
      )}
    </div>
  );
};

export default Loader; 