# Food Rescue - Smart Food Surplus Redistribution System (Frontend)

A modern, responsive web application designed to connect commercial food donors (hotels, caterers, restaurants) with verified recipient organizations (orphanages, shelters, community kitchens) to prevent food waste and help communities in need.

---

## 🚀 Key Features


### 1. Home Page
Hero Section: Headline ("Turn Surplus Food Into Shared Hope"), CTA buttons, and interactive - Recently Donated Meals : card with image carousel.
How It Works: 5-step workflow explaining the food donation lifecycle from posting to handover.
Browse Available Food: Live surplus meals feed with real-time search, category filters, and district filters.
Impact & Analytics : 5 metrics showing rescued meals, food weight, partner count, and CO₂e saved.
About Section: Two dedicated cards for **Food Donors** and **Recipient Organizations** with feature checklists and registration links.
Orderly Navigation: Navbar links smoothly scroll down sequentially 
(`Home` → `How It Works` → `Available Food` → `Impact` → `About`).

### 2. Register Page
Dynamic Header: Changes automatically based on selected role:
  -Food Donor Registration
  -Recipient Organization Registration
Role Selection Cards: Choose between **Food Donor** and **Recipient Org**.
  - Includes a security notice stating Administrator accounts cannot be self-registered.
Complete Form : Organization Name, Category dropdown, Contact Person, Direct Phone, Official Email, Business/NGO ID, Password, Address, City/Region, and Mission Description.

### 3. Login Page
1-Click Accounts: Instant evaluation buttons to test credentials for:
  - **Donor**: Green Leaf Hotel
  - **Recipient**: Hope Shelter
  - **Admin**: System Supervisor
Security Features : Password show/hide toggle, Remember Me checkbox, and Forgot Password link.

### 4. Interactive Features
Evaluation Role Switcher: Floating bottom-left pill for testing different user views with 1 click.
Automated Call Alert Simulation : Interactive modal demonstrating how an automated phone call rings nearby shelters when a donor posts surplus food.

---
 ## Technologies Used

- **React 18**: Frontend UI library
- **Vite**: Ultra-fast build tool and development server
- **Vanilla CSS (Modular)**: Clean CSS classes and variables organized inside `src/styles/`
- **Tailwind CSS**: Utility classes and theme color mappings
- **Lucide React**: Modern and clean icons

---

##  Project Structure

```
frontend_1/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                    # Application entry point
│   ├── App.jsx                     # Main layout, routing, and state
│   ├── components/
│   │   ├── Navbar.jsx              # Header with navigation & theme switch
│   │   ├── Footer.jsx              # Regional hub details & platform links
│   │   ├── EvaluationSwitcher.jsx  # Floating bottom-left role switcher
│   │   └── CallAlertSimulationModal.jsx # Live phone call simulation popup
│   ├── pages/
│   │   ├── HomePage.jsx            # Home page with all 5 sections
│   │   ├── LoginPage.jsx           # Sign in page with 1-click demo accounts
│   │   └── RegisterPage.jsx        # Registration with dynamic headings
│   ├── data/
│   │   └── mockData.js             # Temporary default data before backend connection
│   └── styles/
│       ├── index.css               # Main stylesheet bundle
│       ├── global.css              # Color tokens, buttons, and base reset
│       ├── navbar.css              # Navigation bar styles
│       ├── home.css                # Home page, cards, and grid styles
│       ├── auth.css                # Login and Register form styling
│       └── components.css          # Footer, About section, and modal styling
```

---

## 🔌 Default (Mock) Data & Backend Integration

Until  Node.js / Express and MongoDB backend is connected, the application uses temporary default data:

| File | What It Currently Contains | How to Connect to Backend Later |
|---|---|---|
| `src/data/mockData.js` | Initial meal listings, impact metrics, and user profiles | Replace with API fetch requests (`GET /api/donations`, `GET /api/analytics`) |
| `src/pages/LoginPage.jsx` | 1-Click demo accounts and simulated sign-in | Connect `handleLoginSubmit` to `POST /api/auth/login` |
| `src/pages/RegisterPage.jsx` | Form state with mock success timeout | Connect `handleSubmit` to `POST /api/auth/register` |
| `src/App.jsx` | Local React state for meal postings and claims | Connect `handleMealPosted` to `POST /api/donations` and `handleClaimMeal` to `PUT /api/donations/:id/claim` |

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
👉 **http://localhost:5174/** (or the port shown in your terminal).

### 3. Build for Production
```bash
npm run build
```

---


