import React, { useEffect, useState } from 'react';
import './BuildingDirectory.css';

const BuildingDirectory = ({
  expandedCategories,
  onCategoryToggle,
  onBuildingSelect,
  selectedBuilding,
}) => {
  const [buildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('full');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch building data
        const buildingsResponse = await fetch('https://biola-map-live-production.up.railway.app/aoi_directory');
        const buildingsData = await buildingsResponse.json();
        setBuildings(buildingsData); // Set buildings data

        // Fetch category data
        const categoriesResponse = await fetch('https://biola-map-live-production.up.railway.app/category_info');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData); // Set categories data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Group buildings by category_id
  const groupedBuildings = {};
  buildings.forEach((building) => {
    if (!groupedBuildings[building.category_id]) {
      groupedBuildings[building.category_id] = [];
    }
    groupedBuildings[building.category_id].push(building);
  });

  // Handle switching between 'Full' and 'Filtered' views
  const handleTabClick = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="building-directory">
      <div className="directory-header">
        <h2>Building Directory</h2>
        <div className="directory-tabs">
        <button
            className={`tab ${viewMode === 'full' ? 'active' : ''}`}
            onClick={() => handleTabClick('full')}
          >
            Full Directory
          </button>
          <button
            className={`tab ${viewMode === 'filtered' ? 'active' : ''}`}
            onClick={() => handleTabClick('filtered')}
          >
            Filtered by Building Categories
          </button>
        </div>
      </div>

      <div className="directory-content">
        {viewMode === 'filtered' ? (
          categories.map((category) => {
            // Get the buildings for the current category
            const buildingsInCategory = groupedBuildings[category.category_id];

            return (
              <div key={category.category_id} className="category-section">
                <div
                  className="category-header"
                  onClick={() => onCategoryToggle(category.category_id)}
                >
                  <h3>{category.category_name}</h3>
                  <span
                    className={`expand-icon ${
                      expandedCategories.includes(category.category_id) ? 'expanded' : ''
                    }`}
                  >
                    {expandedCategories.includes(category.category_id) ? '−' : '+'}
                  </span>
                </div>

                {expandedCategories.includes(category.category_id) && (
                  <ul className="building-list">
                    {buildingsInCategory?.map((building) => (
                      <li
                        key={building.aoi_id}
                        className={`building-item ${
                          selectedBuilding?.aoi_id === building.aoi_id ? 'selected' : ''
                        }`}
                        onClick={() => onBuildingSelect(building.aoi_id)}
                      >
                        <span className="building-index">{building.aoi_id}.</span>
                        <span className="building-name">{building.aoi_name}</span>
                      </li>
                    ))}
                    {(!buildingsInCategory || buildingsInCategory.length === 0) && (
                      <li className="no-buildings">No buildings in this category</li>
                    )}
                  </ul>
                )}
              </div>
            );
          })
        ) : (
          // Full view: list all buildings by aoi_id
          <ul className="building-list">
            {buildings
              .sort((a, b) => a.aoi_id - b.aoi_id) // Sort buildings by aoi_id
              .map((building) => (
                <li
                  key={building.aoi_id}
                  className={`building-item ${
                    selectedBuilding?.aoi_id === building.aoi_id ? 'selected' : ''
                  }`}
                  onClick={() => onBuildingSelect(building.aoi_id)}
                >
                  <span className="building-index">{building.aoi_id}.</span>
                  <span className="building-name">{building.aoi_name}</span>
                </li>
              ))}
            {buildings.length === 0 && <li className="no-buildings">No buildings available</li>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BuildingDirectory;