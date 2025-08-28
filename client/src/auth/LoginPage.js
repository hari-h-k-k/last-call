"use client"
import React from "react";

function LoginPage() {

    const [currentView, setCurrentView] = React.useState('login'); // 'login' or 'signup'
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleLogin = async(e) => {

    }

    const handleSignUp = async(e) => {

    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="flex max-w-6xl w-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Left side - Illustration */}
                <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 p-12 flex items-center justify-center">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-8 space-x-4">
                            <div className="relative">
                                <div className="text-6xl">👩</div>
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-sm font-bold px-2 py-1 rounded-full">100</div>
                                <div className="absolute -top-4 left-8 text-yellow-400 text-2xl">$</div>
                            </div>
                            <div className="relative">
                                <div className="text-6xl">👨</div>
                                <div className="absolute -top-2 -left-2 bg-cyan-400 text-gray-900 text-sm font-bold px-2 py-1 rounded-full">⬇</div>
                            </div>
                            <div className="relative">
                                <div className="text-6xl">👩‍🦱</div>
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-sm font-bold px-2 py-1 rounded-full">150</div>
                                <div className="absolute -top-4 right-8 text-yellow-400 text-2xl">$</div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-lg mb-4">Join thousands of bidders</div>
                        <div className="text-cyan-400 text-4xl mb-4">💼</div>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex-1 p-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Sign Up</h2>
                        <button
                            onClick={() => setCurrentView('login')}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg"
                        >
                            Login
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleSignUp}
                            className="w-full bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleLogin}
                            className="text-gray-400 hover:text-white"
                        >
                            Log in
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <button className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors">
                            <span className="text-red-500">G</span>
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage();