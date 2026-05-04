import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children, adminOnly = false, noGuest = false }) {
  const { user, loading, isGuest, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) return <Navigate to="/login" replace />;

  // Guest trying to access user-only pages
  if (noGuest && isGuest) return <Navigate to="/login" replace />;

  // Non-admin trying to access admin pages
  if (adminOnly && !isAdmin) return <Navigate to="/home" replace />;

  return children;
}