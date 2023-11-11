"use client";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Collapsible from "react-collapsible";

import { useMemo, useState } from "react";

export default function Page() {
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

  function addPlace(placeId) {
    setPlaces(
      places.map((m) => (m.placeId == placeId ? { ...m, included: "true" } : m))
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    const postData = async () => {
      const location = mapCenter.lat + "," + mapCenter.lng;
      console.log(
        "`@/pages/api/maps?search_query=${post}&location=${location}`"
      );
      const response = await fetch(`/api/maps`, {
        method: "GET",
        headers: {
          searchQuery: post,
          location: location,
        },
      });

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
    <main>
      <div className="panel">
        <h1>Map</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              id="post"
              type="text"
              value={post}
              className="search_window"
              onChange={(e) => setPost(e.target.value)}
            />
            <button className="search_window_button" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
            </button>
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
        <Collapsible
          overflowWhenOpen="scroll"
          trigger={<div className="remove_label">Removed</div>}
        >
          <ul>
            {removedPlaces.map((m) => (
              <li key={m.name}>
                <div className="place removed">
                  <button
                    className="place_button"
                    onClick={() => addPlace(m.placeId)}
                  >
                    X
                  </button>
                  {m.name}
                </div>
              </li>
            ))}
          </ul>
        </Collapsible>
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
    </main>
  );
}
