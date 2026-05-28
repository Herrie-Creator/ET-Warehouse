import { useState, useEffect } from "react";

const CAT_COLORS = { Audio:"#3b82f6", Lighting:"#f59e0b", AV:"#8b5cf6", Rigging:"#10b981", Staging:"#ef4444" };
const ST_COLORS  = { planning:"#6b7280", confirmed:"#3b82f6", active:"#10b981", completed:"#4b5563", cancelled:"#ef4444" };

function read(key, fallback) {
  try {
    const s = localStorage.getItem("et_" + key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function Badge({ label, color }) {
  const txt = label === "partially_returned" ? "part. returned" : label;
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {txt}
    </span>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ flex: 1, minWidth: 150, background: "#161b27", border: "1px solid #2a2a3a", borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 900, color, fontFamily: "monospace", lineHeight: 1 }}>{value}</div>
      <div style={{ color: "#4b5563", fontSize: 13, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

export default function WarehouseDisplay() {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  function loadData() {
    const units       = read("units",       []);
    const equipTypes  = read("equipTypes",  []);
    const projects    = read("projects",    []);
    const quotes      = read("quotes",      []);
    const faultReports= read("faultReports",[]);
    setData({ units, equipTypes, projects, quotes, faultReports });
    setLastUpdated(new Date());
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Also refresh when localStorage changes from another tab
  useEffect(() => {
    const handler = () => loadData();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#6b7280", fontSize: 18 }}>Loading…</div>
      </div>
    );
  }

  const { units, equipTypes, projects, quotes, faultReports } = data;

  const totalUnits = units.length;
  const outUnits   = units.filter(u => u.status === "out").length;
  const maintUnits = units.filter(u => u.status === "maintenance").length;
  const availUnits = units.filter(u => u.status === "available").length;

  const upcoming = [...projects]
    .filter(p => p.status !== "completed" && p.status !== "cancelled")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6);

  const today = new Date().toISOString().split("T")[0];
  const overdue  = quotes.filter(q => (q.status === "out" || q.status === "partially_returned") && q.endDate < today);
  const dueSoon  = quotes.filter(q => (q.status === "out" || q.status === "partially_returned") && q.endDate >= today && q.endDate <= new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]);
  const openFaults = faultReports.filter(f => f.status === "open" || f.status === "acknowledged").length;

  const activeQuotes = quotes.filter(q => q.status === "out" || q.status === "partially_returned");

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#e5e7eb", padding: "28px 32px", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: 0 }}>Operations Overview</h1>
            <div style={{ background: "#ff8c0022", border: "1px solid #ff8c0044", borderRadius: 8, padding: "3px 12px", fontSize: 12, color: "#ff8c00", fontWeight: 700 }}>WAREHOUSE DISPLAY</div>
          </div>
          <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4, marginLeft: 24 }}>Eventech Warehouse Management · Live View</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>
            {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div style={{ color: "#4b5563", fontSize: 12, marginTop: 2 }}>
            Updated {lastUpdated?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {overdue.length > 0 && (
        <div style={{ background: "#1a0808", border: "2px solid #ef4444", borderRadius: 12, padding: "12px 18px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#ef4444", fontWeight: 800, fontSize: 15 }}>🚨 {overdue.length} Overdue Quote{overdue.length !== 1 ? "s" : ""}</div>
            <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{overdue.map(q => q.id).join(", ")} — equipment not returned</div>
          </div>
          <Badge label="Action Required" color="#ef4444" />
        </div>
      )}
      {dueSoon.length > 0 && (
        <div style={{ background: "#1a1200", border: "1px solid #f59e0b44", borderRadius: 12, padding: "12px 18px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>⚠️ {dueSoon.length} Quote{dueSoon.length !== 1 ? "s" : ""} Due in 48 Hours</div>
            <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{dueSoon.map(q => `${q.id} (${q.endDate})`).join(", ")}</div>
          </div>
          <Badge label="Due Soon" color="#f59e0b" />
        </div>
      )}
      {openFaults > 0 && (
        <div style={{ background: "#1a0808", border: "1px solid #ef444433", borderRadius: 12, padding: "12px 18px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 14 }}>🔧 {openFaults} Open Fault Report{openFaults !== 1 ? "s" : ""}</div>
            <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>Requires warehouse attention</div>
          </div>
          <Badge label="Needs Attention" color="#ef4444" />
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total Assets"  value={totalUnits} sub="individual units tracked"  color="#ff8c00" />
        <StatCard label="Available"     value={availUnits} sub="ready in warehouse"         color="#10b981" />
        <StatCard label="Out on Hire"   value={outUnits}   sub="currently with clients"     color="#f59e0b" />
        <StatCard label="Maintenance"   value={maintUnits} sub="flagged for service"        color="#ef4444" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Upcoming Projects */}
        <div style={{ background: "#161b27", border: "1px solid #2a2a3a", borderRadius: 14, padding: 20 }}>
          <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>Upcoming Projects</div>
          {upcoming.length === 0 && <div style={{ color: "#4b5563", fontSize: 13 }}>No upcoming projects</div>}
          {upcoming.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1f2937" }}>
              <div>
                <div style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>{p.venue || "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge label={p.status} color={ST_COLORS[p.status] || "#6b7280"} />
                <div style={{ color: "#4b5563", fontSize: 11, marginTop: 4 }}>{p.startDate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Assets by Category */}
        <div style={{ background: "#161b27", border: "1px solid #2a2a3a", borderRadius: 14, padding: 20 }}>
          <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>Assets by Category</div>
          {["Audio", "Lighting", "AV", "Rigging", "Staging"].map(cat => {
            const typeIds = equipTypes.filter(t => t.category === cat).map(t => t.id);
            const catUnits = units.filter(u => typeIds.includes(u.typeId));
            const total = catUnits.length, avail = catUnits.filter(u => u.status === "available").length;
            const pct = total ? Math.round(avail / total * 100) : 0;
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: "#e5e7eb", fontSize: 14, fontWeight: 600 }}>{cat}</span>
                  <span style={{ color: "#6b7280", fontSize: 13 }}>{avail}/{total} avail</span>
                </div>
                <div style={{ background: "#1f2937", borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${pct}%`, height: 8, borderRadius: 4, background: CAT_COLORS[cat], transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Hires */}
        <div style={{ background: "#161b27", border: "1px solid #2a2a3a", borderRadius: 14, padding: 20 }}>
          <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>
            Active Hires ({activeQuotes.length})
          </div>
          {activeQuotes.length === 0 && <div style={{ color: "#4b5563", fontSize: 13 }}>No active hires</div>}
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {activeQuotes.map(q => {
              const isOverdue = q.endDate < today;
              return (
                <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #1f2937" }}>
                  <div>
                    <div style={{ color: isOverdue ? "#ef4444" : "#e5e7eb", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{q.id}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{q.client}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge label={q.status} color={isOverdue ? "#ef4444" : "#f59e0b"} />
                    <div style={{ color: isOverdue ? "#ef444488" : "#4b5563", fontSize: 11, marginTop: 3 }}>due {q.endDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
        <div style={{ color: "#374151", fontSize: 12 }}>Auto-refreshes every 10 seconds · Data synced from main app</div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1f2937; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
      `}</style>
    </div>
  );
}
