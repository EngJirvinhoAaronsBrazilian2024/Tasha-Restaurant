import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  username: string;
  password_hash: string; // In a real app, never store plain text, but here we mock
  role: string;
}

export interface Category {
  id: string;
  name: string;
  order_index: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  dietary_tags: string[];
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

export interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  type: 'blog' | 'event';
  date: string;
  created_at: string;
}

// Initial Data Seeding
const SEED_DATA = {
  users: [
    {
      id: '1',
      username: 'Admin',
      password_hash: '$2a$10$X7.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1', // Mock hash, we'll just check string equality for demo
      role: 'admin'
    }
  ],
  categories: [
    { id: '1', name: 'Starters', order_index: 1 },
    { id: '2', name: 'Main Courses', order_index: 2 },
    { id: '3', name: 'Seafood', order_index: 3 },
    { id: '4', name: 'Vegetarian', order_index: 4 },
    { id: '5', name: 'Desserts', order_index: 5 },
    { id: '6', name: 'Beverages', order_index: 6 }
  ],
  menu_items: [
    { id: '1', category_id: '1', name: 'Bruschetta Royale', description: 'Toasted sourdough with heirloom tomatoes, basil, and balsamic glaze.', price: 12, image_url: 'https://images.unsplash.com/photo-1572695157369-a0eac271ad61?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Vegetarian'], is_featured: false },
    { id: '2', category_id: '1', name: 'Seared Scallops', description: 'Pan-seared scallops with cauliflower purée and truffle oil.', price: 18, image_url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free'], is_featured: true },
    { id: '3', category_id: '1', name: 'Beef Carpaccio', description: 'Thinly sliced raw beef with arugula, parmesan, and capers.', price: 16, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free'], is_featured: false },
    { id: '4', category_id: '2', name: 'Truffle Ribeye Steak', description: 'Premium ribeye steak with truffle butter and roasted vegetables.', price: 38, image_url: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free'], is_featured: true },
    { id: '5', category_id: '2', name: 'Herb Crusted Salmon', description: 'Fresh salmon fillet with a herb crust, served with asparagus.', price: 32, image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free'], is_featured: false },
    { id: '6', category_id: '2', name: 'Duck Confit', description: 'Slow-cooked duck leg with potato gratin and cherry sauce.', price: 34, image_url: 'https://images.unsplash.com/photo-1518492104633-130d32229475?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free'], is_featured: false },
    { id: '7', category_id: '3', name: 'Grilled Octopus', description: 'Char-grilled octopus with romesco sauce and roasted potatoes.', price: 28, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free'], is_featured: false },
    { id: '8', category_id: '3', name: 'Lobster Thermidor', description: 'Whole lobster baked with a rich creamy wine sauce and cheese.', price: 45, image_url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Contains Dairy'], is_featured: true },
    { id: '9', category_id: '4', name: 'Wild Mushroom Risotto', description: 'Creamy arborio rice with porcini mushrooms and parmesan crisp.', price: 24, image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Vegetarian', 'Gluten-Free'], is_featured: false },
    { id: '10', category_id: '4', name: 'Roasted Vegetable Tart', description: 'Seasonal vegetables on a flaky puff pastry with goat cheese.', price: 22, image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Vegetarian'], is_featured: false },
    { id: '11', category_id: '5', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.', price: 10, image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Vegetarian'], is_featured: true },
    { id: '12', category_id: '5', name: 'Vanilla Bean Crème Brûlée', description: 'Classic French dessert with a rich custard base and caramelized sugar crust.', price: 9, image_url: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Gluten-Free', 'Vegetarian'], is_featured: false },
    { id: '13', category_id: '5', name: 'Tiramisu', description: 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone cream.', price: 11, image_url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Vegetarian'], is_featured: false },
    { id: '14', category_id: '6', name: 'Signature Old Fashioned', description: 'Bourbon, smoked maple syrup, angostura bitters, orange peel.', price: 14, image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Alcoholic'], is_featured: false },
    { id: '15', category_id: '6', name: 'Artisan Lemonade', description: 'Freshly squeezed lemons, mint, and elderflower syrup.', price: 6, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Non-Alcoholic'], is_featured: false },
    { id: '16', category_id: '6', name: 'Craft Beer Selection', description: 'Ask your server for our rotating selection of local craft beers.', price: 8, image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee8876a3?auto=format&fit=crop&w=800&q=80', dietary_tags: ['Alcoholic'], is_featured: false }
  ],
  settings: {
    opening_hours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '23:00' }
    },
    contact_info: {
      address: 'Kampala',
      phone: '+256700400063',
      email: 'kisakyearon72@gmail.com'
    },
    theme: {
      primaryColor: '#1a1a1a',
      accentColor: '#d97706',
      fontFamily: 'serif',
      borderRadius: 'rounded-sm'
    },
    homepage_content: {
      heroTitle: 'TASHA',
      heroSubtitle: 'Where Elegance Meets Flavor',
      aboutTitle: 'Our Story',
      aboutText: 'At Tasha Restaurant, we believe dining is more than a meal. It is an experience. Founded with a vision to blend global culinary artistry with local ingredients, we create dishes that tell a story.',
      heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80'
    }
  },
  posts: [
    {
      id: '1',
      title: 'Grand Opening Night',
      content: 'Join us for an evening of live jazz and complimentary champagne as we celebrate our grand opening.',
      image_url: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=800&q=80',
      type: 'event',
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Seasonal Menu Launch',
      content: 'Our chef has curated a special menu featuring the freshest ingredients of the season. Come taste the difference.',
      image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      type: 'blog',
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ]
};

// Helper to get/set data
const get = (key: string) => {
  const data = localStorage.getItem(`tasha_${key}`);
  return data ? JSON.parse(data) : null;
};

const set = (key: string, value: any) => {
  localStorage.setItem(`tasha_${key}`, JSON.stringify(value));
};

// Initialize Data
export const initializeData = () => {
  if (!get('users')) set('users', SEED_DATA.users);
  if (!get('categories')) set('categories', SEED_DATA.categories);
  if (!get('menu_items')) set('menu_items', SEED_DATA.menu_items);
  if (!get('settings')) set('settings', SEED_DATA.settings);
  if (!get('posts')) set('posts', SEED_DATA.posts);
  if (!get('reservations')) set('reservations', []);
  if (!get('messages')) set('messages', []);
};

// API Methods
export const api = {
  // Menu
  getMenu: async () => {
    const categories = get('categories') || [];
    const items = get('menu_items') || [];
    return categories.map((cat: Category) => ({
      ...cat,
      items: items.filter((item: MenuItem) => item.category_id === cat.id)
    }));
  },

  getFeaturedItems: async () => {
    const items = get('menu_items') || [];
    return items.filter((item: MenuItem) => item.is_featured);
  },

  // Reservations
  createReservation: async (data: any) => {
    const reservations = get('reservations') || [];
    const newReservation = {
      id: uuidv4(),
      ...data,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    reservations.push(newReservation);
    set('reservations', reservations);
    return { success: true, id: newReservation.id };
  },

  // Contact
  sendMessage: async (data: any) => {
    const messages = get('messages') || [];
    const newMessage = {
      id: uuidv4(),
      ...data,
      is_read: false,
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    set('messages', messages);
    return { success: true };
  },

  // Settings
  getSettings: async () => {
    return get('settings') || {};
  },

  // Posts
  getPosts: async () => {
    return get('posts') || [];
  },

  // Auth (Mock)
  login: async (credentials: any) => {
    const users = get('users') || [];
    // In a real app, verify hash. Here we just check hardcoded password for demo
    // The seed password is 'ronaldocr7'
    const user = users.find((u: User) => u.username === credentials.username);
    
    if (user && credentials.password === 'ronaldocr7') {
       return { 
         success: true, 
         user: { id: user.id, username: user.username, role: user.role } 
       };
    }
    throw new Error('Invalid credentials');
  },

  logout: async () => {
    return { success: true };
  },

  getCurrentUser: async () => {
    // In a real app, we'd check a token. Here we rely on client state or session storage
    // For this refactor, we'll assume the AuthContext handles the state persistence
    return { user: null }; // The context should handle the user object
  },

  // Admin
  getStats: async () => {
    const reservations = get('reservations') || [];
    const messages = get('messages') || [];
    return {
      totalReservations: reservations.length,
      pendingReservations: reservations.filter((r: any) => r.status === 'pending').length,
      newMessages: messages.filter((m: any) => !m.is_read).length
    };
  },

  getReservations: async () => {
    const reservations = get('reservations') || [];
    return reservations.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  updateReservation: async (id: string, status: string) => {
    const reservations = get('reservations') || [];
    const index = reservations.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      reservations[index].status = status;
      set('reservations', reservations);
      return { success: true };
    }
    throw new Error('Reservation not found');
  },

  createMenuItem: async (data: any) => {
    const items = get('menu_items') || [];
    const newItem = {
      id: uuidv4(),
      ...data,
      dietary_tags: data.dietary_tags || []
    };
    items.push(newItem);
    set('menu_items', items);
    return { success: true };
  },

  updateMenuItem: async (id: string, data: any) => {
    const items = get('menu_items') || [];
    const index = items.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      set('menu_items', items);
      return { success: true };
    }
    throw new Error('Item not found');
  },

  deleteMenuItem: async (id: string) => {
    const items = get('menu_items') || [];
    const newItems = items.filter((i: any) => i.id !== id);
    set('menu_items', newItems);
    return { success: true };
  },

  updateSettings: async (key: string, value: any) => {
    const settings = get('settings') || {};
    settings[key] = value;
    set('settings', settings);
    return { success: true };
  },

  createPost: async (data: any) => {
    const posts = get('posts') || [];
    const newPost = {
      id: uuidv4(),
      ...data,
      created_at: new Date().toISOString()
    };
    posts.push(newPost);
    set('posts', posts);
    return { success: true };
  },

  updatePost: async (id: string, data: any) => {
    const posts = get('posts') || [];
    const index = posts.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...data };
      set('posts', posts);
      return { success: true };
    }
    throw new Error('Post not found');
  },

  deletePost: async (id: string) => {
    const posts = get('posts') || [];
    const newPosts = posts.filter((p: any) => p.id !== id);
    set('posts', newPosts);
    return { success: true };
  }
};
