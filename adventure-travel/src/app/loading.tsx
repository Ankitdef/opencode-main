export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero skeleton */}
      <div className="relative h-screen skeleton" />

      {/* Split sections skeleton */}
      <div className="py-section bg-background">
        <div className="mx-auto max-w-7xl px-6 space-y-24">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="h-4 skeleton rounded w-1/4" />
                <div className="h-8 skeleton rounded w-3/4" />
                <div className="h-4 skeleton rounded w-full" />
                <div className="h-4 skeleton rounded w-5/6" />
                <div className="h-10 skeleton rounded-xl w-1/3 mt-4" />
              </div>
              <div className="aspect-[4/3] skeleton rounded-[2rem]" />
            </div>
          ))}
        </div>
      </div>

      {/* Trek cards skeleton */}
      <div className="py-section-sm bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-4 skeleton rounded w-1/6 mb-3" />
          <div className="h-8 skeleton rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
                <div className="h-44 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-3 skeleton rounded w-1/3" />
                  <div className="h-5 skeleton rounded w-2/3" />
                  <div className="h-3 skeleton rounded w-full" />
                  <div className="flex justify-between pt-4">
                    <div className="h-5 skeleton rounded w-1/4" />
                    <div className="h-8 skeleton rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations skeleton */}
      <div className="py-section bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-4 skeleton rounded w-1/6 mb-3" />
          <div className="h-8 skeleton rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 skeleton rounded-3xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="py-section-sm bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-10 skeleton rounded w-1/2 mx-auto" />
                <div className="h-4 skeleton rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
