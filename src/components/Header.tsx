"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@/components/icons";
import { PANEL_URL, SITE_NAME } from "@/lib/config";
import HeaderAuth from "@/components/HeaderAuth";

// استاتیک نگه‌داشته می‌شود (کش/ISR صفحات عمومی حفظ شود) — چک لاگین در HeaderAuth
// سمت کلاینت انجام می‌شود، نه اینجا با cookies() که کل صفحه را دینامیک می‌کند.
const NAV = [
  { key: "/", label: <Link href="/">صفحه اصلی</Link> },
  { key: "/assistant", label: <Link href="/assistant">دستیار هوشمند</Link> },
  { key: "/specialists", label: <Link href="/specialists">متخصصان</Link> },
  { key: "/how-it-works", label: <Link href="/how-it-works">چطور کار می‌کند</Link> },
  { key: "sessions", label: <a href={`${PANEL_URL}/sessions`}>جلسات من</a> },
];

/** «/specialists/ali-12» باید منوی «/specialists» را روشن کند. */
function activeKey(pathname: string) {
  if (pathname === "/") return "/";
  const hit = NAV.find((n) => n.key !== "/" && pathname.startsWith(n.key));
  return hit?.key ?? "";
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const selected = [activeKey(pathname)];

  return (
    <header className="site-header">
      <div className="wrap site-header-bar">
        <Link className="logo" href="/">
          <span className="logo-mark" aria-hidden="true">و</span>
          {SITE_NAME}
        </Link>

        <Menu
          className="main-nav"
          mode="horizontal"
          selectedKeys={selected}
          items={NAV}
          disabledOverflow
          aria-label="ناوبری اصلی"
        />

        <div className="header-actions">
          <HeaderAuth />
          <Button
            className="nav-burger"
            type="text"
            aria-label="باز کردن منو"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <Drawer
        title={SITE_NAME}
        placement="right"
        size={280}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Menu
          mode="inline"
          selectedKeys={selected}
          items={NAV}
          onClick={() => setOpen(false)}
          style={{ border: 0 }}
        />
      </Drawer>
    </header>
  );
}
