// API Configuration
// Force production URL if on Render, otherwise use current origin
const API_BASE_URL = window.location.hostname.includes('render.com')
    ? 'https://shopp-3d74.onrender.com'
    : window.location.origin;

console.log('API Base URL:', API_BASE_URL); // Debug log

const API_ENDPOINTS = {
    products: `${API_BASE_URL}/api/products`,
    login: `${API_BASE_URL}/api/login`,
    signup: `${API_BASE_URL}/api/signup`,
    orders: `${API_BASE_URL}/api/orders`,
    allOrders: `${API_BASE_URL}/api/all-orders`,
    addProduct: `${API_BASE_URL}/api/add-product`,
    sellerProducts: `${API_BASE_URL}/api/seller-products`,
    deleteProduct: (id) => `${API_BASE_URL}/api/delete-product/${id}`
};


