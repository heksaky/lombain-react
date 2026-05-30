import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import LombaDetail from './pages/LombaDetail';
import Bookmark from './pages/Bookmark';
import Kalender from './pages/Kalender';
import ArtikelPage from './pages/ArtikelPage';
import ArtikelDetailPage from './pages/ArtikelDetailPage';

function UserRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.isLocalAdmin) return <Navigate to="/admin" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isLocalAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  if (!user) return children;
  if (user.isLocalAdmin) return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

      {/* Semua halaman user pakai Layout (sidebar otomatis muncul) */}
      <Route path="/dashboard"   element={<UserRoute><Layout><Dashboard /></Layout></UserRoute>} />
      <Route path="/profile"     element={<UserRoute><Layout><Profile /></Layout></UserRoute>} />
      <Route path="/bookmark"    element={<UserRoute><Layout><Bookmark /></Layout></UserRoute>} />
      <Route path="/kalender"    element={<UserRoute><Layout><Kalender /></Layout></UserRoute>} />
      <Route path="/lomba/:id"   element={<UserRoute><Layout><LombaDetail /></Layout></UserRoute>} />
      <Route path="/artikel"     element={<UserRoute><Layout><ArtikelPage /></Layout></UserRoute>} />
      <Route path="/artikel/:id" element={<UserRoute><Layout><ArtikelDetailPage /></Layout></UserRoute>} />

      {/* Admin punya sidebar sendiri */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}