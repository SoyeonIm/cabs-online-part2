/**
 * Student: hpr7339
 * File: Payment.jsx
 * Description: Feature 4 - Payment processing service.
 *              Allows customers to calculate fare estimates based on
 *              distance between Auckland suburbs, enter card details,
 *              and process a simulated payment for their booking.
 *              Note: All payment processing is simulated (no real charges).
 */

import { useState } from "react";

// Fare calculation constants
const BASE_FARE    = 3.50;
const PER_KM_RATE  = 2.20;
const BOOKING_FEE  = 1.50;

// Approximate distances between Auckland suburbs (km)
const DISTANCES = {
  "Auckland CBD":  { "Ponsonby":3, "Newmarket":3, "Parnell":2, "Remuera":5, "Takapuna":8, "Northcote":9, "Henderson":18, "Manukau":22, "Botany":25 },
  "Ponsonby":      { "Auckland CBD":3, "Newmarket":4, "Takapuna":10, "Henderson":15, "Northcote":10 },
  "Newmarket":     { "Auckland CBD":3, "Remuera":3, "Parnell":2, "Manukau":18, "Botany":20 },
  "Takapuna":      { "Auckland CBD":8, "Northcote":4, "Ponsonby":10 },
  "Manukau":       { "Auckland CBD":22, "Botany":8, "Papatoetoe":6 },
  "Henderson":     { "Auckland CBD":18, "Ponsonby":15 },
  "Botany":        { "Auckland CBD":25, "Manukau":8, "Papatoetoe":10 },
};

const SUBURBS = [
  "Auckland CBD", "Ponsonby", "Newmarket", "Parnell", "Remuera",
  "Takapuna", "Northcote", "Henderson", "Manukau", "Botany", "Papatoetoe",
];

/**
 * getDistance(from, to)
 * Returns estimated km distance between two suburbs. Returns 10km as default.
 * @param {string} from - Pickup suburb.
 * @param {string} to   - Destination suburb.
 * @returns {number} Distance in km.
 */
function getDistance(from, to) {
  if (from === to) return 0;
  return DISTANCES[from]?.[to] || DISTANCES[to]?.[from] || 10;
}

/**
 * calcFare(from, to)
 * Calculates the fare estimate for a trip.
 * @param {string} from
 * @param {string} to
 * @returns {{ distance, subtotal, gst, total }}
 */
function calcFare(from, to) {
  const km       = getDistance(from, to);
  const subtotal = BASE_FARE + (km * PER_KM_RATE) + BOOKING_FEE;
  const gst      = subtotal * 0.15;
  const total    = subtotal + gst;
  return { distance: km, subtotal: subtotal.toFixed(2), gst: gst.toFixed(2), total: total.toFixed(2) };
}

/**
 * formatCard(val)
 * Formats a card number string with spaces every 4 digits.
 * @param {string} val
 * @returns {string}
 */
function formatCard(val) {
  return val.replace(/\D/g,"").substring(0,16).replace(/(.{4})/g,"$1 ").trim();
}

/**
 * formatExpiry(val)
 * Formats expiry as MM/YY.
 * @param {string} val
 * @returns {string}
 */
function formatExpiry(val) {
  const clean = val.replace(/\D/g,"").substring(0,4);
  return clean.length > 2 ? `${clean.substring(0,2)}/${clean.substring(2)}` : clean;
}

/**
 * Payment()
 * Main component for Feature 4 – Payment Processing.
 * Shows fare calculator, card input form, and simulated payment result.
 * @returns {JSX.Element}
 */
