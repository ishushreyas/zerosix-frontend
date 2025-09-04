/*
Updated full React frontend (App.jsx)
- Adds full-screen group view for Chat / Expenses / Posts
- Expenses screen: month picker, "This Month" quick filter, total expense summary (calls backend /expenses/summary)
- Expenses list supports filters: payer, category, payment_type (calls backend /expenses with query params)
- Keeps Apple-inspired UI (rounded, blur, soft shadows) and uses lucide-react icons
- Robust API helper (handles non-JSON responses) and fallback demo data

Place as src/App.jsx in your React project (Vite/CRA) with Tailwind configured.
Make sure backend exposes:
  GET  /api/groups/:id/expenses?month=YYYY-MM&payer=...&category=...&payment_type=...
  GET  /api/groups/:id/expenses/summary?month=YYYY-MM
  POST /api/groups/:id/expenses
  (existing endpoints for chat/posts remain)
*/

import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Users,
  UserCircle,
  MessageCircle,
  Receipt,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Plus,
  Search,
  Heart,
  Eye,
  Repeat,
} from "lucide-react";

// ---------- Demo fallback data ----------
const FALLBACK_GROUP_EXPENSES = [
  { expense_id: "e-demo-1", description: "Hotel Booking (demo)", total_amount: 4500, paid_by: "demo-user", paid_by_name: "Demo User", category: "Travel", payment_type: "Card", created_at: "2025-09-01T10:00:00Z" },
  { expense_id: "e-demo-2", description: "Dinner (demo)", total_amount: 1200, paid_by: "demo-user", paid_by_name: "Demo User", category: "Food", payment_type: "Cash", created_at: "2025-09-02T20:00:00Z" },
];

const FALLBACK_PAYER_OPTIONS = [
  { user_id: "demo-user", name: "Demo User" },
  { user_id: "u2", name: "Amit" },
];

