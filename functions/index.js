require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('@supabase/supabase-js');
const functions = require('firebase-functions');

const app = express();
app.use(express.json());

const razorpaySecret = process.env.RAZORPAY_SECRET;

app.post('/webhook', async (req, res) => {
    const receivedSignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(body)
        .digest('hex');

    if (receivedSignature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const { order_id, email, name, phone } = payload.payment.entity;

        try {
            await supabase.from('Registrations').insert({
                name: name || "Anonymous", 
                email: email || "N/A",
                phone: phone || "N/A",
                dateOfAttendance: new Date().toISOString(),
                orderId: order_id,
                status: 'confirmed'
            });

            console.log('User successfully registered via webhook.');
            return res.status(200).send('Webhook received');
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).send('Database error');
        }
    } else {
        return res.status(400).send('Unhandled event type');
    }
});

exports.app = functions.https.onRequest(app);
