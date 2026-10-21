import React, { useRef, useEffect, useState } from 'react';
import './CampusMap.css';
import mapImage from '../../assets/campus-map.png';

const CampusMap = ({ buildings, selectedBuilding, onBuildingSelect, currentPath }) => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle zoom in/out
  const handleZoom = (direction) => {
    setZoom(prevZoom => {
      const newZoom = direction === 'in' 
        ? Math.min(prevZoom + 0.1, 2.5)
        : Math.max(prevZoom - 0.1, 0.8);
      
      // Calculate the new position to maintain the current view relative to the zoom
      const mapRect = mapRef.current.getBoundingClientRect();
      const centerX = mapRect.width / 2;
      const centerY = mapRect.height / 2;

      const scaleFactor = newZoom / prevZoom;

      const newX = centerX - (centerX - position.x) * scaleFactor;
      const newY = centerY - (centerY - position.y) * scaleFactor;

      setPosition({ x: newX, y: newY });
  
      return newZoom;
    });
  };

  // Handle map drag to move around
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Add event listeners for mouse up outside the map
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Center the map initially
  useEffect(() => {
    if (mapRef.current && !hasInitialized) {
      const mapRect = mapRef.current.getBoundingClientRect();
      const centerX = mapRect.width / 2;
      const centerY = mapRect.height / 2;
  
      // Center the map in the viewport
      setPosition({
        x: centerX - (750 * zoom),
        y: centerY - (545 * zoom)
      });
  
      // Set initialized to true to avoid rerunning
      setHasInitialized(true);
    }
  }, []);

  // Center the map on a selected building
  useEffect(() => {
    if (selectedBuilding && mapRef.current && hasInitialized) {
      const mapRect = mapRef.current.getBoundingClientRect();
      const centerX = mapRect.width / 2;
      const centerY = mapRect.height / 2;
  
      // Only recenter if the map hasn't been dragged or zoomed manually
      if (!dragging) {
        setPosition({
          x: centerX - (selectedBuilding.coordinates.x * zoom),
          y: centerY - (selectedBuilding.coordinates.y * zoom)
        });
      }
    }
  }, [selectedBuilding]);

  return (
    <div className="campus-map-container">
      <div className="clear-button-container">
        <button onClick={() => onBuildingSelect(null)} className="clear-button">
          CLEAR
        </button>
      </div>
      <div className="map-controls">
        <button onClick={() => handleZoom('in')} className="zoom-button">+</button>
        <button onClick={() => handleZoom('out')} className="zoom-button">−</button>
      </div>
      
      <div 
        className="campus-map"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={mapRef}
      >
        <div 
          className="map-content" 
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            backgroundImage: `url(${mapImage})`,
            backgroundColor: '#f0f0f0',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Building Markers */}
          {buildings.map(building => (
            <div 
              key={building.aoi_id}
              className={`building-marker ${selectedBuilding?.aoi_id === building.aoi_id ? 'selected' : ''}`}
              style={{ 
                left: `${building.coordinates.x}px`, 
                top: `${building.coordinates.y}px`
              }}
              onClick={() => onBuildingSelect(building.aoi_id)}
            >
              <div className="marker-label">{building.aoi_id}</div>
              {selectedBuilding?.aoi_id === building.aoi_id && (
                <div className="selected-building-name">{building.aoi_name}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusMap;