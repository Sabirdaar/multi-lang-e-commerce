import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock product data for display (remove when you have real products)
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    category: 'electronics'
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring and GPS',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
    category: 'electronics'
  },
  {
    id: 3,
    name: 'Running Shoes',
    description: 'Comfortable running shoes for professional athletes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    category: 'fashion'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable features',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
    category: 'home'
  }
];

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products] = useState(mockProducts); // Using mock data for now
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = async (productId) => {
    // This will be connected to your cart service later
    alert(`Product ${productId} added to cart! (Backend integration pending)`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality will be implemented with backend
    alert(`Search for: ${searchQuery} (Backend integration pending)`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">🛍️ ShopEase</h1>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {['products', 'cart', 'orders', 'profile'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Search
                  </button>
                </div>
              </form>

              <span className="text-sm text-gray-700">
                {userProfile?.displayName || userProfile?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found.</p>
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === 'cart' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
                <p className="text-gray-600">Cart functionality will be available when backend services are connected.</p>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
                <p className="text-gray-600">Order history will be available when backend services are connected.</p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{userProfile?.email}</p>
                    {userProfile?.emailVerified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {userProfile?.displayName || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {userProfile?.createdAt 
                        ? new Date(userProfile.createdAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {userProfile?.uid}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}