// ---------- Robust API helper ----------
const api = {
  get: async (path) => {
    const res = await fetch(path, { credentials: "include" });
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(`API error ${res.status}: ${text.substring(0, 500)}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    if (ct.includes("application/json")) {
      try { return JSON.parse(text); } catch (e) { return text; }
    }
    if (text.trim().startsWith("<?xml") || ct.includes("xml")) {
      const err = new Error(`Non-JSON response from server: ${text.substring(0, 500)}`);
      err.body = text;
      throw err;
    }
    try { return JSON.parse(text); } catch (e) { return text; }
  },
  post: async (path, body) => {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(`API POST error ${res.status}: ${text.substring(0, 500)}`);
      err.status = res.status; err.body = text; throw err;
    }
    try { return JSON.parse(text); } catch (e) { return null; }
  }
};

// ---------- Helpers: months list ----------
function monthOptions(lastN = 24) {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < lastN; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString(undefined, { month: "long", year: "numeric" });
    const value = d.toISOString().slice(0,7); // YYYY-MM
    opts.push({ label, value });
  }
  return opts;
}

// ---------- UI Primitives ----------
const Panel = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.24)] ${className}`}>
    {children}
  </div>
);
const MonoButton = ({ icon, active, children, onClick, className = "" }) => (
  <button onClick={onClick} className={`flex items-center gap-2 rounded-2xl px-4 py-2 transition ${active ? "bg-white text-black shadow-inner" : "bg-white/5 text-white hover:bg-white/10"} ${className}`}>
    {icon}
    <span className="text-sm font-medium tracking-wide">{children}</span>
  </button>
);

// ---------- ExpensesPanel (full-screen) ----------
function ExpensesPanel({ groupId, onClose }) {
  const [month, setMonth] = useState(() => {
    const now = new Date(); return now.toISOString().slice(0,7);
  });
  const [months] = useState(() => monthOptions(36));
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payerOptions, setPayerOptions] = useState(FALLBACK_PAYER_OPTIONS);
  const [filters, setFilters] = useState({ payer: "", category: "", payment_type: "" });
  const [backendError, setBackendError] = useState(null);

  const fetchSummary = async (m) => {
    try {
      const s = await api.get(`/api/groups/${groupId}/expenses/summary?month=${m}`);
      setSummary(s);
    } catch (e) {
      console.warn("summary fetch failed", e.message || e);
      setSummary(null);
      setBackendError(e.message || String(e));
    }
  };

  const fetchExpenses = async (m, f) => {
    setLoading(true);
    setBackendError(null);
    try {
      const qp = new URLSearchParams();
      if (m) qp.set("month", m);
      if (f.payer) qp.set("payer", f.payer);
      if (f.category) qp.set("category", f.category);
      if (f.payment_type) qp.set("payment_type", f.payment_type);
      const arr = await api.get(`/api/groups/${groupId}/expenses?${qp.toString()}`);
      if (Array.isArray(arr)) setExpenses(arr);
      else setExpenses(FALLBACK_GROUP_EXPENSES);
    } catch (e) {
      console.warn("expenses fetch failed", e.message || e);
      setExpenses(FALLBACK_GROUP_EXPENSES);
      setBackendError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // load payer options + initial data
    let mounted = true;
    (async () => {
      try {
        // optional: fetch group members to populate payer options
        const members = await api.get(`/api/groups/${groupId}/members`);
        if (mounted && Array.isArray(members)) setPayerOptions(members.map(m => ({ user_id: m.user_id, name: m.name })));
      } catch (e) {
        console.warn("members fetch failed", e.message || e);
      }

      await fetchSummary(month);
      await fetchExpenses(month, filters);
    })();
    return () => { mounted = false; };
  }, [groupId]);

  useEffect(() => {
    fetchSummary(month);
    fetchExpenses(month, filters);
  }, [month, filters]);

  const totalThisMonth = summary && typeof summary.total_expense !== 'undefined' ? summary.total_expense : expenses.reduce((s,e) => s + Number(e.total_amount || e.amount || 0), 0);

  return (
    <div className="fixed inset-0 z-30 bg-black/60 p-6 overflow-auto">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white/6 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-2 rounded-2xl bg-white/5"><ArrowLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-semibold">Group Expenses</h2>
            </div>
            <div className="flex items-center gap-2">
              <MonoButton onClick={() => { const now = new Date(); setMonth(now.toISOString().slice(0,7)); }} className="px-3 py-2">This Month</MonoButton>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-2xl bg-white/6 px-3 py-2 outline-none">
                {months.map(m => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>
            </div>
          </div>

          {/* summary + filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Panel className="p-4">
              <div>
                <div className="text-sm text-white/60">Total for {month}</div>
                <div className="text-2xl font-bold mt-2">₹{totalThisMonth.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                {summary && summary.breakdown && (
                  <div className="mt-3 text-sm text-white/70">
                    {Object.entries(summary.breakdown).map(([k,v]) => (<div key={k} className="flex justify-between"><span>{k}</span><span>₹{Number(v).toFixed(2)}</span></div>))}
                  </div>
                )}
                {backendError && (<div className="text-xs text-yellow-200 mt-2">Partial data: {String(backendError).slice(0,200)}</div>)}
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="space-y-2">
                <div className="text-sm text-white/60">Filters</div>
                <select value={filters.payer} onChange={(e) => setFilters(f => ({...f, payer: e.target.value}))} className="w-full rounded-2xl bg-white/6 px-3 py-2">
                  <option value="">All payers</option>
                  {payerOptions.map(p => (<option key={p.user_id} value={p.user_id}>{p.name}</option>))}
                </select>

                <input placeholder="Category (e.g. Food)" value={filters.category} onChange={(e) => setFilters(f => ({...f, category: e.target.value}))} className="w-full rounded-2xl bg-white/6 px-3 py-2" />

                <select value={filters.payment_type} onChange={(e) => setFilters(f => ({...f, payment_type: e.target.value}))} className="w-full rounded-2xl bg-white/6 px-3 py-2">
                  <option value="">All payment types</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Other">Other</option>
                </select>

                <div className="flex gap-2">
                  <button onClick={() => { setFilters({ payer: "", category: "", payment_type: "" }); }} className="rounded-2xl bg-white/6 px-3 py-2">Reset</button>
                  <button onClick={() => { fetchExpenses(month, filters); fetchSummary(month); }} className="rounded-2xl bg-white text-black px-3 py-2">Apply</button>
                </div>
              </div>
            </Panel>

            <Panel className="p-4">
              <div className="text-sm text-white/60">Quick Actions</div>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => alert('Start split flow')} className="rounded-2xl bg-white/6 px-3 py-2">New Expense</button>
                <button onClick={() => alert('Export CSV (not implemented)')} className="rounded-2xl bg-white/6 px-3 py-2">Export</button>
              </div>
            </Panel>
          </div>

          {/* expenses list */}
          <div>
            {loading ? <div className="text-center py-8">Loading expenses...</div> : (
              <div className="space-y-2">
                {expenses.map(ex => (
                  <div key={ex.expense_id} className="rounded-2xl bg-white/6 p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{ex.description}</div>
                      <div className="text-xs text-white/60">{ex.category || '—'} • {ex.paid_by_name || ex.paid_by || 'Unknown'}</div>
                    </div>
                    <div className="text-lg font-semibold">₹{Number(ex.total_amount || ex.amount || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ---------- GroupInlineView: now opens full-screen when clicking options ----------
function GroupTile({ g, onOpenFull }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Panel className="overflow-hidden">
      <button className="w-full flex items-center gap-4 p-4 text-left" onClick={() => setExpanded(s => !s)}>
        <img src={g.group_photo_url || `https://i.pravatar.cc/80?u=${g.group_id}`} className="h-12 w-12 rounded-2xl object-cover" alt={g.name} />
        <div className="flex-1">
          <div className="font-semibold">{g.name}</div>
          <div className="text-xs text-white/60">{g.member_count || g.members_count || 0} members</div>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-white/60" /> : <ChevronDown className="h-5 w-5 text-white/60" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          <MonoButton className="justify-center" icon={<MessageCircle className="h-4 w-4" />} onClick={() => onOpenFull('chat', g.group_id)}>Chat</MonoButton>
          <MonoButton className="justify-center" icon={<Receipt className="h-4 w-4" />} onClick={() => onOpenFull('expenses', g.group_id)}>Expenses</MonoButton>
          <MonoButton className="justify-center" icon={<FileText className="h-4 w-4" />} onClick={() => onOpenFull('posts', g.group_id)}>Posts</MonoButton>
        </div>
      )}
    </Panel>
  );
}

// ---------- Main App ----------
export default function App() {
  const [tab, setTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);
  const [fullScreenView, setFullScreenView] = useState(null); // {type: 'expenses'|'chat'|'posts', groupId}

  const fetchAll = async () => {
    setLoading(true); setBackendError(null);
    try {
      const results = await Promise.allSettled([api.get('/api/posts'), api.get('/api/groups'), api.get('/api/users/me')]);
      const [psR, gsR, meR] = results;
      if (psR.status === 'fulfilled' && Array.isArray(psR.value)) setPosts(psR.value); else setPosts([]);
      if (gsR.status === 'fulfilled' && Array.isArray(gsR.value)) setGroups(gsR.value); else setGroups([]);
      if (meR.status === 'fulfilled' && meR.value) setProfile(meR.value); else setProfile(null);
      if (psR.status === 'rejected' || gsR.status === 'rejected' || meR.status === 'rejected') {
        setBackendError((psR.reason?.message || '') + ' ' + (gsR.reason?.message || '') + ' ' + (meR.reason?.message || ''));
      }
    } catch (e) {
      console.error(e);
      setBackendError(e.message || String(e));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openFull = (type, groupId) => setFullScreenView({ type, groupId });
  const closeFull = () => setFullScreenView(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:pt-10">
        {/* Top */}
        <div className="sticky top-4 z-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-2xl bg-white text-black grid place-items-center font-bold">💸</div>
                <div className="font-semibold">Expense Manager</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/6 px-3 py-2">{profile?.name || 'Guest'}</div>
                <img src={profile?.profile_photo_url || 'https://i.pravatar.cc/64'} className="h-9 w-9 rounded-2xl" alt="profile" />
              </div>
            </div>
          </div>
        </div>

        {backendError && (
          <div className="mt-4"><Panel className="p-3"><div className="text-sm text-yellow-200">⚠️ Backend issue detected — some data may be offline. {String(backendError).slice(0,200)}</div></Panel></div>
        )}

        <div className="mt-6 space-y-6">
          {tab === 'home' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-full">
                  <input placeholder="Search posts" className="w-full rounded-2xl bg-white/6 px-4 py-2 outline-none" />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-white/50" />
                </div>
                <button className="rounded-2xl bg-white text-black px-4 py-2" onClick={() => alert('new post')}>New</button>
              </div>
              {loading ? <div>Loading...</div> : (posts.length ? posts.map(p => (
                <div key={p.post_id || p.id}><Panel className="p-4 mb-4"><div className="font-semibold">{p.author_name || p.author}</div><div className="mt-2">{p.content}</div></Panel></div>
              )) : <div>No posts yet</div>)}
            </div>
          )}

          {tab === 'groups' && (
            <div className="grid gap-4">
              {groups.length ? groups.map(g => <GroupTile key={g.group_id || g.id} g={g} onOpenFull={openFull} />) : <div>No groups</div>}
            </div>
          )}

          {tab === 'profile' && (
            <div className="space-y-4">
              <Panel className="p-6"><div className="flex items-center gap-4"><img src={profile?.profile_photo_url || 'https://i.pravatar.cc/120'} className="h-20 w-20 rounded-3xl" alt="profile" /><div><div className="text-xl font-semibold">{profile?.name || 'Shreyas'}</div><div className="text-sm text-white/60">{profile?.email || 'shreyas@example.com'}</div></div></div></Panel>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-3 z-20 mx-auto max-w-md px-4">
        <div className="grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-2">
          <button onClick={() => setTab('home')} className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition ${tab === 'home' ? 'bg-white text-black' : 'hover:bg-white/10'}`}><Home className="h-5 w-5" /><span className="text-xs">Home</span></button>
          <button onClick={() => setTab('groups')} className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition ${tab === 'groups' ? 'bg-white text-black' : 'hover:bg-white/10'}`}><Users className="h-5 w-5" /><span className="text-xs">Groups</span></button>
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition ${tab === 'profile' ? 'bg-white text-black' : 'hover:bg-white/10'}`}><UserCircle className="h-5 w-5" /><span className="text-xs">Profile</span></button>
        </div>
      </nav>

      {/* Full-screen views */}
      {fullScreenView && fullScreenView.type === 'expenses' && <ExpensesPanel groupId={fullScreenView.groupId} onClose={closeFull} />}
      {fullScreenView && fullScreenView.type === 'chat' && (
        <div className="fixed inset-0 z-30 bg-black/60 p-6 overflow-auto">
          <div className="mx-auto max-w-4xl"><Panel className="p-4"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><button onClick={closeFull} className="p-2 rounded-2xl bg-white/5"><ArrowLeft className="h-5 w-5" /></button><h2 className="text-lg font-semibold">Group Chat</h2></div></div><div className="h-96 overflow-auto p-2">(Chat UI - connect to /api/groups/:id/chat)</div></Panel></div></div>
      )}
      {fullScreenView && fullScreenView.type === 'posts' && (
        <div className="fixed inset-0 z-30 bg-black/60 p-6 overflow-auto"><div className="mx-auto max-w-4xl"><Panel className="p-4"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><button onClick={closeFull} className="p-2 rounded-2xl bg-white/5"><ArrowLeft className="h-5 w-5" /></button><h2 className="text-lg font-semibold">Group Posts</h2></div></div><div className="h-96 overflow-auto p-2">(Group posts list here)</div></Panel></div></div>
      )}
    </div>
  );
}

