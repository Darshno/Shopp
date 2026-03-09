# Security Guide

## Deployment Security Checklist

### 1. Environment Variables (CRITICAL!)

When deploying to Render, set these environment variables:

```
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_123456789
MONGO_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=https://your-app.onrender.com
NODE_ENV=production
```

**IMPORTANT**: Never use the default JWT_SECRET in production!

### 2. Security Features Implemented

- **Helmet.js**: Protects against common web vulnerabilities
- **Rate Limiting**: 
  - 100 requests per 15 minutes for general API
  - 5 login attempts per 15 minutes
- **Input Validation**: All user inputs are validated
- **JWT Authentication**: Secure token-based auth with 7-day expiry
- **Password Requirements**: Minimum 6 characters
- **Email Validation**: Proper email format checking
- **Secure Error Messages**: No sensitive data in error responses

### 3. Install Security Packages

Run this before deploying:
```bash
npm install helmet express-rate-limit
```

### 4. MongoDB Security

- Use MongoDB Atlas with IP whitelist
- Create a dedicated database user with limited permissions
- Use strong passwords
- Enable MongoDB encryption at rest

### 5. What's Protected

- User passwords (though you should add bcrypt hashing!)
- JWT tokens with expiry
- API endpoints with authentication
- Rate-limited login attempts
- Validated user inputs
- Protected against XSS, clickjacking, and other attacks

### 6. Recommendations for Production

1. **Add Password Hashing**: Install bcrypt and hash passwords
2. **HTTPS Only**: Render provides this automatically
3. **Regular Updates**: Keep dependencies updated
4. **Monitor Logs**: Check Render logs for suspicious activity
5. **Backup Database**: Regular MongoDB backups
6. **Change Default Secrets**: Never use default JWT_SECRET

### 7. User Data Protection

- Passwords are not sent in API responses
- JWT tokens expire after 7 days
- User data is only accessible with valid authentication
- Orders are user-specific (can't access other users' orders)
