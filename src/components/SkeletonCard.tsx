export default function SkeletonCard() {
  return (
    <div className="border rounded-lg shadow-md bg-gray-200 dark:bg-gray-700 animate-pulse">
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-600"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-400 dark:bg-gray-500 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-1/2"></div>
      </div>
    </div>
  );
}
