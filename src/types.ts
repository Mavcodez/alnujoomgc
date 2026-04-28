export interface Medication {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  requiresPrescription: boolean;
}

export interface CartItem extends Medication {
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: {
    medicationId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  createdAt: any;
  shippingAddress: string;
}

export interface Appointment {
  id?: string;
  userId: string;
  dateTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  pharmacistName: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
}
