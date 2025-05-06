// CompletePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompletePage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-6">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ 주문이 완료되었습니다!
      </h1>
      <p className="text-lg">감사합니다. 곧 준비해드릴게요.</p>
      <button
        onClick={goHome}
        className="px-8 py-4 text-xl bg-blue-500 text-white rounded-2xl shadow"
      >
        처음으로
      </button>
    </div>
  );
};

export default CompletePage;
