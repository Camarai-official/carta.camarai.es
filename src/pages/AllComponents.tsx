"use client";

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import MenuContainer from '../components/MenuContainer';
import CheckoutBar from '../components/CheckoutBar';
import CheckoutScreen from '../components/CheckoutScreen';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import { Pedido, PedidoItem, MenuData } from '../types';

// Funcion para convertir currency a simbolo
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'EUR': return '€';
    case 'USD': return '$';
    default: return currency;
  }
};


// Funcion para procesar los datos del menu y detectar duplicados
const processMenuData = (rawMenuData: any): MenuData => {
  const processedData: MenuData = {};
  
  Object.keys(rawMenuData).forEach(category => {
    const products = rawMenuData[category];
    const productGroups: { [key: string]: any[] } = {};
    
    // Agrupar productos por nombre
    products.forEach((product: any) => {
      const nombre = product.nombre_producto;
      if (!productGroups[nombre]) {
        productGroups[nombre] = [];
      }
      productGroups[nombre].push(product);
    });
    
    // Procesar cada grupo de productos
    const processedProducts: PedidoItem[] = Object.keys(productGroups).map(nombre => {
      const group = productGroups[nombre];
      
      if (group.length === 1) {
        // Producto unico - mostrar directamente
        const product = group[0];
        return {
          id_categoria_detectada: product.id_categoria_detectada || '',
          nombre_producto: product.nombre_producto,
          variaciones: product.variaciones,
          cantidad: 0,
          img_url: product.url, // cambio url por img_url
          descripcion: null,
          currency: product.variaciones?.currency,
          currencySymbol: getCurrencySymbol(product.variaciones?.currency),
          hasVariations: false,
          variations: null
        };
      } else {
        // Producto con variaciones - mostrar el primero y boton para variaciones
        const firstProduct = group[0];
        const variations = group.map((p: any) => ({
          name: p.variaciones.name,
          price: p.variaciones.price,
          currency: p.variaciones.currency,
          currencySymbol: getCurrencySymbol(p.variaciones.currency)
        }));
        
        return {
          id_categoria_detectada: firstProduct.id_categoria_detectada || '',
          nombre_producto: firstProduct.nombre_producto,
          variaciones: firstProduct.variaciones,
          cantidad: 0,
          img_url: firstProduct.url, // cambio url por img_url
          descripcion: null,
          currency: firstProduct.variaciones?.currency,
          currencySymbol: getCurrencySymbol(firstProduct.variaciones?.currency),
          hasVariations: true,
          variations: variations
        };
      }
    });
    
    processedData[category] = processedProducts;
  });
  
  return processedData;
};

function AllComponentsContent() {
  const { t } = useLanguage();
  const [menuData, setMenuData] = useState<any>(null);
  const [pedido, setPedido] = useState<Pedido>({});
  const [activeCategory, setActiveCategory] = useState('tapas');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // El fetch debe ir dentro de un useEffect dentro del componente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session') || '0';
    fetch('/api/obtenerCarta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session: session })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        const processedData = processMenuData(data);
        setMenuData(processedData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  if (!menuData) return <Loader size="large" className="fullscreen" />;

  return (
    <div className="App">
      <Header setCheckoutOpen={setCheckoutOpen} pedido={pedido} />
      <CategoryTabs
        categories={Object.keys(menuData)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <MenuContainer
        menuData={menuData}
        pedido={pedido}
        setPedido={setPedido}
        activeCategory={activeCategory}
      />
      <CheckoutBar
        pedido={pedido}
        setCheckoutOpen={setCheckoutOpen}
      />
      <CheckoutScreen
        open={checkoutOpen}
        setOpen={setCheckoutOpen}
        pedido={pedido}
        setPedido={setPedido}
        notification={notification}
        setNotification={setNotification}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
        duration={4000}
      />
    </div>
  );
}

export default function AllComponents() {
  return (
    <LanguageProvider>
      <AllComponentsContent />
    </LanguageProvider>
  );
}