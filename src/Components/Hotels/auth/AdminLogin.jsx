import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiUser, FiLock, FiLogIn, FiAlertCircle, 
  FiMail, FiShield, FiEye, FiEyeOff 
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../../../firebase';
import EnhancedInput from '../../common/EnhancedInput';
import LoadingSpinner from '../../common/LoadingSpinner';
import { modalVariants } from '../../../utils/hotelAnimations';
import { validationRules } from '../../../utils/hotelValidation';

/**
 * Admin and Hotel Login Component
 * Handles both admin and hotel owner authentication
 */
const AdminLogin = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  defaultRole = 'hotel',
  hotelUsers = [],
  adminUser = null
}) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: defaultRole
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input change
  };

  // Firebase Email/Password Login
  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!loginForm.email || !loginForm.password) {
        throw new Error('Please fill in all fields');
      }

      // Check for admin login
      if (loginForm.role === 'admin') {
        if (adminUser && loginForm.email === adminUser.email && loginForm.password === adminUser.password) {
          // Admin login success
          onLoginSuccess({
            ...adminUser,
            role: 'admin'
          });
          onClose();
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      }

      // Firebase authentication for hotel users
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        loginForm.email, 
        loginForm.password
      );
      const user = userCredential.user;

      // Check email verification
      if (!user.emailVerified) {
        throw new Error('Please verify your email address before logging in');
      }

      // Find hotel user data
      const hotelUser = hotelUsers.find(u => u.email === loginForm.email);
      
      const userData = {
        uid: user.uid,
        id: hotelUser?.id || user.uid,
        email: user.email,
        name: hotelUser?.ownerName || user.displayName || user.email.split('@')[0],
        role: loginForm.role,
        hotelName: hotelUser?.hotelName || 'Hotel Owner',
        emailVerified: user.emailVerified,
        ...hotelUser
      };

      onLoginSuccess(userData);
      onClose();
      
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ 
        prompt: 'select_account'
      });
      
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Find existing hotel user or create new data
      const hotelUser = hotelUsers.find(u => u.email === user.email);
      
      const userData = {
        uid: user.uid,
        id: hotelUser?.id || user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: 'hotel',
        hotelName: hotelUser?.hotelName || `${user.displayName || 'User'}'s Hotel`,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        ...hotelUser
      };

      onLoginSuccess(userData);
      onClose();
      
    } catch (err) {
      console.error('Google sign-in error:', err);
      
      // Handle specific errors
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return; // User cancelled, no error message needed
      }
      
      let errorMessage = 'Google sign-in failed';
      
      switch (err.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized for Google sign-in';
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-100 p-2 rounded-lg">
                  <FiShield className="text-rose-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {loginForm.role === 'admin' ? 'Admin Login' : 'Hotel Partner Login'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {loginForm.role === 'admin' 
                      ? 'Manage hotel approvals and listings' 
                      : 'Manage your hotel properties'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFirebaseLogin} className="p-6 space-y-6">
            {/* Role Selection */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginForm(prev => ({ ...prev, role: 'hotel' }))}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  loginForm.role === 'hotel'
                    ? 'bg-white text-rose-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Hotel Owner
              </button>
              <button
                type="button"
                onClick={() => setLoginForm(prev => ({ ...prev, role: 'admin' }))}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  loginForm.role === 'admin'
                    ? 'bg-white text-rose-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2 text-red-700">
                  <FiAlertCircle size={18} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Email Input */}
            <EnhancedInput
              label="Email Address"
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              icon={FiMail}
              required
              validationRule={validationRules.email}
              disabled={loading}
            />

            {/* Password Input */}
            <EnhancedInput
              label="Password"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              icon={FiLock}
              required
              disabled={loading}
            />

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={20} />
                  <span>Login</span>
                </>
              )}
            </motion.button>

            {/* Divider - Only show for hotel login */}
            {loginForm.role === 'hotel' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <motion.button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <FcGoogle size={24} />
                  <span>Sign in with Google</span>
                </motion.button>
              </>
            )}

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600">
              {loginForm.role === 'hotel' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      // Trigger registration modal
                    }}
                    className="text-rose-600 font-semibold hover:text-rose-700"
                  >
                    Register Now
                  </button>
                </>
              ) : (
                <span className="text-gray-500">Contact support for admin access</span>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminLogin;
