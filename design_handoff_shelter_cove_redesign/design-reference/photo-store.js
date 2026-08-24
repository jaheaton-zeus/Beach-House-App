// Shared source of truth for the house Photos gallery slots.
// Both the public Photos page and the Admin > Photos tab read/write this list,
// so admins can add or remove gallery tiles and the changes appear everywhere.
// The actual dropped images are persisted per-tile by the <image-slot> component
// under each slot's stable id; this store only tracks WHICH tiles exist.

const KEY = 'pt-house-photos-v1';

const DEFAULTS = [
  { id: 'house-photo-1', label: 'Living room', col: 4, row: 2 },
  { id: 'house-photo-2', label: 'Marina view', col: 2, row: 1 },
  { id: 'house-photo-3', label: 'Kitchen', col: 2, row: 1 },
  { id: 'house-photo-4', label: 'Primary bedroom', col: 2, row: 2 },
  { id: 'house-photo-5', label: 'Balcony', col: 2, row: 1 },
  { id: 'house-photo-6', label: 'Pool & hot tub', col: 2, row: 1 },
  { id: 'house-photo-7', label: 'Guest room', col: 2, row: 1 },
  { id: 'house-photo-8', label: 'Bathroom', col: 2, row: 1 },
  { id: 'house-photo-9', label: 'Sunset from the dock', col: 2, row: 1 },
];

export function getSlots() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) { /* fall through to defaults */ }
  return DEFAULTS.map(s => ({ ...s }));
}

export function saveSlots(slots) {
  try { localStorage.setItem(KEY, JSON.stringify(slots)); } catch (e) { /* ignore */ }
  return slots;
}

export function addSlot(label) {
  const slots = getSlots();
  const id = 'house-photo-' + Date.now();
  slots.push({ id, label: label || 'New photo', col: 2, row: 1 });
  return saveSlots(slots);
}

export function removeSlot(id) {
  const slots = getSlots().filter(s => s.id !== id);
  return saveSlots(slots);
}
