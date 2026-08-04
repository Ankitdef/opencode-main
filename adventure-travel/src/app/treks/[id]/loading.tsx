export default function TrekDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[400px] skeleton" />

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-surface pt-20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="h-4 skeleton rounded w-1/3" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="h-8 skeleton rounded w-2/3" />
            <div className="h-4 skeleton rounded w-full" />
            <div className="h-4 skeleton rounded w-5/6" />
            <div className="h-4 skeleton rounded w-3/4" />

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-white/10 p-4 space-y-2">
                  <div className="h-4 skeleton rounded w-1/2" />
                  <div className="h-6 skeleton rounded w-2/3" />
                </div>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-8 space-y-4">
              <div className="flex gap-4 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 skeleton rounded-full w-24" />
                ))}
              </div>
              <div className="h-4 skeleton rounded w-full" />
              <div className="h-4 skeleton rounded w-5/6" />
              <div className="h-4 skeleton rounded w-4/6" />
              <div className="h-32 skeleton rounded-xl mt-4" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-card rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6 space-y-4">
              <div className="h-8 skeleton rounded w-1/2" />
              <div className="h-4 skeleton rounded w-1/3" />
              <div className="h-12 skeleton rounded-xl w-full mt-4" />
              <div className="space-y-3 mt-6">
                <div className="h-4 skeleton rounded w-full" />
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-4 skeleton rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
