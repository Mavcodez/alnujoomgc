import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Pill, Calendar, Menu, X, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { PharmacyInfo } from '../data/pharmacies';

interface NavbarProps {
  pharmacyInfo?: PharmacyInfo;
}

export default function Navbar({ pharmacyInfo }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        if (u.email === 'manavgujaran@gmail.com') {
           setIsAdmin(true);
        } else {
           const adminDoc = await getDoc(doc(db, 'admins', u.uid));
           setIsAdmin(adminDoc.exists());
        }
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate(basePath || '/');
  };

  const basePath = pharmacyInfo ? `/${pharmacyInfo.id}` : '';

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-24 items-center">
          {/* Leftside: Back button & Links (Desktop) */}
          <div className="flex items-center gap-6 flex-1">
            {/* If in a pharmacy, show back button to group */}
            {pharmacyInfo && (
              <Link to="/" className="text-slate-400 hover:text-pharmacy-primary transition-colors hidden sm:flex items-center gap-2 delay-75" title="Back to Group">
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Group Home</span>
              </Link>
            )}

            {/* Desktop Links (Left) */}
            <div className="hidden md:flex items-center space-x-8">
              {pharmacyInfo && (
                <>
                  <Link to={`${basePath}/shop`} className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-bold">Shop</Link>
                  <Link to={`${basePath}/appointments`} className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-bold">Appointments</Link>
                </>
              )}
              {!pharmacyInfo && (
                 <>
                   <Link to="/" className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-bold">Our Branches</Link>
                   <Link to="/about" className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-bold">About Us</Link>
                 </>
              )}
            </div>
          </div>

          {/* Center: Brand */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <Link to={basePath || '/'} className="flex flex-col items-center group pointer-events-auto">
              <span className="font-serif text-3xl md:text-4xl font-black tracking-tight text-pharmacy-primary block leading-none">
                Al Nujoom
              </span>
              {pharmacyInfo ? (
                <span className="text-xs uppercase font-black tracking-[0.2em] text-pharmacy-accent mt-1">
                  {pharmacyInfo.city}
                </span>
              ) : (
                <span className="text-xs uppercase font-black tracking-[0.2em] text-slate-400 mt-1">
                  Group Home
                </span>
              )}
            </Link>
          </div>

          {/* Rightside: Icons & User (Desktop) */}
          <div className="flex items-center justify-end gap-4 md:gap-8 flex-1">
            
            {pharmacyInfo && (
              <Link to={`${basePath}/cart`} className="relative p-2 text-slate-600 hover:text-pharmacy-primary transition-colors hidden md:block">
                <ShoppingCart size={22} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-pharmacy-accent text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </Link>
            )}

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 rounded-full" title="Admin Portal">
                      <ShieldCheck size={20} />
                    </Link>
                  )}
                  <Link to="/profile" className="p-2 text-slate-600 hover:text-pharmacy-primary transition-colors" title="My Profile">
                    <User size={22} />
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Log Out">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-pharmacy-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-pharmacy-primary/20">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              {pharmacyInfo && (
                <Link to={`${basePath}/cart`} className="relative p-2 text-slate-600">
                  <ShoppingCart size={22} />
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-pharmacy-primary focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {pharmacyInfo && (
                <>
                  <Link to={`${basePath}/shop`} className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Shop Medications</Link>
                  <Link to={`${basePath}/appointments`} className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Appointments</Link>
                </>
              )}
              {!pharmacyInfo && (
                <>
                  <Link to="/" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Our Branches</Link>
                  <Link to="/about" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">About Us</Link>
                </>
              )}
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3 py-4 text-base font-bold text-rose-600 hover:bg-rose-50 rounded-lg shadow-sm border border-rose-100 mb-2">Admin Portal</Link>
                  )}
                  <Link to="/profile" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">My Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-4 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg">Log Out</button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-4 text-base font-medium text-pharmacy-primary">Sign In</Link>
              )}
              {pharmacyInfo && (
                 <Link to="/" className="block px-3 py-4 text-base font-medium text-slate-400 hover:bg-slate-50 rounded-lg border-t border-slate-100 mt-2">← Back to Group Home</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
