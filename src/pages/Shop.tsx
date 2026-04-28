import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingBag, Plus, Minus, Check, AlertCircle, ShoppingCart } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { Medication } from '../types';

// Mock data while Firestore is empty
const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Panadol Advance',
    description: 'Fast and effective pain relief. Gentle on the stomach.',
    price: 15.50,
    category: 'Pain Relief',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    requiresPrescription: false
  },
  {
    id: '2',
    name: 'Centrum Adults',
    description: 'Complete multivitamin for everyday health and wellness.',
    price: 85.00,
    category: 'Multivitamins',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-ad5f9f8162c6?auto=format&fit=crop&q=80&w=400',
    requiresPrescription: false
  },
  {
    id: '3',
    name: 'Amoxicillin 500mg',
    description: 'Broad-spectrum antibiotic for bacterial infections.',
    price: 45.00,
    category: 'Antibiotics',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-ed200f5e6a43?auto=format&fit=crop&q=80&w=400',
    requiresPrescription: true
  },
  {
    id: '4',
    name: 'La Roche-Posay SPF 50',
    description: 'Advanced sun protection for sensitive skin.',
    price: 120.00,
    category: 'Skin Care',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    requiresPrescription: false
  }
];

export default function Shop() {
  const [medications, setMedications] = React.useState<Medication[]>(MOCK_MEDICATIONS);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [cart, setCart] = React.useState<{[key: string]: number}>({});

  const categories = ['All', ...Array.from(new Set(MOCK_MEDICATIONS.map(m => m.category)))];

  React.useEffect(() => {
    // Attempt real database fetch if you want, but sticking to mock for now for stability
    /*
    const fetchMedications = async () => {
      setLoading(true);
      const q = query(collection(db, 'medications'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
      if (data.length > 0) setMedications(data);
      setLoading(false);
    };
    fetchMedications();
    */
  }, []);

  const filteredMedications = medications.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const med = medications.find(m => m.id === id);
    return acc + (med ? med.price * qty : 0);
  }, 0);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl font-serif font-bold text-pharmacy-primary mb-4">Medication Shop</h1>
            <p className="text-slate-500 font-light max-w-lg">Browse our wide range of authentic medications and health products. Fast delivery in Fujairah.</p>
          </div>
          
          <div className="w-full md:w-[400px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or symptoms..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-pharmacy-accent/20 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Filter size={14} /> Categories
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat 
                      ? 'bg-pharmacy-primary text-white shadow-lg shadow-pharmacy-primary/20' 
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Preview */}
            <div className="bg-pharmacy-primary p-8 rounded-[32px] text-white shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <ShoppingBag className="mb-4 opacity-50" size={32} />
                <h4 className="text-lg font-bold mb-1">Your Basket</h4>
                <p className="text-xs opacity-70 mb-6">{Object.keys(cart).length} items selected</p>
                <div className="text-2xl font-serif font-bold mb-6 italic">AED {cartTotal.toFixed(2)}</div>
                <Link to="/cart" className="block w-full bg-white text-pharmacy-primary text-center py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all">
                  Go to Checkout
                </Link>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="bg-white rounded-[32px] h-96 animate-pulse" />
                 ))}
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredMedications.map(med => (
                    <motion.div
                      key={med.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 group relative flex flex-col"
                    >
                      {med.requiresPrescription && (
                        <div className="absolute top-4 right-4 z-10 bg-orange-100 text-orange-700 p-2 rounded-full" title="Requires Prescription">
                          <AlertCircle size={16} />
                        </div>
                      )}
                      
                      <div className="relative h-56 mb-6 overflow-hidden rounded-2xl bg-slate-50">
                        <img 
                          src={med.imageUrl} 
                          alt={med.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-pharmacy-accent mb-2">
                          {med.category}
                        </div>
                        <h3 className="text-lg font-bold text-pharmacy-primary mb-2">{med.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed font-light">
                          {med.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <div className="font-serif text-xl font-bold italic text-pharmacy-primary">
                          AED {med.price.toFixed(2)}
                        </div>
                        
                        {cart[med.id] ? (
                          <div className="flex items-center bg-slate-100 rounded-full p-1 gap-3">
                            <button 
                              onClick={() => updateCart(med.id, -1)}
                              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-red-500 shadow-sm transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{cart[med.id]}</span>
                            <button 
                              onClick={() => updateCart(med.id, 1)}
                              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-emerald-500 shadow-sm transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => updateCart(med.id, 1)}
                            className="bg-pharmacy-primary text-white p-3 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-pharmacy-primary/20"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {!loading && filteredMedications.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-dashed border-slate-200">
                <Search size={48} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-lg font-bold text-slate-600">No medications found</h3>
                <p className="text-sm text-slate-400">Try searching for something else or browse another category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
