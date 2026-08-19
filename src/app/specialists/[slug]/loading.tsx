/**
 * اسکلتِ صفحه‌ی متخصص.
 *
 * ابعاد عمداً با نسخه‌ی واقعی یکی‌اند — آواتار ۹۶، همان دو ستون، همان
 * ارتفاعِ کارتِ رزرو. اسکلتی که اندازه‌اش فرق کند خودش همان پرشِ چیدمانی
 * را می‌سازد که قرار بود جلویش را بگیرد.
 */
export default function Loading() {
  return (
    <main className="wrap" aria-busy="true" aria-label="در حال بارگذاری پروفایل">
      <div className="sk sk-line" style={{ width: 180, margin: "18px 0" }} />

      <header className="sp-hero">
        <div className="sk sk-circle" style={{ width: 96, height: 96, flex: "none" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sk sk-line sk-line--lg" style={{ width: "45%" }} />
          <div className="sk sk-line" style={{ width: "30%", marginTop: 10 }} />
          <div className="sk sk-line" style={{ width: "38%", marginTop: 12 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <div className="sk" style={{ width: 104, height: 26, borderRadius: 999 }} />
            <div className="sk" style={{ width: 120, height: 26, borderRadius: 999 }} />
          </div>
        </div>
      </header>

      <div className="sp-layout">
        <div>
          <section className="sp-section">
            <div className="sk sk-line sk-line--lg" style={{ width: 150, marginBottom: 14 }} />
            <div className="sk-card">
              {[100, 96, 88, 60].map((w, i) => (
                <div key={i} className="sk sk-line" style={{ width: `${w}%`, marginTop: i ? 12 : 0 }} />
              ))}
            </div>
          </section>

          <section className="sp-section">
            <div className="sk sk-line sk-line--lg" style={{ width: 130, marginBottom: 14 }} />
            <div className="post-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <article className="post-card" key={i}>
                  {/* همان نسبتِ ابعادِ کارتِ واقعی، تا گرید نپرد */}
                  <div className="sk" style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 0 }} />
                  <div className="p-body">
                    <div className="sk sk-line" style={{ width: "92%" }} />
                    <div className="sk sk-line" style={{ width: "64%", marginTop: 9 }} />
                  </div>
                  <div className="p-foot">
                    <div className="sk sk-line" style={{ width: 120, height: 10 }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="sp-book sp-book--col">
          <div className="sk sk-line sk-line--lg" style={{ width: "60%", height: 26 }} />
          <div className="sk sk-line" style={{ width: "45%", marginTop: 10 }} />
          <div className="sp-book__rows">
            <div className="sp-book__row">
              <div className="sk sk-line" style={{ width: 90 }} />
              <div className="sk sk-line" style={{ width: 60 }} />
            </div>
            <div className="sp-book__row">
              <div className="sk sk-line" style={{ width: 70 }} />
              <div className="sk sk-line" style={{ width: 74 }} />
            </div>
          </div>
          <div className="sk" style={{ width: "100%", height: 42, borderRadius: 12 }} />
          <div className="sk" style={{ width: "100%", height: 42, borderRadius: 12, marginTop: 8 }} />
        </aside>
      </div>
    </main>
  );
}
