export default function ItemCard({ item }) {
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white truncate">{item.title}</h3>
        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
          {item.category}
        </span>
      </div>
      
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{item.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400">Starting Price</span>
          <span className="text-amber-400 font-semibold">{formatPrice(item.startingPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Auction Start</span>
          <span className="text-slate-300">{formatDate(item.auctionStartDate)}</span>
        </div>
      </div>
      
      <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900 py-2 rounded-lg font-medium transition-colors">
        View Details
      </button>
    </div>
  );
}