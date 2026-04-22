export interface Restaurant {
  id: string;        // ← ADD THIS LINE
  name: string;
  cuisines: string;
  rating: number;
  ratingCount: number;
  address: string;
}