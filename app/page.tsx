"use client";
import Panel from "./components/panel";
import MapMarker from "./components/map_marker";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { useMemo, useState } from "react";
import { addPlaces, excludePlace, includePlace } from "./lib/place_handlers";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string;

export default function Page() {
  const [post, setPost] = useState("burger");
  const [places, setPlaces] = useState<any[]>([]);
  // const libraries = useMemo(() => ["places"], []);

  const [mapCenter, setMapCenter] = useState({ lat: 40.69133, lng: -73.98855 });

  function handleSubmit(e) {
    e.preventDefault();

    const postData = async () => {
      const searchQuery = JSON.stringify({
        textQuery: post,
        languageCode: "en",
        locationBias: {
          circle: {
            center: {
              latitude: mapCenter.lat.toString(),
              longitude: mapCenter.lng.toString(),
            },
            radius: "1000",
          },
        },
      });

      const response = await fetch(`/api/maps`, {
        method: "GET",
        headers: {
          searchQuery: searchQuery,
        },
      });

      return response.json();
    };

    postData().then((data) => {
      setPlaces(addPlaces(places, data.results.candidates));
    });
  }

  const includedPlaces = places
    .filter((place) => place.included == "true")
    .sort((one, two) => (one.name < two.name ? -1 : 1));
  const excludedPlaces = places
    .filter((place) => place.included == "false")
    .sort((one, two) => (one.name < two.name ? -1 : 1));

  return (
    <main>
      <APIProvider apiKey={API_KEY}>
        <Map
          className="map"
          defaultZoom={14}
          defaultCenter={mapCenter}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"d24b2a60a5f70b81"}
          onCenterChanged={(e) => setMapCenter(e.detail.center)}
        >
          {includedPlaces.map((m) => (
            <MapMarker
              key={m.placeId}
              name={m.name}
              position={m.location}
              photo={m.photoUri}
            ></MapMarker>
          ))}
        </Map>
        <Panel
          post={post}
          setPost={setPost}
          includedPlaces={includedPlaces}
          excludedPlaces={excludedPlaces}
          excludePlace={(placeId) => setPlaces(excludePlace(places, placeId))}
          includePlace={(placeId) => setPlaces(includePlace(places, placeId))}
          handleSubmit={handleSubmit}
        />
        {/* <div className="mid_point">X</div> */}
      </APIProvider>
    </main>
  );
}

{
  /* {includedPlaces.map((m) => (
      <MarkerF key={m.name} position={m.location}></MarkerF>
    )} */
}
