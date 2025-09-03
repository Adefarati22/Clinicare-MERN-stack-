export default function StatsCard({ title, figure, desc, icon }) {
  return (
    <>
      <div className="stats shadow border border-slate-200 bg-white">
        <div className="stat">
          <div className="stat-figure text-blue-500">{icon}</div>
          <div className="stat-title">{title}</div>
          <div className="stat-value">{figure}</div>
          <div className="stat-desc">{desc}</div>
        </div>
      </div>
    </>
  );
}

// making it a reusable components