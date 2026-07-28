import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const NODE_COUNT = 80;
const CONNECT_DIST = 120;

interface Zone {
  x: number; // 0-1 fraction of width
  y: number; // 0-1 fraction of height
  text: string;
}

const zones: Zone[] = [
  // 第1行
  { x: 0.07, y: 0.12, text: "村长" },
  { x: 0.2, y: 0.12, text: "CunLink" },
  { x: 0.33, y: 0.12, text: "CunMail" },
  { x: 0.47, y: 0.12, text: "AI" },
  { x: 0.6, y: 0.12, text: "OBS" },
  { x: 0.74, y: 0.12, text: "跨境" },
  { x: 0.88, y: 0.12, text: "Cloudflare" },
  // 第2行
  { x: 0.1, y: 0.28, text: "Vercel" },
  { x: 0.25, y: 0.28, text: "ClubSim" },
  { x: 0.4, y: 0.28, text: "Wise" },
  { x: 0.55, y: 0.28, text: "U卡" },
  { x: 0.7, y: 0.28, text: "VPN" },
  { x: 0.85, y: 0.28, text: "Skill" },
  // 第3行
  { x: 0.08, y: 0.44, text: "Geonix" },
  { x: 0.22, y: 0.44, text: "互联网" },
  { x: 0.36, y: 0.44, text: "eSIM" },
  { x: 0.5, y: 0.44, text: "Mineradio" },
  { x: 0.64, y: 0.44, text: "ESTK" },
  { x: 0.8, y: 0.44, text: "TRAE" },
  // 第4行
  { x: 0.12, y: 0.6, text: "ChatGPT" },
  { x: 0.28, y: 0.6, text: "DeepSeek" },
  { x: 0.44, y: 0.6, text: "Gemini" },
  { x: 0.6, y: 0.6, text: "Voyager" },
  { x: 0.76, y: 0.6, text: "BiliNote" },
  // 第5行
  { x: 0.08, y: 0.76, text: "PlainApp" },
  { x: 0.24, y: 0.76, text: "Codex" },
  { x: 0.4, y: 0.76, text: "Reclip" },
  { x: 0.56, y: 0.76, text: "Ollama" },
  { x: 0.72, y: 0.76, text: "Llama" },
  // 第6行
  { x: 0.15, y: 0.9, text: "Binance" },
  { x: 0.3, y: 0.9, text: "Rin" },
  { x: 0.45, y: 0.9, text: "Storage" },
  { x: 0.6, y: 0.9, text: "R2" },
  { x: 0.78, y: 0.9, text: "Recordly" },
];