export default function Payment() {
  const [from,     setFrom]     = useState("Auckland CBD");
  const [to,       setTo]       = useState("Newmarket");
  const [brn,      setBrn]      = useState("");
  const [card,     setCard]     = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [step,     setStep]     = useState("form"); // "form" | "processing" | "success" | "error"
  const [errMsg,   setErrMsg]   = useState("");

  const fare = calcFare(from, to);

  /**
   * handleCardChange(e)
   * Handles card input with formatting for number and expiry fields.
   * @param {Event} e
   */
  function handleCardChange(e) {
    const { name, value } = e.target;
    setCard(c => ({
      ...c,
      [name]: name === "number"  ? formatCard(value)
             : name === "expiry" ? formatExpiry(value)
             : name === "cvv"    ? value.replace(/\D/g,"").substring(0,4)
             : value,
    }));
  }

  /**
   * handlePay()
   * Validates payment form and simulates payment processing.
   */
  function handlePay() {
    setErrMsg("");
    if (!brn.trim())  return setErrMsg("Please enter a booking reference number.");
    if (!/^BRN\d{5}$/.test(brn.trim())) return setErrMsg("Invalid BRN format. Use BRN00001.");
    if (card.number.replace(/\s/g,"").length < 16) return setErrMsg("Please enter a valid 16-digit card number.");
    if (!card.name.trim())   return setErrMsg("Cardholder name is required.");
    if (card.expiry.length < 5) return setErrMsg("Please enter a valid expiry date (MM/YY).");
    if (card.cvv.length < 3) return setErrMsg("CVV must be 3 or 4 digits.");

    setStep("processing");
    setTimeout(() => {
      // 90% success simulation
      if (Math.random() > 0.1) setStep("success");
      else { setStep("error"); setErrMsg("Payment declined. Please try a different card."); }
    }, 2200);
  }

  if (step === "processing") {
    return (
      <div style={{ textAlign:"center", padding:"80px 0" }}>
        <div style={{
          width:60, height:60, borderRadius:"50%",
          border:"3px solid var(--border)", borderTopColor:"var(--yellow)",
          margin:"0 auto 24px", animation:"spin 1s linear infinite",
        }} />
        <div style={{ fontFamily:"Bebas Neue", fontSize:32, letterSpacing:2, marginBottom:8 }}>
          PROCESSING PAYMENT
        </div>
        <div style={{ fontFamily:"IBM Plex Mono", fontSize:11, color:"var(--text-dim)" }}>
          Please do not close this window...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={{ textAlign:"center", padding:"60px 0" }}>
        <div style={{
          width:72, height:72, borderRadius:"50%",
          background:"rgba(16,185,129,0.15)",
          border:"2px solid var(--green)",
          margin:"0 auto 24px",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:32,
        }}>✓</div>
        <h1 className="section-title" style={{ color:"var(--green)", marginBottom:8 }}>PAYMENT SUCCESSFUL</h1>
        <div style={{ fontFamily:"IBM Plex Mono", fontSize:13, color:"var(--text-dim)", marginBottom:32 }}>
          Booking {brn} · NZD ${fare.total} charged
        </div>
        <div style={{
          background:"var(--bg-2)", border:"1px solid var(--border)",
          borderRadius:10, padding:24, maxWidth:400, margin:"0 auto 24px", textAlign:"left",
        }}>
          {[
            ["Booking Reference", brn],
            ["From",              from],
            ["To",                to],
            ["Distance",          `${fare.distance} km`],
            ["Subtotal",          `NZD $${fare.subtotal}`],
            ["GST (15%)",         `NZD $${fare.gst}`],
            ["Total Charged",     `NZD $${fare.total}`],
          ].map(([label, val]) => (
            <div key={label} style={{
              display:"flex", justifyContent:"space-between",
              padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:12,
            }}>
              <span style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"var(--text-dim)", textTransform:"uppercase" }}>{label}</span>
              <span style={{ fontFamily:"IBM Plex Mono", color: label === "Total Charged" ? "var(--green)" : "var(--text)", fontWeight: label === "Total Charged" ? 600 : 400 }}>{val}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-outline" onClick={() => { setStep("form"); setBrn(""); setCard({number:"",name:"",expiry:"",cvv:""}); }}>
          New Payment
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">PAYMENT</h1>
      <p className="section-subtitle">// fare estimate & secure payment processing</p>

      <div className="grid-2" style={{ alignItems:"start" }}>

        {/* Fare calculator */}
        <div className="card">
          <div className="card-title">Fare Calculator</div>

          <div className="field">
            <label>From (Pickup Suburb)</label>
            <select value={from} onChange={e => setFrom(e.target.value)}>
              {SUBURBS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>To (Destination Suburb)</label>
            <select value={to} onChange={e => setTo(e.target.value)}>
              {SUBURBS.filter(s => s !== from).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <hr />

          {/* Fare breakdown */}
          <div>
            {[
              ["Base Fare",     `$${BASE_FARE.toFixed(2)}`],
              ["Distance",      `${fare.distance} km × $${PER_KM_RATE.toFixed(2)}`],
              ["Booking Fee",   `$${BOOKING_FEE.toFixed(2)}`],
              ["Subtotal",      `$${fare.subtotal}`],
              ["GST (15%)",     `$${fare.gst}`],
            ].map(([label, val]) => (
              <div key={label} style={{
                display:"flex", justifyContent:"space-between",
                padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:12,
              }}>
                <span style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"var(--text-dim)", textTransform:"uppercase" }}>{label}</span>
                <span style={{ fontFamily:"IBM Plex Mono", color:"var(--text)" }}>{val}</span>
              </div>
            ))}
            <div style={{
              display:"flex", justifyContent:"space-between",
              padding:"12px 0", fontSize:14, fontWeight:700,
            }}>
              <span style={{ fontFamily:"IBM Plex Mono", color:"var(--yellow)", textTransform:"uppercase", fontSize:11 }}>
                Total (NZD)
              </span>
              <span style={{ fontFamily:"Bebas Neue", fontSize:28, color:"var(--yellow)", letterSpacing:1 }}>
                ${fare.total}
              </span>
            </div>
          </div>
        </div>

        {/* Payment form */}
        <div className="card">
          <div className="card-title">Payment Details</div>

          <div className="field">
            <label>Booking Reference Number</label>
            <input
              value={brn}
              onChange={e => setBrn(e.target.value.toUpperCase())}
              placeholder="e.g. BRN00001"
            />
          </div>

          <hr />

          {/* Card visual */}
          <div style={{
            background:"linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            border:"1px solid var(--border)", borderRadius:12,
            padding:"20px 24px", marginBottom:20,
            fontFamily:"IBM Plex Mono", position:"relative", overflow:"hidden",
          }}>
            <div style={{
              position:"absolute", top:-20, right:-20, width:120, height:120,
              borderRadius:"50%", background:"rgba(245,197,24,0.05)",
              border:"1px solid rgba(245,197,24,0.1)",
            }} />
            <div style={{ fontSize:11, color:"var(--text-dim)", marginBottom:16 }}>CABSONLINE PAYMENT</div>
            <div style={{ fontSize:16, letterSpacing:3, color:"var(--text)", marginBottom:16 }}>
              {card.number || "•••• •••• •••• ••••"}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
              <span style={{ color:"var(--text-dim)" }}>
                {card.name.toUpperCase() || "CARDHOLDER NAME"}
              </span>
              <span style={{ color:"var(--text-dim)" }}>
                {card.expiry || "MM/YY"}
              </span>
            </div>
          </div>

          <div className="field">
            <label>Card Number</label>
            <input name="number" value={card.number} onChange={handleCardChange}
              placeholder="1234 5678 9012 3456" maxLength={19} />
          </div>
          <div className="field">
            <label>Cardholder Name</label>
            <input name="name" value={card.name} onChange={handleCardChange}
              placeholder="Jane Smith" />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Expiry Date</label>
              <input name="expiry" value={card.expiry} onChange={handleCardChange}
                placeholder="MM/YY" maxLength={5} />
            </div>
            <div className="field">
              <label>CVV</label>
              <input name="cvv" value={card.cvv} onChange={handleCardChange}
                placeholder="123" maxLength={4} type="password" />
            </div>
          </div>

          {errMsg && <div className="alert alert-error">{errMsg}</div>}

          <button
            className="btn btn-amber"
            onClick={handlePay}
            style={{ width:"100%", marginTop:8, padding:"12px 20px", fontSize:13 }}
          >
            Pay NZD ${fare.total} →
          </button>

          <div style={{
            marginTop:12, textAlign:"center",
            fontFamily:"IBM Plex Mono", fontSize:10, color:"var(--text-dim)",
          }}>
            🔒 Simulated payment — no real charges will be made
          </div>
        </div>
      </div>
    </div>
  );
}
