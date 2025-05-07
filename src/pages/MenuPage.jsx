import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const MenuPage = ({ addToCart }) => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const orderType = localStorage.getItem('orderType');

  useEffect(() => {
    api
      .get('/api/user/menus')
      .then((res) => setMenus(res.data))
      .catch((err) => console.error('❌ 메뉴 불러오기 실패', err));
  }, []);

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <>
      {/* ✅ 상단 버튼 바 */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 z-50 flex justify-between items-center shadow-md border-b">
        <button
          className="text-xl font-bold bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-2xl transition"
          onClick={() => navigate('/select')}
        >
          🏠 홈
        </button>
        <button
          className="text-xl font-bold bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-2xl transition"
          onClick={() => navigate(-1)}
        >
          ⬅ 뒤로
        </button>
      </div>

      {/* ✅ 메뉴 콘텐츠 */}
      <div className="pt-28 px-6 pb-10">
        <h1 className="text-4xl font-bold mb-6 text-center">
          ☕ 메뉴를 선택하세요
        </h1>

        <p className="text-center text-xl text-gray-700 mb-8">
          주문 유형:{' '}
          <span className="font-extrabold text-black">
            {orderType === 'store' ? '매장 식사' : '포장 주문'}
          </span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menus.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all border border-gray-200"
              onClick={() => addToCart(item)}
            >
              <img
                src={`https://kiosktest.shop/uploads/${item.image}`}
                alt={item.name}
                className="w-full h-36 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-bold mb-1 text-center">
                {item.name}
              </h2>
              <p className="text-center text-gray-700 text-lg">
                {item.price.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={goToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 text-2xl font-semibold rounded-2xl transition-all shadow-lg"
          >
            🛒 장바구니 보기
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuPage;
