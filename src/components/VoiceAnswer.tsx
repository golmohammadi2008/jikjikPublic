"use client";

import { useState } from "react";

export default function VoiceAnswer({
  answerId,
  audioUrl,
  initialTranscript,
}: {
  answerId: string;
  audioUrl: string;
  initialTranscript: string | null;
}) {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/answers/${answerId}/transcribe`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "تبدیل به متن ناموفق بود");
        return;
      }
      setTranscript(data.transcript);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <audio controls src={audioUrl} style={{ width: "100%", height: 40 }} />

      {transcript ? (
        <p style={{ marginTop: 10, fontSize: 14.5, color: "var(--ink-2)" }}>{transcript}</p>
      ) : (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleTranscribe}
          disabled={loading}
          style={{ marginTop: 10 }}
        >
          {loading ? "در حال تبدیل…" : "تبدیل ویس به متن"}
        </button>
      )}

      {error && <p style={{ marginTop: 8, fontSize: 13, color: "var(--saffron-deep)" }}>{error}</p>}
    </div>
  );
}
