// Mock data for development before microservices are ready
const mockUsers = [
  {
    id: 1,
    email: 'demo@shopease.com',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  }
];

const mockProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    category: 'electronics',
    stock: 25
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring and GPS',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
    category: 'electronics',
    stock: 15
  },
  {
    id: 3,
    name: 'Running Shoes',
    description: 'Comfortable running shoes for professional athletes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    category: 'fashion',
    stock: 30
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable features',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
    category: 'home',
    stock: 20
  },
  {
    id: 5,
    name: 'Backpack',
    description: 'Waterproof backpack with laptop compartment',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
    category: 'fashion',
    stock: 40
  },
  {
    id: 6,
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    category: 'home',
    stock: 35
  }
];

const mockCart = [];
const mockOrders = [];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials) => {
    await delay(1000);
    
    if (credentials.email && credentials.password) {
      const user = mockUsers.find(u => u.email === credentials.email) || mockUsers[0];
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: user
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(1000);
    
    if (userData.email && userData.password) {
      const newUser = {
        id: mockUsers.length + 1,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: newUser
        }
      };
    }
    
    throw new Error('Registration failed');
  },

  logout: async () => {
    await delay(500);
    return { data: { message: 'Logged out successfully' } };
  },

  getProfile: async () => {
    await delay(500);
    return { data: mockUsers[0] };
  },

  updateProfile: async (profileData) => {
    await delay(1000);
    Object.assign(mockUsers[0], profileData);
    return { data: mockUsers[0] };
  },
};

export const mockProductService = {
  getAllProducts: async (params = {}) => {
    await delay(800);
    let filteredProducts = [...mockProducts];
    
    // Simple filtering
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }
    
    return { data: filteredProducts };
  },

  getProductById: async (id) => {
    await delay(500);
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return { data: product };
  },

  getProductsByCategory: async (category) => {
    await delay(600);
    const products = mockProducts.filter(p => p.category === category);
    return { data: products };
  },

  searchProducts: async (query) => {
    await delay(700);
    const products = mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return { data: products };
  },

  getCategories: async () => {
    await delay(300);
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return { data: categories };
  },
};

export const mockCartService = {
  getCart: async () => {
    await delay(400);
    return { data: { items: mockCart, total: mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0) } };
  },

  addToCart: async (productId, quantity = 1) => {
    await delay(600);
    const product = mockProducts.find(p => p.id === parseInt(productId));
    if (!product) throw new Error('Product not found');
    
    const existingItem = mockCart.find(item => item.productId === parseInt(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      mockCart.push({
        id: mockCart.length + 1,
        productId: parseInt(productId),
        product: product,
        quantity: quantity,
        price: product.price
      });
    }
    
    return { data: { message: 'Item added to cart' } };
  },

  updateCartItem: async (itemId, quantity) => {
    await delay(500);
    const item = mockCart.find(item => item.id === parseInt(itemId));
    if (!item) throw new Error('Item not found in cart');
    
    if (quantity <= 0) {
      mockCart.splice(mockCart.indexOf(item), 1);
    } else {
      item.quantity = quantity;
    }
    
    return { data: { message: 'Cart updated' } };
  },

  removeFromCart: async (itemId) => {
    await delay(400);
    const index = mockCart.findIndex(item => item.id === parseInt(itemId));
    if (index === -1) throw new Error('Item not found in cart');
    
    mockCart.splice(index, 1);
    return { data: { message: 'Item removed from cart' } };
  },

  clearCart: async () => {
    await delay(300);
    mockCart.length = 0;
    return { data: { message: 'Cart cleared' } };
  },
};

export const mockOrderService = {
  placeOrder: async (orderData) => {
    await delay(1500);
    const newOrder = {
      id: mockOrders.length + 1,
      ...orderData,
      status: 'pending',
      orderDate: new Date().toISOString(),
      total: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    
    mockOrders.push(newOrder);
    mockCart.length = 0; // Clear cart after order
    
    return { data: newOrder };
  },

  getOrders: async () => {
    await delay(700);
    return { data: mockOrders };
  },

  getOrderById: async (id) => {
    await delay(500);
    const order = mockOrders.find(o => o.id === parseInt(id));
    if (!order) throw new Error('Order not found');
    return { data: order };
  },

  cancelOrder: async (id) => {
    await delay(600);
    const order = mockOrders.find(o => o.id === parseInt(id));
    if (!order) throw new Error('Order not found');
    
    order.status = 'cancelled';
    return { data: order };
  },
};