export default function BreedStatCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-surface-container-lowest rounded-xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-1 hover:-translate-y-1 transition-transform">
      <span className="material-symbols-outlined text-outline text-2xl mb-1">{icon}</span>
      <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      <p className="font-headline-md text-headline-md text-on-surface">{value}</p>
    </div>
  )
}
