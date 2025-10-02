export default function WelcomeSection({ onGetStarted }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to Last Call
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your premier bidding platform
        </p>
        <button 
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}