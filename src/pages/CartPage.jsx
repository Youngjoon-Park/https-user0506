import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      const parsed = JSON.parse(saved).map((item) => ({
        ...item,
        quantity: 1,
      }));
      setCartItems(parsed);
    }
  }, []);

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity < 1) updated[index].quantity = 1;
      return updated;
    });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    localStorage.removeItem('cartItems');
    navigate('/complete');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 장바구니</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cartItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between"
          >
            {/* 썸네일 이미지 */}
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold mb-1 text-center">
              {item.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {item.price.toLocaleString()}원
            </p>

            {/* 수량 조절 */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => updateQuantity(idx, -1)}
                className="w-7 h-7 bg-gray-300 rounded-full text-base font-bold"
              >
                -
              </button>
              <span className="text-lg">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(idx, 1)}
                className="w-7 h-7 bg-gray-300 rounded-full text-base font-bold"
              >
                +
              </button>
            </div>

            {/* 항목별 합계 */}
            <div className="text-center font-medium text-gray-700">
              {(item.price * item.quantity).toLocaleString()}원
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right text-2xl font-bold">
        총합: {total.toLocaleString()}원
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg rounded-2xl transition-all"
        >
          ✅ 주문하기
        </button>
      </div>
    </div>
  );
};

export default CartPage;
