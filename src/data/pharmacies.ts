export interface PharmacyInfo {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export const PHARMACIES: PharmacyInfo[] = [
  {
    id: 'nujoom',
    name: 'Al Nujoom Pharmacy',
    city: 'Dibba',
    address: 'Al Akamiyah, Dibba, Fujairah',
    phone: '09 243 2397',
    hours: 'Daily: 8AM - 2AM',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'razi',
    name: 'Al Razi Pharmacy',
    city: 'Dibba',
    address: 'Al Murabba, Dibba, Fujairah',
    phone: '09 244 3322',
    hours: 'Daily: 8AM - 1AM',
    rating: 4.6,
    reviewCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b29cb241?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'amana',
    name: 'Al Amana Pharmacy',
    city: 'Masafi',
    address: 'Masafi, Fujairah',
    phone: '09 256 3456',
    hours: 'Daily: 8AM - 1AM',
    rating: 4.5,
    reviewCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1579154235884-3323247c4b9b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'noor',
    name: 'Al Noor Pharmacy',
    city: 'Mirbah',
    address: 'Mirbah, Fujairah',
    phone: '09 223 8901',
    hours: 'Daily: 8AM - 2AM',
    rating: 4.3,
    reviewCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173ff9e594b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'najah',
    name: 'Al Najah Pharmacy',
    city: 'Khaleebiya',
    address: 'Khaleebiya, Fujairah',
    phone: '09 224 5678',
    hours: 'Daily: 8AM - 1AM',
    rating: 4.7,
    reviewCount: 33,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'noor-nujoom',
    name: 'Noor Al Nujoom Pharmacy',
    city: 'Al Hayl',
    address: 'Al Hayl, Fujairah',
    phone: '09 222 9988',
    hours: 'Daily: 8AM - 1AM',
    rating: 4.2,
    reviewCount: 10,
    imageUrl: 'https://images.unsplash.com/photo-1542887800-faca0261c9e1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fouad',
    name: 'Al Fouad Pharmacy',
    city: 'Dibba Al-Fujairah',
    address: 'Al Ras, Dibba Al-Fujairah',
    phone: '09 244 7890',
    hours: 'Daily: 8AM - 2AM',
    rating: 4.8,
    reviewCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800'
  }
];
