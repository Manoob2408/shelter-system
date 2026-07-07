import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AnimalList } from './pages/AnimalList';
import { AnimalDetail } from './pages/AnimalDetail';
import { AnimalForm } from './pages/AnimalForm';
import { StatsPage } from './pages/StatsPage';
import { Admins } from './pages/Admins';
import { Login } from './pages/Login';

function ProtectedLayout() {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/login" replace />;
  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/animals" element={<AnimalList />} />
              <Route path="/animals/new" element={<AnimalForm />} />
              <Route path="/animals/:id" element={<AnimalDetail />} />
              <Route path="/animals/:id/edit" element={<AnimalForm />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/admins" element={<Admins />} />
            </Routes>
          </div>
        </main>
      </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { admin } = useAuth();
  if (admin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
                path="/login"
                element={<PublicRoute><Login /></PublicRoute>}
            />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}
