import { AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import styles from "@/app/styles/map_marker.module.css";

function MapMarker({ name, position }: { name: string; position: any }) {
  const pos = {
    lat: position.latitude,
    lng: position.longitude,
  };

  return (
    <AdvancedMarker position={pos}>
      {/* <Pin background={"#FBBC04"} glyphColor={"#f33"} borderColor={"#0f0"}>
        <div>{name}</div>
      </Pin> */}
      <div className={styles.pricetag}>{name}</div>
    </AdvancedMarker>
  );
}

export default MapMarker;
