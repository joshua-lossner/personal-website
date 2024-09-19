import React, { createContext, useState, useEffect } from 'react';
import { getCategories } from '../utils/categories';

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = getCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};