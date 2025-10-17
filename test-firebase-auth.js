// Test Firebase Authentication
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test-firebase', (req, res) => {
  res.json({
    success: true,
    message: 'Firebase test endpoint working',
    timestamp: new Date().toISOString(),
    config: {
      apiKey: process.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing'
    }
  });
});

// Firebase config endpoint
app.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: "AIzaSyBptxqQHZpstJwUqq1TD2-sbS_iUCm9spk",
    authDomain: "login-d3f1c.firebaseapp.com",
    projectId: "login-d3f1c",
    storageBucket: "login-d3f1c.firebasestorage.app",
    messagingSenderId: "132957716999",
    appId: "1:132957716999:web:ddaac6be1355184a7560a2"
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Firebase test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test-firebase`);
  console.log(`Config endpoint: http://localhost:${PORT}/firebase-config`);
});