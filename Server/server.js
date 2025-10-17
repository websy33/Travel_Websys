// server.js - Debugged version with Firebase
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const admin = require("firebase-admin");

// Load environment variables first
dotenv.config();

console.log("🚀 Starting Flight Booking Server...");
console.log("📋 Loading dependencies...");

const app = express();

// Firebase Admin SDK configuration
const serviceAccount = {
  type: "service_account",
  project_id: "login-d3f1c",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://login-d3f1c.firebaseio.com"
  });
  console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ Firebase Admin initialization error:", error);
}

// Firebase Web Client Config (for reference/frontend use)
const firebaseConfig = {
  apiKey: "AIzaSyBptxqQHZpstJwUqq1TD2-sbS_iUCm9spk",
  authDomain: "login-d3f1c.firebaseapp.com",
  projectId: "login-d3f1c",
  storageBucket: "login-d3f1c.firebasestorage.app",
  messagingSenderId: "132957716999",
  appId: "1:132957716999:web:ddaac6be1355184a7560a2"
};

// Basic CORS configuration
app.use(cors({
  origin: "*", // Allow all origins for now
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Firebase authentication middleware
const authenticateFirebase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log(`✅ Authenticated user: ${decodedToken.email || decodedToken.uid}`);
    next();
  } catch (error) {
    console.error("❌ Firebase authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  console.log("✅ Health check received");
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    firebase: {
      projectId: firebaseConfig.projectId,
      status: "Connected"
    }
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  console.log("✅ Test endpoint hit");
  res.json({ 
    success: true, 
    message: "Backend is working!",
    data: {
      server: "Express.js",
      status: "active",
      time: new Date().toISOString(),
      firebase: "Integrated"
    }
  });
});

// Firebase config endpoint (for frontend)
app.get("/api/firebase-config", (req, res) => {
  res.json({
    success: true,
    config: firebaseConfig
  });
});

// Protected user profile endpoint
app.get("/api/user/profile", authenticateFirebase, (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name || '',
      picture: req.user.picture || ''
    }
  });
});

// Airport data endpoint
app.get("/api/airports", (req, res) => {
  console.log("📡 Airport data requested");
  const airports = [
    { code: "SXR", name: "Srinagar International Airport", city: "Srinagar", country: "India" },
    { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", country: "India" },
    { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", country: "India" },
    { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India" }
  ];
  
  res.json({
    success: true,
    airports: airports,
    count: airports.length
  });
});

// Mock flight data
const mockFlights = [
  {
    id: "FL001",
    airline: "Air India",
    flightNumber: "AI101",
    departure: { airport: "SXR", time: "08:00", city: "Srinagar" },
    arrival: { airport: "DEL", time: "10:30", city: "Delhi" },
    duration: "2h 30m",
    price: 4500,
    date: "2024-01-15"
  }
];

// Flight search endpoint
app.get("/api/flights/search", (req, res) => {
  const { from, to, date } = req.query;
  console.log(`🔍 Flight search: ${from} → ${to} on ${date}`);
  
  res.json({
    success: true,
    flights: mockFlights,
    count: mockFlights.length,
    searchParams: { from, to, date }
  });
});

// Order endpoint (protected with Firebase auth)
app.post("/api/order", authenticateFirebase, (req, res) => {
  console.log("🛒 Order request received from user:", req.user.email);
  
  try {
    const { flightId, passengers, contactInfo } = req.body;
    
    // Validate required fields
    if (!flightId || !passengers || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    
    // Simulate processing
    setTimeout(() => {
      const bookingRef = `BK${Date.now()}`;
      
      res.json({
        success: true,
        message: "Booking confirmed!",
        bookingReference: bookingRef,
        orderDetails: {
          flightId,
          passengers: passengers.length,
          totalAmount: 12500,
          currency: "INR",
          user: req.user.email
        }
      });
    }, 1000);
    
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({
      success: false,
      message: "Order processing failed"
    });
  }
});

// User bookings endpoint (protected)
app.get("/api/user/bookings", authenticateFirebase, (req, res) => {
  // Return user's booking history
  res.json({
    success: true,
    bookings: [
      {
        id: "BK001",
        flight: "AI101",
        date: "2024-01-15",
        status: "confirmed",
        passengers: 2
      }
    ],
    user: req.user.email
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

console.log("📡 Attempting to start server on port:", PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Flight API Server started successfully!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`🔧 Endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Test: http://localhost:${PORT}/api/test`);
  console.log(`   - Airports: http://localhost:${PORT}/api/airports`);
  console.log(`   - Firebase Config: http://localhost:${PORT}/api/firebase-config`);
  console.log(`   - User Profile: http://localhost:${PORT}/api/user/profile (protected)`);
  console.log(`🔥 Firebase: Integrated and running`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is already in use. Try:`);
    console.log(`   - Using a different port: PORT=5001 node server.js`);
    console.log(`   - Killing the process using port ${PORT}`);
  }
});

console.log("⚡ Server initialization complete - waiting for connections...");