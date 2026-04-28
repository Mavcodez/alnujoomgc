import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Stethoscope, Video, MessageSquare, ChevronRight, Check } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { format, addDays, startOfToday } from 'date-fns';
import { PHARMACIES } from '../data/pharmacies';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '08:00 PM', '09:00 PM'
];

export default function Appointments() {
  const { pharmacyId } = useParams();
  const pharmacy = PHARMACIES.find(p => p.id === pharmacyId);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  if (!pharmacy) return <Navigate to="/" replace />;
  const basePath = `/${pharmacy.id}`;

  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !auth.currentUser) return;

    setIsSubmitting(true);
    try {
      const dateTime = `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`;
      await addDoc(collection(db, 'appointments'), {
        userId: auth.currentUser.uid,
        pharmacyId: pharmacy.id,
        dateTime,
        reason,
        status: 'scheduled',
        pharmacistName: `Dr. Ahmad Ibrahim (${pharmacy.city})`
      });
      setSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-40 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-lg mx-auto border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-pharmacy-primary mb-4 italic">Appointment Booked!</h2>
          <p className="text-slate-500 mb-10 leading-relaxed font-light">
            Your consultation at {pharmacy.name} has been scheduled. You'll receive a confirmation email shortly.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="bg-pharmacy-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-pharmacy-primary/20"
          >
            Book Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-pharmacy-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-pharmacy-primary mb-6">Expert Consultation in {pharmacy.city}</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
            Professional advice just a few clicks away. Choose a convenient time to speak with our qualified pharmacists about your healthcare needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Stethoscope size={20} className="text-pharmacy-accent" /> Why consult us?
              </h3>
              <ul className="space-y-6">
                {[
                  { icon: <Video />, text: "Virtual or In-person" },
                  { icon: <Clock />, text: "15-30 min deep sessions" },
                  { icon: <MessageSquare />, text: "Direct follow-up chat" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

             <div className="medical-gradient p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
               <h4 className="text-lg font-bold mb-4">Urgent Help?</h4>
               <p className="text-sm opacity-70 mb-8 leading-relaxed">If you need immediate assistance, please call our local branch line.</p>
               <a href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-colors">
                 {pharmacy.phone} <ChevronRight size={16} />
               </a>
             </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleBooking} className="bg-white p-10 lg:p-12 rounded-[50px] shadow-sm border border-slate-100">
              {/* Date Selection */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Select Date</label>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                  {dates.map((date, i) => {
                    const isSelected = selectedDate && format(selectedDate, 'PP') === format(date, 'PP');
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 w-20 h-28 rounded-3xl flex flex-col items-center justify-center transition-all ${
                          isSelected 
                          ? 'bg-pharmacy-primary text-white shadow-xl shadow-pharmacy-primary/30 scale-105' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase mb-1">{format(date, 'EEE')}</span>
                        <span className="text-2xl font-serif font-bold">{format(date, 'd')}</span>
                        <span className="text-[10px] opacity-60 mt-1">{format(date, 'MMM')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Select Available Time</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map(time => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 rounded-2xl text-xs font-bold transition-all border ${
                          isSelected
                          ? 'bg-pharmacy-accent border-pharmacy-accent text-white shadow-lg'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-pharmacy-accent'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Reason */}
              <div className="mb-12">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Reason for consultation</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us a bit about your symptoms or medical query..."
                  className="w-full bg-slate-50 rounded-3xl p-6 border-none focus:ring-2 focus:ring-pharmacy-accent font-medium text-sm transition-all"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !selectedDate || !selectedTime}
                className="w-full bg-pharmacy-primary text-white py-6 rounded-[30px] font-bold text-lg hover:bg-opacity-95 transition-all shadow-2xl shadow-pharmacy-primary/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
