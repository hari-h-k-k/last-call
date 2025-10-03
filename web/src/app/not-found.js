import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-300 mb-8">The page you're looking for doesn't exist.</p>
        <Link 
          href="/" 
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}