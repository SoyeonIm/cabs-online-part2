/**
 * Student: hpr7339
 * File: BookingMap.jsx
 * Description: Feature 1 - Map-based taxi booking with styled Auckland map.
 *              Clean Uber-style map showing Auckland suburbs with zoom support.
 *              Submits booking to Part 1 PHP API via Fetch.
 */

import { useState, useRef } from "react";

/* Auckland suburbs with position percentages on the SVG canvas */
const SUBURBS = [
  { name: "Auckland CBD",  x: 52, y: 40, major: true  },
  { name: "Newmarket",     x: 56, y: 50, major: false },
  { name: "Parnell",       x: 60, y: 44, major: false },
  { name: "Ponsonby",      x: 44, y: 43, major: false },
  { name: "Remuera",       x: 61, y: 55, major: false },
  { name: "Mt Eden",       x: 49, y: 52, major: false },
  { name: "Grey Lynn",     x: 40, y: 48, major: false },
  { name: "Takapuna",      x: 54, y: 18, major: true  },
  { name: "Northcote",     x: 42, y: 27, major: false },
  { name: "Henderson",     x: 18, y: 54, major: true  },
  { name: "Manukau",       x: 64, y: 84, major: true  },
  { name: "Botany",        x: 75, y: 74, major: false },
  { name: "Papatoetoe",    x: 62, y: 78, major: false },
  { name: "Onehunga",      x: 50, y: 62, major: false },
  { name: "Mangere",       x: 50, y: 73, major: false },
];

/* Roads as SVG path data */
const ROADS = [
  "M 52,40 L 52,10",          // SH1 north
  "M 52,40 L 52,90",          // SH1 south
  "M 52,40 L 10,40",          // SH16 west
  "M 52,40 L 90,40",          // SH1 east
  "M 52,40 L 18,54",          // SH16 Henderson
  "M 52,40 L 42,27",          // Northcote link
  "M 52,40 L 64,84",          // SH1 Manukau
  "M 64,84 L 75,74",          // Botany link
  "M 52,40 L 50,62",          // Onehunga link
];

function getPadded(n) { return String(n).padStart(2,"0"); }

/**
 * AucklandMap({ pickup, destination, selectingDest, onSelect })
 * Clean SVG map of Auckland with zoom control.
 */
