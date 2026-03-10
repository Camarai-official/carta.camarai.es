"use client";

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FiTrash2 } from "react-icons/fi";
import Notification from './Notification';
import './CheckoutScreen.css';
import { Pedido } from '../types';

type CheckoutScreenProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  };
  setNotification: React.Dispatch<React.SetStateAction<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  }>>;
};

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ open, setOpen, pedido, setPedido, notification, setNotification }) => {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  // Deshabilitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup cuando el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Detectar si hay scroll en el modal y controlar el indicador
  useEffect(() => {
    const checkScroll = () => {
      if (modalRef.current && screenRef.current) {
        const hasScroll = modalRef.current.scrollHeight > modalRef.current.clientHeight;
        screenRef.current.classList.toggle('has-scroll', hasScroll);
      }
    };

    const handleScroll = () => {
      if (modalRef.current && screenRef.current) {
        const isScrolled = modalRef.current.scrollTop > 0;
        screenRef.current.classList.toggle('scrolled', isScrolled);
      }
    };

    if (open) {
      checkScroll();
      modalRef.current?.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        modalRef.current?.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [open, pedido]);

  const total = Object.values(pedido).reduce((acc, item) => {
    if (item && item.variaciones && typeof item.variaciones.price === 'number') {
      return acc + (item.cantidad * item.variaciones.price);
    }
    return acc;
  }, 0);
  
  const handleIncrement = useCallback((product: string) => {
    setPedido(prevPedido => {
      const currentItem = prevPedido[product];
      if (!currentItem) return prevPedido;
      
      return {
        ...prevPedido,
        [product]: {
          ...currentItem,
          cantidad: currentItem.cantidad + 1
        }
      };
    });
  }, []);



  
  const handleDecrement = useCallback((product: string) => {
    setPedido(prevPedido => {
      const currentItem = prevPedido[product];
      if (!currentItem || currentItem.cantidad <= 0) return prevPedido;
      
      return {
        ...prevPedido,
        [product]: {
          ...currentItem,
          cantidad: currentItem.cantidad - 1
        }
      };
    });
  }, []);

  const handleRemoveItem = useCallback((product: string) => {
    setPedido(prevPedido => {
      const currentPedido = { ...prevPedido };
      delete currentPedido[product];
      return currentPedido;
    });
  }, [setPedido]);

  const handleCompleteOrder = () => {
    const itemsWithQuantity = Object.entries(pedido).filter(([_, item]) => item.cantidad > 0);
    
    const jsonFirst = { session: "34671503751", line_items: [] };

    const pedidoJson: { session: string; [key: string]: any } = { ...jsonFirst };
    for (const [product, item] of Object.entries(pedido)) {
      if (item.cantidad > 0) {
        pedidoJson.line_items.push({
          quantity: item.cantidad.toString(),
          catalog_object_id: item.variaciones.item_id,
          note: "Created by CamarAI",
        });
      }
    }
    console.log('Pedido JSON incremental:', pedidoJson);

    if (itemsWithQuantity.length === 0) {
      setNotification({
        message: t('notifications.emptyCartWarning'),
        type: 'warning',
        isVisible: true
      });
      return;
    }
    
    let mensaje = "Pedido:\n";
    Object.entries(pedido).forEach(([product, item]) => {
      if (item.cantidad > 0 && item.variaciones && typeof item.variaciones.price === 'number') {
        mensaje += `${item.nombre_producto} x${item.cantidad} = ${(item.cantidad * item.variaciones.price / 100).toFixed(2)}€\n`;
      }
    });
    mensaje += `\nTotal: ${(total / 100).toFixed(2)}€`;

    fetch('/api/generarComanda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: pedidoJson })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        setNotification({
          message: `${t('notifications.orderSuccess')} ${total.toFixed(2)}€`,
          type: 'success',
          isVisible: true
        });
        setOpen(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleScrollToBottom = () => {
    if (modalRef.current) {
      modalRef.current.scrollTo({
        top: modalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    // Solo hacer scroll si se hace clic en el área del icono (parte inferior central)
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickX = e.clientX - rect.left;
    
    // Verificar si el clic está en el área del icono (parte inferior central)
    if (clickY > rect.height - 120 && clickY < rect.height - 40 && 
        clickX > rect.width / 2 - 30 && clickX < rect.width / 2 + 30) {
      handleScrollToBottom();
    }
  };
  
  if (!open) return null;
  return (
    <div className="checkout-screen" ref={screenRef} onClick={handleScreenClick}>
      <div className="checkout-modal" ref={modalRef}>
        <div className="checkout-header">
          <h2 className="checkout-title">{t('checkout.title')}</h2>
          <button className="close-btn" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="checkout-items">
          {Object.keys(pedido).filter(p => pedido[p].cantidad > 0).length === 0 && (
            <div className="empty-cart-message">{t('checkout.emptyCart')}</div>
          )}
          {Object.entries(pedido).map(([product, item]) => (
            item.cantidad > 0 && (
              <div className="checkout-item" key={product}>
                <div className="checkout-item-image">
                  <img 
                    src={item.img_url || `https://source.unsplash.com/random/100x100/?${encodeURIComponent(product)}`}
                    alt={product}
                  />
                </div>
                <div className="checkout-item-info">
                  <div className="checkout-item-name">{product}</div>
                  <div className="quantity-controls">
                    <button className="quantity-btn minus" onClick={() => handleDecrement(product)}>-</button>
                    <span className="quantity-value">{item.cantidad}</span>
                    <button className="quantity-btn plus" onClick={() => handleIncrement(product)}>+</button>
                  </div>
                </div>
                <div className="checkout-item-price">
                  {item && item.variaciones && typeof item.variaciones.price === 'number'
                    ? ((item.cantidad * item.variaciones.price) / 100).toFixed(2)
                    : '0.00'}€
                </div>
                <button className="remove-item-btn" onClick={() => handleRemoveItem(product)}>
                  <FiTrash2 />
                </button>
              </div>
            )
          ))}
        </div>
        <div className="checkout-total-section">
          {t('checkout.total')}: <span>{total.toFixed(2)}</span>€
        </div>
        <button className="confirm-btn" onClick={handleCompleteOrder}>
          {t('checkout.completeOrder')}
        </button>
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
        duration={4000}
      />
    </div>
  );
};

export default CheckoutScreen;