import React from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage({ cartItems, updateQuantity, removeItem, clearCart }) {
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어 있습니다.');
      return;
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/processing');
  };

  return (
    <>
      {/* ✅ 상단 내비게이션 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => navigate('/select')}
          style={{ fontSize: '18px', fontWeight: 'bold' }}
        >
          🏠 홈
        </button>
        <button
          onClick={() => navigate('/menu')}
          style={{ fontSize: '18px', fontWeight: 'bold' }}
        >
          ⬅ 뒤로
        </button>
      </div>

      {/* ✅ 본문 */}
      <div style={{ padding: '90px 20px 40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>🛒 장바구니</h2>

        {cartItems.length === 0 ? (
          <p>장바구니가 비어 있습니다.</p>
        ) : (
          <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    marginBottom: '15px',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '10px',
                  }}
                >
                  <strong>{item.name}</strong> <br />
                  {item.price.toLocaleString()}원 × {item.quantity}개 ={' '}
                  <strong>
                    {(item.price * item.quantity).toLocaleString()}원
                  </strong>
                  <div style={{ marginTop: '5px' }}>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      ➕
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      ➖
                    </button>
                    <button onClick={() => removeItem(item.id)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: '20px', fontSize: '20px' }}>
              💰 총 합계:{' '}
              <span style={{ color: 'green', fontWeight: 'bold' }}>
                {totalPrice.toLocaleString()}원
              </span>
            </h3>

            {/* ✅ 이쁘게 만든 버튼 */}
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={clearCart}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                🧹 장바구니 비우기
              </button>

              <button
                onClick={handleOrder}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✅ 주문하기
              </button>
            </div>

            {/* ✅ 주문 내역 표시 */}
            <div style={{ marginTop: '30px' }}>
              <h4 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                🧾 주문 내역:
              </h4>
              <ul style={{ marginTop: '10px' }}>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity}개 /{' '}
                    {(item.price * item.quantity).toLocaleString()}원
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
