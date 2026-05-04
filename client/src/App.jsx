import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Signup   from './pages/Signup';
import Home     from './pages/Home';
import AIPage   from './pages/AIPage';
import Saved    from './pages/Saved';
import History  from './pages/History';
import Pantry from './pages/Pantry';
import NotFound from './pages/NotFound';

import AdminDashboard        from './pages/admin/Dashboard';
import ManageRecipes         from './pages/admin/ManageRecipes';
import ManageUsers           from './pages/admin/ManageUsers';
import ManageIngredients     from './pages/admin/ManageIngredients';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"       element={<Landing />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected — any logged in user (including guest) */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Protected — users only (no guest) */}
          <Route path="/ai"   element={<ProtectedRoute noGuest><AIPage /></ProtectedRoute>} />
          <Route path="/saved"   element={<ProtectedRoute noGuest><Saved /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute noGuest><History /></ProtectedRoute>} />
          <Route path="/pantry" element={<ProtectedRoute noGuest><Pantry /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin"                    element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/recipes"            element={<ProtectedRoute adminOnly><ManageRecipes /></ProtectedRoute>} />
          <Route path="/admin/users"              element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/ingredients"        element={<ProtectedRoute adminOnly><ManageIngredients /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}