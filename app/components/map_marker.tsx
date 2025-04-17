import { AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import styles from "@/app/styles/map_marker.module.css";

function MapMarker({
  name,
  position,
  photo,
  isSelected,
  onMarkerClick,
  isExcluded,
  onExclude,
  onInclude,
}: {
  name: string;
  position: any;
  photo: string;
  isSelected: boolean;
  onMarkerClick: (event: React.MouseEvent) => void;
  isExcluded: boolean;
  onExclude: () => void;
  onInclude: () => void;
}) {
  const pos = {
    lat: position.latitude,
    lng: position.longitude,
  };

  const handleExcludeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExclude();
  };

  const handleIncludeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInclude();
  };

  return (
    <AdvancedMarker 
      position={pos} 
      zIndex={isSelected ? 1000 : 1}
    >
      {/* <Pin background={"#FBBC04"} glyphColor={"#f33"} borderColor={"#0f0"}>
        <div>{name}</div>
      </Pin> */}
      <div 
        className={`${styles.pricetag} ${isSelected ? styles.selected : ''} ${isExcluded ? styles.excluded : ''}`}
        onClick={onMarkerClick}
      >
        <span>{name}</span>
        <br />
        <img src={photo} alt={name} />
        {!isExcluded && isSelected && (
          <button 
            className={styles.excludeButton}
            onClick={handleExcludeClick}
            title="Exclude"
          >
            ×
          </button>
        )}
        {isExcluded && isSelected && (
          <button 
            className={styles.includeButton}
            onClick={handleIncludeClick}
            title="Add back"
          >
            ↺
          </button>
        )}
      </div>
    </AdvancedMarker>
  );
}

export default MapMarker;
