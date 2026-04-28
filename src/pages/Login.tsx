import React from 'react';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pill, Chrome, ArrowRight, Shield } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            userId: user.uid,
            displayName: user.displayName,
            email: user.email,
            phone: user.phoneNumber || '',
            address: '',
            createdAt: new Date().toISOString()
          });
        }
      }
      
      navigate('/');
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 flex-col lg:flex-row gap-12 pt-20 pb-20">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-pharmacy-primary rounded-2xl flex items-center justify-center text-white">
            <Pill size={28} />
          </div>
          <span className="font-serif text-2xl font-bold text-pharmacy-primary">Al Nujoom</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-4 italic">Welcome back</h1>
        <p className="text-slate-500 mb-10 font-light leading-relaxed">
          Sign in to access your prescriptions, track orders, and schedule consultations.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 bg-slate-50 text-slate-700 py-5 rounded-[24px] font-bold text-sm hover:bg-slate-100 transition-all border border-slate-100 disabled:opacity-50"
        >
          <div className="bg-white p-2 rounded-full shadow-sm">
            <Chrome size={20} className="text-blue-500" />
          </div>
          {loading ? 'Authenticating...' : 'Continue with Google'}
        </button>

        <div className="mt-12 p-6 bg-emerald-50 rounded-3xl flex gap-4">
          <Shield className="text-emerald-600 shrink-0" size={24} />
          <div className="text-xs text-emerald-800 leading-relaxed">
            <p className="font-bold mb-1">Secure & HIPAA Compliant</p>
            <p className="opacity-70">Your health data is encrypted and protected following the highest security standards.</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hidden lg:block w-full max-w-lg"
      >
        <img 
          src="https://images.unsplash.com/photo-1579154235884-3323247c4b9b?auto=format&fit=crop&q=80&w=800" 
          alt="Pharmacy Care"
          className="rounded-[60px] shadow-2xl filter brightness-95 object-cover h-[600px] w-full"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </div>
  );
}
