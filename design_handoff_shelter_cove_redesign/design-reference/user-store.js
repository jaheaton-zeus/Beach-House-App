// Shared user store for the P/T Beach House site.
// Each user has a reservation code (set by an admin) they use to book. Super
// Users can approve or deny reservation requests. Admins manage this list from
// Admin > Users. Persisted in localStorage.

const KEY = 'pt-users-v1';

const SEED = [
  { id: 1, name: 'Sarah Pierce', email: 'sarah@family.com', family: 'Pierce', code: 'PIERCE7', superUser: true },
  { id: 2, name: 'Mike Thomas', email: 'mike@thomasfam.com', family: 'Thomas', code: 'THOMAS7', superUser: true },
  { id: 3, name: 'Emma Pierce', email: 'emma@family.com', family: 'Pierce', code: 'EMMA22', superUser: false },
  { id: 4, name: 'Dave Thomas', email: 'dave@thomasfam.com', family: 'Thomas', code: 'DAVE19', superUser: false },
  { id: 5, name: 'Aaron Heaton', email: 'aaron@ptbeachhouse.com', family: 'Pierce', code: 'HEATON1', superUser: true, siteAdmin: true },
];

const CODE_KEY = 'pt-current-code-v1';

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/);
  return ((parts[0] || '').charAt(0) + (parts[1] || '').charAt(0)).toUpperCase() || '?';
}

export function getAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) { /* fall through */ }
  return SEED.map(u => ({ ...u }));
}

export function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  return list;
}

export function add(user) {
  const list = getAll();
  const id = list.reduce((m, u) => Math.max(m, u.id), 0) + 1;
  list.push({ id, superUser: false, ...user });
  return save(list);
}

export function update(id, patch) {
  return save(getAll().map(u => u.id === id ? { ...u, ...patch } : u));
}

export function remove(id) {
  return save(getAll().filter(u => u.id !== id));
}

export function findByCode(code) {
  const c = (code || '').trim().toLowerCase();
  if (!c) return null;
  return getAll().find(u => (u.code || '').trim().toLowerCase() === c) || null;
}

export function getCurrentUser() {
  const all = getAll();
  return all.find(u => u.siteAdmin) || all.find(u => u.superUser) || all[0] || null;
}

export function getCurrentUserCode() {
  try { return localStorage.getItem(CODE_KEY) || null; } catch (e) { return null; }
}

export function setCurrentUserCode(code) {
  try { localStorage.setItem(CODE_KEY, code || ''); } catch (e) { /* ignore */ }
}
