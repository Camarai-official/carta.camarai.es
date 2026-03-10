"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './CheckoutBar.css';

type PedidoItem = {
  id_categoria_detectada: string;
  nombre_producto: string;
  variaciones: {
    currency: string;
    item_id: string;
    name: string;
    price: number;
  };
  cantidad: number;
  url?: string;
};

type Pedido = {
  [key: string]: PedidoItem;
};

type CheckoutBarProps = {
  pedido: Pedido;
  setCheckoutOpen: (open: boolean) => void;
};

const CheckoutBar: React.FC<CheckoutBarProps> = ({ pedido, setCheckoutOpen }) => {
  const { t } = useLanguage();
  const total = Object.values(pedido).reduce((acc, item) => {
    if (item && item.variaciones && typeof item.variaciones.price === 'number') {
      return acc + (item.cantidad * item.variaciones.price);
    }
    return acc;
  }, 0);
  return (
    <div className="checkout-bar">
      <div className="checkout-total">{t('checkout.total')}: {(total / 100).toFixed(2)}€</div>
      <button className="checkout-btn" onClick={() => setCheckoutOpen(true)}>
        {t('checkout.viewOrder')}
      </button>
    </div>
  );
};

export default CheckoutBar;