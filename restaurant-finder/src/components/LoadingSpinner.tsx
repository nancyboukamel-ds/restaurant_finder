export function LoadingSpinner() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center py-12">
      <div className="inline-block">
        <div className="w-16 h-16 border-4 border-jet-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 text-lg">Finding restaurants...</p>
    </div>
  );
}