const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
  
      const data = await response.json();
      if (data.status === 'OK') {
        return data.results[0]?.formatted_address || '';
      } else {
        console.warn('Reverse geocoding failed:', data.status);
        return '';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };
  
  export default getAddressFromCoords