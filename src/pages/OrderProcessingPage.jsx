import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderProcessingPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedItems);

    const timer = setTimeout(() => {
      navigate('/payment'); // 또는 결제 완료 페이지
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      {/* ✅ 상단 고정 내비게이션 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <button onClick={() => navigate('/select')}>🏠 홈</button>
        <button onClick={() => navigate(-1)}>⬅ 뒤로</button>
      </div>

      {/* ✅ 본문 영역 */}
      <div
        style={{
          paddingTop: '90px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '20px',
        }}
      >
        <h1
          style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}
        >
          🛠 주문 처리 중입니다...
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          아래 주문 내역을 확인해주세요
        </p>

        <ul style={{ marginBottom: '30px' }}>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity}개
            </li>
          ))}
        </ul>

        <div style={{ fontSize: '40px', animation: 'bounce 1.5s infinite' }}>
          ⏳
        </div>
      </div>
    </>
  );
};

export default OrderProcessingPage;
