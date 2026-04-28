import React from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Package, Calendar as CalendarIcon, Clock, ArrowRight, Settings, Phone, MapPin, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { Order, Appointment } from '../types';

export default function Profile() {
  const [user, setUser] = React.useState(auth.currentUser);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      try {
        // Fetch Orders
        const qOrders = query(
          collection(db, 'orders'), 
          where('userId', '==', auth.currentUser.uid)
        );
        const sOrders = await getDocs(qOrders);
        setOrders(sOrders.docs.map(d => ({ id: d.id, ...d.data() } as Order)));

        // Fetch Appointments
        const qApps = query(
          collection(db, 'appointments'), 
          where('userId', '==', auth.currentUser.uid)
        );
        const sApps = await getDocs(qApps);
        setAppointments(sApps.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return <div className="pt-40 text-center">Please sign in to view your profile.</div>;

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* User Info Card */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-pharmacy-accent/20 rounded-full flex items-center justify-center text-pharmacy-primary mb-6">
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-full h-full rounded-full" alt="Avatar" referrerPolicy="no-referrer" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <h2 className="text-2xl font-serif font-bold text-pharmacy-primary mb-2 italic">{user.displayName}</h2>
              <p className="text-sm text-slate-500 mb-8 font-light">{user.email}</p>
              
              <div className="w-full space-y-4 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
                  <Phone size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">050 123 4567</span>
                </div>
                <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Dibba, Fujairah</span>
                </div>
              </div>

              <button className="w-full mt-10 p-4 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                <Settings size={18} /> Edit Profile
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            
            {/* Orders Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-pharmacy-primary italic flex items-center gap-3">
                  <Package className="text-pharmacy-accent" /> Recent Orders
                </h3>
                <button className="text-sm font-bold text-pharmacy-accent hover:underline flex items-center gap-1 group">
                  View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1,2].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse" />)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-pharmacy-primary/5 rounded-2xl flex items-center justify-center text-pharmacy-primary">
                          <ClipboardList size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order.id?.slice(-6)}</p>
                          <p className="font-bold text-sm">{order.items.length} items • AED {order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                         <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           {order.status}
                         </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-400 font-light">You haven't placed any orders yet.</p>
                </div>
              )}
            </section>

            {/* Appointments Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-pharmacy-primary italic flex items-center gap-3">
                  <CalendarIcon className="text-pharmacy-accent" /> Appointments
                </h3>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse" />)}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map(app => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100"
                    >
                      <div className="flex justify-between items-start mb-6">
                         <div className="p-4 bg-pharmacy-primary/10 rounded-2xl text-pharmacy-primary">
                           <Clock size={24} />
                         </div>
                         <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                           {app.status}
                         </span>
                      </div>
                      <h4 className="font-serif font-bold text-lg mb-2 italic">Consultation</h4>
                      <p className="text-sm font-medium text-slate-600 mb-6">{app.dateTime}</p>
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <User size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">{app.pharmacistName}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-400 font-light">No upcoming appointments.</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
