'use client'
import React, { useState, useEffect } from 'react';
import { User, Clock, DollarSign, Camera, Music, Watch, Plus, Eye, Star, Grid3X3, List, Filter, Search } from 'lucide-react';

const BiddingPlatform = () => {
    const [currentView, setCurrentView] = useState('auctions');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCreateAuction, setShowCreateAuction] = useState(false);
    const [userBids, setUserBids] = useState({
        ongoingBids: 12,
        auctionsWon: 8,
        totalSpent: 2450
    });

    // Sample auction data
    const [auctions, setAuctions] = useState([
        {
            id: 1,
            title: 'Vintage Camera',
            description: 'Professional vintage camera in excellent condition',
            currentBid: 200,
            timeRemaining: '01:24:36',
            image: '📷',
            category: 'Electronics',
            isWatched: true
        },
        {
            id: 2,
            title: 'Electric Guitar',
            description: 'Beautiful red electric guitar with amplifier',
            currentBid: 350,
            timeRemaining: '03:12:19',
            image: '🎸',
            category: 'Music',
            isWatched: false
        },
        {
            id: 3,
            title: 'Smartwatch',
            description: 'Latest model smartwatch with health tracking',
            currentBid: 150,
            timeRemaining: '02:10:11',
            image: '⌚',
            category: 'Electronics',
            isWatched: true
        }
    ]);

    const [activeAuctions] = useState([
        { id: 1, name: 'Vintage Camera', timeLeft: '46:23s' },
        { id: 2, name: 'Electric Guitar', timeLeft: '1:12:45' },
        { id: 3, name: 'Smartwatch', timeLeft: '2:20:15' }
    ]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [createAuctionForm, setCreateAuctionForm] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startingPrice: '',
        reservePrice: ''
    });

    // Update countdown timers
    useEffect(() => {
        const interval = setInterval(() => {
            setAuctions(prev => prev.map(auction => ({
                ...auction,
                timeRemaining: updateTimer(auction.timeRemaining)
            })));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateTimer = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        totalSeconds = Math.max(0, totalSeconds - 1);

        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;

        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
        setCurrentView('dashboard');
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
        setCurrentView('dashboard');
    };

    const handleCreateAuction = (e) => {
        e.preventDefault();
        setShowCreateAuction(false);
        setCurrentView('dashboard');
        // Reset form
        setCreateAuctionForm({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            startingPrice: '',
            reservePrice: ''
        });
    };

    const placeBid = (auctionId, amount) => {
        setAuctions(prev => prev.map(auction =>
            auction.id === auctionId
                ? { ...auction, currentBid: auction.currentBid + 10 }
                : auction
        ));
    };

    const toggleWatchlist = (auctionId) => {
        setAuctions(prev => prev.map(auction =>
            auction.id === auctionId
                ? { ...auction, isWatched: !auction.isWatched }
                : auction
        ));
    };

    // Login/Signup View
    if (!isLoggedIn) {

    }

    // Create Auction Modal
    if (showCreateAuction) {
        return (
            <div className="min-h-screen bg-gray-900 p-4">
                <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-white mb-8">Create Auction</h2>


                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">Title</label>
                            <input
                                type="text"
                                value={createAuctionForm.title}
                                onChange={(e) => setCreateAuctionForm({...createAuctionForm, title: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                            <textarea
                                value={createAuctionForm.description}
                                onChange={(e) => setCreateAuctionForm({...createAuctionForm, description: e.target.value})}
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={createAuctionForm.startDate}
                                    onChange={(e) => setCreateAuctionForm({...createAuctionForm, startDate: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">End Date</label>
                                <input
                                    type="datetime-local"
                                    value={createAuctionForm.endDate}
                                    onChange={(e) => setCreateAuctionForm({...createAuctionForm, endDate: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">Starting Price</label>
                                <input
                                    type="number"
                                    value={createAuctionForm.startingPrice}
                                    onChange={(e) => setCreateAuctionForm({...createAuctionForm, startingPrice: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">Reserve Price</label>
                                <input
                                    type="number"
                                    value={createAuctionForm.reservePrice}
                                    onChange={(e) => setCreateAuctionForm({...createAuctionForm, reservePrice: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                            <div className="text-gray-400 text-4xl mb-4">🖼️</div>
                            <p className="text-gray-400">Drag and drop or upload an image</p>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                onClick={handleCreateAuction}
                                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShowCreateAuction(false)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="text-2xl">🏆</div>
                        <h1 className="text-2xl font-bold text-white">Bidding</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowCreateAuction(true)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                        >
                            <Plus size={20} />
                            <span>Create Auction</span>
                        </button>
                        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-900" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <nav className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
                    <div className="p-4 space-y-2">
                        <button
                            onClick={() => setCurrentView('auctions')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                currentView === 'auctions' ? 'bg-cyan-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <Grid3X3 size={20} />
                            <span>Auctions</span>
                        </button>

                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                currentView === 'dashboard' ? 'bg-cyan-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <List size={20} />
                            <span>My Bids</span>
                        </button>

                        <button
                            onClick={() => setCurrentView('my-auctions')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                currentView === 'my-auctions' ? 'bg-cyan-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <DollarSign size={20} />
                            <span>My Auctions</span>
                        </button>

                        <button
                            onClick={() => setCurrentView('watchlist')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                currentView === 'watchlist' ? 'bg-cyan-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <Star size={20} />
                            <span>Watchlist</span>
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {currentView === 'dashboard' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">My Bidding Dashboard</h2>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-gray-400 text-sm font-semibold mb-2">Ongoing Bids</h3>
                                    <div className="text-3xl font-bold text-yellow-400">{userBids.ongoingBids}</div>
                                </div>

                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-gray-400 text-sm font-semibold mb-2">Auctions Won</h3>
                                    <div className="text-3xl font-bold text-cyan-400">{userBids.auctionsWon}</div>
                                </div>

                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Spent</h3>
                                    <div className="text-3xl font-bold text-yellow-400">${userBids.totalSpent.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Active Auctions */}
                            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Active Auctions</h3>
                                <div className="space-y-4">
                                    {activeAuctions.map((auction) => (
                                        <div key={auction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-2xl">
                                                    {auction.id === 1 ? '📷' : auction.id === 2 ? '🎸' : '⌚'}
                                                </div>
                                                <span className="text-white font-semibold">{auction.name}</span>
                                            </div>
                                            <div className="text-cyan-400 font-mono text-lg">{auction.timeLeft}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'auctions' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Bidding</h2>
                                <div className="flex items-center space-x-4">
                                    <select className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                        <option>Category</option>
                                        <option>Electronics</option>
                                        <option>Music</option>
                                        <option>Art</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Price"
                                        className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    />

                                    <select className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                        <option>Sort by ending soon</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {auctions.map((auction) => (
                                    <div key={auction.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                        <div className="h-48 bg-gray-700 flex items-center justify-center text-6xl">
                                            {auction.image}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-bold text-white">{auction.title}</h3>
                                                <button
                                                    onClick={() => toggleWatchlist(auction.id)}
                                                    className={`p-2 rounded-full ${
                                                        auction.isWatched ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                                                    }`}
                                                >
                                                    <Star size={20} fill={auction.isWatched ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>

                                            <p className="text-gray-400 text-sm mb-4">{auction.description}</p>

                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Current bid</p>
                                                    <p className="text-2xl font-bold text-yellow-400">${auction.currentBid}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">Time left</p>
                                                    <p className="text-cyan-400 font-mono">{auction.timeRemaining}</p>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => placeBid(auction.id, 10)}
                                                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                                                >
                                                    Place Bid
                                                </button>
                                                <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors">
                                                    <Eye size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'watchlist' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Watchlist</h2>
                            <div className="grid grid-cols-3 gap-6">
                                {auctions.filter(auction => auction.isWatched).map((auction) => (
                                    <div key={auction.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                        <div className="h-48 bg-gray-700 flex items-center justify-center text-6xl">
                                            {auction.image}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2">{auction.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-yellow-400 font-bold text-lg">${auction.currentBid}</div>
                                                <div className="text-cyan-400 font-mono">{auction.timeRemaining}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'my-auctions' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">My Auctions</h2>
                            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No auctions yet</h3>
                                <p className="text-gray-400 mb-6">Create your first auction to start selling</p>
                                <button
                                    onClick={() => setShowCreateAuction(true)}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold"
                                >
                                    Create Auction
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BiddingPlatform;