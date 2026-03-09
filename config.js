// API Configuration
// Change this to your deployed backend URL when deploying
const API_BASE_URL = window.location.port === '5500' || window.location.protocol === 'file:'
    ? 'http://localhost:5000'
    : window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : window.location.origin;

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
