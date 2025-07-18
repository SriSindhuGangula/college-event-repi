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

import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import './EventForm.css';

const EventForm = ({ eventData, handleChange, handleSubmit, setEventData, isEdit }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [customTag, setCustomTag] = useState('');

  const handleLocationSelect = ({ lat, lng, locationName }) => {
    setEventData(prev => ({
      ...prev,
      location: { lat, lng },
      locationName: locationName || ''
    }));
  };

  const handleLocationNameChange = (e) => {
    setEventData(prev => ({
      ...prev,
      locationName: e.target.value
    }));
  };

  const handleTagAdd = () => {
    if (customTag && !eventData.tags.includes(customTag)) {
      setEventData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag]
      }));
      setCustomTag('');
    }
  };

  const handleTagRemove = (tag) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.name.trim()) newErrors.name = 'Event name is required';
    if (!eventData.date) newErrors.date = 'Event date is required';
    if (!eventData.description.trim()) newErrors.description = 'Description is required';
    if (!eventData.location) newErrors.location = 'Please select a location on the map';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage('');
    setTimeout(() => {
      handleSubmit();
      setLoading(false);
      setSuccessMessage(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
    }, 1500); // Simulate network delay
  };

  return (
    <form onSubmit={onSubmit} className="form" aria-label="Event Form">
      <h2>{isEdit ? 'Edit Event' : 'Create Event'}</h2>

      {successMessage && <p className="success">{successMessage}</p>}

      <label className="label">Event Name</label>
      <input
        type="text"
        name="name"
        value={eventData.name}
        onChange={handleChange}
        required
        className={`input ${errors.name ? 'error' : ''}`}
        placeholder="Enter event name"
      />
      {errors.name && <small className="error-text">{errors.name}</small>}

      <label className="label">Event Date</label>
      <input
        type="date"
        name="date"
        value={eventData.date}
        onChange={handleChange}
        required
        className={`input ${errors.date ? 'error' : ''}`}
      />
      {errors.date && <small className="error-text">{errors.date}</small>}

      <label className="label">Description</label>
      <textarea
        name="description"
        value={eventData.description}
        onChange={handleChange}
        maxLength={300}
        required
        className={`textarea ${errors.description ? 'error' : ''}`}
      />
      <small>{eventData.description.length}/300 characters</small>
      {errors.description && <small className="error-text">{errors.description}</small>}

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
      {errors.location && <small className="error-text">{errors.location}</small>}

      <div style={{ margin: '15px 0' }}>
        <LocationPicker onLocationSelect={handleLocationSelect} />
      </div>

      <label className="label">Tags</label>
      <div className="tag-container">
        {eventData.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag} <button type="button" onClick={() => handleTagRemove(tag)}>x</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={customTag}
        onChange={(e) => setCustomTag(e.target.value)}
        placeholder="Add custom tag"
        className="input"
      />
      <button type="button" onClick={handleTagAdd} className="button small">
        Add Tag
      </button>

      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm;

