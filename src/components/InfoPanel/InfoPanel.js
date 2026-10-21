import React, { useEffect, useState } from 'react';
import './InfoPanel.css';

const InfoPanel = ({ building, categories, setDirection }) => {
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [openHours, setOpenHours] = useState('Loading...');
  const [showModal, setShowModal] = useState(false);
  const [fullOpenHours, setFullOpenHours] = useState(null);
  const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

  useEffect(() => {
    if (!building) return;

    // Fetch full row from aoi_info
    const fetchDetailedInfo = async () => {
      try {
        const res = await fetch(`https://biola-map-live-production.up.railway.app/aoi_info/${building.aoi_id}`);
        const data = await res.json();
        setDetailedInfo(data[0]); // Should be only one row
      } catch (err) {
        console.error('Error fetching building info:', err);
        setDetailedInfo(null);
      }
    };

    // Fetch open hours for current day
    const fetchOpenHours = async () => {
      try {
        const res = await fetch(`https://biola-map-live-production.up.railway.app/open_hours_value/${building.aoi_id}?day=${currentDay}`);
        const data = await res.json();
        setOpenHours(data[0]?.[currentDay] || 'Unavailable');
      } catch (err) {
        console.error('Error fetching open hours:', err);
        setOpenHours('Unavailable');
      }
    };

    fetchDetailedInfo();
    fetchOpenHours();
  }, [building, currentDay]);

  if (!building) {
    return (
      <div className="info-panel empty">
        <div className="empty-message">
          <p>Select a building or area of interest to display information.</p>
        </div>
      </div>
    );
  }

  if (!detailedInfo) {
    return (
      <div className="info-panel empty">
        <p>Loading building details...</p>
      </div>
    );
  }

  // Fetch full open hours
  const fetchFullOpenHours = async () => {
    try {
      const res = await fetch(`https://biola-map-live-production.up.railway.app/open_hours/${building.aoi_id}`);
      const data = await res.json();
      setFullOpenHours(data[0]); // open_hours table only returns one row per building
      setShowModal(true); // Show modal after data is loaded
    } catch (err) {
      console.error('Error fetching full open hours:', err);
      setFullOpenHours(null);
    }
  };

  // Find the matching category name
  const categoryName = categories.find((cat) => cat.category_id === detailedInfo.category_id)?.category_name || 'Uncategorized';

  // Dynamically load image from the public/images folder
  const imageSrc = detailedInfo.image_filename ? `/images/${detailedInfo.image_filename}` : null;

  return (
    <>
      <div className="info-panel">
        <div className="info-header">
          <h2>{detailedInfo.aoi_name}</h2>
          <span className="building-id">#{detailedInfo.aoi_id}</span>
        </div>
  
        <div className="building-image-container">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={detailedInfo.aoi_name}
              className="building-image"
              width="300"
              height="200"
            />
          ) : (
            <div className="building-image fallback">No image available</div>
          )}
        </div>
  
        <div className="info-details">
          <div className="info-section">
            <h3>Building Description</h3>
            <p>{detailedInfo.description || 'N/A'}</p>
          </div>
  
          <div className="info-section">
            <h3>Today's Hours of Operation</h3>
            <p>{openHours}</p>
          </div>
  
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{categoryName}</span>
            </div>
  
            <div className="info-item">
              <span className="info-label">Need an Eagle ID?</span>
              <span className="info-value">
                {detailedInfo.requires_id ? 'Yes' : 'No'}
              </span>
            </div>
  
            <div className="info-item">
              <span className="info-label">Restrooms</span>
              <span className="info-value">
                {detailedInfo.has_restroom ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
  
          <div className="action-buttons">
            <button className="action-button primary" onClick={() => setDirection(true)}>Directions To Here</button>
            <button className="action-button secondary" onClick={() => setDirection(true)}>Directions From Here</button>
            <button
              className="action-button tertiary"
              onClick={fetchFullOpenHours}
            >
              View Full Open Hours
            </button>
          </div>
        </div>
      </div>
  
      {showModal && fullOpenHours && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
            <h2>Full Open Hours</h2>
            <div className="hours-grid">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="hours-item">
                  <span className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  <span className="day-hours">{fullOpenHours[day] || 'Unavailable'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoPanel;