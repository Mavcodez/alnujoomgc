import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck, CreditCard, ChevronRight, UploadCloud } from 'lucide-react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PHARMACIES } from '../data/pharmacies';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { pharmacyId } = useParams();
  const pharmacy = PHARMACIES.find(p => p.id === pharmacyId);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [hasPrescription, setHasPrescription] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [cartItems, setCartItems] = React.useState([
    { id: '1', name: 'Panadol Advance', price: 15.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400' },
    { id: '3', name: 'Amoxicillin 500mg', price: 45.00, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1550572017-ed200f5e6a43?auto=format&fit=crop&q=80&w=400', requiresPrescription: true },
  ]);

  const requiresRx = cartItems.some(i => i.requiresPrescription);

  if (!pharmacy) return <Navigate to="/" replace />;
  const basePath = `/${pharmacy.id}`;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 10.00;
  const total = subtotal + shipping;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setHasPrescription(true);
      toast.success('Prescription uploaded successfully!');
    }
  };

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (requiresRx && !hasPrescription) {
      toast.error('Please upload a prescription for RX items.');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment intent call
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) })
      });
      const { clientSecret } = await response.json();
      
      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        pharmacyId: pharmacy.id,
        items: cartItems.map(i => ({ medicationId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        totalAmount: total,
        status: 'paid', // Simulated success
        createdAt: serverTimestamp(),
        shippingAddress: `Demo Address, ${pharmacy.city}`,
        hasPrescription
      });

      toast.success("Payment Successful! Your order has been placed.");
      navigate('/profile');
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-10">
          <Link to={`${basePath}/shop`} className="p-3 bg-white rounded-full text-slate-400 hover:text-pharmacy-primary transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-pharmacy-primary">My Basket</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 relative">
                   {item.requiresPrescription && (
                     <div className="absolute top-1 right-1 bg-orange-100 text-orange-700 p-1 rounded-full" title="Requires Prescription">
                       <ShieldCheck size={12} />
                     </div>
                   )}
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-400 font-medium">AED {item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                  </div>
                </div>
                <button 
                   onClick={() => setCartItems(items => items.filter(i => i.id !== item.id))}
                   className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}

            {requiresRx && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-8 rounded-3xl border-2 border-dashed ${hasPrescription ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'} text-center`}
              >
                {hasPrescription ? (
                  <>
                    <ShieldCheck size={40} className="mx-auto text-emerald-500 mb-4" />
                    <h4 className="font-bold text-emerald-800 mb-2">Prescription Uploaded</h4>
                    <p className="text-sm text-emerald-600">Our pharmacists will review it shortly.</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={40} className="mx-auto text-pharmacy-primary mb-4" />
                    <h4 className="font-bold text-slate-800 mb-2">Prescription Required</h4>
                    <p className="text-sm text-slate-500 mb-6">One or more items in your cart require a valid prescription.</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload}
                      className="hidden" 
                      accept="image/*,.pdf"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-pharmacy-primary text-white rounded-full font-bold text-sm shadow-lg shadow-pharmacy-primary/20 hover:scale-105 transition-all"
                    >
                      Upload Document
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {cartItems.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                <ShoppingBag size={48} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-medium">Your basket is empty</p>
                <Link to={`${basePath}/shop`} className="text-pharmacy-accent font-bold mt-4 inline-block hover:underline underline-offset-4">Browse medications</Link>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-8">Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-slate-800">AED {shipping.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between text-xl font-serif font-bold text-pharmacy-primary italic">
                  <span>Total</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0 || (requiresRx && !hasPrescription)}
                className="w-full bg-pharmacy-primary text-white py-5 rounded-3xl font-bold text-sm hover:scale-[1.02] transition-all shadow-xl shadow-pharmacy-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <CreditCard size={18} />
                {isProcessing ? 'Processing...' : 'Pay with Stripe'}
              </button>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4 text-emerald-600">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Secure SSL Encrypted Checkout</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 italic">
               <p className="text-xs text-slate-400 leading-relaxed">
                 <span className="font-bold text-slate-600 block mb-2 not-italic">Prescription Policy</span>
                 Orders containing prescription-only medications (POM) will require you to show your original Emirates ID and a valid prescription at the time of delivery.
               </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
