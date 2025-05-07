// 📁 src/pages/MainPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6">
      <h1 className="text-4xl font-bold mb-10">
        🍽️ 키오스크에 오신 걸 환영합니다!
      </h1>
      <button
        onClick={() => navigate('/select')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 text-2xl font-semibold rounded-2xl transition-all"
      >
        ▶️ 주문 시작
      </button>
    </div>
  );
};

export default MainPage;
