export const DEFAULT_QUEEN_HINT_SHORTCUT = 'q'

const RESERVED_SHORTCUT_KEYS = new Set([
  'alt',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowup',
  'control',
  'enter',
  'escape',
  'meta',
  'shift',
  ' ',
  'space',
  'tab',
])

export const normalizeShortcutKey = (key: string) => key.toLowerCase()

export const isReservedShortcutKey = (key: string) => {
  return RESERVED_SHORTCUT_KEYS.has(normalizeShortcutKey(key))
}

export const isValidShortcutKey = (key: string) => {
  const normalizedKey = normalizeShortcutKey(key)

  return normalizedKey.length === 1 && !isReservedShortcutKey(normalizedKey)
}

export const formatShortcutKey = (key: string) => normalizeShortcutKey(key).toUpperCase()
