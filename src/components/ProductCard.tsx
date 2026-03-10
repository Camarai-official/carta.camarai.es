"use client";

import React, { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CiImageOff } from "react-icons/ci";
import Loader from './Loader';
import { PedidoItem, Pedido } from '../types';
import './ProductCard.css';

type ProductCardProps = {
  producto: PedidoItem;
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
};

const ProductCard: React.FC<ProductCardProps> = ({ producto, pedido, setPedido }) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const cantidad = pedido[producto.nombre_producto]?.cantidad || 0;
  const currency = producto.variaciones?.currency || 'EUR';
  
  const handleQty = useCallback((delta: number) => {
    setPedido(prevPedido => {
      const currentPedido = { ...prevPedido };
      const currentCantidad = currentPedido[producto.nombre_producto]?.cantidad || 0;
      if (!currentPedido[producto.nombre_producto]) {
        currentPedido[producto.nombre_producto] = {
          ...producto,
          cantidad: 0
        };
      }
      const newCantidad = Math.max(0, currentCantidad + delta);
      currentPedido[producto.nombre_producto].cantidad = newCantidad;
      return currentPedido;
    });
  }, [producto, setPedido]);

  const handleIncrement = useCallback(() => {
    handleQty(1);
  }, [handleQty]);

  const handleDecrement = useCallback(() => {
    handleQty(-1);
  }, [handleQty]);

  const toggleVariations = () => {
    setShowVariations(!showVariations);
  };

  return (
    <div className="product-card">
      <div className="product-image" style={{ backgroundImage: `url('${producto.img_url}')` }}>
        {!imageLoaded && !imageError && (
          <div className="image-loading">
            <img 
              src="/img/up.png" 
              alt="Loading" 
              className="product-loader-image"
            />
          </div>
        )}
        {imageError && (
          <div className="image-loading" style={{ color: '#ff4444' }}>
            <CiImageOff size={30} />
          </div>
        )}
        <img
          src={producto.img_url}
          alt={producto.nombre_producto}
          style={{ display: 'none' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
      <h3 className="product-name">{producto.nombre_producto}</h3>
      <p className="product-description">{producto.descripcion || ''}</p>
      <div className="product-footer">
        <div className="product-price">{producto.variaciones?.price} {currency}</div>
        <div className="quantity-controls">
          <button className="quantity-btn minus" onClick={handleDecrement}>-</button>
          <span className="quantity-value">{cantidad}</span>
          <button className="quantity-btn plus" onClick={handleIncrement}>+</button>
        </div>
      </div>
      
      {/* Botón para mostrar variaciones si el producto las tiene */}
      {producto.hasVariations && Array.isArray(producto.variaciones) && (
        <div className="variations-section">
          <button 
            className="variations-btn" 
            onClick={toggleVariations}
            style={{
              width: '100%',
              padding: '8px 16px',
              marginTop: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showVariations ? 'Ocultar variaciones' : 'Ver variaciones'}
          </button>
          
          {showVariations && (
            <div className="variations-list" style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              {producto.variaciones.map((variation: any, index: any) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 0',
                  borderBottom: Array.isArray(producto.variaciones) && index < producto.variaciones.length - 1 ? '1px solid #dee2e6' : 'none'
                }}>
                  <span style={{ fontWeight: '500' }}>{variation.name}</span>
                  <span>{variation.price} {variation.currencySymbol}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;