/** اسکلتِ آرشیو سوال‌ها. */
export default function Loading() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری سوال‌ها">
      <div className="sk sk-line sk-line--lg" style={{ width: 200, margin: "22px 0 16px" }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="sk-card" key={i} style={{ marginTop: 12 }}>
          <div className="sk sk-line" style={{ width: `${70 + (i % 3) * 8}%` }} />
          <div className="sk sk-line" style={{ width: 130, marginTop: 10, height: 10 }} />
        </div>
      ))}
    </main>
  );
}
