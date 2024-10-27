const express = require('express');
const { sendEmail } = require('./sendEmail');
const app = express();
app.use(express.json());

app.post('/send-ticket-email', (req, res) => {
    const { email, ticketId, qrCode } = req.body;

    const subject = 'Your Ticket Confirmation';
    const text = `Thank you for your registration! Your Ticket ID is: ${ticketId}`;
    const html = `<strong>Your Ticket ID:</strong> ${ticketId}<br><img src="${qrCode}" alt="QR Code">`;

    sendEmail(email, subject, text, html)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Error sending email' });
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
