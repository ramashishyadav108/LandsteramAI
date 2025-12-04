import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import GoogleCallback from './components/Auth/GoogleCallback';
import VerifyEmail from './components/Auth/VerifyEmail';
import { Dashboard } from './components/Dashboard';
import { LeadsPage, LeadDetailsPage, AddLeadPage } from './components/Leads';
import { MeetingsPage } from './components/Meetings';
import { ApplicationManagementPage, ApplicationOverviewPage } from './components/ApplicationManagement';
import ProfilePage from './pages/ProfilePage';
import ScorecardTestPage from './pages/ScorecardTestPage';
import ScorecardCalculator from './pages/ScorecardCalculator';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Leads */}
          <Route path="/deal-sourcing/create-leads" element={<LeadsPage />} />
          <Route path="/deal-sourcing/leads-detail" element={<LeadsPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/new" element={<AddLeadPage />} />
          <Route path="/leads/:id" element={<LeadDetailsPage />} />
          {/* Meetings */}
          <Route path="/meetings" element={<MeetingsPage />} />
          {/* Application Management */}
          <Route path="/application-management" element={<ApplicationOverviewPage />} />
          <Route path="/application-management/:leadId" element={<ApplicationManagementPage />} />
          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* Scorecard Test */}
          <Route path="/scorecard-test" element={<ScorecardTestPage />} />
          {/* Scorecard Calculator */}
          <Route path="/scorecard" element={<ScorecardCalculator />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
