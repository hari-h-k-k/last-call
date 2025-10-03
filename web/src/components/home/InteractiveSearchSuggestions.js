'use client';

export default function InteractiveSearchSuggestions({ onSearch }) {
  const suggestions = [
    'Art', 'House', 'Car',
    'Bike', 'Apartment', 'Collectibles'
  ];

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <span className="text-slate-400 text-sm mr-2">Popular:</span>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSearch(suggestion)}
          className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-200 hover:scale-105"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}