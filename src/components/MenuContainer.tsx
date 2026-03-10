"use client";

import React from 'react';
import CategorySection from './CategorySection';
import { PedidoItem, Pedido, MenuData } from '../types';
import './MenuContainer.css';

type MenuContainerProps = {
  menuData: MenuData;
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
  activeCategory: string;
};

const MenuContainer: React.FC<MenuContainerProps> = ({ menuData, pedido, setPedido, activeCategory }) => (
  <div className="menu-container">
    {Object.keys(menuData).map(category => (
      <CategorySection
        key={category}
        category={category}
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        products={menuData[category]}
        pedido={pedido}
        setPedido={setPedido}
        visible={activeCategory === category}
      />
    ))}
  </div>
);

export default MenuContainer;