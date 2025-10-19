"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import Navbar from '@/components/layout/Navbar';
import { itemService } from '@/services/itemService';
import ItemCard from '../../components/ui/ItemCard';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('listings');
  const [profileImage, setProfileImage] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(userData);
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  useEffect(() => {
      const fetchMyItems = async () => {
        try {
          const myItemsResponse = await itemService.getMyItems();
          setMyItems(myItemsResponse.subject || []);
          console.log(myItemsResponse);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyItems();


    }, [activeTab]);

  const stats = [
    { label: 'Total Listings', value: myItems.length.toString(), icon: '📋', color: 'text-blue-400' },
    { label: 'Active Bids', value: '5', icon: '🔨', color: 'text-green-400' },
    { label: 'Items Won', value: '8', icon: '🏆', color: 'text-yellow-400' },
    { label: 'Success Rate', value: '85%', icon: '📈', color: 'text-purple-400' }
  ];

  if (!user) return <div>Loading...</div>;

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: '📋' }
//    { id: 'biddings', label: 'Past Biddings', icon: '🔨' },
//    { id: 'favorites', label: 'Favorites', icon: '❤️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'listings':
        return (
          <div className="grid grid-cols-4 gap-8">
            {myItems.map((item) => (
                            <ItemCard key={item.item.id} item={item.item} registered={item.registered} />
                          ))}
          </div>
        );
      case 'biddings':
        return (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-slate-600 border border-slate-500 shadow-lg rounded-xl p-6 flex justify-between items-center hover:shadow-xl hover:border-slate-400 transition-all">
                <div>
                  <h4 className="text-white font-medium text-lg mb-1">Antique Vase #{item}</h4>
                  <p className="text-slate-300">Your bid: $180 • Final price: $220</p>
                </div>
                <span className="text-red-400 font-medium bg-red-900 px-3 py-1 rounded">Lost</span>
              </div>
            ))}
          </div>
        );
      case 'favorites':
        return (
          <div className="grid grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-slate-600 border border-slate-500 shadow-lg rounded-xl p-6 hover:shadow-xl hover:border-slate-400 transition-all">
                <div className="w-full h-40 bg-slate-500 border border-slate-400 rounded-lg mb-4"></div>
                <h4 className="text-white font-medium text-lg mb-2">Art Piece #{item}</h4>
                <p className="text-slate-300">Starting bid: $100</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar show={true} />
      <div className="min-h-screen bg-slate-800 pt-16">
        <div className="flex flex-col px-8 py-6 bg-slate-900">
          {/* Top Half - Profile & Stats */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left - Profile Card */}
            <div className="bg-slate-700 border border-slate-600 shadow-xl rounded-xl p-12 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-200">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-4xl text-amber-600">👤</span>
                  )}
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">{user?.name || 'John Doe'}</h2>
                <p className="text-slate-300 text-lg mb-4">{user?.email || 'john@example.com'}</p>
                <p className="text-slate-400 mb-8">Auction Enthusiast & Collector</p>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Right - Statistics Panel */}
            <div className="bg-slate-700 border border-slate-600 shadow-xl rounded-xl p-12">
              <h3 className="text-3xl font-bold text-white mb-8 border-b border-slate-600 pb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-slate-600 border border-slate-500 shadow-lg rounded-xl p-8 text-center hover:bg-slate-550 transition-all">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Half - Tabbed Content */}
          <div className="bg-slate-700 border border-slate-600 shadow-xl rounded-xl overflow-hidden mb-8">
            {/* Tab Navigation */}
            <div className="border-b-2 border-slate-600 bg-slate-750">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-8 py-6 text-lg font-medium transition-all border-r border-slate-600 last:border-r-0 ${
                      activeTab === tab.id
                        ? 'text-amber-400 border-b-4 border-amber-400 bg-slate-600 shadow-lg'
                        : 'text-slate-300 hover:text-amber-300 hover:bg-slate-650'
                    }`}
                  >
                    <span className="mr-3 text-xl">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8 bg-slate-750">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}