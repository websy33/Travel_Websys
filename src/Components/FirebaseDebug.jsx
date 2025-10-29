import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db, isFirebaseInitialized, debugFirebase } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const FirebaseDebug = () => {
  const [status, setStatus] = useState({
    initialized: false,
    auth: false,
    provider: false,
    db: false,
    envVars: {},
    error: null
  });
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = () => {
    const envVars = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Present' : '❌ Missing',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Missing',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Missing',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'Missing',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'Missing',
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Present' : '❌ Missing'
    };

    setStatus({
      initialized: isFirebaseInitialized(),
      auth: !!auth,
      provider: !!googleProvider,
      db: !!db,
      envVars,
      error: null
    });

    // Log to console
    console.log('🔥 Firebase Debug Status:', {
      initialized: isFirebaseInitialized(),
      auth: !!auth,
      provider: !!googleProvider,
      db: !!db,
      envVars
    });

    debugFirebase();
  };

  const testGoogleAuth = async () => {
    setLoading(true);
    setTestResult('Testing Google authentication...');
    
    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase not initialized properly');
      }

      const result = await signInWithPopup(auth, googleProvider);
      setTestResult(`✅ Success! Logged in as: ${result.user.email}`);
      console.log('Google Auth Result:', result);
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
      console.error('Google Auth Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setTestResult('✅ Signed out successfully');
    } catch (error) {
      setTestResult(`❌ Sign out error: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-6 max-w-md z-50 border-2 border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">🔥 Firebase Debug</h3>
        <button 
          onClick={checkStatus}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="font-semibold">Initialized:</span>
          <span className={status.initialized ? 'text-green-600' : 'text-red-600'}>
            {status.initialized ? '✅ Yes' : '❌ No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Auth:</span>
          <span className={status.auth ? 'text-green-600' : 'text-red-600'}>
            {status.auth ? '✅ Ready' : '❌ Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Provider:</span>
          <span className={status.provider ? 'text-green-600' : 'text-red-600'}>
            {status.provider ? '✅ Ready' : '❌ Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Database:</span>
          <span className={status.db ? 'text-green-600' : 'text-red-600'}>
            {status.db ? '✅ Ready' : '❌ Failed'}
          </span>
        </div>
      </div>

      <div className="border-t pt-3 mb-3">
        <p className="font-semibold text-xs text-gray-600 mb-2">Environment Variables:</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>API Key:</span>
            <span>{status.envVars.apiKey}</span>
          </div>
          <div className="flex justify-between">
            <span>Auth Domain:</span>
            <span className="text-blue-600">{status.envVars.authDomain}</span>
          </div>
          <div className="flex justify-between">
            <span>Project ID:</span>
            <span className="text-blue-600">{status.envVars.projectId}</span>
          </div>
          <div className="flex justify-between">
            <span>App ID:</span>
            <span>{status.envVars.appId}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={testGoogleAuth}
          disabled={loading || !status.initialized}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Google Auth'}
        </button>
        
        {auth?.currentUser && (
          <button
            onClick={signOut}
            className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all"
          >
            Sign Out
          </button>
        )}
      </div>

      {testResult && (
        <div className={`mt-3 p-2 rounded text-xs ${
          testResult.includes('✅') ? 'bg-green-50 text-green-800' : 
          testResult.includes('❌') ? 'bg-red-50 text-red-800' : 
          'bg-blue-50 text-blue-800'
        }`}>
          {testResult}
        </div>
      )}

      {auth?.currentUser && (
        <div className="mt-3 p-2 bg-green-50 rounded text-xs">
          <p className="font-semibold text-green-800">Logged in as:</p>
          <p className="text-green-600">{auth.currentUser.email}</p>
        </div>
      )}
    </div>
  );
};

export default FirebaseDebug;
