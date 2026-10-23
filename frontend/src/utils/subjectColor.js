const PALETTE = [
  { dot: 'bg-sky-400', chip: 'bg-sky-100 text-sky-800' },
  { dot: 'bg-amber-400', chip: 'bg-amber-100 text-amber-800' },
  { dot: 'bg-emerald-400', chip: 'bg-emerald-100 text-emerald-800' },
  { dot: 'bg-violet-400', chip: 'bg-violet-100 text-violet-800' },
  { dot: 'bg-rose-400', chip: 'bg-rose-100 text-rose-800' },
]

export function subjectColor(id) {
  return PALETTE[id % PALETTE.length]
}