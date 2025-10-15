import axios from 'axios';
import {
  mockAuthService,
  mockProductService,
  mockCartService,
  mockOrderService
} from './mockApiService';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Check if we should use mock data (when API is not available)
const USE_MOCK_DATA = !import.meta.env.VITE_API_GATEWAY_URL || 
  import.meta.env.VITE_API_GATEWAY_URL.includes('localhost');

// Service factory that falls back to mock data
const createService = (realService, mockService) => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data service');
    return mockService;
  }
  
  // Return real service but with error handling
  return Object.keys(realService).reduce((service, method) => {
    service[method] = async (...args) => {
      try {
        return await realService[method](...args);
      } catch (error) {
        console.warn(`API call failed, using mock data for ${method}:`, error);
        return await mockService[method](...args);
      }
    };
    return service;
  }, {});
};

// Auth Services
export const authService = createService({
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
}, mockAuthService);

// Product Services
export const productService = createService({
  getAllProducts: (params = {}) => apiClient.get('/products', { params }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  getProductsByCategory: (category) => apiClient.get(`/products/category/${category}`),
  searchProducts: (query) => apiClient.get(`/products/search?q=${query}`),
  getCategories: () => apiClient.get('/products/categories'),
}, mockProductService);

// Cart Services
export const cartService = createService({
  getCart: () => apiClient.get('/cart'),
  addToCart: (productId, quantity = 1) => 
    apiClient.post('/cart/items', { productId, quantity }),
  updateCartItem: (itemId, quantity) => 
    apiClient.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => apiClient.delete(`/cart/items/${itemId}`),
  clearCart: () => apiClient.delete('/cart/clear'),
}, mockCartService);

// Order Services
export const orderService = createService({
  placeOrder: (orderData) => apiClient.post('/orders', orderData),
  getOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
}, mockOrderService);

export default apiClient;