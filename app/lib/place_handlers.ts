export function addPlaces(places, newPlaces) {
  const existingPlaces = new Set();
  places.map((m) => existingPlaces.add(m.placeId));

  const newPlacesWithVis = newPlaces.map((m) => ({
    ...m,
    included: "true",
  }));

  const deduplicatedPlaces = newPlacesWithVis.filter((item) => {
    const duplicate = existingPlaces.has(item.placeId);
    return !duplicate;
  });

  console.log("test");

  return places.concat(deduplicatedPlaces);
}

export function excludePlace(places, placeId) {
  return places.map((m) =>
    m.placeId == placeId ? { ...m, included: "false" } : m
  );
}

export function includePlace(places, placeId) {
  return places.map((m) =>
    m.placeId == placeId ? { ...m, included: "true" } : m
  );
}
