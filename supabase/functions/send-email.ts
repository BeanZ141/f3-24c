import { serve } from "https://deno.land/std@0.113.0/http/server.ts";

const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY");
const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN");

serve(async (req) => {
const { recipient_email, ticket_id } = await req.json();

const emailData = {
from: `Your Event <no-reply@${mailgunDomain}>`,
to: recipient_email,
subject: "Your Ticket Registration",
text: `Thank you for registering! Your ticket ID is: ${ticket_id}`,
};

const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
method: "POST",
headers: {
Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
"Content-Type": "application/x-www-form-urlencoded",
},
body: new URLSearchParams(emailData),
});

return response.ok 
    ? new Response("Email sent successfully", { status: 200 })
    : new Response("Failed to send email", { status: 500 });
});
