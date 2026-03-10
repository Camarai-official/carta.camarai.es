import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import MenuContainer from './components/MenuContainer';
import CheckoutBar from './components/CheckoutBar';
import CheckoutScreen from './components/CheckoutScreen';
import './App.css';
import { fetchMenuData } from './utils/menuData';

function App() {
  const [menuData, setMenuData] = useState(null);
  const [pedido, setPedido] = useState({});
  const [activeCategory, setActiveCategory] = useState('tapas');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    fetchMenuData().then(setMenuData);
  }, []);

  if (!menuData) return <div>Cargando menú...</div>;

  return (
    <div className="App">
      <Header />
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
      />
    </div>
  );
}

export default App; 