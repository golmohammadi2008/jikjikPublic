"use client";

/**
 * دستیار هوشمند روی سایت عمومی — چند سوال بدون حساب (تعداد از سرور می‌آید).
 *
 * چرا اینجا: کسی که از گوگل می‌آید هیچ دلیلی برای ساختن حساب ندارد تا وقتی
 * چیزی نگرفته باشد. یکی دو پاسخِ واقعی آن دلیل را می‌سازد.
 *
 * و وقتی سهمیه تمام شد بن‌بست نمی‌گیرد: متخصص‌های همان حوزه‌ای که پرسیده را
 * می‌بیند و می‌داند برای ادامه باید وارد شود. آن لحظه، نه زودتر، جایی است که
 * دعوت به ثبت‌نام معنی دارد.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { askAssistant } from "@/lib/api";
import { PANEL_URL, SESSION_TOKEN_COOKIE } from "@/lib/config";
import type { AssistantModel, AssistantSpecialist } from "@/lib/types";
import { buildSlug } from "@/lib/slug";

type Turn = { q: string; a: string };

export default function AssistantWidget({ models, freeAsks }: { models: AssistantModel[]; freeAsks: number }) {
  const [picked, setPicked] = useState(models[0]?.key || "");
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [asking, setAsking] = useState(false);
  const [left, setLeft] = useState(freeAsks);
  const [locked, setLocked] = useState(false);
  const [specialists, setSpecialists] = useState<AssistantSpecialist[]>([]);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  /**
   * کاربر از قبل وارد شده؟
   *
   * فقط برای *متنِ* دکمه است، نه دسترسی: کسی که لاگین است باید «ادامه در
   * پنل» ببیند نه «ورود». خودِ مسیر در هر دو حالت یکی است و اگر توکن نباشد،
   * پنل خودش به صفحه‌ی ورود می‌فرستد و بعد از ورود به همین‌جا برمی‌گرداند.
   */
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_TOKEN_COOKIE}=`)));
  }, []);
  // سوالی که کاربر همین حالا نوشته یا آخرین چیزی که پرسیده — همان با او به
  // پنل می‌رود
  const lastQuestion = input.trim() || turns[turns.length - 1]?.q || "";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [turns, asking]);

  const ask = async () => {
    const text = input.trim();
    if (!text || asking || locked) return;
    setAsking(true);
    setError("");
    setInput("");
    try {
      const r = await askAssistant(text, picked);
      setTurns((t) => [...t, { q: text, a: r.answer }]);
      setLeft(r.asksLeft);
      setSpecialists(r.specialists || []);
      if (r.asksLeft <= 0) setLocked(true);
    } catch (e) {
      const err = e as { code?: string; message?: string; data?: { specialists?: AssistantSpecialist[] } };
      if (err?.code === "ASK_LIMIT") {
        setLocked(true);
        setLeft(0);
        setSpecialists(err.data?.specialists || []);
      } else {
        setError(err?.message || "پاسخ در دسترس نیست — دوباره تلاش کنید");
        setInput(text); // نوشته‌ی کاربر نباید بابت خطای ما گم شود
      }
    } finally {
      setAsking(false);
    }
  };

  return (
    <section className="section" id="assistant">
      <div className="wrap">
        <div className="section-head">
          <h2>همین حالا بپرس</h2>
          {!locked && <span className="more">{left.toLocaleString("fa-IR")} سوال رایگان</span>}
        </div>

        {models.length > 1 && (
          <div className="asst-models">
            {models.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`asst-chip ${m.key === picked ? "on" : ""}`}
                onClick={() => setPicked(m.key)}
                disabled={locked}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        <div className="asst-box">
          {turns.length === 0 && !locked && (
            <p className="asst-empty">
              سوالت را بنویس — پاسخ فوری می‌گیری، و اگر لازم شد متخصصِ همان حوزه را معرفی می‌کنیم.
            </p>
          )}

          {turns.map((t, i) => (
            <div key={i} className="asst-turn">
              <p className="asst-q">{t.q}</p>
              <p className="asst-a">{t.a}</p>
            </div>
          ))}

          {asking && <p className="asst-a asst-loading">در حال نوشتن…</p>}
          {error && <p className="asst-error">{error}</p>}
          <div ref={endRef} />

          {!locked ? (
            <div className="asst-form">
              <input
                className="asst-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void ask(); }}
                placeholder="مثلاً: قرارداد کارم بند عجیبی دارد، مشکل‌دار است؟"
                maxLength={1000}
                disabled={asking}
              />
              <button type="button" className="btn btn-saffron" onClick={() => void ask()} disabled={asking || !input.trim()}>
                بپرس
              </button>
            </div>
          ) : (
            <div className="asst-locked">
              <b>سهمیه‌ی امروز تمام شد</b>
              <p>
                {loggedIn
                  ? "گفتگو را در پنل ادامه بده."
                  : "وارد شو تا گفتگو را همان‌جا ادامه بدهی."}
              </p>
              {/* آخرین سوالِ کاربر همراهش می‌رود: بعد از ورود، جوابِ *همان*
                  سوال را می‌بیند نه یک صفحه‌ی خالی که باید دوباره تایپش کند.
                  آن دوباره‌نوشتن دقیقاً جایی است که کاربرِ تازه رها می‌کند. */}
              <a
                className="btn btn-saffron"
                href={`${PANEL_URL}/assistant${lastQuestion ? `?q=${encodeURIComponent(lastQuestion)}` : ''}`}
              >
                {loggedIn ? "ادامه‌ی گفتگو" : "ورود و ادامه‌ی گفتگو"}
              </a>
            </div>
          )}
        </div>

        {/* متخصص‌های همان حوزه — بعد از اولین پاسخ، نه زودتر.
            حوزه از روی مدلی که کاربر انتخاب کرده تعیین می‌شود، پس برای سوال
            حقوقی برنامه‌نویس پیشنهاد نمی‌شود؛ و اگر در آن حوزه کسی نباشد،
            هیچ‌کس نشان داده نمی‌شود — پیشنهادِ بی‌ربط از نبودِ پیشنهاد بدتر است. */}
        {specialists.length > 0 && (
          <div className="asst-pros">
            <h3>متخصص همین حوزه</h3>
            <ul>
              {specialists.map((s) => (
                <li key={s.id}>
                  <Link href={`/specialists/${buildSlug(s.name, s.id)}`}>
                    {s.avatar
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img className="pro-avatar" src={s.avatar} alt="" loading="lazy" />
                      : <span className="pro-avatar pro-avatar-fallback">{(s.name || "؟")[0]}</span>}
                    <span className="pro-meta">
                      <b>{s.name}</b>
                      <small>
                        {s.specialty || s.categoryLabel || ""}
                        {s.ratingCount > 0 ? ` · ★ ${s.ratingAvg.toLocaleString("fa-IR")}` : ""}
                      </small>
                    </span>
                    <span className="pro-cta">مشاهده</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
