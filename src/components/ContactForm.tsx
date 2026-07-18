"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("نام را وارد کنید");
    if (form.message.trim().length < 5) return setError("متن پیام خیلی کوتاه است");
    if (!form.email.trim() && !form.phone.trim()) return setError("ایمیل یا شماره تماس را وارد کنید");
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || "ارسال ناموفق بود");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال ناموفق بود");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="contact-done">
        <div className="contact-done-icon" aria-hidden="true">✓</div>
        <h2>پیام شما ثبت شد</h2>
        <p>ممنون که با ما در تماس هستید — به‌زودی پاسخ می‌دهیم.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="cf-row">
        <label>
          نام <span aria-hidden="true">*</span>
          <input value={form.name} onChange={set("name")} maxLength={100} required placeholder="نام و نام خانوادگی" />
        </label>
        <label>
          موضوع
          <input value={form.subject} onChange={set("subject")} maxLength={150} placeholder="موضوع پیام" />
        </label>
      </div>
      <div className="cf-row">
        <label>
          ایمیل
          <input type="email" value={form.email} onChange={set("email")} maxLength={150} placeholder="you@example.com" dir="ltr" />
        </label>
        <label>
          شماره تماس
          <input value={form.phone} onChange={set("phone")} maxLength={30} placeholder="۰۹۱۲..." dir="ltr" />
        </label>
      </div>
      <label>
        پیام <span aria-hidden="true">*</span>
        <textarea value={form.message} onChange={set("message")} maxLength={4000} rows={6} required placeholder="پیام شما..." />
      </label>

      {error && <p className="cf-error">{error}</p>}

      <button className="btn btn-saffron" type="submit" disabled={sending}>
        {sending ? "در حال ارسال…" : "ارسال پیام"}
      </button>
    </form>
  );
}
