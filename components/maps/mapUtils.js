export const getDistanceKm = (pointA, pointB) => {
  const R = 6371;

  const dLat = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const dLng = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const lat1 = (pointA.latitude * Math.PI) / 180;
  const lat2 = (pointB.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) *
      Math.sin(dLng / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const getRemainingDistanceKm = (currentPoint, routeCoordinates) => {
  if (!currentPoint || routeCoordinates.length === 0) {
    return 0;
  }

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  routeCoordinates.forEach((point, index) => {
    const distance = getDistanceKm(currentPoint, point);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  let remaining = getDistanceKm(currentPoint, routeCoordinates[nearestIndex]);

  for (let i = nearestIndex; i < routeCoordinates.length - 1; i++) {
    remaining += getDistanceKm(routeCoordinates[i], routeCoordinates[i + 1]);
  }

  return Number(remaining.toFixed(2));
};