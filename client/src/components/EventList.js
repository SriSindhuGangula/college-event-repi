import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';

const EventList = ({ events, onEdit, onDelete, onNotify, showActions = false, showRegister = false }) => {
  const [search, setSearch] = useState('');

  if (!events) return <div className="loading">Loading events...</div>;

  // Filter events by search query
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.description.toLowerCase().includes(search.toLowerCase()) ||
    (event.tags && event.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="event-container">
      <h2 className="event-header">Upcoming Events</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search events by name, description, or tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
        aria-label="Search events"
      />

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>No events found. Try a different search or create a new event.</p>
          <Link to="/create" className="create-btn">+ Create Event</Link>
        </div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <h3 className="event-title">
                  <Link to={`/events/${event._id}`}>{event.name}</Link>
                </h3>
                <span className="event-date">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
              </div>

              <p className="event-location">
                <strong>Location:</strong>{' '}
                {event.location?.lat && event.location?.lng ? (
                  <a
                    href={`https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-link"
                  >
                    {event.locationName || `${event.location.lat}, ${event.location.lng}`}
                  </a>
                ) : (
                  event.locationName || 'No location set'
                )}
              </p>

              <p className="event-description">{event.description}</p>

              {event.tags?.length > 0 && (
                <div className="tag-container">
                  {event.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              {showRegister && event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register-button"
                >
                  Register Now
                </a>
              )}

              {showActions && (
                <div className="action-buttons">
                  <button onClick={() => onEdit(event._id)} className="icon-btn edit-btn" aria-label="Edit event">✏️</button>
                  <button onClick={() => onDelete(event._id)} className="icon-btn delete-btn" aria-label="Delete event">🗑️</button>
                  <button onClick={() => onNotify(event._id)} className="icon-btn notify-btn" aria-label="Notify users">🔔</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
