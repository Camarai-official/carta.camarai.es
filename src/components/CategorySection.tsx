"use client";

import React from 'react';
import ProductCard from './ProductCard';
import { PedidoItem, Pedido } from '../types';
import './CategorySection.css';

type CategorySectionProps = {
  category: string;
  title: string;
  products: PedidoItem[];
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
  visible: boolean;
};

const CategorySection: React.FC<CategorySectionProps> = ({ category, title, products, pedido, setPedido, visible }) => {
  if (!visible) return null;
  return (
    <div className="category-section" id={category}>
      <h2 className="category-title">{title}</h2>
      <div className="product-list">
        {products.map(producto => (
          <ProductCard
            key={producto.nombre_producto}
            producto={producto}
            pedido={pedido}
            setPedido={setPedido}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;