# E-Commerce Store

A full-stack e-commerce application with user authentication, product management, cart, wishlist, and order tracking.

## Features

- User authentication (login/signup)
- Product browsing with categories
- Shopping cart
- Wishlist
- Order placement and tracking
- Seller dashboard for product management

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open `index.html` in your browser or access via `http://localhost:5000`

## Environment Variables

Create a `.env` file with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Deployment on Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables in Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
6. Deploy!

## API Endpoints

- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/add-product` - Add product (protected)
- `GET /api/seller-products` - Get seller products (protected)
- `DELETE /api/delete-product/:id` - Delete product (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
