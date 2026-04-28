import React from 'react';
import { motion } from 'motion/react';
import { Pill, ShieldCheck, Truck, Clock, ArrowRight, Star, HeartPulse, Sparkles, Calendar, MapPin, Phone } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PHARMACIES } from '../data/pharmacies';

const categories = [
  { name: 'Pain Relief', icon: '💊', count: 120 },
  { name: 'Multivitamins', icon: '🥦', count: 85 },
  { name: 'Skin Care', icon: '🧴', count: 210 },
  { name: 'First Aid', icon: '🩹', count: 45 },
  { name: 'Baby Care', icon: '👶', count: 32 },
  { name: 'Personal Care', icon: '🪥', count: 154 },
];

const features = [
  {
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    title: "100% Authentic",
    desc: "All medications are sourced from authorized distributors with strict quality control."
  },
  {
    icon: <Truck size={24} className="text-blue-600" />,
    title: "Fast Delivery",
    desc: "Get your essentials delivered to your doorstep within 2 hours."
  },
  {
    icon: <Clock size={24} className="text-purple-600" />,
    title: "Late Night Support",
    desc: "Open late to assist with your urgent medical needs."
  }
];

export default function Home() {
  const { pharmacyId } = useParams();
  const pharmacy = PHARMACIES.find(p => p.id === pharmacyId);

  if (!pharmacy) return <Navigate to="/" replace />;

  const basePath = `/${pharmacy.id}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-pharmacy-accent/5 -skew-x-12 transform translate-x-1/2 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-pharmacy-accent/10 text-pharmacy-primary px-4 py-2 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">Available in {pharmacy.city}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-pharmacy-primary leading-[1.1] mb-8">
                Your Health, Our <span className="text-pharmacy-accent italic">Priority</span> Everyday.
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Order your prescriptions online, book pharmacist consultations, and experience premium care with {pharmacy.name} — serving {pharmacy.city}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to={`${basePath}/shop`} className="w-full sm:w-auto bg-pharmacy-primary text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-all shadow-xl shadow-pharmacy-primary/25 flex items-center justify-center gap-2">
                  Order Now <ArrowRight size={18} />
                </Link>
                <Link to={`${basePath}/appointments`} className="w-full sm:w-auto border-2 border-pharmacy-primary/10 text-pharmacy-primary px-8 py-4 rounded-full font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  Book Consultation
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span className="text-sm font-bold">{pharmacy.rating} ({pharmacy.reviewCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="text-red-500" size={16} />
                  <span className="text-sm font-bold">Health Ministry Approved</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl">
                 <img 
                  src="https://images.unsplash.com/photo-1631549916768-4119b29cb241?auto=format&fit=crop&q=80&w=1200" 
                  alt="Pharmacy professional"
                  className="w-full h-full object-cover aspect-[4/5]"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-1/4 z-20 glass-card p-6 rounded-3xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Sparkles className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Prescription Verified</h4>
                    <p className="text-[10px] opacity-60">Ready for pickup in 5m</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-slate-100 hover:border-pharmacy-accent/30 transition-all group"
              >
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-pharmacy-primary mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((c, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer"
              >
                <div className="text-4xl mb-4">{c.icon}</div>
                <h4 className="text-sm font-bold mb-1">{c.name}</h4>
                <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{c.count} items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="medical-gradient rounded-[50px] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="flex-1 text-center lg:text-left z-10">
              <h2 className="text-3xl lg:text-5xl font-serif font-semibold text-white mb-6">Need expert advice?</h2>
              <p className="text-white/70 mb-10 max-w-lg mx-auto lg:mx-0 font-light">
                Schedule a private 15-minute consultation with our senior pharmacists at {pharmacy.city}. Available for medication reviews, wellness advice, and chronic disease management.
              </p>
              <Link to={`${basePath}/appointments`} className="inline-flex bg-white text-pharmacy-primary px-10 py-5 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-black/20 gap-3 items-center">
                <Calendar size={20} />
                Book Free Consultation
              </Link>
            </div>
            <div className="flex-1 w-full lg:w-auto relative z-10">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px]">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" 
                  alt="Pharmacist advice"
                  className="rounded-3xl mb-8 shadow-2xl brightness-90 grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center gap-4 text-white">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Quick Turnaround</p>
                    <p className="text-xs opacity-60">Consultations starting within 30m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full h-[400px] rounded-[40px] overflow-hidden bg-slate-100 relative shadow-inner">
               <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(pharmacy.name + ', ' + pharmacy.city)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
               />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-serif font-bold text-pharmacy-primary mb-6 italic">Visit our branch</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Located conveniently in {pharmacy.city}, we provide a spacious and welcoming environment for all your pharmaceutical needs.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pharmacy-accent/10 rounded-2xl flex items-center justify-center text-pharmacy-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">{pharmacy.city} Branch</h4>
                    <p className="text-sm text-slate-500">{pharmacy.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pharmacy-accent/10 rounded-2xl flex items-center justify-center text-pharmacy-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Call for info</h4>
                    <p className="text-sm text-slate-500">{pharmacy.phone}</p>
                  </div>
                </div>
              </div>
              <button className="mt-10 inline-flex items-center gap-2 text-pharmacy-accent font-bold group">
                Get Directions <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
