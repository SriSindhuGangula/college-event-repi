const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  locationName: { type: String, required: true },
  tags: [{ type: String }],
  registrationLink: { type: String, required: false }

});

module.exports = mongoose.model('Event', EventSchema);
