## Ticketease — Unified Ticketing Platform (f3-24c)

Ticketease is a unified ticketing platform that brings discovery, booking, and entry verification for travel and events into a single, seamless experience. Users can search and compare flights, hotels, trains, and events, complete secure checkout, and receive instant digital tickets. Organizers benefit from fast on-site validation and real-time attendance insights.

### Key Features
- Search and compare across categories: flights, hotels, trains, and events
- Guided checkout with instant, secure digital ticket issuance
- Unique ticket identifiers with on-site validation and attendance logging
- Responsive, accessible UI with fast load and clear status feedback
- Real-time data updates and filtering for a smooth browsing experience

### How It Works (High-Level)
1. Users discover and filter inventory, then confirm a booking via a streamlined flow.
2. Upon successful payment/confirmation, a unique ticket is issued and attached to the user.
3. At the venue, tickets are verified and usage is recorded; attendance is logged in real time.

### Tech Overview
- Frontend: Static web app (HTML/CSS/JS)
- Backend services: Supabase (data and authentication)
- Hosting: Firebase Hosting (static site)
- Scanning & Validation: Client-side scanning with server-validated ticket checks

### Data Model (Summary)
- Travel & Events: `flights`, `hotels`, `trains`, `events`
- Ticketing: `ticket_ids` (issued/used status), `Registrations` (user-to-ticket), `attendance_log` (check-ins)

Full schema setup and migration steps are documented here: [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (URL + anon key)
- Firebase CLI (optional, for local hosting emulation and deployment)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase project and provision the tables using the migration guide.
4. Configure credentials securely:
   - Prefer runtime configuration (e.g., environment variables or hosting config)
   - Never commit secrets; do not hardcode keys in source control

### Run Locally
- Quick dev server (any static server works):
  ```bash
  npx serve public
  ```
- Or with Firebase Hosting emulator:
  ```bash
  firebase emulators:start --only hosting
  ```

### Deployment
Deploy the static site to Firebase Hosting:
```bash
firebase deploy --only hosting
```

---

## Security & Compliance
- Enable Row Level Security (RLS) policies on Supabase tables (see migration guide)
- Store secrets outside of source control and rotate regularly
- Validate tickets server-side and log attendance events reliably

---

## Roadmap
- Organizer dashboard (inventory management, analytics, exports)
- Multi-gateway payments and refunds
- Loyalty and saved preferences
- Advanced search and recommendations
- Email/SMS ticket delivery and reminders

---

## Contributing
Issues and pull requests are welcome. Please open an issue to discuss substantial changes.

## License
No license specified. If you intend to open-source, add a `LICENSE` file (e.g., MIT/Apache-2.0). Otherwise, all rights reserved by default.
