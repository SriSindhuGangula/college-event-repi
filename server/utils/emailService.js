// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendRegistrationEmail = async (to, name, event, mode = 'creation') => {
  const { name: eventName, date, description, location, locationName, registrationLink } = event;

  let mapsUrl = '';
  if (location && location.lat && location.lng) {
    mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  } else if (locationName) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
  }

  const subject = mode === 'manual'
    ? `Reminder: Don't Miss Out on "${eventName}"`
    : `New Event: ${eventName}`;

  const intro = mode === 'manual'
    ? `<p>Just a quick reminder about this exciting upcoming event:</p>`
    : `<p>We have a new event that might interest you:</p>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <p>Hi ${name},</p>
      ${intro}
      <h3>${eventName}</h3>
      <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Location:</strong> <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">${locationName || 'View Location'}</a></p>
      ${
        registrationLink
          ? `<p><strong>Register here:</strong> <a href="${registrationLink}" target="_blank" rel="noopener noreferrer">${registrationLink}</a></p>`
          : ''
      }
      <p>Looking forward to your participation!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendRegistrationEmail };
