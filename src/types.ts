export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  order_index: number;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  dietary_tags: string[] | string; // Handle both array (new) and string (legacy/db)
  is_featured: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface Settings {
  opening_hours: {
    [key: string]: { open: string; close: string };
  };
  contact_info: {
    address: string;
    phone: string;
    email: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}
