export default function WelcomeSection({ onGetStarted }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
        <div className="mb-8">
          <div className="text-8xl mb-4">🏆</div>
          <h1 className="text-6xl md:text-7xl font-bold text-amber-400 mb-6 leading-tight">
            Welcome to Last Call
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            Your premier bidding platform
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Discover rare items, place winning bids, and join thousands of collectors in exciting real-time auctions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={onGetStarted}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1"
          >
            Start Bidding Now
          </button>
          <button className="border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
            Learn More
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-400">10K+</div>
            <div className="text-slate-400">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">500+</div>
            <div className="text-slate-400">Live Auctions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">99%</div>
            <div className="text-slate-400">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}