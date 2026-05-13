import { useState, useEffect, useRef } from "react";
import "./SpinWheel.css";

const SEGS = [
  { label: "10% OFF",   code: "SNOW10",   col: "#5DCAA5" },
  { label: "15% OFF",   code: "SNOW15",   col: "#85B7EB" },
  { label: "FREE ITEM", code: "SNOWFREE", col: "#e24b4a" },
  { label: "20% OFF",   code: "SNOW20",   col: "#7F77DD" },
  { label: "FREE SHIP", code: "SNOWSHIP", col: "#378ADD" },
  { label: "5% OFF",    code: "SNOW5",    col: "#97C459" },
  { label: "TRY AGAIN", code: "",         col: "#B4B2A9" },
  { label: "25% OFF",   code: "SNOW25",   col: "#EF9F27" },
];

const N = SEGS.length;
const ARC = (Math.PI * 2) / N;

function drawWheel(canvas, angle) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const cx = 115, cy = 115, r = 112;
  ctx.clearRect(0, 0, 230, 230);

  SEGS.forEach((s, i) => {
    const st = angle + i * ARC;
    const en = st + ARC;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, st, en);
    ctx.closePath();
    ctx.fillStyle = s.col;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(st + ARC / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10.5px Jost, sans-serif";
    ctx.fillText(s.label, r - 10, 4);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 13, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export default function SpinWheel() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [igChecked, setIgChecked] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null); // null | { label, code }

  const canvasRef = useRef(null);
  const angleRef = useRef(0);

  // Draw wheel on mount and when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => drawWheel(canvasRef.current, angleRef.current), 50);
    }
  }, [open]);

  function trySpin() {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    if (!igChecked) {
      alert("Please follow us on Instagram first!");
      return;
    }
    if (spinning) return;

    // ── تحقق من الإيميل المكرر ──
    const usedEmails = JSON.parse(localStorage.getItem("sw_used_emails") || "[]");
    if (usedEmails.includes(email.toLowerCase())) {
      alert("This email has already been used! Each email can only spin once.");
      return;
    }

    setSpinning(true);

    const spins = 5 + Math.random() * 5;
    const tSeg = Math.floor(Math.random() * N);
    const tAngle = spins * Math.PI * 2 + (Math.PI * 2 - (tSeg * ARC + ARC / 2));
    const s0 = angleRef.current;
    const t0 = performance.now();
    const dur = 4800;

    function step(now) {
      const t = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      angleRef.current = s0 + tAngle * ease;
      drawWheel(canvasRef.current, angleRef.current);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // ── احفظ الإيميل بعد ما العجلة تخلص ──
        const updated = [...usedEmails, email.toLowerCase()];
        localStorage.setItem("sw_used_emails", JSON.stringify(updated));

        setSpinning(false);
        setResult(SEGS[tSeg]);
      }
    }
    requestAnimationFrame(step);
  }

  function reset() {
    setResult(null);
    setEmail("");
    setIgChecked(false);
    setSpinning(false);
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        className="sw-fab"
        onClick={() => setOpen(true)}
        aria-label="Spin & Win"
      >
        <span className="sw-fab-icon">🎡</span>
        <span className="sw-fab-label">Spin &amp; Win</span>
      </button>

      {/* ── Overlay + Modal ── */}
      {open && (
        <div className="sw-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="sw-modal">
            {/* Close */}
            <button className="sw-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

            {/* Snowflakes (decorative) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="sw-flake"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${10 + Math.random() * 12}px`,
                  animationDuration: `${6 + Math.random() * 8}s`,
                  animationDelay: `${-Math.random() * 8}s`,
                }}
              >❄</span>
            ))}

            <div className="sw-badge">❄ Limited Offer</div>
            <h2 className="sw-title">Spin &amp; Win</h2>
            <p className="sw-sub">
              Register your email &amp; follow us on Instagram
              <br />to unlock your reward
            </p>

            {/* Wheel */}
            <div className="sw-wheel-wrap">
              <div className="sw-pointer" />
              <canvas ref={canvasRef} width={230} height={230} />
            </div>

            {/* Form or Result */}
            {!result ? (
              <div className="sw-form-area">
                <input
                  className="sw-input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="sw-check-row">
                  <input
                    type="checkbox"
                    id="ig-check"
                    checked={igChecked}
                    onChange={(e) => setIgChecked(e.target.checked)}
                  />
                  <label htmlFor="ig-check">
                    I follow{" "}
                    <a
                      href="https://www.instagram.com/snow.eg1?igsh=MWtwcmF2ejF5aTc5cg=="
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#185FA5", fontWeight: 500 }}
                    >
                      @snow.eg
                    </a>{" "}
                    on Instagram ✓
                  </label>
                </div>
                <button
                  className="sw-btn"
                  onClick={trySpin}
                  disabled={spinning}
                >
                  {spinning ? "Spinning…" : "Spin the wheel"}
                </button>
              </div>
            ) : (
              <div className="sw-result">
                <p className="sw-prize-label">🎉 You won: {result.label}</p>
                <div className="sw-divider" />
                <p className="sw-prize-code">
                  {result.code ? (
                    <>Your code: <span>{result.code}</span></>
                  ) : (
                    "Better luck next time — try again!"
                  )}
                </p>
                <button className="sw-btn" onClick={reset}>Spin Again</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
