import * as turf from '@turf/turf';

export const calculateScore = (guessCoords: [number, number], actualCoords: [number, number]): number => {
  // Calculate distance in miles
  const distance = turf.distance(
    turf.point(guessCoords),
    turf.point(actualCoords),
    { units: 'miles' }
  );

  // Perfect score if within 5 miles
  if (distance <= 5) return 100;

  // Deduct 1 point per 10 miles
  const score = 100 - Math.floor(distance / 10);
  
  // Minimum score of 0
  return Math.max(0, score);
}; 