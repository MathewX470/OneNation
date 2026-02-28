import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Groq from "groq-sdk";

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

// ── Pulse ring animation injected once ──────────────────────────────────────
const STYLE_ID = "va-pulse-style";
if (!document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes va-ping { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.9);opacity:0} }
    @keyframes va-spin { to{transform:rotate(360deg)} }
    @keyframes va-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  `;
  document.head.appendChild(s);
}

// ── States ───────────────────────────────────────────────────────────────────
const S = { IDLE: "idle", LISTENING: "listening", PROCESSING: "processing", DONE: "done", ERROR: "error" };

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const [state, setState] = useState(S.IDLE);
  const [transcript, setTranscript] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const recognitionRef = useRef(null);

  // ── Speech Recognition setup ─────────────────────────────────────────────
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMsg("Speech recognition is not supported in this browser. Please use Chrome.");
      setState(S.ERROR);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    recognitionRef.current = rec;

    rec.onstart = () => {
      setState(S.LISTENING);
      setStatusMsg("Listening... describe your civic issue");
    };

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setState(S.PROCESSING);
      setStatusMsg("Analysing your report...");
      extractDetails(text);
    };

    rec.onerror = (e) => {
      setState(S.ERROR);
      setStatusMsg(`Microphone error: ${e.error}. Please try again.`);
    };

    rec.onend = () => {
      if (state === S.LISTENING) {
        setState(S.ERROR);
        setStatusMsg("No speech detected. Please try again.");
      }
    };

    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  // ── Claude API call ───────────────────────────────────────────────────────


const extractDetails = async (text) => {
  try {
    const groq = new Groq({ 
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true  // required for client-side use
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // free, very fast
      messages: [{
        role: "user",
        content: `You are a civic issue report assistant for a government platform in India.
Extract structured details from this spoken complaint and return ONLY valid JSON with no extra text:

Spoken complaint: "${text}"