function AucklandMap({ pickup, destination, selectingDest, onSelect }) {
  const [zoom, setZoom] = useState(1);
  const [pan,  setPan]  = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos  = useRef({ x: 0, y: 0 });

  function onMouseDown(e) {
    dragging.current = true;
    lastPos.current  = { x: e.clientX, y: e.clientY };
  }
  function onMouseMove(e) {
    if (!dragging.current) return;
    setPan(p => ({
      x: p.x + (e.clientX - lastPos.current.x),
      y: p.y + (e.clientY - lastPos.current.y),
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }
  function onMouseUp() { dragging.current = false; }

  return (
    <div style={{ position:"relative" }}>

      {/* Map canvas */}
      <div
        style={{
          width:"100%", height:380,
          borderRadius:12,
          border:"1.5px solid #e2e8f0",
          overflow:"hidden",
          cursor: dragging.current ? "grabbing" : "grab",
          userSelect:"none",
          background:"#f8fafc",
          boxShadow:"0 4px 24px rgba(0,0,0,0.08)",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{
            transform:`scale(${zoom}) translate(${pan.x/10}px, ${pan.y/10}px)`,
            transformOrigin:"center",
            transition: dragging.current ? "none" : "transform 0.2s",
          }}
        >
          {/* Background */}
          <rect x="0" y="0" width="100" height="100" fill="#f0f4f8" />

          {/* Harbour / sea */}
          <path
            d="M 30,0 Q 50,15 70,5 L 90,22 Q 65,35 55,28 Q 45,22 28,32 Z"
            fill="#bfdbfe"
            opacity="0.7"
          />
          <text x="52" y="17" textAnchor="middle"
            fill="#3b82f6" fontSize="3.2" fontFamily="DM Sans" fontStyle="italic" opacity="0.8">
            Waitematā Harbour
          </text>

          {/* Manukau Harbour south */}
          <path
            d="M 20,80 Q 35,85 45,78 L 48,90 Q 32,95 18,88 Z"
            fill="#bfdbfe" opacity="0.5"
          />

          {/* Green land areas */}
          <ellipse cx="30" cy="60" rx="12" ry="8" fill="#d1fae5" opacity="0.5" />
          <ellipse cx="70" cy="65" rx="10" ry="6" fill="#d1fae5" opacity="0.5" />

          {/* Roads */}
          {ROADS.map((d, i) => (
            <path key={i} d={`M ${d.replace("M ","")}`}
              stroke="#cbd5e1" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          ))}

          {/* Motorways (thicker) */}
          <path d="M 52,40 L 52,10"  stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.6" />
          <path d="M 52,40 L 52,90"  stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.6" />
          <path d="M 52,40 L 18,54"  stroke="#fbbf24" strokeWidth="1.0" fill="none" opacity="0.5" />

          {/* Suburb areas (circles) */}
          {SUBURBS.map(s => {
            const isPickup = s.name === pickup;
            const isDest   = s.name === destination;
            const active   = isPickup || isDest;
            return (
              <circle key={s.name + "area"}
                cx={s.x} cy={s.y}
                r={s.major ? 5 : 3.5}
                fill={isPickup ? "rgba(245,197,24,0.15)"
                    : isDest   ? "rgba(22,163,74,0.15)"
                    : "rgba(255,255,255,0.5)"}
                stroke={isPickup ? "#f5c518"
                      : isDest   ? "#16a34a"
                      : "#e2e8f0"}
                strokeWidth={active ? 0.8 : 0.5}
              />
            );
          })}

          {/* Suburb labels + pins */}
          {SUBURBS.map(s => {
            const isPickup = s.name === pickup;
            const isDest   = s.name === destination;
            const active   = isPickup || isDest;

            return (
              <g key={s.name}
                onClick={e => { e.stopPropagation(); onSelect(s.name); }}
                style={{ cursor:"pointer" }}
              >
                {/* Pin dot */}
                <circle
                  cx={s.x} cy={s.y}
                  r={active ? 2.2 : s.major ? 1.5 : 1.1}
                  fill={isPickup ? "#f5c518"
                      : isDest   ? "#16a34a"
                      : s.major  ? "#64748b" : "#94a3b8"}
                  stroke="#fff"
                  strokeWidth={active ? 0.7 : 0.4}
                />

                {/* Active glow ring */}
                {active && (
                  <circle cx={s.x} cy={s.y} r="3.5"
                    fill="none"
                    stroke={isPickup ? "#f5c518" : "#16a34a"}
                    strokeWidth="0.6"
                    opacity="0.5"
                  />
                )}

                {/* Label */}
                <rect
                  x={s.x - s.name.length * 0.95}
                  y={s.y + 2.8}
                  width={s.name.length * 1.9}
                  height="3.2"
                  rx="0.8"
                  fill={isPickup ? "#f5c518"
                      : isDest   ? "#16a34a"
                      : "rgba(255,255,255,0.92)"}
                />
                <text
                  x={s.x} y={s.y + 5.2}
                  textAnchor="middle"
                  fontSize={active ? 2.4 : s.major ? 2.1 : 1.8}
                  fontFamily="DM Sans"
                  fontWeight={active || s.major ? "700" : "500"}
                  fill={isPickup ? "#000"
                      : isDest   ? "#fff"
                      : "#334155"}
                >
                  {s.name}
                </text>
              </g>
            );
          })}

          {/* Compass */}
          <g transform="translate(92, 8)">
            <circle cx="0" cy="0" r="3.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
            <text x="0" y="1.5" textAnchor="middle" fontSize="3"
              fontFamily="DM Sans" fontWeight="700" fill="#64748b">N</text>
          </g>
        </svg>
      </div>

      {/* Zoom controls */}
      <div style={{
        position:"absolute", bottom:16, left:16,
        display:"flex", flexDirection:"column", gap:4,
      }}>
        {[["＋", 0.3], ["－", -0.3]].map(([label, delta]) => (
          <button
            key={label}
            onClick={() => setZoom(z => Math.min(3, Math.max(0.8, z + delta)))}
            style={{
              width:32, height:32,
              background:"#fff",
              border:"1.5px solid #e2e8f0",
              borderRadius:6,
              cursor:"pointer",
              fontSize:18,
              fontWeight:700,
              color:"#334155",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
              lineHeight:1,
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => { setZoom(1); setPan({ x:0, y:0 }); }}
          style={{
            width:32, height:32, background:"#fff",
            border:"1.5px solid #e2e8f0", borderRadius:6,
            cursor:"pointer", fontSize:10, fontWeight:700,
            color:"#334155", display:"flex", alignItems:"center",
            justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          ⌂
        </button>
      </div>

      {/* Mode indicator */}
      <div style={{
        position:"absolute", top:12, left: "50%",
        transform:"translateX(-50%)",
        background: selectingDest ? "#16a34a" : "#f5c518",
        color: selectingDest ? "#fff" : "#000",
        borderRadius:20,
        padding:"5px 14px",
        fontSize:11,
        fontFamily:"DM Sans",
        fontWeight:700,
        boxShadow:"0 2px 12px rgba(0,0,0,0.15)",
        whiteSpace:"nowrap",
        pointerEvents:"none",
      }}>
        {selectingDest ? "🏁 Click suburb to set destination" : "📍 Click suburb to set pickup"}
      </div>
    </div>
  );
}

/**
 * BookingMap()
 * Main booking component with styled Auckland map.
 */
export default function BookingMap() {
  const now = new Date();

  const [form, setForm] = useState({
    cname:"", phone:"", unumber:"", snumber:"",
    stname:"", sbname:"", dsbname:"",
    date:`${now.getFullYear()}-${getPadded(now.getMonth()+1)}-${getPadded(now.getDate())}`,
    time:`${getPadded(now.getHours())}:${getPadded(now.getMinutes())}`,
  });

  const [selectingDest, setSelectingDest] = useState(false);
  const [status,        setStatus]        = useState(null);
  const [loading,       setLoading]       = useState(false);

  function handleSelect(name) {
    if (selectingDest) {
      setForm(f => ({ ...f, dsbname: name }));
      setSelectingDest(false);
    } else {
      setForm(f => ({ ...f, sbname: name }));
      setSelectingDest(true); // auto-switch to destination
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.cname.trim())  return setStatus({ type:"error", msg:"Customer name is required." });
    if (!/^\d{10,12}$/.test(form.phone.trim())) return setStatus({ type:"error", msg:"Phone must be 10–12 digits." });
    if (!form.snumber.trim()) return setStatus({ type:"error", msg:"Street number is required." });
    if (!form.stname.trim())  return setStatus({ type:"error", msg:"Street name is required." });

    const [h,m]    = form.time.split(":").map(Number);
    const [y,mo,d] = form.date.split("-").map(Number);
    if (new Date(y,mo-1,d,h,m) < new Date())
      return setStatus({ type:"error", msg:"Pickup time must not be in the past." });

    const [yr,mnth,dy] = form.date.split("-");
    const fd = new FormData();
    Object.entries({...form, date:`${dy}/${mnth}/${yr}`}).forEach(([k,v]) => fd.append(k,v));

    setLoading(true);
    try {
      const res  = await fetch("https://webdev.aut.ac.nz/~hpr7339/assign/booking.php",{ method:"POST", body:fd });
      const data = await res.json();
      if (data.success) {
        setStatus({ type:"success",
          msg:`✅ Booking confirmed!\nBooking reference number: ${data.brn}\nPickup time: ${data.time}\nPickup date: ${data.date}` });
        setForm(f => ({ ...f, cname:"", phone:"", snumber:"", stname:"" }));
      } else {
        setStatus({ type:"error", msg: data.message || "Booking failed." });
      }
    } catch {
      setStatus({ type:"error", msg:"Network error. Please try again." });
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h1 className="section-title">Book a Taxi</h1>
      <p className="section-subtitle">// click a suburb on the map to set your pickup and destination</p>

      <div className="grid-2" style={{ alignItems:"start" }}>

        {/* Map */}
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <button className={`btn btn-sm ${!selectingDest ? "btn-amber" : "btn-outline"}`}
              onClick={() => setSelectingDest(false)}>
              📍 Set Pickup
            </button>
            <button className={`btn btn-sm ${selectingDest ? "btn-green" : "btn-outline"}`}
              onClick={() => setSelectingDest(true)}>
              🏁 Set Destination
            </button>
          </div>

          <AucklandMap
            pickup={form.sbname}
            destination={form.dsbname}
            selectingDest={selectingDest}
            onSelect={handleSelect}
          />

          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            {form.sbname && (
              <div className="alert alert-info"
                style={{ flex:1, marginTop:0, padding:"8px 12px", fontSize:12 }}>
                📍 Pickup: <strong>{form.sbname}</strong>
              </div>
            )}
            {form.dsbname && (
              <div className="alert alert-success"
                style={{ flex:1, marginTop:0, padding:"8px 12px", fontSize:12 }}>
                🏁 Destination: <strong>{form.dsbname}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-title">Booking Details</div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="field">
                <label>Customer Name *</label>
                <input name="cname" value={form.cname} onChange={handleChange} placeholder="Jane Smith" />
              </div>
              <div className="field">
                <label>Phone * (10–12 digits)</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="0211234567" />
              </div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Unit No.</label>
                <input name="unumber" value={form.unumber} onChange={handleChange} placeholder="Optional" />
              </div>
              <div className="field">
                <label>Street No. *</label>
                <input name="snumber" value={form.snumber} onChange={handleChange} placeholder="55" />
              </div>
            </div>
            <div className="field">
              <label>Street Name *</label>
              <input name="stname" value={form.stname} onChange={handleChange} placeholder="Queen Street" />
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Pickup Suburb</label>
                <input name="sbname" value={form.sbname} onChange={handleChange} placeholder="Click map ↑" />
              </div>
              <div className="field">
                <label>Destination Suburb</label>
                <input name="dsbname" value={form.dsbname} onChange={handleChange} placeholder="Click map ↑" />
              </div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Pickup Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Pickup Time *</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-amber" disabled={loading}
              style={{ width:"100%", marginTop:4, padding:"12px", fontSize:14 }}>
              {loading ? "Booking..." : "Confirm Booking →"}
            </button>
          </form>
          {status && (
            <div className={`alert alert-${status.type==="success"?"success":"error"}`}
              style={{ whiteSpace:"pre-line" }}>
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
