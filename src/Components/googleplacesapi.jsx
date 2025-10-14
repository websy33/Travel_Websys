import React, { useEffect, useRef, useState } from "react";

let autoComplete;

const SearchLocationInput = ({ setSelectedLocation }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const autoCompleteRef = useRef(null);

  // Debug: Check if API key is loaded
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  console.log('API Key from env:', apiKey);
  console.log('Full env:', import.meta.env);

  useEffect(() => {
    console.log('API Key in useEffect:', apiKey);
    
    if (!apiKey || apiKey === 'undefined') {
      setError("Google Maps API key is missing. Check your .env file.");
      console.error('API key is missing or undefined');
      return;
    }

    // Check if script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
      return;
    }

    setLoading(true);
    
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setLoading(false);
      console.log('Google Maps script loaded successfully');
      initializeAutocomplete();
    };
    
    script.onerror = () => {
      setLoading(false);
      setError("Failed to load Google Maps script. Check your API key and network connection.");
      console.error('Failed to load Google Maps script');
    };
    
    document.head.appendChild(script);

    const initializeAutocomplete = () => {
      if (!window.google?.maps?.places) {
        setError("Google Places library not available");
        return;
      }

      try {
        autoComplete = new window.google.maps.places.Autocomplete(
          autoCompleteRef.current,
          {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: "IN" },
            fields: ["formatted_address", "geometry", "name"]
          }
        );

        autoComplete.addListener("place_changed", () => {
          const place = autoComplete.getPlace();
          if (place.geometry) {
            const latLng = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setSelectedLocation(latLng);
            setQuery(place.formatted_address || place.name || "");
            setError(null);
          }
        });
      } catch (err) {
        setError("Error initializing autocomplete: " + err.message);
        console.error('Autocomplete error:', err);
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, setSelectedLocation]);

  return (
    <div className="search-location-input">
      <label>Type in your suburb or postcode</label>
      <input
        ref={autoCompleteRef}
        className="form-control"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Places ..."
        value={query}
        disabled={loading}
      />
      {loading && <div>Loading Google Maps...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default SearchLocationInput;