export default function SelectField({ label, id, children, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-xl border border-sky-200 bg-white/70 px-4 py-3 text-ink outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-300"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}