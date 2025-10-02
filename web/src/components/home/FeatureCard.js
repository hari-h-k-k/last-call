export default function FeatureCard({ icon, title, description, bgColor }) {
  return (
    <div className="text-center p-6">
      <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-amber-400">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}