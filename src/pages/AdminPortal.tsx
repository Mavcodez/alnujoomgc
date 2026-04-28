import React from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Package, Calendar, Clock, MapPin, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Order, Appointment } from '../types';

export default function AdminPortal() {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [stats, setStats] = React.useState({ users: 0, orders: 0, appointments: 0 });
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkAdmin = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setIsAdmin(false);
          return;
        }
        
        // Fast path for hardcoded founder admin
        if (user.email === 'manavgujaran@gmail.com') {
           setIsAdmin(true);
           fetchData();
           return;
        }

        try {
          // Verify admin status by attempting to check admin collection
          await getDocs(query(collection(db, 'admins')));
          setIsAdmin(true);
          fetchData(); // If we succeed, fetch stats
        } catch (error) {
          console.error("Admin check failed or not an admin:", error);
          setIsAdmin(false);
        }
      });
    };
    checkAdmin();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const uSnap = await getDocs(collection(db, 'users'));
      const aSnap = await getDocs(collection(db, 'appointments'));
      
      const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const oSnap = await getDocs(ordersQ);
      const ordersData = oSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      
      setStats({
        users: uSnap.size,
        orders: oSnap.size,
        appointments: aSnap.size,
      });
      setRecentOrders(ordersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status.");
    }
  };

  if (isAdmin === null) return <div className="pt-40 text-center">Checking credentials...</div>;

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-12 rounded-[40px] text-center shadow-xl max-w-md w-full border border-red-100">
          <ShieldCheck size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-500 mb-8">You do not have administrative privileges to view this portal.</p>
          <button onClick={() => navigate('/')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 leading-tight">Admin Portal</h1>
            <p className="text-slate-500 font-medium tracking-wide text-sm">System Overview & Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users /></div>
               <h3 className="font-bold text-slate-700">Total Users</h3>
             </div>
             <p className="text-4xl font-serif font-bold">{stats.users}</p>
          </motion.div>
          <motion.div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Package /></div>
               <h3 className="font-bold text-slate-700">Total Orders</h3>
             </div>
             <p className="text-4xl font-serif font-bold">{stats.orders}</p>
          </motion.div>
          <motion.div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Calendar /></div>
               <h3 className="font-bold text-slate-700">Appointments</h3>
             </div>
             <p className="text-4xl font-serif font-bold">{stats.appointments}</p>
          </motion.div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Recent Orders</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-pharmacy-primary transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 pt-2 px-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="pb-4 pt-2 px-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="pb-4 pt-2 px-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="pb-4 pt-2 px-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="pb-4 pt-2 px-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="pb-4 pt-2 px-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-slate-500">{order.id?.slice(0, 8)}...</td>
                      <td className="py-4 px-4 text-sm font-medium text-slate-700">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{order.userId.slice(0, 6)}...</td>
                      <td className="py-4 px-4 font-serif font-bold text-slate-900">AED {order.totalAmount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id!, e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg text-xs font-medium py-1 px-2 focus:outline-none focus:border-pharmacy-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No orders found in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
