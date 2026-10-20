# Food Rescue - Smart Food Surplus Redistribution System (Frontend)

A modern, responsive web application designed to connect commercial food donors (hotels, caterers, restaurants) with verified recipient organizations (orphanages, shelters, community kitchens) to prevent food waste and help communities in need.

---

## Key Features

### 1. Home Page
- **Hero Section**: Headline (*"Turn Surplus Food Into Shared Hope"*), call-to-action buttons, and interactive recently donated meals showcase with image carousel.
- **How It Works**: 5-step intuitive workflow explaining the food donation lifecycle from posting to verification and handover.
- **Browse Available Food**: Real-time surplus meals feed with dynamic search, category filters, and district filters.
- **Impact & Analytics**: Live metrics tracking rescued meals, food weight saved, partner organizations, and CO₂e emissions avoided.
- **About Section**: Dedicated information cards for **Food Donors** and **Recipient Organizations** with feature checklists and instant registration links.
- **Orderly Navigation**: Smooth scroll navigation across all sections 
(`Home` → `How It Works` → `Available Food` → `Impact` → `About`).

### 2. Food Donor Portal (Dashboard & Management)
A dedicated, role-based workspace for hotels, restaurants, and caterers:
- **Donor Dashboard (`/donor`)**:
  - Live summary statistics (Active Listings, Pending Requests, Scheduled Pickups, Completed Donations, Total Portions Shared).
  - Quick action buttons (Post Food, View Requests, Scheduled Pickups).
  - Active listings overview with live status badges.
  - Recent incoming requests preview and scheduled pickups list.
  - Environmental Impact widget (CO₂e saved and meals rescued).
- **Post Food Surplus (`/donor/post`)**:
  - Clean donation creation form: Meal Title, Food Category (Rice & Curry, Bakery, Prepared meals, etc.), Quantity / Portions, Safe-Until Expiry Time, Pickup Location, Dietary Tags (Vegetarian, Halal, etc.), and Storage Instructions.
  - Instant trigger for automated recipient call alert simulation.
- **My Donations (`/donor/donations`)**:
  - Manage all posted surplus listings with search and status filter pills (`All`, `Available`, `Requested`, `Accepted`, `Collected`).
  - Request counters and quick action controls (Edit, Cancel / Delete).
- **Incoming Requests (`/donor/requests`)**:
  - Review recipient organizations requesting surplus food.
  - Organization details (shelter name, distance, contact phone, resident count, message).
  - Instant **Accept** and **Decline** actions with real-time UI status updates.
- **Pickup Schedule (`/donor/pickups`)**:
  - Track assigned drivers, scheduled pickup time slots, vehicle details, recipient organization info, and contact numbers.
- **Collapsible Sidebar Navigation**: Fast navigation between Dashboard, Post Food, Donations, Requests, and Pickups with badge counts.

### 3. Authentication & Onboarding
- **Dynamic Register Page**:
  - Switches form fields dynamically between **Food Donor** and **Recipient Organization**.
  - Collects Organization Name, Category, Contact Person, Direct Phone, Email, Business/NGO Registration ID, Location/Address, and Mission.
  - Includes a security notice stating Administrator accounts cannot be self-registered.
- **Login Page with 1-Click Evaluation Accounts**:
  - Instant demo login buttons for fast testing:
    - **Donor**: Green Leaf Hotel
    - **Recipient**: Hope Shelter
    - **Admin**: System Supervisor
  - Security features: Password visibility toggle, Remember Me option, and Forgot Password simulation.

### 4. Interactive Simulation Tools
- **Role Switcher**: Floating bottom-left evaluation pill allowing 1-click switching between `Visitor / Guest`, `Food Donor`, `Recipient Org`, and `System Admin`.
- **Automated Call Alert Simulation**: Interactive simulation modal showing how automated IVR phone calls ring nearby shelters as soon as surplus food is posted.

---

##  Technologies Used

- **React 18**: Modern component-based frontend UI architecture
- **Vite**: Ultra-fast build tool and development server
- **Vanilla CSS (Modular)**: Clean CSS classes and CSS custom properties (variables) organized inside `src/styles/`
- **Tailwind CSS**: Utility classes and theme color mappings
- **Lucide React**: Crisp, modern icon set

