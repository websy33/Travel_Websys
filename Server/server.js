// server.js - Debugged version
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables first
dotenv.config();

console.log("🚀 Starting Flight Booking Server...");
console.log("📋 Loading dependencies...");

const app = express();

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

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  console.log("✅ Health check received");
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
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
      time: new Date().toISOString()
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

// Order endpoint
app.post("/api/order", (req, res) => {
  console.log("🛒 Order request received");
  
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
          currency: "INR"
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
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is already in use. Try:`);
    console.log(`   - Using a different port: PORT=5001 node server.js`);
    console.log(`   - Killing the process using port ${PORT}`);
  }
});

console.log("⚡ Server initialization complete - waiting for connections...");