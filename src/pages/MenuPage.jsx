import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      name: '아메리카노',
      price: 3000,
      image: '/uploads/menu/0state.png',
    },
    { id: 2, name: '카페라떼', price: 3500, image: '/uploads/menu/1props.png' },
    { id: 3, name: '카푸치노', price: 3500, image: '/uploads/menu/2state.png' },
    { id: 4, name: '바닐라라떼', price: 4000, image: '/uploads/menu/cat.bmp' },
    {
      id: 5,
      name: '헤이즐넛라떼',
      price: 4000,
      image: '/uploads/menu/dog.bmp',
    },
    {
      id: 6,
      name: '카라멜마끼아또',
      price: 4500,
      image: '/uploads/menu/duke.png',
    },
    { id: 7, name: '콜드브루', price: 3800, image: '/uploads/menu/lenna.bmp' },
    {
      id: 8,
      name: '디카페인 아메리카노',
      price: 3300,
      image: '/uploads/menu/Lenna.jpg',
    },
    {
      id: 9,
      name: '아이스초코',
      price: 3500,
      image: '/uploads/menu/어쩌다보니_최종.jpg',
    },
    {
      id: 10,
      name: '밀크티',
      price: 3700,
      image: '/uploads/menu/키오스크.png',
    },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const goToCart = () => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    navigate('/cart');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ☕ 메뉴를 선택하세요
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all"
            onClick={() => addToCart(item)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />
            <h2 className="text-xl font-semibold mb-1 text-center">
              {item.name}
            </h2>
            <p className="text-center text-gray-700">
              {item.price.toLocaleString()}원
            </p>
          </div>
        ))}
      </div>

      {/* ✅ 선택 개수 표시 */}
      {cart.length > 0 && (
        <>
          <div className="mt-6 text-center text-lg text-gray-700">
            현재 선택된 항목: <span className="font-bold">{cart.length}</span>{' '}
            개
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-3 flex flex-col items-center shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mb-2"
                />
                <p className="font-medium text-center">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={goToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all"
        >
          장바구니 보기
        </button>
      </div>
    </div> // ✅ return의 마지막 div 종료
  );
};

export default MenuPage;
