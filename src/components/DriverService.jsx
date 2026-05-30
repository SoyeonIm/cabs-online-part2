/**
 * Student: hpr7339
 * File: DriverService.jsx
 * Description: Feature 2 - Driver querying service.
 *              Displays a list of available drivers with their status,
 *              allows searching by driver ID or name, and lets admin
 *              assign a driver to a pending booking reference number.
 */

import { useState } from "react";

// Mock driver data representing the CabsOnline driver fleet
const DRIVERS = [
  { id: "DRV001", name: "Mike Johnson",   vehicle: "Toyota Camry",    plate: "ABC-1234", status: "available", area: "Auckland CBD",  rating: 4.8, trips: 342 },
  { id: "DRV002", name: "Sarah Lee",      vehicle: "Honda Accord",    plate: "DEF-5678", status: "on-trip",   area: "Ponsonby",      rating: 4.9, trips: 518 },
  { id: "DRV003", name: "James Patel",    vehicle: "Ford Mondeo",     plate: "GHI-9012", status: "available", area: "Newmarket",     rating: 4.7, trips: 201 },
  { id: "DRV004", name: "Lily Zhang",     vehicle: "Hyundai Sonata",  plate: "JKL-3456", status: "offline",   area: "Takapuna",      rating: 4.6, trips: 156 },
  { id: "DRV005", name: "Tom Williams",   vehicle: "Kia Optima",      plate: "MNO-7890", status: "available", area: "Henderson",     rating: 4.5, trips: 289 },
  { id: "DRV006", name: "Ana Fernandez",  vehicle: "Mazda 6",         plate: "PQR-1234", status: "on-trip",   area: "Remuera",       rating: 4.9, trips: 671 },
  { id: "DRV007", name: "David Kim",      vehicle: "Nissan Altima",   plate: "STU-5678", status: "available", area: "Manukau",       rating: 4.7, trips: 423 },
  { id: "DRV008", name: "Emma Brown",     vehicle: "Subaru Legacy",   plate: "VWX-9012", status: "offline",   area: "Botany",        rating: 4.4, trips: 98  },
];

/**
 * statusBadge(status)
 * Returns JSX badge for a driver's current status.
 * @param {string} status - "available" | "on-trip" | "offline"
 * @returns {JSX.Element}
 */
function statusBadge(status) {
  const map = {
    "available": <span className="badge badge-green">Available</span>,
    "on-trip":   <span className="badge badge-amber">On Trip</span>,
    "offline":   <span className="badge badge-red">Offline</span>,
  };
  return map[status] || <span className="badge">{status}</span>;
}

/**
 * DriverService()
 * Main component for Feature 2 – Driver Querying Service.
 * Provides search/filter, driver stats, and a booking assignment form.
 * @returns {JSX.Element}
 */
