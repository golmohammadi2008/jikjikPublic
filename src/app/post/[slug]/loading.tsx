/** اسکلتِ صفحه‌ی پست. */
export default function Loading() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری پست">
      <div className="sk sk-line" style={{ width: 180, margin: "18px 0" }} />
      <div className="sk" style={{ width: "100%", aspectRatio: "16 / 10", borderRadius: 16 }} />
      <div className="sk-card" style={{ marginTop: 18 }}>
        <div className="sk sk-line sk-line--lg" style={{ width: "60%" }} />
        {[96, 92, 88, 70].map((w, i) => (
          <div key={i} className="sk sk-line" style={{ width: `${w}%`, marginTop: 12 }} />
        ))}
      </div>
    </main>
  );
}
