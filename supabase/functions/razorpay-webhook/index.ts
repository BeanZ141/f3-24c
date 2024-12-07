const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const razorpaySecret = process.env.RAZORPAY_SECRET;
const supabaseUrl = "https://xiwdkytqnabqawssehrg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function handleRazorpayWebhook(req, res) {
    const receivedSignature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body)
        .digest('hex');

    if (receivedSignature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const { order_id, payment } = payload;
        const { email, name, phone } = payment.entity;

        try {
            const { data: userData, error: userError } = await supabase
                .from('Registrations')
                .insert([
                    {
                        name: name || "Anonymous",
                        email: email || "N/A",
                        phone: phone || "N/A",
                        dateOfAttendance: new Date().toISOString(),
                        status: 'confirmed'
                    }
                ]);

            if (userError) {
                throw userError;
            }

            const { data: ticketData, error: ticketError } = await supabase
                .from('ticket_ids')
                .select('tickets')
                .eq('registered', false)
                .eq('used', false)
                .limit(1);

            if (ticketError || ticketData.length === 0) {
                throw new Error('No available tickets');
            }

            const ticketId = ticketData[0].tickets;

            await supabase
                .from('ticket_ids')
                .update({ registered: true })
                .eq('tickets', ticketId);

            await supabase
                .from('Registrations')
                .update({ registeredTicketId: ticketId })
                .eq('email', email); // Assuming email is unique

            console.log('User successfully registered and ticket assigned.');
            return res.status(200).send('Webhook received and processed');
        } catch (error) {
            console.error('Error processing webhook:', error);
            return res.status(500).send('Database error');
        }
    } else {
        return res.status(400).send('Unhandled event type');
    }
}

module.exports = { handleRazorpayWebhook };
