import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Pill, Calendar, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState(auth.currentUser);
  const navigate = useNavigate();

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-pharmacy-primary rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Pill size={24} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-pharmacy-primary">
                Al Nujoom
              </span>
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-medium">Shop Medications</Link>
            <Link to="/appointments" className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-medium">Appointments</Link>
            <Link to="/about" className="text-slate-600 hover:text-pharmacy-primary transition-colors text-sm font-medium">About Us</Link>
            
            <div className="h-6 w-px bg-slate-200" />
            
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-pharmacy-primary transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-pharmacy-accent text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="p-2 text-slate-600 hover:text-pharmacy-primary transition-colors">
                  <User size={22} />
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-pharmacy-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-pharmacy-primary/20">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             <Link to="/cart" className="relative p-2 text-slate-600">
              <ShoppingCart size={22} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-pharmacy-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
              <Link to="/shop" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Shop Medications</Link>
              <Link to="/appointments" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Appointments</Link>
              <Link to="/about" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">About Us</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-lg">My Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-4 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg">Log Out</button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-4 text-base font-medium text-pharmacy-primary">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
