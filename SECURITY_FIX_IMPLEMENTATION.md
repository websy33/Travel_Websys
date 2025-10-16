# 🛠️ SECURITY FIX IMPLEMENTATION GUIDE
## Step-by-Step Instructions for Developers

**Purpose:** Practical, copy-paste ready code to fix security vulnerabilities

---

## 🚨 PHASE 1: EMERGENCY FIXES (Do This NOW)

### Step 1: Rotate Exposed API Keys

#### **1.1 Razorpay Keys (CRITICAL - Financial Risk)**

1. **Login to Razorpay Dashboard:** https://dashboard.razorpay.com/
2. Navigate to: Settings → API Keys
3. **Regenerate Key Pair:**
   - Click "Regenerate Live Key"
   - Save new Key ID and Secret securely
4. **Update .env file:**
```env
RAZORPAY_KEY_ID=rzp_live_YOUR_NEW_KEY_ID
RAZORPAY_SECRET=your_new_secret_key
```

5. **Enable Security Features:**
   - Settings → Webhooks → Enable signature verification
   - Settings → Security → Enable IP whitelisting (add your server IP)
   - Settings → Security → Enable 2FA

#### **1.2 EmailJS Credentials**

1. **Login to EmailJS:** https://dashboard.emailjs.com/
2. Navigate to: Account → API Keys
3. **Create New Public Key:**
   - Delete old key: `37pN2ThzFwwhwk7ai`
   - Generate new public key
   - Update service and template IDs if needed
4. **Update .env file:**
```env
VITE_EMAILJS_PUBLIC_KEY=your_new_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

#### **1.3 JWT Secret**

Generate new JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update .env:
```env
JWT_SECRET=your_new_64_character_hex_string_here
```

#### **1.4 AIRIQ Credentials**

Contact AIRIQ support to rotate:
```env
AIRIQ_API_KEY=your_new_api_key
AIRIQ_LOGIN_ID=your_new_login_id
AIRIQ_PASSWORD=your_new_secure_password
```

---

### Step 2: Secure Environment Files

#### **2.1 Create .env.example (Template)**

**Create file:** `.env.example`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://username:password@localhost:27017/database_name

# JWT Configuration
JWT_SECRET=generate_using_crypto_randomBytes_64_hex
JWT_EXPIRES_IN=7d

# EmailJS Configuration (Get from https://dashboard.emailjs.com/)
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id

# Razorpay Configuration (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key

# AIRIQ API Configuration
AIRIQ_API_BASE_URL=https://api.example.com
AIRIQ_API_KEY=your_airiq_api_key
AIRIQ_LOGIN_ID=your_airiq_login_id
AIRIQ_PASSWORD=your_airiq_password

# Appwrite Configuration (if using)
VITE_APIWRITE_PROJECT_ID=your_project_id
VITE_APIWRITE_BUCKET_ID=your_bucket_id
VITE_APIWRITE_DATABASE_ID=your_database_id
VITE_APIWRITE_URL=https://cloud.appwrite.io/v1
VITE_APIWRITE_COLLECTION_ID=your_collection_id

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5000
```

#### **2.2 Update .gitignore**

Verify these lines exist in `.gitignore`:
```
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.sample
```

#### **2.3 Remove Sensitive .env.sample**

```bash
# Delete the file with real secrets
git rm --cached .env.sample
rm .env.sample

# Create your real .env file (not tracked by git)
cp .env.example .env
# Then edit .env with real values

# Commit the changes
git add .env.example .gitignore
git commit -m "Security: Remove exposed secrets, add .env.example template"
```

---

### Step 3: Remove Hardcoded Credentials from Frontend

#### **3.1 Delete LoginModal.jsx**

```bash
git rm src/Components/LoginModal.jsx
```

**Why?** This file contains hardcoded credentials and client-side authentication logic that must be removed.

#### **3.2 Update Hotels.jsx - Remove Hardcoded Data**

**Find and DELETE these sections in `src/Pages/Hotels.jsx`:**

