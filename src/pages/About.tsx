import React from 'react';
import { motion } from 'motion/react';
import { Users, Shield, Award, MapPin, Pill } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <div className="w-16 h-16 bg-pharmacy-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
            <Pill size={32} />
          </div>
          <h1 className="text-5xl font-serif font-bold text-pharmacy-primary mb-6">About Al Nujoom</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Leading the way in pharmaceutical care across the UAE since 2012. Our mission is to make healthcare accessible, authentic, and patient-centric.
          </p>
        </div>

        {/* Founders Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-serif font-bold text-pharmacy-primary mb-12 text-center italic">Our Founders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-slate-50 shadow-lg mx-auto md:mx-0">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Dr. Mohammed Al-Sayed</h3>
              <p className="text-sm font-bold text-pharmacy-accent uppercase tracking-widest mb-6">Founder & CEO</p>
              <p className="text-slate-600 leading-relaxed font-light">
                With over 20 years of experience in the pharmaceutical industry, Dr. Mohammed founded Al Nujoom with a vision to redefine community healthcare. His commitment to stringent quality control and authentic medication sourcing has established Al Nujoom as a trusted name in the region.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-slate-50 shadow-lg mx-auto md:mx-0">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                  alt="Co-Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Dr. Fatima Hassan</h3>
              <p className="text-sm font-bold text-pharmacy-accent uppercase tracking-widest mb-6">Co-Founder & Chief Medical Officer</p>
              <p className="text-slate-600 leading-relaxed font-light">
                Dr. Fatima leads the clinical operations and pharmacist training programs at Al Nujoom. She holds a PharmD and is passionate about patient education, chronic disease management, and implementing advanced pharmacy technologies across all branches.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Milestones / Stats */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <MapPin size={24}/>, value: "7", label: "Locations" },
            { icon: <Users size={24}/>, value: "50k+", label: "Happy Patients" },
            { icon: <Award size={24}/>, value: "12", label: "Years of Trust" },
            { icon: <Shield size={24}/>, value: "100%", label: "Authentic Products" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-serif font-bold text-pharmacy-primary mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
