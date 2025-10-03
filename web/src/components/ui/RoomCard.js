'use client';

export default function RoomCard({ room }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 hover:border-amber-500/50">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white truncate">
            Room #{room.itemId}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            room.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-amber-500 text-black'
          }`}>
            {room.status === 'PENDING' ? 'WAITING' : room.status}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Current Bid:</span>
            <span className="text-amber-400 font-bold">{formatPrice(room.currentPrice)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Start Time:</span>
            <span className="text-slate-300">{formatDate(room.startDate)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">End Time:</span>
            <span className="text-slate-300">{formatDate(room.endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}