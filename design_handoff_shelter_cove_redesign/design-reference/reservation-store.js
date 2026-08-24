// Shared reservation store for the P/T Beach House site.
// Home booking card writes pending requests; Admin > Reservations approves/denies
// by MAJORITY VOTE of the current super users. Persisted in localStorage.

const KEY = 'pt-reservations-v1';

// approvals / denials hold the ids of super users who voted that way.
const SEED = [
  { id: 1, name: 'Sarah Pierce', family: 'Pierce', code: 'PIERCE7', checkIn: '2026-09-12', checkOut: '2026-09-19', status: 'approved', approvals: [], denials: [] },
  { id: 2, name: 'Mike Thomas', family: 'Thomas', code: 'THOMAS7', checkIn: '2026-10-03', checkOut: '2026-10-10', status: 'pending', approvals: [1], denials: [] },
  { id: 3, name: 'Sarah Pierce', family: 'Pierce', code: 'PIERCE7', checkIn: '2026-11-21', checkOut: '2026-11-28', status: 'pending', approvals: [2], denials: [] },
  { id: 4, name: 'Dave Thomas', family: 'Thomas', code: 'THOMAS7', checkIn: '2026-08-01', checkOut: '2026-08-05', status: 'denied', approvals: [], denials: [] },
];

const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(r => ({ approvals: [], denials: [], ...r }));
    }
  } catch (e) { /* fall through */ }
  return SEED.map(r => ({ ...r, approvals: [...r.approvals], denials: [...r.denials] }));
}

export function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  return list;
}

export function add(res) {
  const list = getAll();
  const id = list.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  list.unshift({ id, status: 'pending', approvals: [], denials: [], ...res });
  return save(list);
}

export function remove(id) {
  return save(getAll().filter(r => r.id !== id));
}

export function majorityNeeded(superCount) {
  return Math.floor(superCount / 2) + 1;
}

function recompute(res, superIds) {
  const set = new Set(superIds);
  res.approvals = (res.approvals || []).filter(u => set.has(u));
  res.denials = (res.denials || []).filter(u => set.has(u));
  const need = majorityNeeded(superIds.length);
  if (res.approvals.length >= need) res.status = 'approved';
  else if (res.denials.length >= need) res.status = 'denied';
  else res.status = 'pending';
}

// A super user casts (or changes) their vote. kind: 'approve' | 'deny'.
export function castVote(id, userId, kind, superIds) {
  const list = getAll();
  const res = list.find(r => r.id === id);
  if (!res) return save(list);
  res.approvals = (res.approvals || []).filter(u => u !== userId);
  res.denials = (res.denials || []).filter(u => u !== userId);
  if (kind === 'approve') res.approvals.push(userId);
  else if (kind === 'deny') res.denials.push(userId);
  recompute(res, superIds);
  return save(list);
}

export function voteInfo(res, superIds) {
  const set = new Set(superIds);
  return {
    approvals: (res.approvals || []).filter(u => set.has(u)).length,
    denials: (res.denials || []).filter(u => set.has(u)).length,
    needed: majorityNeeded(superIds.length),
    superCount: superIds.length,
  };
}

export function overlaps(checkIn, checkOut, ignoreId) {
  const a = new Date(checkIn + 'T00:00');
  const b = new Date(checkOut + 'T00:00');
  return getAll().find(r => {
    if (r.id === ignoreId) return false;
    if (r.status !== 'pending' && r.status !== 'approved') return false;
    const rs = new Date(r.checkIn + 'T00:00');
    const re = new Date(r.checkOut + 'T00:00');
    return a < re && b > rs;
  }) || null;
}

export function nights(checkIn, checkOut) {
  return Math.max(0, Math.round((new Date(checkOut + 'T00:00') - new Date(checkIn + 'T00:00')) / 86400000));
}

export function formatRange(checkIn, checkOut) {
  const a = new Date(checkIn + 'T00:00');
  const b = new Date(checkOut + 'T00:00');
  if (isNaN(a) || isNaN(b)) return '';
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (sameMonth) return `${MO[a.getMonth()]} ${a.getDate()} \u2013 ${b.getDate()}, ${b.getFullYear()}`;
  return `${MO[a.getMonth()]} ${a.getDate()} \u2013 ${MO[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`;
}
