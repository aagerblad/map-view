import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import type { NextPage } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function FirstPost() {
  const [post, setPost] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);
  const libraries = useMemo(() => ["places"], []);

  const mapCenter = useMemo(
    () => ({ lat: 40.691337426702155, lng: -73.98855438877749 }),
    []
  );
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
      mapId: "d24b2a60a5f70b81",
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const postData = async () => {
      const data = {
        post: post,
      };

      const response = await fetch(`/api/maps?search=${post}`, {
        method: "GET",
      });
      return response.json();
    };
    postData().then((data) => {
      console.log(data.message);
      console.log("hejsan");
      console.log(data.results.props.data.candidates);
      setMarkers(data.results.props.data.candidates);
    });
  }

  return (
    <>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "800px", height: "800px" }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        {markers.map((m) => (
          <MarkerF position={m.location}></MarkerF>
        ))}
      </GoogleMap>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="post">Post</label>
          <input
            id="post"
            type="text"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
