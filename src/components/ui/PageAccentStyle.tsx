export default function PageAccentStyle({ color }: { color?: string }) {
  if (!color) return null
  return <style>{`:root { --page-accent-color: ${color}; }`}</style>
}
