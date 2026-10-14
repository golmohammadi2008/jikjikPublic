"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";

/**
 * صحنه‌ی سه‌بعدیِ هیرو — «شبکه‌ی پرسش و متخصص».
 *
 * هسته‌ی آبی = سوالِ تو؛ ماهواره‌هایی که روی مدارها می‌چرخند = متخصص‌ها؛
 * خط‌ها همان ارتباطِ زنده‌اند. صرفاً تزئینی است (`aria-hidden`) و هیچ
 * محتوای سئو یا اطلاعاتی داخلش نیست.
 *
 * ملاحظات:
 * - کانواسِ شفاف است تا گرادیانِ CSS زیرش دیده شود و اگر WebGL نبود، چیزی نشکند.
 * - بیرونِ دید و تبِ پس‌زمینه، حلقه‌ی رندر متوقف می‌شود (باتری موبایل).
 * - با `prefers-reduced-motion` فقط یک فریم رندر می‌شود.
 * - همه‌ی geometry/materialها موقع unmount آزاد می‌شوند.
 */

const BLUE = 0x93c5fd; // روی زمینه‌ی آبیِ هیرو: رنگ‌ها روشن‌اند تا از زمینه جدا شوند
const VIOLET = 0xc4b5fd;
const TEAL = 0x67e8f9;
const SAT_COLORS = [BLUE, VIOLET, TEAL, VIOLET, BLUE, TEAL, BLUE, VIOLET, TEAL];

type Sat = { mesh: Mesh; ring: number; angle: number; speed: number };

export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      // WebGL غیرفعال/پشتیبانی‌نشده — قابِ خالی می‌ماند و پس‌زمینه‌ی CSS کافی است
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    scene.add(new AmbientLight(0xffffff, 1.35));
    const key = new DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const glow = new PointLight(VIOLET, 18, 14);
    glow.position.set(-3, -2, 3);
    scene.add(glow);

    const world = new Group();
    scene.add(world);
    const disposables: { dispose(): void }[] = [];
    const track = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);

    // --- هسته
    const coreGeo = track(new IcosahedronGeometry(1.15, 1));
    const coreMat = track(
      new MeshStandardMaterial({ color: 0x3b82f6, flatShading: true, roughness: 0.35, metalness: 0.2, transparent: true, opacity: 0.9 }),
    );
    const core = new Mesh(coreGeo, coreMat);
    world.add(core);
    const edgeGeo = track(new EdgesGeometry(coreGeo));
    const edgeMat = track(new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }));
    core.add(new LineSegments(edgeGeo, edgeMat));

    // --- مدارها
    const RADII = [2.0, 2.7, 3.35];
    const TILTS: [number, number][] = [
      [1.15, 0.2],
      [0.35, -0.5],
      [-0.7, 0.9],
    ];
    const rings: Group[] = RADII.map((r, i) => {
      const g = new Group();
      g.rotation.set(TILTS[i][0], TILTS[i][1], 0);
      const geo = track(new TorusGeometry(r, 0.008, 6, 160));
      const ringMat = track(new MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 1 }));
      g.add(new Mesh(geo, ringMat));
      world.add(g);
      return g;
    });

    // --- ماهواره‌ها (متخصص‌ها)
    const satGeo = track(new SphereGeometry(0.17, 20, 20));
    const sats: Sat[] = SAT_COLORS.map((c, i) => {
      const mat = track(new MeshStandardMaterial({ color: c, roughness: 0.25, metalness: 0.15 }));
      const mesh = new Mesh(satGeo, mat);
      const ring = i % 3;
      rings[ring].add(mesh);
      return { mesh, ring, angle: (i / SAT_COLORS.length) * Math.PI * 2, speed: 0.18 + (i % 4) * 0.05 };
    });

    // --- خط‌های ارتباط هسته ← ماهواره
    const linePos = new Float32Array(sats.length * 6);
    const lineGeo = track(new BufferGeometry());
    lineGeo.setAttribute("position", new BufferAttribute(linePos, 3));
    const lineMat = track(new LineBasicMaterial({ color: new Color(0xffffff), transparent: true, opacity: 0.35 }));
    world.add(new LineSegments(lineGeo, lineMat));

    // --- گرد و غبار ستاره‌ای
    const N = 260;
    const dust = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      // توزیع روی پوسته‌ی کره‌ای دورتر از مدارها
      const r = 4.2 + Math.random() * 2.6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      dust.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3);
    }
    const dustGeo = track(new BufferGeometry());
    dustGeo.setAttribute("position", new BufferAttribute(dust, 3));
    const dustMat = track(new PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.6 }));
    const points = new Points(dustGeo, dustMat);
    world.add(points);

    // --- اندازه
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // بزرگ‌ترین مدار (شعاع ≈ ۳٫۴) باید در کوچک‌ترین بُعدِ قاب جا شود؛ در قابِ
      // باریک (موبایل) دوربین عقب‌تر می‌رود تا مدار بیرون نزند
      camera.position.z = Math.min(16, 10 / Math.min(1, camera.aspect));
      // قابِ پهن (هیروی تمام‌عرض): صحنه به چپِ قاب می‌رود تا زیرِ متنِ وسط نیفتد
      const visibleW = 2 * camera.position.z * Math.tan((42 / 2) * (Math.PI / 180)) * camera.aspect;
      world.position.x = camera.aspect > 1.3 ? -visibleW * 0.3 : 0;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) renderer.render(scene, camera);
    });
    ro.observe(host);
    resize();

    // --- اشاره‌گر (پارالاکس)
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // --- حلقه
    let raf = 0;
    let running = false;
    let last = performance.now();
    let visible = true;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      world.rotation.y += (target.x * 0.5 - world.rotation.y) * 0.04 + dt * 0.08;
      world.rotation.x += (target.y * 0.3 - world.rotation.x) * 0.04;
      core.rotation.y += dt * 0.35;
      core.rotation.x += dt * 0.15;
      points.rotation.y -= dt * 0.02;
      rings.forEach((g, i) => (g.rotation.z += dt * (0.05 + i * 0.02)));

      sats.forEach((s, i) => {
        s.angle += dt * s.speed;
        const r = RADII[s.ring];
        s.mesh.position.set(Math.cos(s.angle) * r, Math.sin(s.angle) * r, 0);
        // موقعیتِ جهانیِ ماهواره برای خط (چون فرزندِ حلقه‌ی چرخان است)
        s.mesh.getWorldPosition(tmp);
        world.worldToLocal(tmp);
        linePos.set([0, 0, 0, tmp.x, tmp.y, tmp.z], i * 6);
      });
      lineGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(frame);
    };
    const tmp = core.position.clone();

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(host);
    document.addEventListener("visibilitychange", sync);

    if (reduced) frame(performance.now());
    else start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      disposables.forEach((d) => d.dispose());
      (scene as unknown as { clear(): void }).clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="hero-canvas" aria-hidden="true" />;
}

