/** اسکلتِ صفحه‌ی سوال. */
export default function Loading() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری سوال">
      <div className="sk sk-line" style={{ width: 180, margin: "18px 0" }} />
      <div className="sk-card">
        <div className="sk sk-line sk-line--lg" style={{ width: "85%" }} />
        <div className="sk sk-line sk-line--lg" style={{ width: "55%", marginTop: 10 }} />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div className="sk-card" key={i} style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="sk sk-circle" style={{ width: 36, height: 36 }} />
            <div className="sk sk-line" style={{ width: 120 }} />
          </div>
          {[94, 90, 62].map((w, j) => (
            <div key={j} className="sk sk-line" style={{ width: `${w}%`, marginTop: 12 }} />
          ))}
        </div>
      ))}
    </main>
  );
}
