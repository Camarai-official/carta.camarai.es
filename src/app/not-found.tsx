"use client";

import Link from 'next/link';
import config from './config.json';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-logo">
          <img src={config.brand.logo} alt={config.brand.headerTitle} />
        </div>
        
        <div className="not-found-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#25D366"/>
          </svg>
        </div>
        
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página no encontrada</h2>
        <p className="not-found-description">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        
        <div className="not-found-actions">
          <Link href="/" className="not-found-btn primary">
            Ir al Inicio
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="not-found-btn secondary"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
} 