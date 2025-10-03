import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-900/95 backdrop-blur-sm shadow-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
            Last Call
          </Link>
          
          <nav className="flex space-x-6">
            <Link href="/auctions" className="text-slate-300 hover:text-white transition-colors font-medium">
              Auctions
            </Link>
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors font-medium">
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}