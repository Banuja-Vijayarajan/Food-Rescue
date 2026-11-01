# Food Rescue

Food Rescue is a food-surplus redistribution system that connects food donors with verified recipient organizations. Its purpose is to reduce food waste and deliver safe, usable food to communities that need it.

## How the System Works

1. A donor posts available surplus food with its quantity, ingredients, safe-consumption time, pickup location, storage details, and a photo.
2. Registered recipient organizations receive system and SMS alerts. Call alerts can be enabled or disabled by the organization.
3. A recipient organization searches the available food and filters it by category, location, or distance.
4. The organization views the food details and submits a request for the required number of portions.
5. The donor reviews the request and accepts or declines it.
6. After acceptance, both parties can follow the pickup and handover process.
7. Completed donations are recorded for history, reporting, and impact tracking.


## Project Structure

Food-Rescue/
├── index.html                              # Main HTML document
├── package.json                            # Project scripts and package list
├── vite.config.js                          # Application build configuration
├── tailwind.config.js                      # Utility-style configuration
├── postcss.config.js                       # CSS processing configuration
├── public/
│   └── food-rescue-logo.png                # Food Rescue logo asset
└── src/
    ├── main.jsx                            # Application entry point
    ├── App.jsx                             # Page state, roles, listings, and portal routing
    ├── components/
    │   ├── Navbar.jsx                      # Public navigation, theme, login, and registration
    │   ├── Footer.jsx                      # Platform links and regional contact information
    │   ├── CallAlertBanner.jsx             # Automated alert information banner
    │   ├── CallAlertSimulationModal.jsx    # Donor-to-recipient call alert simulation
    │   ├── EvaluationSwitcher.jsx          # Legacy evaluation component; not mounted in App
    │   └── donor/
    │       └── DonorShared.jsx             # Shared donor badges and interface elements
    ├── pages/
    │   ├── HomePage.jsx                    # Public landing page and available-food feed
    │   ├── LoginPage.jsx                   # Donor, recipient, and admin demo login
    │   ├── RegisterPage.jsx                # Donor and recipient organization registration
    │   ├── donor/
    │   │   ├── DonorLayout.jsx             # Donor portal sidebar, topbar, and page routing
    │   │   ├── DonorDashboardPage.jsx      # Donor statistics and operational overview
    │   │   ├── PostFoodPage.jsx            # Surplus post form, ingredients, and food images
    │   │   ├── DonorDonationsPage.jsx      # Donor listing and donation management
    │   │   ├── DonorRequestsPage.jsx       # Incoming recipient request decisions
    │   │   ├── DonorPickupPage.jsx         # Pickup schedule and handover logistics
    │   │   ├── DonorHistoryPage.jsx        # Completed donation and impact history
    │   │   └── DonorProfilePage.jsx        # Editable donor profile and deactivation
    │   ├── recipient/
    │   │   ├── RecipientLayout.jsx         # Recipient portal routing, profile, and alerts
    │   │   ├── RecipientDashboardPage.jsx  # Recipient activity overview
    │   │   ├── AvailableFoodPage.jsx       # Search, category, location, and distance filters
    │   │   ├── RecipientRequestsPage.jsx   # Food request history and status tracking
    │   │   └── RecipientPickupPage.jsx     # Recipient pickup and handover tracking
    │   └── admin/
    │       ├── AdminLayout.jsx             # Admin portal shell and navigation
    │       ├── AdminDashboardPage.jsx      # Platform-wide operational dashboard
    │       ├── AdminUsersPage.jsx          # User and organization management
    │       ├── AdminVerificationPage.jsx   # Organization verification workflow
    │       ├── AdminDonationsPage.jsx      # Donation monitoring and administration
    │       ├── AdminReportsPage.jsx        # Reports and issue management
    │       ├── AdminAnalyticsPage.jsx      # Analytics and report exports
    │       └── AdminSettingsPage.jsx       # System information and audit settings
    ├── data/
    │   ├── mockData.js                     # Public listings, impact data, and workflow content
    │   ├── donorMockData.js                # Donor statistics, requests, and pickup data
    │   ├── recipientMockData.js            # Recipient profile, requests, and pickup data
    │   └── adminMockData.js                # Admin users, donations, reports, and analytics
    └── styles/
        ├── index.css                       # Main stylesheet imports
        ├── main.css                        # Shared application layout styles
        ├── global.css                      # Colors, design tokens, buttons, and base styles
        ├── navbar.css                      # Public navbar and logo styling
        ├── home.css                        # Home page, food cards, and modal styling
        ├── auth.css                        # Login and registration page styling
        ├── components.css                  # Footer and shared component styling
        ├── donor-dashboard.css             # Donor portal and shared portal styles
        ├── recipient-dashboard.css         # Recipient portal and alert preference styles
        └── admin-dashboard.css             # Admin portal tables, cards, and layouts
        
## Project Structure

Make sure Node.js and npm are installed, then open a terminal inside the `Food-Rescue` project folder.

### 1. Install packages

```bash
npm install
```

### 2. Start the project

```bash
npm run dev
```

Open the address displayed in the terminal, normally `http://localhost:5173`.

### 3. Create a production build

```bash
npm run build
```

The production files are generated in the `dist/` folder.

### 4. Preview the production build

```bash
npm run preview
```
