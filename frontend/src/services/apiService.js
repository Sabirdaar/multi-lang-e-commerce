const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL, // Now points to API Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Your API calls will now go through the gateway:
// GET /products → API Gateway → Python Product Service
// POST /auth/login → API Gateway → Auth Service