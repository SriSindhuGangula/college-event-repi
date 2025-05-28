import React from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';

const EventList = ({ events, onEdit, onDelete, onNotify, showActions = false, showRegister = false }) => {
  if (!events) return <div>Loading events...</div>;

  return (
    <div className="event-container">
      <h2>Upcoming Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="event-list">
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <Link to={`/events/${event._id}`} className="event-title">
                <h3>{event.name}</h3>
              </Link>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p>
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
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Tags:</strong> {event.tags?.join(', ')}</p>

              {showRegister && event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register-button"
                >
                  Register
                </a>
              )}

              {showActions && (
                <>
                  <button onClick={() => onEdit(event._id)} className="edit-button">Edit</button>
                  <button onClick={() => onDelete(event._id)} className="delete-btn">Delete</button>
                  <button onClick={() => onNotify(event._id)} className="notify-button">Send Notifications</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
