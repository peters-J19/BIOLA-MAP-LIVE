import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, buildings, selectedBuilding, onBuildingSelect, showDirections, setDirection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredBuildings, setFilteredBuildings] = useState([]);

  useEffect(() => {
    if (selectedBuilding) {
      setSearchTerm(selectedBuilding.aoi_name);
    } else {
      setSearchTerm('');
    }
  }, [selectedBuilding]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = buildings.filter(building => 
        building.aoi_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBuildings(filtered);
      setShowDropdown(true);
    } else {
      setFilteredBuildings([]);
      setShowDropdown(false);
    }

    onSearch(value);
  };

  const handleSelectSearchItem = (buildingId) => {
    const building = buildings.find(b => b.aoi_id === buildingId);
    setSearchTerm(building.aoi_name);
    setShowDropdown(false);
    onSearch(building.aoi_name);
    onBuildingSelect(building.aoi_id);
  };

  return (
    <div className="search-container">
      <div className="search-toggle">
        <button 
          className={`toggle-button ${!showDirections ? 'active' : ''}`}
          onClick={() => { 
            setDirection(false); 
            setShowDropdown(false); // Hide dropdown when switching to Search
          }}
        >
          Search
        </button>
        <button 
          className={`toggle-button ${showDirections ? 'active' : ''}`}
          onClick={() => {
            setDirection(true); 
            setShowDropdown(false); // Hide dropdown when switching to Directions
            setSearchTerm('');
            onSearch('');
          }}
        >
          Directions
        </button>
      </div>

      {!showDirections ? (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchTerm}
            onChange={handleSearchChange}
            maxLength="100"
            className="search-input"
          />
          <button className="search-button">
            🔍
          </button>

          {showDropdown && filteredBuildings.length > 0 && (
            <ul className="search-dropdown">
              {filteredBuildings.map(building => (
                <li 
                  key={building.aoi_id}
                  onClick={() => handleSelectSearchItem(building.aoi_id)}
                  className="dropdown-item"
                >
                  <span className="item-name">{building.aoi_name}</span>
                  <span className="item-category">{building.aoi_id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="directions-placeholder">
          <p>🚧 This feature is under construction. Stay tuned!</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;