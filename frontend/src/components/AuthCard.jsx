export default function AuthCard({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8">
        <h1 className="text-center font-script text-5xl font-semibold text-sky-700">
          StudentOS
        </h1>
        <h2 className="mt-2 text-center text-lg text-ink-soft">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}