export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-96 bg-gradient-to-br from-sky-600 to-cyan-500 animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 skeleton rounded w-1/3 mb-4" />
        <div className="h-4 skeleton rounded w-2/3 mb-8" />
        <div className="space-y-4">
          <div className="h-10 skeleton rounded" />
          <div className="h-10 skeleton rounded w-2/3" />
          <div className="h-10 skeleton rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