**Lines 1396-1414 (Demo hotel user):**
```javascript
// DELETE THIS ENTIRE SECTION
const [hotelUsers, setHotelUsers] = useState(() => {
  const saved = localStorage.getItem('kashmirStays_hotelUsers');
  if (saved) return JSON.parse(saved);
  return [
    {
      id: 1,
      hotelName: 'Hotel Dal View',
      ownerName: 'Rajesh Kumar',
      email: 'hoteldalview@example.com', 
      password: 'hotel123',  // REMOVE THIS
      // ... rest of object
    }
  ];
});
```

**Lines 1418-1424 (Admin user):**
```javascript
// DELETE THIS ENTIRE SECTION
const [adminUser] = useState({
  id: 999,
  name: 'Admin User',
  email: 'admin@traveligo.com', 
  password: 'admin123',  // REMOVE THIS
  role: 'admin'
});
```

**Lines 2010-2053 (Client-side login logic):**
```javascript
// DELETE THIS ENTIRE handleLogin FUNCTION
const handleLogin = () => {
  if (loginForm.email === adminUser.email && 
      loginForm.password === adminUser.password) {
    // ... client-side auth logic
  }
  // ... more client-side checks
};
```

**Replace with backend API call:**
```javascript
const handleLogin = async () => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        email: loginForm.email,
        password: loginForm.password,
        role: loginForm.role
      })
    });

    const data = await response.json();
    
    if (data.success) {
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setUserRole(data.user.role);
      setShowLoginModal(false);
      toast.success('Login successful!');
    } else {
      toast.error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Login failed. Please try again.');
  }
};
```

---

## 🔐 PHASE 2: IMPLEMENT BACKEND AUTHENTICATION

### Step 1: Create Database Models

**Create file:** `Server/models/User.js`
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'hotel', 'admin'],
    default: 'user'
  },
  phone: String,
  hotelName: String, // For hotel users
  address: String,
  city: String,
  pincode: String,
  gstNumber: String,
  panNumber: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Don't return password hash in queries
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
```

**Create file:** `Server/models/Hotel.js`
```javascript
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  amenities: [String],
  images: [String],
  pricing: {
    startingPrice: Number,
    currency: { type: String, default: 'INR' }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
```

---

### Step 2: Create Authentication Middleware

**Create file:** `Server/middleware/auth.js`
```javascript
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticateToken = (req, res, next) => {
  // Get token from cookie or Authorization header
  const token = req.cookies.authToken || 
                req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.' 
      });
    }
    return res.status(403).json({ 
      success: false,
      error: 'Invalid token' 
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {string[]} roles - Array of allowed roles
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work differently for authenticated users
 */
const optionalAuth = (req, res, next) => {
  const token = req.cookies.authToken || 
                req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Invalid token, but we don't fail the request
      req.user = null;
    }
  }
  
  next();
};

module.exports = { 
  authenticateToken, 
  requireRole, 
  optionalAuth 
};
```

---

### Step 3: Create Authentication Routes

**Create file:** `Server/routes/auth.js`
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register',
  // Validation
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['user', 'hotel']),
  
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { email, password, name, role, phone, hotelName } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          error: 'Email already registered' 
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        email,
        passwordHash,
        name,
        role: role || 'user',
        phone,
        hotelName
      });

      await user.save();

      res.status(201).json({ 
        success: true,
        message: 'Registration successful. Please login.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Registration failed. Please try again.' 
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login',
  // Validation
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { email, password, role } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password' 
        });
      }

      // Check role if specified
      if (role && user.role !== role) {
        return res.status(401).json({ 
          success: false,
          error: `Please login with ${user.role} credentials` 
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password' 
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          role: user.role,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Set HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token // Also send token in response for clients that prefer it
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Login failed. Please try again.' 
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user by clearing cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        hotelName: user.hotelName
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get user info' 
    });
  }
});

/**
 * PUT /api/auth/change-password
 * Change user password (requires authentication)
 */
router.put('/change-password',
  authenticateToken,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ 
          success: false,
          error: 'Current password is incorrect' 
        });
      }

      // Hash and save new password
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ 
        success: true,
        message: 'Password changed successfully' 
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to change password' 
      });
    }
  }
);

module.exports = router;
```

---

### Step 4: Update Server Configuration

**Update file:** `Server/server.js`

