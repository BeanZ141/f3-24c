## Ticket Management system
### Project | f3-24c
A web-based application for ticket registration and verification, featuring QR code generation and secure email delivery via SendGrid.

## Overview
This project provides a secure and streamlined way to register and verify event attendees. It leverages Firebase for database management, Supabase for ticket storage, and Twilio SendGrid to deliver QR codes and ticket IDs to registered users via email.

## Features
- User Registration: Collects attendee information and securely stores it.
- Email Verification: Sends QR codes and ticket IDs to registered users.
- QR Code Generation: Creates QR codes for easy ticket scanning and verification.
- Ticket Validation: Real-time ticket verification with Supabase.
- Responsive UI: User-friendly and responsive interface.

## Prerequisites
- Node.js (version 14 or later)
- Firebase CLI (for Firebase integration)
- Supabase Account (for Database management)
- SendGrid API Key (for email functionality)

## Dependencies
- Node.js - JavaScript runtime
- Firebase - Hosting
- Supabase - Real-time database for ticket management, database and authentication
- Twilio SendGrid - Email API for delivering tickets and QR codes