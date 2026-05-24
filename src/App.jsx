import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Hanya user biasa (bukan admin lokal)
function UserRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.isLocalAdmin) return <Navigate to="/admin" replace />;
  return children;
}

// Hanya admin lokal (login admin/123)
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isLocalAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

// Hanya untuk yang belum login
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

      {/* Halaman user biasa */}
      <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
      <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
      <Route path="/bookmark" element={<UserRoute><Bookmark /></UserRoute>} />
      <Route path="/kalender" element={<UserRoute><Kalender /></UserRoute>} />
      <Route path="/lomba/:id" element={<UserRoute><LombaDetail /></UserRoute>} />
      <Route path="/artikel" element={<UserRoute><ArtikelPage /></UserRoute>} />      {/* ← tambah */}
      <Route path="/artikel/:id" element={<UserRoute><ArtikelDetailPage /></UserRoute>} /> {/* ← tambah */}

      {/* Halaman admin lokal */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
