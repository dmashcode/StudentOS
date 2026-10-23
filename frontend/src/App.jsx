export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8 text-center">
        <h1 className="font-script text-5xl font-semibold text-sky-700">
          StudentOS
        </h1>
        <p className="mt-2 text-ink-soft">Tailwind chal raha hai.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="rounded-2xl bg-sky-700 px-7 py-3 font-medium text-white shadow-lg hover:bg-sky-800">
            Save
          </button>
          <span className="rounded-full bg-gold px-3 py-1 text-sm text-ink">
            gold
          </span>
        </div>
      </div>
    </div>
  )
}