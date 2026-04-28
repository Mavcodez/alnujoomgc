import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PHARMACIES } from '../data/pharmacies';

export default function GroupHome() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-pharmacy-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-serif font-bold text-pharmacy-primary mb-6"
          >
            Care that is <span className="text-pharmacy-accent italic">closer</span> to you.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-light mb-12"
          >
            Find your nearest Al Nujoom Pharmacy branch. We provide authentic medications, expert pharmacist consultations, and fast local delivery across exactly {PHARMACIES.length} locations.
          </motion.p>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="pb-32 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHARMACIES.map((pharmacy, i) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link 
                  to={`/${pharmacy.id}`}
                  className="block bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden h-full flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pharmacy-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-pharmacy-primary/10 transition-colors z-0" />
                  
                  <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 overflow-hidden relative z-10 pointer-events-none">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      loading="lazy" 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(pharmacy.name + ', ' + pharmacy.city)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-12 h-12 bg-pharmacy-accent/10 rounded-2xl flex items-center justify-center text-pharmacy-primary">
                      <MapPin size={24} />
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                      <Star size={12} className="fill-current" /> {pharmacy.rating}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-pharmacy-primary mb-2 relative z-10">{pharmacy.name}</h3>
                  <p className="text-sm text-slate-500 mb-8 line-clamp-2 relative z-10 flex-grow">{pharmacy.address}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10 mt-auto">
                     <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                       {pharmacy.hours.includes('24') ? 'Open 24/7' : pharmacy.hours}
                     </span>
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pharmacy-primary group-hover:text-white transition-colors">
                       <ArrowRight size={16} />
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
