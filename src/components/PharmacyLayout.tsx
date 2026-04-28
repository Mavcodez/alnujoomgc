import React from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PHARMACIES } from '../data/pharmacies';

export default function PharmacyLayout() {
  const { pharmacyId } = useParams();
  const pharmacy = PHARMACIES.find(p => p.id === pharmacyId);

  // If pharmacy ID is invalid, redirect to group home
  if (!pharmacy) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-pharmacy-accent selection:text-white">
      <Navbar pharmacyInfo={pharmacy} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer pharmacyInfo={pharmacy} />
    </div>
  );
}
