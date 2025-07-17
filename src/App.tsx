import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NeighborhoodsPage from './pages/NeighborhoodsPage';
import NeighborhoodPage from './pages/NeighborhoodPage';
import ListingDetailPage from './pages/ListingDetailPage';
import SubmitListingPage from './pages/SubmitListingPage';
import SubmitHighlightPage from './pages/SubmitHighlightPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import FeedbackPage from './pages/FeedbackPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import EnvTestPage from './pages/EnvTestPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/neighborhoods" element={<NeighborhoodsPage />} />
        <Route path="/neighborhood/:id" element={<NeighborhoodPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/submit-listing" element={<SubmitListingPage />} />
        <Route path="/submit-highlight" element={<SubmitHighlightPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/env-test" element={<EnvTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;