Return JSON in this exact format:
{
  "subject": "concise title max 80 chars",
  "description": "detailed description in formal English",
  "urgency": "Low" or "Medium" or "High",
  "locationHint": "any location mentioned or empty string"
}`
      }],
      response_format: { type: "json_object" },  // forces clean JSON output
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    setState(S.DONE);
    setStatusMsg("Details extracted! Redirecting to report form...");

    setTimeout(() => {
      setShowPanel(false);
      setState(S.IDLE);
      setTranscript("");
      setStatusMsg("");
      navigate("/dashboard/report", {
        state: {
          prefill: {
            subject: parsed.subject || "",
            description: parsed.description || "",
            urgency: parsed.urgency || "Medium",
            locationHint: parsed.locationHint || "",
          },
        },
      });
    }, 1800);
  } catch (err) {
    console.error(err);
    setState(S.ERROR);
    setStatusMsg("Could not process your speech. Please try again or fill the form manually.");
  }
};

  // ── Cleanup on close ──────────────────────────────────────────────────────
  const handleClose = () => {
    recognitionRef.current?.stop();
    setShowPanel(false);
    setState(S.IDLE);
    setTranscript("");
    setStatusMsg("");
  };

  const handleMicClick = () => {
    if (state === S.LISTENING) {
      stopListening();
    } else if (state === S.IDLE || state === S.ERROR) {
      setTranscript("");
      setStatusMsg("");
      startListening();
    }
  };

  // ── Mic icon colours ──────────────────────────────────────────────────────
  const micColor = {
    [S.IDLE]: NAVY,
    [S.LISTENING]: "#DC2626",
    [S.PROCESSING]: GOLD,
    [S.DONE]: "#16a34a",
    [S.ERROR]: "#DC2626",
  }[state];

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setShowPanel(true)}
        title="Voice Report Assistant"
        style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "7px 14px", borderRadius: "8px",
          border: `1px solid rgba(184,151,46,0.35)`,
          backgroundColor: "rgba(184,151,46,0.08)",
          color: GOLD, cursor: "pointer",
          fontSize: "12px", fontFamily: "sans-serif", fontWeight: "600",
          letterSpacing: "0.04em", transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(184,151,46,0.18)"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(184,151,46,0.08)"; }}
      >
        <MicIcon size={14} color={GOLD} />
        Voice Report
      </button>

      {/* Overlay panel */}
      {showPanel && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(10,22,40,0.65)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "16px",
          animation: "va-fadein 0.25s ease",
        }}>
          <div style={{
            backgroundColor: "#FDFBF7",
            borderRadius: "20px",
            padding: "36px 32px",
            maxWidth: "480px", width: "100%",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
            border: "1px solid rgba(184,151,46,0.2)",
            position: "relative",
            animation: "va-fadein 0.3s ease",
          }}>
            {/* Gold top bar */}
            <div style={{ position: "absolute", top: 0, left: "32px", right: "32px", height: "3px", backgroundColor: GOLD, borderRadius: "0 0 3px 3px" }} />

            {/* Close */}
            <button
              onClick={handleClose}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#8A7E6E", fontSize: "18px", lineHeight: 1 }}
            >✕</button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: NAVY, fontFamily: "Georgia, serif", margin: "0 0 4px" }}>
                Voice Report Assistant
              </h2>
              <p style={{ fontSize: "12px", color: "#8A7E6E", fontFamily: "sans-serif", margin: 0 }}>
                Speak your complaint — we'll fill the form for you
              </p>
              <div style={{ width: "36px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", margin: "10px auto 0" }} />
            </div>

            {/* Mic button */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
              <div style={{ position: "relative" }}>
                {/* Pulse ring when listening */}
                {state === S.LISTENING && (
                  <div style={{
                    position: "absolute", inset: "-12px",
                    borderRadius: "50%",
                    border: "2px solid #DC2626",
                    animation: "va-ping 1.2s ease-out infinite",
                    pointerEvents: "none",
                  }} />
                )}
                <button
                  onClick={handleMicClick}
                  disabled={state === S.PROCESSING || state === S.DONE}
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    border: "none", cursor: state === S.PROCESSING || state === S.DONE ? "default" : "pointer",
                    backgroundColor: state === S.LISTENING ? "#FEF2F2" : state === S.DONE ? "#F0FDF4" : "#F7F5F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                    boxShadow: state === S.LISTENING ? "0 0 0 4px rgba(220,38,38,0.15)" : "0 4px 16px rgba(0,0,0,0.1)",
                  }}
                >
                  {state === S.PROCESSING ? (
                    <div style={{ width: "28px", height: "28px", border: `3px solid ${GOLD}`, borderTopColor: "transparent", borderRadius: "50%", animation: "va-spin 0.8s linear infinite" }} />
                  ) : state === S.DONE ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <MicIcon size={28} color={micColor} />
                  )}
                </button>
              </div>
            </div>

            {/* Instructions / status */}
            <div style={{ textAlign: "center", marginBottom: "20px", minHeight: "48px" }}>
              {state === S.IDLE && (
                <p style={{ fontSize: "13px", color: "#6B5E4E", fontFamily: "sans-serif", lineHeight: "1.6", margin: 0 }}>
                  Press the mic and describe your issue.<br />
                  <span style={{ color: "#A0927E", fontSize: "12px" }}>e.g. "There's a large pothole on MG Road near the bus stop, it's causing accidents"</span>
                </p>
              )}
              {state !== S.IDLE && (
                <p style={{
                  fontSize: "13px", fontFamily: "sans-serif", lineHeight: "1.6", margin: 0,
                  color: state === S.ERROR ? "#B91C1C" : state === S.DONE ? "#166534" : NAVY,
                  fontWeight: state === S.LISTENING ? "600" : "400",
                }}>
                  {statusMsg}
                </p>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div style={{
                backgroundColor: "#F7F5F0", border: "1px solid #E8E0D4",
                borderRadius: "10px", padding: "14px 16px",
                animation: "va-fadein 0.3s ease",
              }}>
                <p style={{ fontSize: "10px", fontWeight: "600", color: "#A0927E", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 6px", fontFamily: "sans-serif" }}>
                  You said
                </p>
                <p style={{ fontSize: "13px", color: NAVY, fontFamily: "sans-serif", margin: 0, lineHeight: "1.6" }}>
                  "{transcript}"
                </p>
              </div>
            )}

            {/* Retry button on error */}
            {state === S.ERROR && (
              <button
                onClick={handleMicClick}
                style={{
                  width: "100%", marginTop: "16px", padding: "11px", borderRadius: "10px",
                  border: "none", cursor: "pointer", backgroundColor: NAVY, color: "#fff",
                  fontSize: "14px", fontWeight: "600", fontFamily: "sans-serif",
                }}
              >
                Try Again
              </button>
            )}

            {/* Manual fallback */}
            <p style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "#A0927E", fontFamily: "sans-serif" }}>
              Prefer typing?{" "}
              <button
                onClick={() => { handleClose(); navigate("/dashboard/report"); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: "11px", fontFamily: "sans-serif", fontWeight: "600", padding: 0 }}
              >
                Fill form manually
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Inline mic SVG icon ───────────────────────────────────────────────────────
function MicIcon({ size = 20, color = NAVY }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}