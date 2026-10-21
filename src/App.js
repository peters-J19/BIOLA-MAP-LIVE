import React, { useState, useEffect } from 'react';
import './App.css';
import BuildingDirectory from './components/Directory/BuildingDirectory';
import CampusMap from './components/Map/CampusMap';
import SearchBar from './components/SearchBar/SearchBar';
import InfoPanel from './components/InfoPanel/InfoPanel';

function App() {

  const [isMobile, setIsMobile] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [filteredSearchResults, setFilteredSearchResults] = useState([]);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  useEffect(() => {
    const imageFilenames = [
      'gatehouseLMB.png',
      'centralReceiving.png',
      'facilitiesManagement.png',
      'sigmaHall.png',
      'biolaOrganicGarden.png',
      'blackstoneHall.png',
      'welchApartments.png',
      'liApartments.png',
      'thompsonHall.png',
      'alphaHall.png',
      'hortonHall.png',
      'emersonHall.png',
      'parkingStructureK.png',
      'centralPlant.png',
      'barbourField.png',
      'crowellHall.png',
      'chaseGym.png',
      'lansingPool.png',
      'parkingStructureS.png',
      'kavalichPark.png',
      'oliveGrove.png',
      'cafeBiola.png',
      'foodPantry.png',
      'subBuilding.png',
      'eagleNest.png',
      'fluorfountain.png',
      'studentServices.png',
      'musicWorship.png',
      'bardwell.png',
      'campusSafety.png',
      'marshburnHall.png',
      'bellTower.png',
      'studentHealthCenter.png',
      'soubirouHall.png',
      'libraryBiola.png',
      'heritage.png',
      'sutherland.png',
      'roseHall.png',
      'metzgerLawn.png',
      'admissionCenter.png',
      'roseSharonPrayerChapel.png',
      'talbotEast.png',
      'calvaryChapel.png',
      'myersHall.png',
      'gateBiolaAve.png',
      'businessBuilding.png',
      'limCenter.png',
      'filmCenter.png',
      'roodHall.png',
      'doroEnHall.png',
      'nineBuild.png',
      'groveModul.png',
      'productionCenter.png',
      'tennisCenter.png',
      'southField.png',
      'sandVolleyCourt.png',
      'archRange.png',
      'softballField.png',
      'baseballField.png',
      'hopeHall.png',
      'stewartHall.png',
      'hartHall.png',
      'laMiradaApartments.png',
      'rosecransApartments1&2.png',
      'rosecransApartments3.png',
      'rosecransApartment4.png',
      'rosecransApartment5.png',
      'tropicanaApartments.png',
      'tradewindsApartments.png',
      'beachcomberApartments.png',
      'liloMiradaApartments.png',
      'professionalBuilding.png',
      'lotA.png',
      'lotB.png',
      'lotC.png',
      'lotE.png',
      'lotF.png',
      'lotG.png',
      'lotH.png',
      'lotI.png',
      'lotL.png',
      'lotM.png',
      'lotN.png',
      'lotO.png',
      'lotP.png',
      'ent1.png',
      'ent2.png',
      'ent6.png',
      'ent7.png'
    ];
  
    imageFilenames.forEach((filename, i) => {
      setTimeout(() => {
        const img = new Image();
        img.src = `/images/${filename}`;
      }, i * 50); // 50ms stagger
    });
  }, []);

  const setDirection = (direction) => {
    setShowDirections(direction); // Toggle the directions tab
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch building data from the new route that includes coordinates
        const buildingsResponse = await fetch('https://biola-map-live-production.up.railway.app/aoi_app');
        const buildingsData = await buildingsResponse.json();

        // Add { x, y } coordinates object to each building
        const buildingsWithCoords = buildingsData.map(building => ({
          ...building,
          coordinates: { x: building.coordinate_x, y: building.coordinate_y }
        }));

        setFilteredBuildings(buildingsWithCoords);

        // Fetch category data
        const categoriesResponse = await fetch('https://biola-map-live-production.up.railway.app/category_info');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        setExpandedCategories([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBuildingSelect = (buildingId) => {
    const building = filteredBuildings.find(b => b.aoi_id === buildingId);
    setSelectedBuilding(building);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredSearchResults([]);
      return;
    }
  
    const lowercaseSearch = searchTerm.toLowerCase();
    const searchResults = filteredBuildings.filter(building => 
      building.aoi_name.toLowerCase().includes(lowercaseSearch)
    );
  
    setFilteredSearchResults(searchResults);
  };

  const toggleCategory = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  if (isMobile === true) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '1.2rem',
        backgroundColor: '#a9c9f0'
      }}>
        🚫🚫<br />This website is not designed for mobile devices. Please use a desktop or laptop for the full experience.<br />🚫🚫
      </div>
    );
  }

  if (isMobile === null) return null;

  return (
    <div className="app">
      <div className="header">
        <h1>Biola University Campus Map</h1>
        <SearchBar
          onSearch={handleSearch} 
          buildings={filteredSearchResults}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={handleBuildingSelect}
          showDirections={showDirections}
          setDirection={setDirection}
        />
      </div>
      <div className="main-content">
        <div className="left-panel">
          <BuildingDirectory 
            buildings={filteredBuildings}
            categories={categories}
            expandedCategories={expandedCategories}
            onBuildingSelect={handleBuildingSelect}
            onCategoryToggle={toggleCategory}
            selectedBuilding={selectedBuilding}
          />
        </div>
        <div className="center-panel">
          <CampusMap 
            buildings={filteredBuildings}
            onBuildingSelect={handleBuildingSelect}
            selectedBuilding={selectedBuilding}
          />
        </div>
        <div className="right-panel">
          <InfoPanel 
            building={selectedBuilding}
            categories={categories}
            setDirection={setDirection}
          />
        </div>
      </div>
    </div>
  );
}

export default App;