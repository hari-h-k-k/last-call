export default function WelcomeSection({ onGetStarted }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-400 mb-6">
          Welcome to Last Call
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Your premier bidding platform
        </p>
        <button 
          onClick={onGetStarted}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}