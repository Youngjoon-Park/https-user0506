// MainRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectTypePage from '../pages/SelectTypePage';
import MenuPage from '../pages/MenuPage';
import CartPage from '../pages/CartPage';
import CompletePage from '../pages/CompletePage';

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectTypePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/complete" element={<CompletePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
