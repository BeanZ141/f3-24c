require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const functions = require('firebase-functions');
const supabase = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

app.post('/create-order', async (req, res) => {
    const { paymentAmount, userInfo } = req.body;

    if (!paymentAmount || !userInfo) {
        return res.status(400).send('Invalid request body');
    }

    const options = {
        amount: paymentAmount * 100,
        currency: 'INR',
        receipt: `order_rcptid_${Date.now()}`
    };

    try {
        const order = await razorpayInstance.orders.create(options);

        await supabase.from('Registrations').insert({
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            dateOfAttendance: userInfo.dateOfAttendance,
            orderId: order.id,
            status: 'pending'
        });

        const paymentUrl = `https://checkout.razorpay.com/v1/checkout.js?order_id=${order.id}&key=${razorpayInstance.key_id}`;

        res.status(200).json({ 
            orderId: order.id, 
            keyId: razorpayInstance.key_id,
            paymentUrl: paymentUrl
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).send('Error creating order');
    }
});

app.post('/webhook', async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

    if (receivedSignature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const { order_id } = payload.payment.entity;

        try {
            await supabase.from('Registrations')
                .update({ status: 'confirmed' })
                .eq('orderId', order_id);

            console.log('User registration confirmed via webhook.');
            return res.status(200).send('Webhook received');
        } catch (error) {
            console.error('Error updating registration:', error);
            return res.status(500).send('Database update error');
        }
    } else {
        return res.status(400).send('Unhandled event type');
    }
});

exports.app = functions.https.onRequest(app);
