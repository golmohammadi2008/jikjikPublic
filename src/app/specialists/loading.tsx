/** اسکلتِ فهرست متخصص‌ها — همان گرید، همان ابعاد. */
export default function Loading() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری متخصص‌ها">
      <div className="sk sk-line sk-line--lg" style={{ width: 200, margin: "22px 0 16px" }} />
      <div className="post-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <article className="post-card" key={i}>
            <div className="p-body" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="sk sk-circle" style={{ width: 48, height: 48, flex: "none" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sk sk-line" style={{ width: "70%" }} />
                <div className="sk sk-line" style={{ width: "45%", marginTop: 9 }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
