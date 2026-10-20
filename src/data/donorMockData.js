// Donor-specific mock data
// Separated from global mockData.js for clean code organisation

export const DONOR_STATS = [
  { id: 1, label: 'Active Listings',    value: 2,    sub: 'Ready for rescue',        icon: 'ListOrdered',  color: 'emerald' },
  { id: 2, label: 'Pending Requests',   value: 0,    sub: 'Awaiting decision',        icon: 'Inbox',        color: 'amber'   },
  { id: 3, label: 'Pickups Scheduled',  value: 1,    sub: 'In transit or slated',     icon: 'CalendarClock',color: 'sky'     },
  { id: 4, label: 'Completed',          value: 1,    sub: 'Successfully delivered',   icon: 'CheckCircle2', color: 'green'   },
  { id: 5, label: 'Total Donated',      value: '130',sub: 'portions / items shared',  icon: 'TrendingUp',   color: 'lime'    },
];

export const DONOR_MY_POSTINGS = [
  {
    id: 'meal-d001',
    title: 'Rice & Vegetable Curry Feast',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80',
    quantity: '50 portions',
    location: 'Vavuniya',
    safeUntil: '8:30 PM',
    status: 'Available',
    requests: 0,
    postedAgo: 'Just now',
    donorName: 'Green Leaf Hotel',
  },
  {
    id: 'meal-d002',
    title: 'Coconut Milk Fish Curry & String Hoppers',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
    quantity: '30 portions',
    location: 'Vavuniya',
    safeUntil: '9:00 PM',
    status: 'Requested',
    requests: 2,
    postedAgo: '15m ago',
    donorName: 'Green Leaf Hotel',
  },
];

export const DONOR_INCOMING_REQUESTS = [
  {
    id: 'req-001',
    orgName: 'Hope Shelter',
    orgType: 'Welfare Home',
    avatar: 'HS',
    meal: 'Coconut Milk Fish Curry & String Hoppers',
    portions: '30 portions',
    message: "We have 45 residents who haven't had dinner yet. This would be a tremendous help.",
    requestedAt: '10 minutes ago',
    distance: '1.8 km',
    phone: '+94 24 222 1188',
    status: 'pending',
    rating: 4.8,
  },
  {
    id: 'req-002',
    orgName: 'Sunrise Orphanage',
    orgType: "Children's Home",
    avatar: 'SO',
    meal: 'Coconut Milk Fish Curry & String Hoppers',
    portions: '30 portions',
    message: 'We urgently need food for 28 children tonight. Please consider our request.',
    requestedAt: '25 minutes ago',
    distance: '3.2 km',
    phone: '+94 77 456 7890',
    status: 'pending',
    rating: 4.9,
  },
];

export const DONOR_PICKUP_SCHEDULE = [
  {
    id: 'ps-001',
    meal: 'Traditional Feast & Vegetable Curries',
    recipient: 'Child Care & Welfare Center',
    avatar: 'CC',
    driver: 'Mr. Kumaran',
    driverPhone: '+94 77 111 2233',
    pickupTime: 'Today, 7:30 PM',
    portions: '50 portions',
    status: 'confirmed',
    distance: '2.1 km',
  },
];

export const DONOR_HISTORY = [
  {
    id: 'dh-001',
    meal: 'Fragrant Chicken Biryani & Mint Raita',
    recipient: 'Hope Shelter',
    date: 'Oct 18, 2026',
    portions: '75 portions',
    rating: 5,
    co2: '12.5 kg CO₂e saved',
    status: 'completed',
  },
  {
    id: 'dh-002',
    meal: 'Coconut Sambol & Pol Roti Breakfast',
    recipient: 'Sunrise Orphanage',
    date: 'Oct 15, 2026',
    portions: '40 portions',
    rating: 5,
    co2: '6.2 kg CO₂e saved',
    status: 'completed',
  },
  {
    id: 'dh-003',
    meal: 'Wedding Banquet Surplus — Rice & Curries',
    recipient: 'Vavuniya Elder Care',
    date: 'Oct 10, 2026',
    portions: '120 portions',
    rating: 4,
    co2: '20.1 kg CO₂e saved',
    status: 'completed',
  },
];
