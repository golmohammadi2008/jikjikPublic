/** اسکلتِ صفحه‌ی دسته. */
export default function Loading() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری دسته">
      <div className="sk sk-line sk-line--lg" style={{ width: 220, margin: "22px 0 16px" }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="sk-card" key={i} style={{ marginTop: 12 }}>
          <div className="sk sk-line" style={{ width: "88%" }} />
          <div className="sk sk-line" style={{ width: "40%", marginTop: 10, height: 10 }} />
        </div>
      ))}
    </main>
  );
}
