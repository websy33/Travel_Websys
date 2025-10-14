import React from 'react';

const SearchLocationInput = ({ setSelectedLocation }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    // Mock location selection
    setSelectedLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi coordinates
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search for locations..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchLocationInput;