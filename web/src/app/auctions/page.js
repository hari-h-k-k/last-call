'use client';
import Navbar from '../../components/layout/Navbar';
import AuctionOfTheDay from '../../components/auctions/AuctionOfTheDay';
import LiveAuctionsPreview from '../../components/auctions/LiveAuctionsPreview';

export default function AuctionsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Auctions</h1>
          <p className="text-xl text-slate-300">Live bidding and upcoming auctions</p>
        </div>

        <div className="space-y-16">
          <AuctionOfTheDay />
          <LiveAuctionsPreview />
        </div>
      </div>
    </div>
  );
}