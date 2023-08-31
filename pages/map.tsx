import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo, useState } from "react";

export default function FirstPost() {
  const [post, setPost] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const libraries = useMemo(() => ["places"], []);

  const [mapCenter, setMapCenter] = useState({ lat: 40.69133, lng: -73.98855 });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      mapId: "d24b2a60a5f70b81",
    }),
    []
  );

  const [mapref, setMapRef] = useState<google.maps.Map>();

  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };

  const handleCenterChanged = () => {
    if (mapref) {
      const newCenter = mapref.getCenter();
      if (newCenter) {
        setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      }
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  function addPlaces(newPlaces) {
    const existingPlaces = new Set();
    places.map((m) => existingPlaces.add(m.placeId));

    const newPlacesWithVis = newPlaces.map((m) => ({ ...m, included: "true" }));

    const deduplicatedPlaces = newPlacesWithVis.filter((item) => {
      const duplicate = existingPlaces.has(item.placeId);
      return !duplicate;
    });

    setPlaces(places.concat(deduplicatedPlaces));
  }

  function removePlace(placeId) {
    setPlaces(
      places.map((m) =>
        m.placeId == placeId ? { ...m, included: "false" } : m
      )
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const postData = async () => {
      const location = mapCenter.lat + "," + mapCenter.lng;
      const response = await fetch(
        `/api/maps?search_query=${post}&location=${location}`,
        {
          method: "GET",
        }
      );

      return response.json();
    };

    postData().then((data) => {
      addPlaces(data.results.candidates);
    });
  }

  const filteredPlaces = places
    .filter((place) => place.included == "true")
    .sort((one, two) => (one.name < two.name ? -1 : 1));
  const removedPlaces = places
    .filter((place) => place.included == "false")
    .sort((one, two) => (one.name < two.name ? -1 : 1));
  return (
    <>
      <div className="panel">
        <form onSubmit={handleSubmit}>
          <div>
            {/* <label htmlFor="post">Post</label> */}
            <input
              id="post"
              type="text"
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
            <button type="submit">Submit</button>
          </div>
        </form>
        <ul>
          {filteredPlaces.map((m) => (
            <li key={m.name}>
              <div className="place">
                <button
                  className="place_button"
                  onClick={() => removePlace(m.placeId)}
                >
                  X
                </button>
                {m.name}
              </div>
            </li>
          ))}
        </ul>
        <ul>
          {removedPlaces.map((m) => (
            <li key={m.name}>
              <div className="place removed">
                <button
                  className="place_button"
                  onClick={() => removePlace(m.placeId)}
                >
                  X
                </button>
                {m.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          // mapContainerStyle={{ width: "800px", height: "800px" }}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            padding: "0",
            margin: "0",
            position: "absolute",
            top: "0",
            left: "0",
          }}
          onLoad={handleOnLoad}
          onDragEnd={handleCenterChanged}
          onZoomChanged={handleCenterChanged}
        >
          {filteredPlaces.map((m) => (
            <MarkerF key={m.name} position={m.location}></MarkerF>
          ))}
        </GoogleMap>
        <div className="mid_point">X</div>
      </div>
    </>
  );
}
