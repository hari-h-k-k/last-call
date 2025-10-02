import FeatureCard from './FeatureCard';

export default function HomeContent() {
  const features = [
    {
      icon: '🏆',
      title: 'Win Amazing Items',
      description: 'Bid on exclusive items and win at great prices',
      bgColor: 'bg-amber-100'
    },
    {
      icon: '⚡',
      title: 'Real-time Bidding',
      description: 'Experience live auctions with instant updates',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Safe and secure transactions guaranteed',
      bgColor: 'bg-slate-100'
    }
  ];

  return (
    <main id="home-section" className="min-h-screen bg-slate-800 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-400 mb-4">
            Start Bidding Today
          </h2>
          <p className="text-lg text-slate-300">
            Join thousands of users in exciting real-time auctions
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </main>
  );
}