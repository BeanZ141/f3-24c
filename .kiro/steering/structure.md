# Project Structure

## Root Directory
```
├── public/              # Static web assets (served by Firebase Hosting)
├── functions/           # Firebase Functions (currently minimal)
├── supabase/           # Supabase configuration and functions
├── node_modules/       # npm dependencies
├── .firebase/          # Firebase deployment cache
├── .git/              # Git repository
├── .kiro/             # Kiro AI assistant configuration
└── .vscode/           # VS Code workspace settings
```

## Public Directory (Frontend)
```
public/
├── index.html          # Main landing page
├── category/           # Category-specific pages (flights, hotels, etc.)
├── scanner/            # QR code scanning interface
├── css/               # Stylesheets organized by feature
│   ├── styles.css     # Main styles
│   ├── themes.css     # Theme system (light/dark)
│   ├── navbar.css     # Navigation styles
│   └── *.css          # Feature-specific styles
├── js/                # JavaScript modules
│   ├── index.js       # Main page logic
│   ├── database.js    # Supabase client and data operations
│   ├── login-signup.js # Authentication logic
│   ├── theme.js       # Theme switching
│   └── *.js           # Feature-specific scripts
├── images/            # Static assets (logos, icons, etc.)
└── extensions/        # Additional UI components
```

## Backend Structure
```
supabase/
├── functions/         # Edge functions
│   └── razorpay-webhook/ # Payment webhook handler
└── .temp/            # Supabase CLI temporary files

functions/
└── api/              # Firebase Functions (placeholder)
```

## Configuration Files
- `package.json` - npm dependencies and build scripts
- `firebase.json` - Firebase Hosting configuration
- `.firebaserc` - Firebase project settings
- `.gitignore` - Git ignore patterns
- `README.md` - Project documentation

## Naming Conventions
- **HTML files**: kebab-case (e.g., `book-ticket.html`, `check-in.html`)
- **CSS files**: kebab-case matching functionality (e.g., `login-popup.css`)
- **JS files**: kebab-case for modules (e.g., `login-signup.js`)
- **Directories**: lowercase with hyphens where needed
- **IDs/Classes**: kebab-case in HTML/CSS, camelCase in JavaScript

## File Organization Principles
- Group related functionality together (CSS + JS for same feature)
- Keep static assets in dedicated directories
- Separate concerns: authentication, theming, data operations
- Use descriptive filenames that indicate purpose
- Maintain consistent structure across similar pages

## Key Pages
- `index.html` - Main landing with service grid
- `dashboard.html` - User dashboard and ticket management
- `book-ticket.html` - Booking flow interface
- `check-in.html` - Ticket validation interface
- `category/*.html` - Category-specific search pages
- `scanner/*.html` - QR code scanning interface