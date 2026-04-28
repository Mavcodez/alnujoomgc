import React from 'react';
import { Phone, MapPin, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { PharmacyInfo } from '../data/pharmacies';

interface FooterProps {
  pharmacyInfo?: PharmacyInfo;
}

export default function Footer({ pharmacyInfo }: FooterProps) {
  const basePath = pharmacyInfo ? `/${pharmacyInfo.id}` : '';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-serif text-2xl font-bold mb-2 italic">
              Al Nujoom {pharmacyInfo ? 'Pharmacy' : 'Group'}
            </h3>
            {pharmacyInfo && (
              <p className="text-pharmacy-accent font-bold text-xs uppercase tracking-widest mb-4">{pharmacyInfo.city}</p>
            )}
            <p className="text-sm leading-relaxed opacity-70">
              Leading the way in pharmacy services in the UAE. We combine tradition with technology to provide the best care for your health.
            </p>
            <div className="flex gap-4 mt-8">
              <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
              <Facebook size={20} className="hover:text-white cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              {pharmacyInfo && (
                <>
                  <li><a href={`${basePath}/shop`} className="hover:text-white transition-colors">Browse Medications</a></li>
                  <li><a href={`${basePath}/appointments`} className="hover:text-white transition-colors">Online Consultation</a></li>
                </>
              )}
              {!pharmacyInfo && (
                 <li><a href="/" className="hover:text-white transition-colors">Our Branches</a></li>
              )}
              <li><a href="/profile" className="hover:text-white transition-colors">My Account</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-pharmacy-accent shrink-0 mt-1" />
                <span>{pharmacyInfo ? pharmacyInfo.address : 'Main Office: Dibba Al-Fujairah, UAE'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-pharmacy-accent shrink-0" />
                <span>{pharmacyInfo ? pharmacyInfo.phone : '+971 9 243 2397'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-pharmacy-accent shrink-0" />
                <span>{pharmacyInfo ? `branch.${pharmacyInfo.id}@alnujoom.com` : 'info@alnujoom.com'}</span>
              </li>
            </ul>
          </div>

          {pharmacyInfo && (
            <div>
              <h4 className="text-white font-medium mb-6">Opening Hours</h4>
              <div className="bg-white/5 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider opacity-60">Status</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Open</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock size={16} />
                  <span className="font-medium">{pharmacyInfo.hours}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50">© 2026 Al Nujoom Pharmacy Group. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-medium opacity-50">
            <a href="#" className="hover:opacity-100">Terms</a>
            <a href="#" className="hover:opacity-100">Cookies</a>
            <a href="#" className="hover:opacity-100">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
