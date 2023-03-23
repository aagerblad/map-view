import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import type { NextPage } from "next";
import Link from "next/link";
import { useMemo } from "react";

export default function FirstPost() {
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

  return (
    <>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "800px", height: "800px" }}
        onLoad={() => console.log("Map Component Loaded...")}
      />
      <Link href="/search/test">Search</Link>{" "}
    </>
  );
}
