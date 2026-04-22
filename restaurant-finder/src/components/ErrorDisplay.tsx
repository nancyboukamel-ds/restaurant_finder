interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <span className="text-3xl">⚠️</span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-700 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}