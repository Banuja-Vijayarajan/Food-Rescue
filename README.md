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

## Public Website

The public home page introduces the platform, explains the food-rescue process, displays available surplus food, and shows community-impact information.

Visitors can browse basic food listings, but they must register or sign in as an organization before viewing complete details or requesting food.

The system supports registration and login for food donors and recipient organizations. Administrator access is available through the demo login.

## Food Donor Portal

The donor portal allows hotels, restaurants, caterers, bakeries, and other food providers to:

- view donation, request, pickup, and impact summaries;
- post surplus food with ingredients and safety information;
- upload a food photo or select a default photo;
- manage active and previous food listings;
- review incoming requests from recipient organizations;
- accept or decline food requests;
- follow scheduled pickups and handovers;
- view donation history and impact records;
- edit the donor profile;
- deactivate the donor account;
- sign out and return to the home page.

## Recipient Organization Portal

The recipient portal is designed for registered welfare organizations, shelters, orphanages, and community food programs. It allows an organization to:

- view active requests, pickups, and rescued-food summaries;
- search available surplus food;
- filter food by category, location, distance, and availability;
- view food, donor, storage, ingredient, and safety details;
- request a required number of portions;
- track request decisions and pickup progress;
- edit the welfare organization profile;
- deactivate the organization account;
- manage notification preferences;
- sign out and return to the home page.

System alerts and SMS alerts for new donor posts are always enabled. Automated call alerts are optional and can be disabled by the recipient organization.

## Admin Portal

The admin portal provides overall control and monitoring of the platform. Administrators can:

- view platform activity and operational summaries;
- manage users and organizations;
- review and process organization verification requests;
- monitor food donations and their statuses;
- review reported issues;
- view analytics and generate reports;
- inspect system information and audit records;
- sign out and return to the home page.

## User Roles

| Role | Main responsibility |
|---|---|
| Public Visitor | Learn about the platform and browse basic surplus-food information |
| Food Donor | Post surplus food and manage requests, pickups, and donation records |
| Recipient Organization | Find suitable food, submit requests, and coordinate collection |
| Administrator | Verify organizations and supervise users, donations, reports, and platform activity |

## Project Structure

```text
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
```

## How to Run the Project

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

## Current Project Status

The current system is an interactive demonstration. Login, registration, alerts, image uploads, profile updates, and account deactivation are simulated within the application. Data may reset when the page is refreshed.