```javascript
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

console.log('🚀 Starting Travel Booking Server...');

const app = express();

// ===== SECURITY MIDDLEWARE =====

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", // Required for some third-party widgets
        "https://checkout.razorpay.com",
        "https://cdn.shapo.io",
        "https://static.elfsight.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'", 
        "https://api.razorpay.com",
        process.env.VITE_API_BASE_URL
      ],
      frameSrc: ["https://api.razorpay.com"]
    }
  },
  crossOriginEmbedderPolicy: false // Required for some third-party embeds
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { 
    success: false,
    error: 'Too many requests, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: { 
    success: false,
    error: 'Too many login attempts, please try again later.' 
  }
});

app.use('/api/', apiLimiter);

// ===== BASIC MIDDLEWARE =====

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request timing
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} [${duration}ms]`);
  });
  next();
});

// ===== DATABASE CONNECTION =====

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ===== ROUTES =====

// Import routes
const authRoutes = require('./routes/auth');
const { authenticateToken, requireRole } = require('./middleware/auth');

// Public routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Auth routes (with rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Protected routes example
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { flightId, passengers, contactInfo } = req.body;
    
    // User is authenticated via req.user
    // Validate and create order...
    
    res.json({
      success: true,
      message: 'Order created successfully',
      orderId: `ORD-${Date.now()}`
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Admin-only routes example
app.get('/api/admin/users', 
  authenticateToken, 
  requireRole(['admin']), 
  async (req, res) => {
    // Only admins can access this
    res.json({ success: true, users: [] });
  }
);

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    error: message
  });
});

// ===== START SERVER =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Server started successfully!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Endpoints available at: http://localhost:${PORT}/api/`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is already in use.`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    mongoose.connection.close();
    console.log('Server closed');
    process.exit(0);
  });
});
```

---

## 🔧 PHASE 3: CENTRALIZE FRONTEND SERVICES

### Step 1: Create Configuration Files

**Create file:** `src/config/api.js`
```javascript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      me: '/api/auth/me'
    },
    flights: '/api/flights',
    hotels: '/api/hotels',
    orders: '/api/orders'
  },
  timeout: 30000 // 30 seconds
};

export const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID
};

export const EMAILJS_CONFIG = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
};
```

---

### Step 2: Create Service Files

**Create file:** `src/services/emailService.js`
```javascript
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/api';

