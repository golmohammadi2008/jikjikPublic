"use client";

import { useState } from "react";
import { Alert, Button, Card, Form, Input, Result } from "antd";
import { SendOutlined } from "@/components/icons";
import { API_BASE_URL } from "@/lib/config";

type Values = { name: string; subject?: string; email?: string; phone?: string; message: string };

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (values: Values) => {
    setError("");
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "", email: "", phone: "", ...values }),
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
      <Card variant="borderless">
        <Result
          status="success"
          title="پیام شما ثبت شد"
          subTitle="ممنون که با ما در تماس هستید — به‌زودی پاسخ می‌دهیم."
        />
      </Card>
    );
  }

  return (
    <Card variant="borderless" className="contact-form">
      <Form<Values> layout="vertical" onFinish={submit} requiredMark="optional" disabled={sending}>
        <div className="cf-row">
          <Form.Item
            name="name"
            label="نام"
            rules={[{ required: true, min: 2, whitespace: true, message: "نام را وارد کنید" }]}
          >
            <Input maxLength={100} placeholder="نام و نام خانوادگی" />
          </Form.Item>
          <Form.Item name="subject" label="موضوع">
            <Input maxLength={150} placeholder="موضوع پیام" />
          </Form.Item>
        </div>
        {/* حداقل یکی از ایمیل/تلفن لازم است؛ هر دو را «وابسته به دیگری» اعتبارسنجی می‌کنیم */}
        <div className="cf-row">
          <Form.Item
            name="email"
            label="ایمیل"
            dependencies={["phone"]}
            rules={[
              { type: "email", message: "ایمیل معتبر نیست" },
              ({ getFieldValue }) => ({
                validator: (_, v) =>
                  v?.trim() || getFieldValue("phone")?.trim()
                    ? Promise.resolve()
                    : Promise.reject(new Error("ایمیل یا شماره تماس را وارد کنید")),
              }),
            ]}
          >
            <Input maxLength={150} placeholder="you@example.com" dir="ltr" />
          </Form.Item>
          <Form.Item name="phone" label="شماره تماس" dependencies={["email"]}>
            <Input maxLength={30} placeholder="۰۹۱۲..." dir="ltr" />
          </Form.Item>
        </div>
        <Form.Item
          name="message"
          label="پیام"
          rules={[{ required: true, min: 5, whitespace: true, message: "متن پیام خیلی کوتاه است" }]}
        >
          <Input.TextArea maxLength={4000} rows={6} showCount placeholder="پیام شما..." />
        </Form.Item>

        {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

        <Button type="primary" size="large" htmlType="submit" loading={sending} icon={<SendOutlined />}>
          ارسال پیام
        </Button>
      </Form>
    </Card>
  );
}
