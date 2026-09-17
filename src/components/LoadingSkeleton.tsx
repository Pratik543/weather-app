export function WeatherSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      <div>
        <div className="skeleton h-5 w-48" />
        <div className="skeleton mt-2 h-4 w-32" />
        <div className="mt-6 flex items-center gap-8">
          <div className="skeleton h-24 w-40" />
          <div className="skeleton h-14 w-36" />
        </div>
        <div className="skeleton mt-6 h-4 w-72" />
      </div>
      <div>
        <div className="skeleton mb-3 h-3 w-28" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton h-28 w-[76px] shrink-0" />
          ))}
        </div>
      </div>
      <div>
        <div className="skeleton mb-3 h-3 w-24" />
        <div className="glass rounded-2xl p-2">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-2 py-3">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
