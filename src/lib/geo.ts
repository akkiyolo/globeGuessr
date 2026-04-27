export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export function calculateScore(distanceKm: number): number {
  const maxScore = 5000;
  // If you're within 100 meters, full score.
  if (distanceKm < 0.1) return maxScore;
  
  // Exponential decay. e.g. at 2000km, the score will be 5000 * e^-1 ~ 1839.
  // We can adjust the 2000 factor to make it more or less forgiving.
  const score = Math.round(maxScore * Math.exp(-distanceKm / 2000));
  return Math.max(0, score);
}
