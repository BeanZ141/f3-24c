# Technology Stack

## Architecture
- **Frontend**: Static web application (HTML/CSS/JavaScript)
- **Backend**: Supabase (database, authentication, real-time features)
- **Hosting**: Firebase Hosting for static site deployment
- **Build System**: Webpack with Babel for JavaScript transpilation
- **Package Manager**: npm

## Key Dependencies
### Frontend Libraries
- **Supabase JS**: `@supabase/supabase-js` - Database and auth client
- **HTML5 QR Code**: `html5-qrcode` - QR code scanning functionality
- **HTML2Canvas**: `html2canvas` - Ticket generation and rendering
- **Font Awesome**: Icon library for UI components

### Backend Services
- **Express.js**: Server framework for API endpoints
- **Razorpay**: Payment processing integration
- **Mailgun**: Email service for notifications
- **CORS**: Cross-origin resource sharing middleware

### Development Tools
- **Webpack**: Module bundler and build tool
- **Babel**: JavaScript transpiler for browser compatibility
- **Prettier**: Code formatting
- **CSS Loader**: CSS processing in webpack

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Development build with watch mode
npm run watch

# Development build
npm run build:dev

# Serve locally (any static server)
npx serve public

# Firebase local emulator
firebase emulators:start --only hosting
```

### Production
```bash
# Production build
npm run build
# or
npm run build:prod

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Database
- Use Supabase CLI for database migrations and management
- Row Level Security (RLS) policies must be enabled on all tables
- Real-time subscriptions for live updates

## Environment Configuration
- Store Supabase URL and anon key as environment variables
- Never commit secrets to source control
- Use Firebase hosting environment config for production secrets