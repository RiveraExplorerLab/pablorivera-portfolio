# Pablo Rivera Portfolio

A personal portfolio site built with React, TypeScript, and Firebase.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Markdown**: Marked + DOMPurify

## Features

- 📝 **Blog** - Markdown-based blog posts with tags
- 🛠️ **Projects** - Project showcase with tech stack, links, and access control
- 👥 **Community** - Newsletter and early access signups
- 🔐 **Admin Panel** - Full CMS for managing content
- 🎯 **Access Requests** - Users can request access to gated projects

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase account with Blaze (pay-as-you-go) plan
- Firebase CLI: `npm install -g firebase-tools`

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/RiveraExplorerLab/pablorivera-portfolio.git
   cd pablorivera-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore, Authentication (Email/Password), and Storage
   - Upgrade to Blaze plan

4. Create admin user:
   - Firebase Console → Authentication → Users → Add user
   - Use your email and a secure password

5. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase config values from Project Settings.

6. Deploy security rules:
   ```bash
   firebase login
   firebase use --add  # Select your project
   firebase deploy --only firestore:rules,storage
   firebase deploy --only firestore:indexes
   ```

7. Start development server:
   ```bash
   npm run dev
   ```

### Deployment

```bash
npm run deploy  # Build and deploy to Firebase Hosting
```

## Project Structure

```
src/
├── lib/           # Firebase services and utilities
├── hooks/         # React hooks for data fetching
├── providers/     # Context providers (Auth)
├── routes/        # Page components
├── components/    # Reusable UI components
├── helpers/       # Utility functions
└── data/          # Static data (stack)
```

## Admin Access

1. Navigate to `/login`
2. Sign in with your admin email
3. Access admin panel at `/admin`

### Admin Routes

- `/admin` - Posts and Projects management
- `/admin/community` - Newsletter and early access signups
- `/admin/access` - Access requests and granted access

## Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Data Model

### Collections

- `blogPosts` - Blog posts with markdown content
- `projects` - Project entries with tech stack and access control
- `communitySignups` - Newsletter and early access signups
- `accessRequests` - User requests for project access
- `projectAccess` - Granted access records

## License

MIT
