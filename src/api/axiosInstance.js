// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kiosktest.shop', // 백엔드 서버 주소
  withCredentials: true, // 필요 시 쿠키 인증 포함
});

export default api;
