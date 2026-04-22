import type { Restaurant } from '../types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // Ensure rating is a number and format it safely
  const ratingDisplay = typeof restaurant.rating === 'number' 
    ? restaurant.rating.toFixed(1) 
    : '0.0';

  // Format count with comma for thousands (e.g., 1,234)
  const countDisplay = restaurant.ratingCount.toLocaleString();

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      {/* Name and Rating */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-900 flex-1">
          {restaurant.name}
        </h2>
        <div className="flex items-center gap-1 ml-4">
          <span className="text-2xl">⭐</span>
          <span className="text-lg font-semibold text-gray-900">
            {ratingDisplay}
            <span className="text-sm text-gray-600 ml-1">
              ({countDisplay})
            </span>
          </span>
        </div>
      </div>

      {/* Cuisines */}
      <div className="mb-3">
        <p className="text-gray-700 flex items-center gap-2">
          <span className="text-lg">🍽️</span>
          <span className="font-medium">{restaurant.cuisines}</span>
        </p>
      </div>

      {/* Address */}
      <div>
        <p className="text-gray-600 flex items-start gap-2">
          <span className="text-lg mt-0.5">📍</span>
          <span>{restaurant.address}</span>
        </p>
      </div>
    </article>
  );
}