const AINodeNetwork = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 800, h: 400 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    sizeRef.current = { w, h };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, w, 0, h, -1, 1);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle texture
    const tc = document.createElement("canvas");
    tc.width = 64; tc.height = 64;
    const tctx = tc.getContext("2d")!;
    const g = tctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.15, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    tctx.fillStyle = g;
    tctx.fillRect(0, 0, 64, 64);
    const particleTex = new THREE.CanvasTexture(tc);

    // Nodes
    const nodes: { pos: THREE.Vector3; vel: THREE.Vector3; basePos: THREE.Vector3; size: number; phase: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      nodes.push({
        pos: new THREE.Vector3(x, y, 0),
        vel: new THREE.Vector3(0, 0, 0),
        basePos: new THREE.Vector3(x, y, 0),
        size: 1.5 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Points
    const posArr = new Float32Array(NODE_COUNT * 3);
    const colArr = new Float32Array(NODE_COUNT * 3);
    const sizArr = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      posArr[i * 3] = nodes[i].pos.x;
      posArr[i * 3 + 1] = nodes[i].pos.y;
      sizArr[i] = nodes[i].size;
      const c = new THREE.Color().setHSL(0.58, 0.7, 0.5 + Math.random() * 0.3);
      colArr[i * 3] = c.r; colArr[i * 3 + 1] = c.g; colArr[i * 3 + 2] = c.b;
    }
    const ptGeom = new THREE.BufferGeometry();
    ptGeom.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    ptGeom.setAttribute("size", new THREE.BufferAttribute(sizArr, 1));
    ptGeom.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
    const ptMat = new THREE.PointsMaterial({
      size: 4, map: particleTex, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false,
      sizeAttenuation: true, vertexColors: true,
    });
    const points = new THREE.Points(ptGeom, ptMat);
    scene.add(points);

    // Lines
    const MAX_LINES = 300;
    const lPos = new Float32Array(MAX_LINES * 6);
    const lCol = new Float32Array(MAX_LINES * 6);
    const lGeom = new THREE.BufferGeometry();
    lGeom.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
    lGeom.setAttribute("color", new THREE.BufferAttribute(lCol, 3));
    const lMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const lines = new THREE.LineSegments(lGeom, lMat);
    scene.add(lines);

    // Pulse
    const pPos = new Float32Array(MAX_LINES * 6);
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.LineBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const pLine = new THREE.LineSegments(pGeom, pMat);
    scene.add(pLine);

    // Mouse
    const onMouse = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };
      setMousePos({ x: mx, y: my });
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      setMousePos({ x: -9999, y: -9999 });
    };
    renderer.domElement.addEventListener("mousemove", onMouse);
    renderer.domElement.addEventListener("mouseleave", onLeave);

    // Animation
    let conns: { a: number; b: number; alpha: number; pulse: number }[] = [];
    let pulseTimer = 0;

    function animate() {
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const mouseActive = mx > -1000;
      const now = Date.now();

      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        const dx = Math.sin(now * 0.0003 + n.phase) * 0.08;
        const dy = Math.cos(now * 0.0004 + n.phase * 1.3) * 0.08;

        if (mouseActive) {
          const mdx = mx - n.pos.x, mdy = my - n.pos.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 250) {
            const force = (1 - dist / 250) * 0.04;
            n.vel.x += mdx * force * 0.01;
            n.vel.y += mdy * force * 0.01;
          }
        }

        n.vel.x += (n.basePos.x - n.pos.x) * 0.001 + dx;
        n.vel.y += (n.basePos.y - n.pos.y) * 0.001 + dy;
        n.vel.x *= 0.98; n.vel.y *= 0.98;
        n.pos.x += n.vel.x; n.pos.y += n.vel.y;
        n.pos.x = Math.max(0, Math.min(w, n.pos.x));
        n.pos.y = Math.max(0, Math.min(h, n.pos.y));
      }

      const pa = ptGeom.attributes.position;
      for (let i = 0; i < NODE_COUNT; i++) {
        (pa.array as Float32Array)[i * 3] = nodes[i].pos.x;
        (pa.array as Float32Array)[i * 3 + 1] = nodes[i].pos.y;
      }
      pa.needsUpdate = true;

      conns = [];
      for (let i = 0; i < NODE_COUNT; i++)
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].pos.x - nodes[j].pos.x;
          const dy = nodes[i].pos.y - nodes[j].pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST)
            conns.push({ a: i, b: j, alpha: (1 - dist / CONNECT_DIST) * 0.4, pulse: 0 });
        }

      const showN = Math.min(conns.length, MAX_LINES);
      const lp = lGeom.attributes.position.array as Float32Array;
      const lc = lGeom.attributes.color.array as Float32Array;
      for (let i = 0; i < MAX_LINES; i++) {
        if (i < showN) {
          const c = conns[i];
          const na = nodes[c.a], nb = nodes[c.b];
          lp[i * 6] = na.pos.x; lp[i * 6 + 1] = na.pos.y; lp[i * 6 + 2] = 0;
          lp[i * 6 + 3] = nb.pos.x; lp[i * 6 + 4] = nb.pos.y; lp[i * 6 + 5] = 0;
          const a = c.alpha * 3;
          lc[i * 6] = 0.29 * a; lc[i * 6 + 1] = 0.62 * a; lc[i * 6 + 2] = a;
          lc[i * 6 + 3] = 0.29 * a; lc[i * 6 + 4] = 0.62 * a; lc[i * 6 + 5] = a;
        } else {
          for (let k = 0; k < 6; k++) { lp[i * 6 + k] = 0; lc[i * 6 + k] = 0; }
        }
      }
      lGeom.attributes.position.needsUpdate = true;
      lGeom.attributes.color.needsUpdate = true;
      lGeom.setDrawRange(0, showN * 2);

      pulseTimer += 0.008;
      if (pulseTimer > 1 && conns.length > 3) {
        pulseTimer = 0;
        const idx = Math.floor(Math.random() * Math.min(conns.length, MAX_LINES));
        if (conns[idx].pulse === 0) conns[idx].pulse = 0.001;
      }

      const pp = pGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < MAX_LINES; i++) for (let k = 0; k < 6; k++) pp[i * 6 + k] = 0;
      let activeP = 0;
      for (let i = 0; i < Math.min(conns.length, MAX_LINES); i++) {
        const c = conns[i];
        if (c.pulse > 0) {
          c.pulse += 0.025;
          if (c.pulse >= 1) { c.pulse = 0; continue; }
          const t = c.pulse;
          const na = nodes[c.a], nb = nodes[c.b];
          const px = na.pos.x + (nb.pos.x - na.pos.x) * t;
          const py = na.pos.y + (nb.pos.y - na.pos.y) * t;
          const glow = Math.sin(t * Math.PI) * 3;
          pp[i * 6] = px - glow; pp[i * 6 + 1] = py; pp[i * 6 + 2] = 0;
          pp[i * 6 + 3] = px + glow; pp[i * 6 + 4] = py; pp[i * 6 + 5] = 0;
          activeP++;
        }
      }
      pGeom.attributes.position.needsUpdate = true;
      pGeom.setDrawRange(0, activeP * 2);
      pMat.opacity = activeP > 0 ? 1 : 0;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    const animId = requestAnimationFrame(animate);

    const onResize = () => {
      const cw = container.clientWidth, ch = container.clientHeight;
      sizeRef.current = { w: cw, h: ch };
      renderer.setSize(cw, ch);
      camera.right = cw; camera.bottom = ch;
      camera.updateProjectionMatrix();
      for (const n of nodes) {
        n.basePos.x = Math.min(n.basePos.x, cw);
        n.basePos.y = Math.min(n.basePos.y, ch);
        n.pos.x = Math.min(n.pos.x, cw);
        n.pos.y = Math.min(n.pos.y, ch);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("mousemove", onMouse);
      renderer.domElement.removeEventListener("mouseleave", onLeave);
      renderer.dispose();
      ptGeom.dispose(); ptMat.dispose();
      lGeom.dispose(); lMat.dispose();
      pGeom.dispose(); pMat.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {zones.map((zone, i) => {
        const mx = mousePos.x, my = mousePos.y;
        const { w, h } = sizeRef.current;
        const zx = zone.x * w;
        const zy = zone.y * h;
        const dx = mx - zx;
        const dy = my - zy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // 距离越近越清晰，阈值更高（最大距离100px才开始显示）
        const maxDist = 100;
        const rawOpacity = mx > -1000 ? Math.max(0, 1 - dist / maxDist) : 0;
        // 门槛效果：小于0.3完全不显示，然后快速攀升
        const opacity = rawOpacity < 0.3 ? 0 : (rawOpacity - 0.3) / 0.7;
        // 从很小缩放到略大
        const scale = 0.2 + opacity * 0.75;

        return (
          <div
            key={i}
            className="pointer-events-none absolute"
            style={{
              left: `${zone.x * 100}%`,
              top: `${zone.y * 100}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              textShadow: opacity > 0.5
                ? `0 0 ${20 * opacity}px rgba(74,158,255,${0.5 * opacity}), 0 0 ${40 * opacity}px rgba(74,158,255,${0.2 * opacity})`
                : "none",
              color: "#e8e8e8",
              fontSize: "clamp(12px, 1.8vw, 22px)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              fontFamily: '"Montserrat Variable", system-ui, sans-serif',
              transition: "opacity 0.4s ease, transform 0.4s ease",
              zIndex: 10,
            }}
          >
            {zone.text}
          </div>
        );
      })}
    </div>
  );
};

export default AINodeNetwork;
