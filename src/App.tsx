import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { OTPVerification } from './components/OTPVerification';
import { Dashboard } from './components/Dashboard';
import { OrderDetails } from './components/OrderDetails';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'otp' | 'dashboard' | 'order-details'>('login');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated]);

  const handleViewChange = (view: 'login' | 'signup' | 'otp' | 'dashboard' | 'order-details') => {
    setCurrentView(view);
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('order-details');
  };

  const handleBackToDashboard = () => {
    setSelectedOrderId(null);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {currentView === 'login' && <LoginForm onViewChange={handleViewChange} />}
        {currentView === 'signup' && <SignupForm onViewChange={handleViewChange} />}
        {currentView === 'otp' && <OTPVerification onViewChange={handleViewChange} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && <Dashboard onOrderSelect={handleOrderSelect} />}
      {currentView === 'order-details' && selectedOrderId && (
        <OrderDetails orderId={selectedOrderId} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;