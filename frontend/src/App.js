import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import RecommendationHistory from './components/pages/RecommendationHistory';
import RecommendationsPage from './components/pages/RecommendationsPage';
import RecommendationDetailPage from './components/pages/RecommendationDetailPage';
import HistoryDetailPage from './components/pages/HistoryDetailPage';
import TermsOfService from './components/pages/TermsOfService';
import Analytics from './components/pages/Analytics';
import CropLibrary from './components/pages/CropLibrary';
import WeatherDashboard from './components/pages/WeatherDashboard';
import SoilAnalysis from './components/pages/SoilAnalysis';
import MarketPrices from './components/pages/MarketPrices';
import UserProfile from './components/pages/UserProfile';
import About from './components/pages/About';
import { AuthProvider, useAuth } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

// Wrapper to force remount of Analytics on user change
function AnalyticsWithKey() {
  const { user } = useAuth();
  return <Analytics key={user?._id || 'guest'} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Navbar />
            <main className="app-route-shell">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <RecommendationHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <RecommendationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendation/:id"
                element={
                  <ProtectedRoute>
                    <RecommendationDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history/:id"
                element={
                  <ProtectedRoute>
                    <HistoryDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsWithKey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crops"
                element={
                  <ProtectedRoute>
                    <CropLibrary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/weather"
                element={
                  <ProtectedRoute>
                    <WeatherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/soil-analysis"
                element={
                  <ProtectedRoute>
                    <SoilAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/market-prices"
                element={
                  <ProtectedRoute>
                    <MarketPrices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              
              {/* Catch-all - redirect to home */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;