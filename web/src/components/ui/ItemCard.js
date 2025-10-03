export default function ItemCard({ item, registered }) {
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className={`relative backdrop-blur-sm rounded-xl p-6 transition-all duration-300 ${
      registered 
        ? 'bg-gradient-to-br from-green-900/20 via-slate-800/50 to-blue-900/20 border border-green-500/50 hover:shadow-xl hover:shadow-green-500/30'
        : 'bg-slate-800/50 border border-slate-700/50 hover:shadow-xl hover:shadow-amber-500/10'
    }`}>
      {/* Status Bar */}
      {registered && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"></div>
      )}
      
      {/* Ribbon Badge */}
      {registered && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12">
          ✓ REGISTERED
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-semibold truncate ${
          registered ? 'text-green-100' : 'text-white'
        }`}>
          {item.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          registered 
            ? 'bg-green-500/20 text-green-400'
            : 'bg-amber-500/20 text-amber-400'
        }`}>
          {item.category}
        </span>
      </div>
      
      <p className={`text-sm mb-4 line-clamp-2 ${
        registered ? 'text-green-200' : 'text-slate-300'
      }`}>
        {item.description}
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className={registered ? 'text-green-300' : 'text-slate-400'}>
            Starting Price
          </span>
          <span className={`font-semibold ${
            registered ? 'text-green-400' : 'text-amber-400'
          }`}>
            {formatPrice(item.startingPrice)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={registered ? 'text-green-300' : 'text-slate-400'}>
            Auction Start
          </span>
          <span className={registered ? 'text-green-200' : 'text-slate-300'}>
            {formatDate(item.auctionStartDate)}
          </span>
        </div>
        {registered && (
          <div className="flex justify-between">
            <span className="text-green-300">Status</span>
            <span className="text-green-400 font-medium">Registered ✓</span>
          </div>
        )}
      </div>
      
      <button className={`w-full mt-4 py-2 rounded-lg font-medium transition-all duration-300 group relative overflow-hidden ${
        registered 
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
      }`}>
        <span className={`transition-opacity duration-200 ${registered ? 'group-hover:opacity-0' : ''}`}>
          {registered ? 'Registered' : 'View Details'}
        </span>
        {registered && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View Details
          </span>
        )}
      </button>
    </div>
  );
}