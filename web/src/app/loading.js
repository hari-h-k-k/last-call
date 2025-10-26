export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-amber-400 text-lg">Loading...</p>
      </div>
    </div>
  );
}