export function resolvePortraitState({ hovered, waving }) {
  if (waving) return 'wave'
  if (hovered) return 'hover'
  return 'default'
}
