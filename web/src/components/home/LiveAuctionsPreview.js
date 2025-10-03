export default function LiveAuctionsPreview() {
  const liveAuctions = [
    { id: 1, title: 'Vintage Watch', currentBid: 850, timeLeft: '2h 15m', bidders: 12 },
    { id: 2, title: 'Rare Painting', currentBid: 2400, timeLeft: '45m', bidders: 8 },
    { id: 3, title: 'Classic Guitar', currentBid: 1200, timeLeft: '1h 30m', bidders: 15 }
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-amber-400">Live Auctions</h2>
          <div className="flex items-center text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium">LIVE NOW</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {liveAuctions.map((auction) => (
            <div key={auction.id} className="bg-slate-800/50 rounded-xl p-6 border border-green-500/20">
              <h3 className="text-white font-semibold mb-3">{auction.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Bid</span>
                  <span className="text-green-400 font-bold">${auction.currentBid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Left</span>
                  <span className="text-amber-400">{auction.timeLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bidders</span>
                  <span className="text-white">{auction.bidders}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                Join Auction
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}