import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'ShopEase API Gateway is running',
    timestamp: new Date().toISOString()
  });
});

// Service routes configuration
const services = {
  // Product Service (Python - Future)
  '/products': {
    target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
      '^/products': '/api/products'
    }
  },
  // Auth Service (Your current Firebase setup)
  '/auth': {
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '/api/auth'
    }
  },
  // Order Service (Java - Future)
  '/orders': {
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/orders': '/api/orders'
    }
  }
};

// Setup proxy middleware for each service
Object.entries(services).forEach(([route, config]) => {
  app.use(route, createProxyMiddleware(config));
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ShopEase API Gateway',
    version: '1.0.0',
    endpoints: Object.keys(services)
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Gateway Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🛍️ ShopEase API Gateway running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Available routes: ${Object.keys(services).join(', ')}`);
});