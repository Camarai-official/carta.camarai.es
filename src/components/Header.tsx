"use client";

import React, { useEffect, useRef } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { TbWorld } from "react-icons/tb";
import { useLanguage } from '../context/LanguageContext';
import config from '../app/config.json';
import { Pedido, PedidoItem } from '../types';
import './Header.css';

type HeaderProps = {
  setCheckoutOpen: (open: boolean) => void;
  pedido: Pedido;
};

const Header: React.FC<HeaderProps> = ({ setCheckoutOpen, pedido }) => {
  const { t, language, setLanguage, isLanguageMenuOpen, setIsLanguageMenuOpen } = useLanguage();
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
  // Calcular el total de productos en el carrito
  const totalItems = Object.values(pedido).reduce((acc, item) => acc + item.cantidad, 0);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'jp', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'al', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageClick = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
  };

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageMenuOpen, setIsLanguageMenuOpen]);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img 
            src={config.brand.logo} 
            alt={`${config.brand.name} Logo`} 
            className="header-logo"
          />
          <h1 className="header-title">{config.brand.headerTitle}</h1>
        </div>
        <div className="header-actions">
          <div className="language-dropdown" ref={languageDropdownRef}>
            <button 
              className="language-btn" 
              onClick={handleLanguageClick}
              title="Select Language"
            >
              <TbWorld />
              <span className="current-language">{currentLanguage?.flag}</span>
            </button>
            {isLanguageMenuOpen && (
              <div className="language-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="language-flag">{lang.flag}</span>
                    <span className="language-name">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="cart-container" onClick={() => setCheckoutOpen(true)}>
            <FiShoppingCart  className="cart-icon" />
            {totalItems > 0 && (
              <div className="cart-badge">{totalItems}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;