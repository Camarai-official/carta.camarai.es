"use client";

import React, { useEffect, useState, useRef } from 'react';
import './CategoryTabs.css';

type CategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, setActiveCategory }) => {
  const [showTabs, setShowTabs] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Solo aplicar en mobile
      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          setShowTabs(false); // Scroll hacia abajo
        } else {
          setShowTabs(true); // Scroll hacia arriba
        }
        lastScrollY.current = currentScrollY;
      } else {
        setShowTabs(true); // Siempre visible en desktop
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`category-tabs${showTabs ? '' : ' hide-tabs'}`}>
      {categories.map(category => (
        <div
          key={category}
          className={`category-tab${activeCategory === category ? ' active' : ''}`}
          data-category={category}
          onClick={() => setActiveCategory(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default CategoryTabs; 