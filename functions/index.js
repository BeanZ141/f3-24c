const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

require('dotenv').config();
const express = require('express');
const mailgun = require('mailgun-js');
const cors = require('cors');
const app = express();
const PORT = 5500;

const mg = mailgun({
apiKey: process.env.MAILGUN_API_KEY,
domain: process.env.MAILGUN_DOMAIN,
});

app.use(cors());
app.use(express.json());

app.post('/send-email', (req, res) => {
const { name, email, ticketId } = req.body;

const emailData = {
    from: 'Your Event <mailgun@sandboxe5457533522246b98ad1eb17e65483a1.mailgun.org>',
    to: email,
    subject: 'Your Ticket Registration',
    text: `Thank you for registering, ${name}! Your ticket ID is: ${ticketId}`,
    html: `<h1>Thank you for registering, ${name}!</h1><p>Your ticket ID is: <strong>${ticketId}</strong></p>`,
};

mg.messages().send(emailData, (error, body) => {
    if (error) {
        console.error('Mailgun Error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log('Mailgun Response:', body);
    res.status(200).json({ message: 'Email sent successfully', body });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