export default function DriverService() {
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [selected,  setSelected]  = useState(null);
  const [brn,       setBrn]       = useState("");
  const [assignMsg, setAssignMsg] = useState(null);

  // Stats
  const available = DRIVERS.filter(d => d.status === "available").length;
  const onTrip    = DRIVERS.filter(d => d.status === "on-trip").length;
  const offline   = DRIVERS.filter(d => d.status === "offline").length;

  // Filter drivers
  const filtered = DRIVERS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.id.toLowerCase().includes(search.toLowerCase()) ||
                        d.area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "all" || d.status === filter;
    return matchSearch && matchStatus;
  });

  /**
   * handleAssign()
   * Simulates assigning a selected driver to a booking reference number.
   * In production this would call the Part 1 admin.php assign endpoint.
   */
  function handleAssign() {
    if (!selected) return setAssignMsg({ type:"error", msg:"Please select a driver." });
    if (!brn.trim()) return setAssignMsg({ type:"error", msg:"Please enter a booking reference number." });
    if (!/^BRN\d{5}$/.test(brn.trim())) return setAssignMsg({ type:"error", msg:"Invalid BRN format. Use BRN00001." });
    if (selected.status !== "available") return setAssignMsg({ type:"error", msg:`${selected.name} is not available.` });

    setAssignMsg({
      type: "success",
      msg:  `✅ Driver ${selected.name} (${selected.id}) assigned to booking ${brn}!`,
    });
    setBrn("");
  }

  return (
    <div>
      <h1 className="section-title">DRIVER SERVICE</h1>
      <p className="section-subtitle">// query available drivers and assign them to bookings</p>

      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">Available</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>{available}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">On Trip</div>
          <div className="stat-value" style={{ color: "var(--yellow)" }}>{onTrip}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Offline</div>
          <div className="stat-value" style={{ color: "var(--text-dim)" }}>{offline}</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: "start", gap: 24 }}>

        {/* Driver list */}
        <div className="card">
          <div className="card-title">Driver Fleet</div>

          {/* Search + filter */}
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <input
              style={{
                flex:1, background:"var(--bg-3)", border:"1px solid var(--border)",
                borderRadius:6, color:"var(--text)", fontFamily:"IBM Plex Mono",
                fontSize:12, padding:"7px 12px", outline:"none",
              }}
              placeholder="Search by name, ID or area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                background:"var(--bg-3)", border:"1px solid var(--border)",
                borderRadius:6, color:"var(--text)", fontFamily:"IBM Plex Mono",
                fontSize:11, padding:"7px 10px", outline:"none",
              }}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="on-trip">On Trip</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Driver</th>
                  <th>Area</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(driver => (
                  <tr key={driver.id}
                    style={{ background: selected?.id === driver.id ? "rgba(245,197,24,0.05)" : "" }}
                  >
                    <td style={{ fontFamily:"var(--mono)", fontSize:11 }}>{driver.id}</td>
                    <td>
                      <div style={{ color:"var(--text)", fontWeight:500 }}>{driver.name}</div>
                      <div style={{ fontSize:10, color:"var(--text-dim)", marginTop:2 }}>
                        {driver.vehicle} · {driver.plate}
                      </div>
                    </td>
                    <td style={{ fontSize:11 }}>{driver.area}</td>
                    <td>
                      <span style={{ color:"var(--yellow)", fontFamily:"var(--mono)", fontSize:11 }}>
                        ★ {driver.rating}
                      </span>
                      <span style={{ fontSize:10, color:"var(--text-dim)", marginLeft:4 }}>
                        ({driver.trips})
                      </span>
                    </td>
                    <td>{statusBadge(driver.status)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => { setSelected(driver); setAssignMsg(null); }}
                        disabled={driver.status !== "available"}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign:"center", padding:24, color:"var(--text-dim)" }}>
                    No drivers found.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign panel */}
        <div className="card">
          <div className="card-title">Assign Driver to Booking</div>

          {selected ? (
            <div style={{
              background:"var(--bg-3)", border:"1px solid rgba(245,197,24,0.3)",
              borderRadius:6, padding:14, marginBottom:18,
            }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--yellow)", marginBottom:6 }}>
                SELECTED DRIVER
              </div>
              <div style={{ fontWeight:600, color:"var(--text)", fontSize:14 }}>{selected.name}</div>
              <div style={{ fontSize:11, color:"var(--text-dim)", marginTop:4 }}>
                {selected.id} · {selected.vehicle} · {selected.area}
              </div>
              <div style={{ marginTop:8 }}>{statusBadge(selected.status)}</div>
            </div>
          ) : (
            <div className="alert alert-info" style={{ marginBottom:18 }}>
              ← Select an available driver from the list
            </div>
          )}

          <div className="field">
            <label>Booking Reference Number</label>
            <input
              value={brn}
              onChange={e => setBrn(e.target.value.toUpperCase())}
              placeholder="e.g. BRN00001"
            />
          </div>

          <button
            className="btn btn-amber"
            onClick={handleAssign}
            style={{ width:"100%" }}
            disabled={!selected || selected.status !== "available"}
          >
            Assign Driver →
          </button>

          {assignMsg && (
            <div className={`alert alert-${assignMsg.type === "success" ? "success" : "error"}`}>
              {assignMsg.msg}
            </div>
          )}

          <hr />

          {/* Driver detail if selected */}
          {selected && (
            <div>
              <div className="card-title">Driver Profile</div>
              {[
                ["Driver ID",    selected.id],
                ["Vehicle",      selected.vehicle],
                ["Plate",        selected.plate],
                ["Current Area", selected.area],
                ["Rating",       `★ ${selected.rating}`],
                ["Total Trips",  selected.trips],
              ].map(([label, val]) => (
                <div key={label} style={{
                  display:"flex", justifyContent:"space-between",
                  padding:"7px 0", borderBottom:"1px solid var(--border)",
                  fontSize:12,
                }}>
                  <span style={{ color:"var(--text-dim)", fontFamily:"var(--mono)", fontSize:10 }}>
                    {label.toUpperCase()}
                  </span>
                  <span style={{ color:"var(--text)", fontFamily:"var(--mono)" }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
