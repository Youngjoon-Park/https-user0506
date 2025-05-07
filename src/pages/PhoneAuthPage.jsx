// 📁 src/pages/PhoneAuthPage.jsx
import React, { useState } from 'react';
import api from '../api/axiosInstance';

const PhoneAuthPage = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  // 인증번호 요청
  const handleSendCode = async () => {
    try {
      await api.post('/api/auth/send-code', { phone });
      setStep(2);
      setMessage('인증번호가 전송되었습니다.');
    } catch (err) {
      console.error('❌ 전송 실패:', err);
      setMessage('인증번호 전송 실패');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const res = await api.post('/api/auth/verify-code', { phone, code });
      setMessage(res.data); // 인증 성공 메시지
    } catch (err) {
      console.error('❌ 전송 실패:', err);
      setMessage('❌ 인증 실패');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">📱 휴대폰 인증</h1>

      <input
        type="tel"
        placeholder="전화번호 입력 (예: 01012345678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border px-4 py-2 rounded mb-4 w-full max-w-sm"
      />

      {step === 1 && (
        <button
          onClick={handleSendCode}
          className="bg-blue-600 text-white px-6 py-2 rounded mb-4"
        >
          인증번호 받기
        </button>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border px-4 py-2 rounded mb-4 w-full max-w-sm"
          />
          <button
            onClick={handleVerifyCode}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            인증번호 확인
          </button>
        </>
      )}

      {message && <p className="mt-6 text-lg">{message}</p>}
    </div>
  );
};

export default PhoneAuthPage;
