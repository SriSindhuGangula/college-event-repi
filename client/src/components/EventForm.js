/*
import React from 'react';
import LocationPicker from './components/LocationPicker';
import './EventForm.css'; // Optional: Create separate styles or reuse AdminDashboard.css

const EventForm = ({ eventData, handleChange, handleSubmit, isEdit }) => {
  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">Event Name</label>
      <input
        type="text"
        name="name"
        value={eventData.name}
        onChange={handleChange}
        required
        className="input"
      />

      <label className="label">Event Date</label>
      <input
        type="date"
        name="date"
        value={eventData.date}
        onChange={handleChange}
        required
        className="input"
      />

      <label className="label">Description</label>
      <textarea
        name="description"
        value={eventData.description}
        onChange={handleChange}
        required
        className="textarea"
      />

      <label className="label">Location</label>
      <input
        type="text"
        name="location"
        value={eventData.location}
        onChange={handleChange}
        required
        className="input"
      />

      <label className="label">Tags</label>
      <select
        multiple
        name="tags"
        value={eventData.tags}
        onChange={handleChange}
        className="input"
        style={{ height: '100px' }}
      >
        <option value="Coding">Coding</option>
        <option value="AI">AI</option>
        <option value="Robotics">Robotics</option>
        <option value="IOT">IOT</option>
        <option value="Sports">Sports</option>
      </select>

      <button type="submit" className="button">
        {isEdit ? 'Update Event' : 'Create Event'} 
      </button>
    </form>
  );
};

export default EventForm; */

import React from 'react';
import LocationPicker from './LocationPicker';
import './EventForm.css';

const EventForm = ({ eventData, handleChange, handleSubmit, setEventData, isEdit }) => {
  const handleLocationSelect = ({ lat, lng, locationName }) => {
  setEventData(prev => ({
    ...prev,
    location: { lat, lng },
    locationName: locationName
  }));
};

  const handleLocationNameChange = (e) => {
    setEventData(prev => ({
      ...prev,
      locationName: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">Event Name</label>
      <input
        type="text"
        name="name"
        value={eventData.name}
        onChange={handleChange}
        required
        className="input"
      />

      <label className="label">Event Date</label>
      <input
        type="date"
        name="date"
        value={eventData.date}
        onChange={handleChange}
        required
        className="input"
      />

      <label className="label">Description</label>
      <textarea
        name="description"
        value={eventData.description}
        onChange={handleChange}
        required
        className="textarea"
      />
      <label className="label">Registration Form Link (optional)</label>
      <input
       type="url"
       name="registrationLink"
       value={eventData.registrationLink || ''}
       onChange={handleChange}
       placeholder="https://example.com/register"
       className="input"
      />

      <label className="label">Event Location</label>

      {/* Show input only after selecting on map */}
      {eventData.location && (
        <>
          <input
            type="text"
            name="locationName"
            value={eventData.locationName}
            onChange={handleLocationNameChange}
            required
            className="input"
            placeholder="Enter location name (e.g. Seminar Hall)"
          />

          <div className="input" style={{ marginTop: 5 }}>
            Coordinates: {eventData.location.lat}, {eventData.location.lng}
          </div>
        </>
      )}

      {/* Map below */}
      <div style={{ margin: '15px 0' }}>
        <LocationPicker onLocationSelect={handleLocationSelect} />
      </div>

      <label className="label">Tags</label>
      <select
        multiple
        name="tags"
        value={eventData.tags}
        onChange={handleChange}
        className="input"
        style={{ height: '100px' }}
      >
        <option value="Coding">Coding</option>
        <option value="AI">AI</option>
        <option value="Robotics">Robotics</option>
        <option value="IOT">IOT</option>
        <option value="Sports">Sports</option>
      </select>

      <button type="submit" className="button">
        {isEdit ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm; 
 
