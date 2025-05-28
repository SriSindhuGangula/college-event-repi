// server/controllers/eventController.js
const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
   const { name, date, description, location, locationName, registrationLink, tags } = req.body;

    // Check if user exists, otherwise assign null to createdBy
    const createdBy = req.user ? req.user.id : null;

    const event = new Event({
      name,
      date,
      description,
      location,
      locationName,       // NEW
      registrationLink,   // NEW
      tags,
      createdBy, // If user is not authenticated, set as null
    });

    await event.save();
 // Find users whose tags match event.tags
    const interestedUsers = await User.find({ tags: { $in: tags } });

    // Send notifications to those users
    interestedUsers.forEach(user => {
      sendEventNotificationEmail(user.email, user.name, event).catch(console.error);
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Event creation failed', details: err.message });
  }
};
