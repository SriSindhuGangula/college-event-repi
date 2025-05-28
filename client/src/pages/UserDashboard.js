import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventList from '../components/EventList'; // Adjust path if needed
import './UserDashboard.css';

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to view events.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setMessage('Failed to fetch events.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      {message && <p className="message">{message}</p>}
      <EventList events={events} showActions={false} showRegister={true} />
    </div>
  );
};

export default UserDashboard;
