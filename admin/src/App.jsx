import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiHome, FiCheckCircle, FiXCircle, FiUsers, FiPackage, FiLogIn, FiLock, FiMail, FiAlertCircle, FiShield, FiGlobe } from 'react-icons/fi';
import { authAPI, hotelsAPI } from './api';

// Premium Login Component
const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(email, password);
            if (response.success && response.data.user.role === 'admin') {
                onLogin(response.data.user);
            } else {
                setError('Access denied. Admin credentials required.');
                authAPI.logout();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight
                        }}
                        animate={{
                            y: [null, Math.random() * -200],
                            opacity: [0.3, 0]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Glass Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30"
                        >
                            <FiShield className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-2"
                        >
                            Admin Portal
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center space-x-2 text-gray-300"
                        >
                            <FiGlobe className="w-4 h-4" />
                            <span className="text-sm">Traveligo Management System</span>
                        </motion.div>
                    </div>

                    {/* Error Alert */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center backdrop-blur-sm"
                            >
                                <FiAlertCircle className="mr-3 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 outline-none"
                                    placeholder="master@traveligo.in"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 outline-none"
                                    placeholder="Enter secure password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <>
                                    <FiLogIn className="mr-2" />
                                    <span>Access Admin Panel</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-gray-400 text-xs">
                            Secure access for authorized personnel only
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            © 2024 Traveligo. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-center"
                >
                    <div className="inline-flex items-center space-x-2 text-gray-500 text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <FiShield className="w-3 h-3" />
                        <span>256-bit SSL Encrypted</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
    const [hotels, setHotels] = useState([]);
    const [pendingHotels, setPendingHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [hotelsRes, pendingRes] = await Promise.all([
                hotelsAPI.getHotels(),
                hotelsAPI.getPendingHotels()
            ]);
            setHotels(hotelsRes.data || []);
            setPendingHotels(pendingRes.data || []);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (hotelId) => {
        try {
            await hotelsAPI.approveHotel(hotelId);
            loadData();
        } catch (err) {
            alert('Error approving hotel: ' + err.message);
        }
    };

    const handleReject = async (hotelId) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            try {
                await hotelsAPI.rejectHotel(hotelId, reason);
                loadData();
            } catch (err) {
                alert('Error rejecting hotel: ' + err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <FiShield className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Traveligo Admin</h1>
                            <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
                        </div>
                    </div>
                    <motion.button
                        onClick={onLogout}
                        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-300 text-sm">Pending Hotels</p>
                                <p className="text-4xl font-bold text-white mt-1">{pendingHotels.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-amber-500/30 rounded-xl flex items-center justify-center">
                                <FiPackage className="text-amber-400 w-7 h-7" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-300 text-sm">Approved Hotels</p>
                                <p className="text-4xl font-bold text-white mt-1">{hotels.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                                <FiCheckCircle className="text-emerald-400 w-7 h-7" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-300 text-sm">Total Hotels</p>
                                <p className="text-4xl font-bold text-white mt-1">{hotels.length + pendingHotels.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-purple-500/30 rounded-xl flex items-center justify-center">
                                <FiUsers className="text-purple-400 w-7 h-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-700">
                        <nav className="flex">
                            {['pending', 'approved'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab
                                            ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab === 'pending' ? `Pending (${pendingHotels.length})` : `Approved (${hotels.length})`}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {activeTab === 'pending' ? (
                                    <motion.div
                                        key="pending"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        {pendingHotels.length === 0 ? (
                                            <p className="text-center text-gray-500 py-8">No pending hotels</p>
                                        ) : (
                                            pendingHotels.map((hotel) => (
                                                <div key={hotel._id || hotel.id} className="bg-gray-700/50 border border-gray-600 rounded-xl p-5 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold text-white text-lg">{hotel.name}</h3>
                                                        <p className="text-gray-400 text-sm">{hotel?.address?.city || 'Location N/A'}</p>
                                                        <p className="text-purple-400 font-medium mt-1">₹{(hotel.pricePerNight || 0).toLocaleString()}/night</p>
                                                    </div>
                                                    <div className="flex space-x-3">
                                                        <motion.button
                                                            onClick={() => handleApprove(hotel._id || hotel.id)}
                                                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-5 py-2.5 rounded-lg flex items-center border border-emerald-500/30"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <FiCheckCircle className="mr-2" />
                                                            Approve
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleReject(hotel._id || hotel.id)}
                                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-2.5 rounded-lg flex items-center border border-red-500/30"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <FiXCircle className="mr-2" />
                                                            Reject
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="approved"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        {hotels.length === 0 ? (
                                            <p className="text-center text-gray-500 py-8">No approved hotels</p>
                                        ) : (
                                            hotels.map((hotel) => (
                                                <div key={hotel._id || hotel.id} className="bg-gray-700/50 border border-gray-600 rounded-xl p-5 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold text-white text-lg">{hotel.name}</h3>
                                                        <p className="text-gray-400 text-sm">{hotel?.address?.city || 'Location N/A'}</p>
                                                        <p className="text-purple-400 font-medium mt-1">₹{(hotel.pricePerNight || 0).toLocaleString()}/night</p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-500/30">Active</span>
                                                        <span className="text-amber-400 font-medium">★ {hotel.rating || 0}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Main App
function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authAPI.getStoredUser();
        if (storedUser && storedUser.role === 'admin') {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        authAPI.logout();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
