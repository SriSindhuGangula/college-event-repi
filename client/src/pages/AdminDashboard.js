
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    description: '',
    location: { lat: '', lng: '' },
    locationName: '',
    tags: [],
    registrationLink: ''
  });
  const [message, setMessage] = useState('');
  const { id } = useParams(); // Get event id if available
  const history = useHistory();

  // Fetch events
  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to view events.');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setMessage('Failed to fetch events');
    }
  };

  useEffect(() => {
  if (id) {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => {
        const event= res.data;
         const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
         setEventData({
           ...event,
           date: formattedDate,
           location: event.location || { lat: '', lng: '' },
           locationName: event.locationName || '',
         });
        })
      .catch(err => {
        console.error('Error fetching event data for editing:', err);
        setMessage('Failed to fetch event for editing');
      });
  } else {
    fetchEvents(); // For new event creation
  }
}, [id]);

  const handleChange = (e) => {
    if (e.target.name === 'tags') {
      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
      setEventData({ ...eventData, tags: selected });
    } else {
      setEventData({ ...eventData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create an event.');
      return;
    }

    try {
      if (id) {
        // If in edit mode, update the event
        await axios.put(`http://localhost:5000/api/events/${id}`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Event updated successfully!');
      } else {
        // Create a new event
        await axios.post('http://localhost:5000/api/events', eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Event created successfully!');
      }
      setEventData({
       name: '',
       date: '',
       description: '',
       location: { lat: '', lng: '' },
       locationName: '',
       tags: [],
       registrationLink: ''
      });

      fetchEvents();
      history.push('/admin-dashboard');
    } catch (err) {
      console.error('Axios Error:', err);
      setMessage('An error occurred while saving the event');
    }
  };

  const handleDelete = async (eventId) => {
     console.log('Deleting event with ID:', eventId);
  const token = localStorage.getItem('token');
  if (!token) {
    setMessage('You must be logged in to delete an event.');
    return;
  }

  if (!window.confirm('Are you sure you want to delete this event?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMessage('Event deleted successfully!');
    fetchEvents();
  } catch (err) {
    console.error('Error deleting event:', err);
    setMessage('Failed to delete event');
  }
};
const handleNotify = async (eventId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    setMessage('You must be logged in to send notifications.');
    return;
  }

  try {
    await axios.post(
      `http://localhost:5000/api/events/${eventId}/notify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMessage('Notifications sent successfully!');
  } catch (err) {
    console.error('Failed to send notifications:', err);
    setMessage('Failed to send notifications.');
  }
};


  return (
    <div className="container">
      <h2>{id ? 'Edit Event' : 'Create New Event'}</h2> {/* Conditional Heading */}
      <EventForm
        eventData={eventData}
        handleChange={handleChange}
        setEventData={setEventData} // ✅ Add this
        handleSubmit={handleSubmit}
        isEdit={!!id}
      />
      {message && (
        <p style={{ marginTop: '10px', color: message.includes('Failed') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
      <h3 style={{ marginTop: '40px' }}>All Events</h3>
      <EventList 
       events={events}
       onEdit={(eventId) => history.push(`/admin-dashboard/edit/${eventId}`)}
       onDelete={handleDelete}
      showActions={true}
      onNotify={handleNotify}
      />

    </div>
  );
};

export default AdminDashboard;


