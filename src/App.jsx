import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import SelectTypePage from './pages/SelectTypePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderProcessingPage from './pages/OrderProcessingPage';
import PhoneAuthPage from './pages/PhoneAuthPage'; // 상대 경로 맞게

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (menu) => {
    const exist = cartItems.find((item) => item.id === menu.id);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...menu, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, amount) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/select" element={<SelectTypePage />} />
        <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              clearCart={clearCart}
            />
          }
        />
        <Route path="/processing" element={<OrderProcessingPage />} />

        <Route path="/phone-auth" element={<PhoneAuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