class EmailService {
  constructor() {
    // Initialize EmailJS once
    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    }
  }

  /**
   * Send booking confirmation email
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Email send result
   */
  async sendBookingConfirmation(bookingData) {
    try {
      if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId) {
        throw new Error('EmailJS not configured. Please set environment variables.');
      }

      const templateParams = {
        to_name: bookingData.customerName,
        to_email: bookingData.email,
        package_name: bookingData.packageName,
        booking_date: bookingData.bookingDate,
        total_amount: bookingData.amount,
        payment_id: bookingData.paymentId || 'Pending',
        booking_reference: bookingData.bookingRef
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return { success: true, result };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send contact form email
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Email send result
   */
  async sendContactForm(contactData) {
    try {
      const templateParams = {
        from_name: contactData.name,
        from_email: contactData.email,
        message: contactData.message,
        phone: contactData.phone || 'Not provided'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        'contact_template_id', // You may need a different template
        templateParams
      );

      return { success: true, result };
    } catch (error) {
      console.error('Contact email error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
```

**Create file:** `src/services/paymentService.js`
```javascript
import { RAZORPAY_CONFIG, API_CONFIG } from '../config/api';

class PaymentService {
  constructor() {
    this.razorpayKey = RAZORPAY_CONFIG.keyId;
    this.razorpayLoaded = false;
    this.loadRazorpayScript();
  }

  /**
   * Load Razorpay script
   */
  async loadRazorpayScript() {
    if (this.razorpayLoaded) return true;

    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.razorpayLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay SDK'));
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Initialize payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async initiatePayment(paymentData) {
    try {
      // Ensure script is loaded
      await this.loadRazorpayScript();

      if (!this.razorpayKey) {
        throw new Error('Razorpay not configured');
      }

      // Create order on backend first (IMPORTANT for security)
      const orderResponse = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include auth cookie
        body: JSON.stringify(paymentData)
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Open Razorpay checkout
      return new Promise((resolve, reject) => {
        const options = {
          key: this.razorpayKey,
          amount: orderData.amount, // Amount from server (secure)
          currency: orderData.currency,
          order_id: orderData.orderId, // Server-generated order ID
          name: 'Traveligo',
          description: paymentData.description || 'Travel Booking',
          handler: (response) => {
            // Payment successful
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          },
          prefill: {
            name: paymentData.customerName,
            email: paymentData.email,
            contact: paymentData.phone
          },
          theme: {
            color: '#3B82F6' // Your brand color
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
    } catch (error) {
      console.error('Payment error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PaymentService();
```

**Create file:** `src/services/authService.js`
```javascript
import { API_CONFIG } from '../config/api';

class AuthService {
  /**
   * Login user
   * @param {Object} credentials - Email, password, role
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.register}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout current user
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.logout}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user info
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.me}`, {
        credentials: 'include'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();
```

---

### Step 3: Refactor Components to Use Services

**Example: Update a destination page to use centralized services**

**Before (in src/Footer/Bali.jsx):**
```javascript
// OLD - Hardcoded credentials
emailjs.init('37pN2ThzFwwhwk7ai');
const result = await emailjs.send(
  'service_ov629rm',
  'template_jr1dnto',
  templateParams
);

// OLD - Hardcoded Razorpay key
const options = {
  key: "rzp_live_R8Ga0PdPPfJptw",
  // ...
};
```

**After:**
```javascript
import emailService from '../services/emailService';
import paymentService from '../services/paymentService';

// Send email
const emailResult = await emailService.sendBookingConfirmation({
  customerName: bookingData.name,
  email: bookingData.email,
  packageName: 'Bali Package',
  bookingDate: bookingData.date,
  amount: bookingData.amount,
  bookingRef: bookingData.reference
});

// Process payment
const paymentResult = await paymentService.initiatePayment({
  amount: bookingData.amount,
  description: 'Bali Package Booking',
  customerName: bookingData.name,
  email: bookingData.email,
  phone: bookingData.phone
});

if (paymentResult.success) {
  // Payment successful
  console.log('Payment ID:', paymentResult.paymentId);
}
```

**Repeat this refactoring for all 41 files** that currently have hardcoded credentials.

---

## 📋 TESTING YOUR SECURITY FIXES

### Test Authentication

```bash
# 1. Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "securePassword123",
    "role": "user"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "securePassword123"
  }'

# 3. Access protected endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt

# 4. Try accessing admin endpoint (should fail)
curl -X GET http://localhost:5000/api/admin/users \
  -b cookies.txt
```

### Verify Environment Variables

```bash
# Check that .env exists and has correct values
cat .env | grep -v "^#" | grep -v "^$"

# Verify .env.sample is removed or sanitized
test -f .env.sample && echo "WARNING: .env.sample still exists!" || echo "OK"

# Check that .env is in .gitignore
git check-ignore .env && echo "OK: .env is ignored" || echo "WARNING: .env not ignored!"
```

---

## ✅ SECURITY CHECKLIST

After completing all fixes, verify:

- [ ] All hardcoded API keys removed from code
- [ ] .env.sample deleted or replaced with .env.example
- [ ] All secrets in environment variables
- [ ] JWT authentication working
- [ ] Protected routes require valid tokens
- [ ] Passwords hashed with bcrypt
- [ ] HttpOnly cookies used for auth
- [ ] CORS restricted to specific origins
- [ ] Helmet.js enabled
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] Payment amounts verified server-side
- [ ] All 41 files refactored to use centralized services
- [ ] MongoDB authentication enabled
- [ ] All exposed keys rotated

---

## 🆘 TROUBLESHOOTING

### Common Issues:

**1. "Cannot connect to MongoDB"**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Or start MongoDB
sudo systemctl start mongod
```

**2. "CORS Error"**
```javascript
// Verify ALLOWED_ORIGINS in .env includes your frontend URL
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

**3. "Token expired"**
```bash
# Clear cookies and login again
# Or adjust JWT_EXPIRES_IN in .env
JWT_EXPIRES_IN=7d
```

**4. "Razorpay not loading"**
```javascript
// Check browser console for CSP errors
// Verify Razorpay domains are in Helmet CSP configuration
```

---

**Document Version:** 1.0  
**Last Updated:** October 16, 2025  
**Status:** Implementation Guide