---

##  Project Structure

```
Food-Rescue/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                        # Application entry point
│   ├── App.jsx                         # Main app routing, role handling & state
│   ├── components/
│   │   ├── Navbar.jsx                  # Main header with navigation links & login triggers
│   │   ├── Footer.jsx                  # Regional hub contacts & platform links
│   │   ├── EvaluationSwitcher.jsx      # Floating bottom-left role switcher
│   │   ├── CallAlertSimulationModal.jsx# Live phone call simulation popup
│   │   └── donor/
│   │       └── DonorShared.jsx         # Shared donor components (StatusBadge, etc.)
│   ├── pages/
│   │   ├── HomePage.jsx                # Landing page with all 5 public sections
│   │   ├── LoginPage.jsx               # Sign-in page with 1-click demo accounts
│   │   ├── RegisterPage.jsx            # Dynamic donor/recipient registration form
│   │   └── donor/
│   │       ├── DonorLayout.jsx         # Donor portal shell with sidebar & header
│   │       ├── DonorDashboardPage.jsx  # Main donor overview dashboard
│   │       ├── PostFoodPage.jsx        # Food surplus donation form
│   │       ├── DonorDonationsPage.jsx  # Donor active & past listings management
│   │       ├── DonorRequestsPage.jsx   # Incoming recipient requests & approval flow
│   │       └── DonorPickupPage.jsx     # Scheduled pickups & driver tracking
│   ├── data/
│   │   ├── mockData.js                 # Global mock data (public listings, metrics, users)
│   │   └── donorMockData.js            # Donor-specific mock data (stats, requests, pickups)
│   └── styles/
│       ├── index.css                   # Main global stylesheet bundle
│       ├── global.css                  # Color design tokens, buttons & base reset
│       ├── navbar.css                  # Public navigation bar styles
│       ├── home.css                    # Home page hero, cards & grid styles
│       ├── auth.css                    # Login and Register form styling
│       ├── components.css              # Footer, About cards & modal styling
│       └── donor-dashboard.css         # Donor portal layout, sidebar, tables & cards
```

---

## 🔌 Mock Data & Backend Integration Guide

The frontend currently uses structured mock data in `src/data/`, ready for smooth transition to a Node.js / Express + MongoDB backend:

| File / Component | Current Mock Data | Backend API Endpoint |
|---|---|---|
| `src/data/mockData.js` | Public surplus meal listings & impact statistics | `GET /api/donations/public`, `GET /api/analytics` |
| `src/data/donorMockData.js` | Donor stats, listings, requests & pickup schedules | `GET /api/donor/dashboard`, `GET /api/donor/stats` |
| `src/pages/donor/PostFoodPage.jsx` | Submits new surplus food item to state | `POST /api/donations` |
| `src/pages/donor/DonorDonationsPage.jsx` | Filterable list of donor's posted meals | `GET /api/donor/donations`, `DELETE /api/donations/:id` |
| `src/pages/donor/DonorRequestsPage.jsx` | Recipient requests with Accept/Decline action | `PUT /api/requests/:id/accept`, `PUT /api/requests/:id/reject` |
| `src/pages/donor/DonorPickupPage.jsx` | Confirmed driver pickup details | `GET /api/donor/pickups` |
| `src/pages/LoginPage.jsx` | 1-Click test accounts & simulated sign-in | `POST /api/auth/login` |
| `src/pages/RegisterPage.jsx` | Multi-role registration form data | `POST /api/auth/register` |

---

## 💻 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
 **http://localhost:5173/** (or the port shown in your terminal).

### 3. Switch to Food Donor View
- Click the floating **Role Switcher** pill at the bottom-left corner and select **"Food Donor"**, or:
- Click **"Sign In"** in the top navigation, click the **"Donor: Green Leaf Hotel"** quick button, and submit.

### 4. Build for Production
```bash
npm run build
```
Checks for TypeScript/JSX syntax errors and generates optimized production assets in `dist/`.
