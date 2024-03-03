import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

function MapMarker({ key, position }: { key: string; position: any }) {
  return (
    <AdvancedMarker key={key} position={position}>
      <Pin background={"#FBBC04"} glyphColor={"#f33"} borderColor={"#0f0"} />
    </AdvancedMarker>
  );
}

export default MapMarker;
