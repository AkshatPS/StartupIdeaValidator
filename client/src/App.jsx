import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import NewIdeaForm from "./pages/NewIdeaForm";
import ValidationPage from "./pages/ValidationPage";
import ReportPage from "./pages/ReportPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import AuthCallbackPage from "./pages/AuthCallbackPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes are accessible to everyone */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        {/* --- Protected Routes --- */}
        {/* These routes are only accessible to authenticated users */}
        {/* The ProtectedRoute component will check for a token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-idea" element={<NewIdeaForm />} />
          <Route path="/validate/:ideaId" element={<ValidationPage />} />
          <Route path="/edit-idea/:ideaId" element={<NewIdeaForm />} />
          <Route path="/report/:ideaId" element={<ReportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* --- Catch-all Route --- */}
        {/* This will render for any path that doesn't match the above routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
