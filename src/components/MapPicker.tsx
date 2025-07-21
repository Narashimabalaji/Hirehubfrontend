import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Box, CircularProgress } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '400px',
};

interface MapPickerProps {
  center: { lat: number; lng: number };
  onSelectLocation: (lat: number, lng: number) => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({ center, onSelectLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <CircularProgress />;

  return (
    <Box sx={{ mt: 2,width:"100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onClick={(e) => {
          if (e.latLng) {
            onSelectLocation(e.latLng.lat(), e.latLng.lng());
          }
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </Box>
  );
};
