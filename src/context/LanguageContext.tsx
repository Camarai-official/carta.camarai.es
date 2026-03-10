"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en' | 'jp' | 'zh' | 'fr' | 'al';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLanguageMenuOpen: boolean;
  setIsLanguageMenuOpen: (open: boolean) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');
  const [translations, setTranslations] = useState<any>({});
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locate/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to Spanish if loading fails
        if (language !== 'es') {
          setLanguage('es');
        }
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setIsLanguageMenuOpen(false);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['es', 'en', 'jp', 'zh', 'fr', 'al'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      isLanguageMenuOpen, 
      setIsLanguageMenuOpen 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 