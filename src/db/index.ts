import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// Determine if we are running in a serverless environment (Netlify or Vercel)
const isServerless = process.env.NETLIFY || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION;

let db: any;

function getDb() {
  if (db) return db;

  const pathsToTry = [];
  
  if (isServerless) {
    pathsToTry.push(path.join('/tmp', 'tasha.db'));
  }
  
  pathsToTry.push(path.resolve('tasha.db'));
  pathsToTry.push(':memory:');

  for (const p of pathsToTry) {
    try {
      console.log(`Attempting to open database at: ${p}`);
      const instance = new Database(p);
      console.log(`Successfully opened database at: ${p}`);
      db = instance;
      
      // Enable foreign keys
      db.pragma('foreign_keys = ON');
      return db;
    } catch (error) {
      console.warn(`Failed to open database at ${p}:`, error);
    }
  }
  
  throw new Error('Could not initialize database in any location');
}

// Initialize immediately to fail fast or fallback
try {
  getDb();
} catch (e) {
  console.error('CRITICAL: DB Init failed', e);
}

export function initDb() {
  const database = getDb();
  
  try {
    // Users table
    database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin'
      )
    `);

    // Categories table
    database.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      )
    `);

    // Menu Items table
    database.exec(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        dietary_tags TEXT, -- JSON string or comma separated
        is_featured BOOLEAN DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Reservations table
    database.exec(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        guests INTEGER NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    database.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT 0
      )
    `);

    // Blog/Events Posts table
    database.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        type TEXT DEFAULT 'blog', -- blog, event
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table (key-value store for dynamic config)
    database.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // Ensure Admin user exists with correct credentials
    const hashedPassword = bcrypt.hashSync('ronaldocr7', 10);
    const existingAdmin = database.prepare("SELECT * FROM users WHERE username = 'Admin' OR username = 'admin'").get() as any;

    if (existingAdmin) {
      database.prepare('UPDATE users SET username = ?, password_hash = ? WHERE id = ?').run('Admin', hashedPassword, existingAdmin.id);
    } else {
      database.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('Admin', hashedPassword);
    }

    const categoryCount = database.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
    if (categoryCount.count === 0) {
      const insertCategory = database.prepare('INSERT INTO categories (name, order_index) VALUES (?, ?)');
      insertCategory.run('Starters', 1);
      insertCategory.run('Main Courses', 2);
      insertCategory.run('Seafood', 3);
      insertCategory.run('Vegetarian', 4);
      insertCategory.run('Desserts', 5);
      insertCategory.run('Beverages', 6);

      // Get IDs
      const startersId = database.prepare("SELECT id FROM categories WHERE name = 'Starters'").get() as { id: number };
      const mainsId = database.prepare("SELECT id FROM categories WHERE name = 'Main Courses'").get() as { id: number };
      const seafoodId = database.prepare("SELECT id FROM categories WHERE name = 'Seafood'").get() as { id: number };
      const vegetarianId = database.prepare("SELECT id FROM categories WHERE name = 'Vegetarian'").get() as { id: number };
      const dessertsId = database.prepare("SELECT id FROM categories WHERE name = 'Desserts'").get() as { id: number };
      const beveragesId = database.prepare("SELECT id FROM categories WHERE name = 'Beverages'").get() as { id: number };

      const insertItem = database.prepare(`
        INSERT INTO menu_items (category_id, name, description, price, image_url, dietary_tags, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      // Starters
      insertItem.run(startersId.id, 'Bruschetta Royale', 'Toasted sourdough with heirloom tomatoes, basil, and balsamic glaze.', 12, 'https://images.unsplash.com/photo-1572695157369-a0eac271ad61?auto=format&fit=crop&w=800&q=80', '["Vegetarian"]', 0);
      insertItem.run(startersId.id, 'Seared Scallops', 'Pan-seared scallops with cauliflower purée and truffle oil.', 18, 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80', '["Gluten-Free"]', 1);
      insertItem.run(startersId.id, 'Beef Carpaccio', 'Thinly sliced raw beef with arugula, parmesan, and capers.', 16, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', '["Gluten-Free"]', 0);

      // Main Courses
      insertItem.run(mainsId.id, 'Truffle Ribeye Steak', 'Premium ribeye steak with truffle butter and roasted vegetables.', 38, 'https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&fit=crop&w=800&q=80', '["Gluten-Free"]', 1);
      insertItem.run(mainsId.id, 'Herb Crusted Salmon', 'Fresh salmon fillet with a herb crust, served with asparagus.', 32, 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80', '["Gluten-Free"]', 0);
      insertItem.run(mainsId.id, 'Duck Confit', 'Slow-cooked duck leg with potato gratin and cherry sauce.', 34, 'https://images.unsplash.com/photo-1518492104633-130d32229475?auto=format&fit=crop&w=800&q=80', '["Gluten-Free"]', 0);

      // Seafood
      insertItem.run(seafoodId.id, 'Grilled Octopus', 'Char-grilled octopus with romesco sauce and roasted potatoes.', 28, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', '["Gluten-Free"]', 0);
      insertItem.run(seafoodId.id, 'Lobster Thermidor', 'Whole lobster baked with a rich creamy wine sauce and cheese.', 45, 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80', '["Contains Dairy"]', 1);

      // Vegetarian
      insertItem.run(vegetarianId.id, 'Wild Mushroom Risotto', 'Creamy arborio rice with porcini mushrooms and parmesan crisp.', 24, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80', '["Vegetarian", "Gluten-Free"]', 0);
      insertItem.run(vegetarianId.id, 'Roasted Vegetable Tart', 'Seasonal vegetables on a flaky puff pastry with goat cheese.', 22, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', '["Vegetarian"]', 0);

      // Desserts
      insertItem.run(dessertsId.id, 'Chocolate Lava Cake', 'Warm chocolate cake with a molten center, served with vanilla ice cream.', 10, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', '["Vegetarian"]', 1);
      insertItem.run(dessertsId.id, 'Vanilla Bean Crème Brûlée', 'Classic French dessert with a rich custard base and caramelized sugar crust.', 9, 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=800&q=80', '["Gluten-Free", "Vegetarian"]', 0);
      insertItem.run(dessertsId.id, 'Tiramisu', 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone cream.', 11, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80', '["Vegetarian"]', 0);

      // Beverages
      insertItem.run(beveragesId.id, 'Signature Old Fashioned', 'Bourbon, smoked maple syrup, angostura bitters, orange peel.', 14, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', '["Alcoholic"]', 0);
      insertItem.run(beveragesId.id, 'Artisan Lemonade', 'Freshly squeezed lemons, mint, and elderflower syrup.', 6, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', '["Non-Alcoholic"]', 0);
      insertItem.run(beveragesId.id, 'Craft Beer Selection', 'Ask your server for our rotating selection of local craft beers.', 8, 'https://images.unsplash.com/photo-1535958636474-b021ee8876a3?auto=format&fit=crop&w=800&q=80', '["Alcoholic"]', 0);
    }

    // Initial Settings
    const settingsCount = database.prepare('SELECT count(*) as count FROM settings').get() as { count: number };
    if (settingsCount.count === 0) {
      const insertSetting = database.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      insertSetting.run('opening_hours', JSON.stringify({
        monday: { open: '12:00', close: '22:00' },
        tuesday: { open: '12:00', close: '22:00' },
        wednesday: { open: '12:00', close: '22:00' },
        thursday: { open: '12:00', close: '22:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '23:00' }
      }));
      insertSetting.run('contact_info', JSON.stringify({
        address: 'Kampala',
        phone: '+256700400063',
        email: 'kisakyearon72@gmail.com'
      }));
      insertSetting.run('theme', JSON.stringify({
        primaryColor: '#1a1a1a',
        accentColor: '#d97706', // Amber-600
        fontFamily: 'serif', // serif, sans
        borderRadius: 'rounded-sm'
      }));
      insertSetting.run('homepage_content', JSON.stringify({
        heroTitle: 'TASHA',
        heroSubtitle: 'Where Elegance Meets Flavor',
        aboutTitle: 'Our Story',
        aboutText: 'At Tasha Restaurant, we believe dining is more than a meal. It is an experience. Founded with a vision to blend global culinary artistry with local ingredients, we create dishes that tell a story.',
        heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80'
      }));
    }

    // Seed Posts
    const postsCount = database.prepare('SELECT count(*) as count FROM posts').get() as { count: number };
    if (postsCount.count === 0) {
      const insertPost = database.prepare('INSERT INTO posts (title, content, image_url, type, date) VALUES (?, ?, ?, ?, ?)');
      insertPost.run(
        'Grand Opening Night',
        'Join us for an evening of live jazz and complimentary champagne as we celebrate our grand opening.',
        'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=800&q=80',
        'event',
        new Date().toISOString()
      );
      insertPost.run(
        'Seasonal Menu Launch',
        'Our chef has curated a special menu featuring the freshest ingredients of the season. Come taste the difference.',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        'blog',
        new Date().toISOString()
      );
    }
  } catch (err) {
    console.error('Failed to initialize database tables:', err);
  }
}

// Proxy object to ensure we always get the valid DB instance
const dbProxy = new Proxy({}, {
  get: (target, prop) => {
    const database = getDb();
    return (database as any)[prop];
  }
}) as any;

export default dbProxy;
