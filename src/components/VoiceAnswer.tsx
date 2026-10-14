"use client";

import { useState } from "react";
import { Alert, Button, Typography } from "antd";
import { AudioOutlined } from "@/components/icons";

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
        <Typography.Paragraph type="secondary" style={{ marginTop: 10 }}>{transcript}</Typography.Paragraph>
      ) : (
        <Button size="small" icon={<AudioOutlined />} loading={loading} onClick={handleTranscribe} style={{ marginTop: 10 }}>
          {loading ? "در حال تبدیل…" : "تبدیل ویس به متن"}
        </Button>
      )}

      {error && <Alert type="error" showIcon title={error} style={{ marginTop: 8 }} />}
    </div>
  );
}
