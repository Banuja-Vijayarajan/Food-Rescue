import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CallAlertSimulationModal from './components/CallAlertSimulationModal';
import EvaluationSwitcher from './components/EvaluationSwitcher';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorLayout from './pages/donor/DonorLayout';
import { INITIAL_FOOD_POSTINGS } from './data/mockData';

export default function App() {
  // Theme state with localStorage persistence (Default: Deep Forest Dark Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('foodrescue-theme') || 'dark';
  });

  // Navigation state: 'home' | 'login' | 'register'
  const [currentPage, setCurrentPage] = useState('home');

  // Evaluation Role state: 'visitor' | 'donor' | 'recipient' | 'admin'
  const [currentRole, setCurrentRole] = useState('visitor');

  // Interactive Call Simulation modal state
  const [callModalOpen, setCallModalOpen] = useState(false);

  // Dynamic food listings state
  const [foodListings, setFoodListings] = useState(INITIAL_FOOD_POSTINGS);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('foodrescue-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Callback when a donor posts a new meal
  const handleMealPosted = (newMealData) => {
    const newEntry = {
      id: `meal-${Date.now()}`,
      title: newMealData.title,
      donorName: newMealData.donorName,
      donorType: 'Hotel & Banquets',
      rating: '5.0',
      portions: newMealData.portions,
      status: 'Requested',
      timeAgo: 'Just now',
      availableUntil: '11:30 PM today (2h left)',
      location: 'Vavuniya Town (1.2 km)',
      district: 'Vavuniya',
      category: 'Prepared meals',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      description: 'Emergency banquet surplus claimed directly via automated IVR telephone dispatch by ' + newMealData.recipient,
      storage: 'Insulated hot carriers',
      callAlertSent: true,
    };
    setFoodListings([newEntry, ...foodListings]);
  };

  // Callback when a meal is requested
  const handleClaimMeal = (mealId) => {
    setFoodListings(prev => prev.map(m => {
      if (m.id === mealId) {
        return { ...m, status: 'Requested' };
      }
      return m;
    }));
  };

  // If logged in as donor, show the full Donor Dashboard
  if (currentRole === 'donor') {
    return (
      <>
        <DonorLayout
          setCurrentPage={setCurrentPage}
          setCurrentRole={setCurrentRole}
          foodListings={foodListings}
          onMealPosted={handleMealPosted}
        />
        {/* Floating Role Switcher — still accessible inside dashboard */}
        <EvaluationSwitcher
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          setCurrentPage={setCurrentPage}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Banner was removed as requested by user */}

      {/* Main Navigation */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenCallSim={() => setCallModalOpen(true)}
      />

      {/* Main Pages */}
      <div className="flex-grow">
        {currentPage === 'home' && (
          <HomePage 
            foodListings={foodListings}
            setCurrentPage={setCurrentPage}
            onOpenCallSim={() => setCallModalOpen(true)}
            currentRole={currentRole}
            onClaimMeal={handleClaimMeal}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage 
            setCurrentPage={setCurrentPage}
            setCurrentRole={setCurrentRole}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage 
            setCurrentPage={setCurrentPage}
            setCurrentRole={setCurrentRole}
          />
        )}
      </div>

      {/* Footer */}
      <Footer 
        setCurrentPage={setCurrentPage}
        onOpenCallSim={() => setCallModalOpen(true)}
      />

      {/* Floating 1-Click Evaluation Switcher (Bottom-Left Pill) */}
      <EvaluationSwitcher 
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        setCurrentPage={setCurrentPage}
      />

      {/* Interactive Call Alert Simulation Modal */}
      <CallAlertSimulationModal 
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        onMealPosted={handleMealPosted}
      />
    </div>
  );
}
