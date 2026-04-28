import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Toaster } from 'react-hot-toast';

import GroupHome from './pages/GroupHome';
import PharmacyLayout from './components/PharmacyLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Cart from './pages/Cart';
import About from './pages/About';
import AdminPortal from './pages/AdminPortal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(undefined);

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (user === undefined) return null; // Wait for auth check
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

// Global layout for pages outside a specific pharmacy (e.g. login, profile, group home)
function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen selection:bg-pharmacy-accent selection:text-white bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '100px', fontWeight: 'bold' } }} />
      <Routes>
        {/* Group Home */}
        <Route path="/" element={<GlobalLayout><GroupHome /></GlobalLayout>} />
        
        {/* Global Pages */}
        <Route path="/about" element={<GlobalLayout><About /></GlobalLayout>} />
        <Route path="/login" element={<GlobalLayout><Login /></GlobalLayout>} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <GlobalLayout><Profile /></GlobalLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <GlobalLayout><AdminPortal /></GlobalLayout>
          </ProtectedRoute>
        } />

        {/* Individual Pharmacy Portal */}
        <Route path="/:pharmacyId" element={<PharmacyLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
