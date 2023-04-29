import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Marker,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

export default function FirstPost() {
  const [post, setPost] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);
  const libraries = useMemo(() => ["places"], []);

  const [mapCenter, setMapCenter] = useState({ lat: 40.69133, lng: -73.98855 });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
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

  function handleSubmit(e) {
    e.preventDefault();
    const postData = async () => {
      const lat = mapCenter.lat;
      const lng = mapCenter.lng;
      const response = await fetch(
        `/api/maps?search=${post}&lat=${lat}&lng=${lng}`,
        {
          method: "GET",
        }
      );

      return response.json();
    };

    postData().then((data) => {
      console.log(data.results);
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
        onLoad={handleOnLoad}
        onDragEnd={handleCenterChanged}
      >
        {markers.map((m) => (
          <MarkerF key={m.name} position={m.location}></MarkerF>
        ))}
      </GoogleMap>
      <h1>
        {mapCenter.lat} {mapCenter.lng}
      </h1>
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
