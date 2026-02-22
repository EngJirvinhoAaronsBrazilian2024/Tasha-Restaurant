import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDb } from './src/db/index.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDb();

  app.use(express.json());
  app.use(cookieParser());

  // --- API Routes ---

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies?.token;
    if (!token) {
      console.log('Auth failed: No token');
      return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        console.log('Auth failed: Invalid token', err.message);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  };

  // Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { username, password } = req.body;
      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      // Set secure to true and sameSite to none for iframe compatibility in AI Studio
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  // Check Auth
  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Public: Get Menu
  app.get('/api/menu', (req, res) => {
    try {
      const categories = db.prepare('SELECT * FROM categories ORDER BY order_index').all();
      const items = db.prepare('SELECT * FROM menu_items').all();
      
      // Group items by category
      const menu = categories.map((cat: any) => ({
        ...cat,
        items: items.filter((item: any) => item.category_id === cat.id)
      }));

      res.json(menu);
    } catch (error) {
      console.error('Get menu error:', error);
      res.status(500).json({ error: 'Failed to fetch menu' });
    }
  });

  // Public: Get Featured Items
  app.get('/api/menu/featured', (req, res) => {
    try {
      const items = db.prepare('SELECT * FROM menu_items WHERE is_featured = 1').all();
      res.json(items);
    } catch (error) {
      console.error('Get featured error:', error);
      res.status(500).json({ error: 'Failed to fetch featured items' });
    }
  });

  // Public: Create Reservation
  app.post('/api/reservations', (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO reservations (name, email, phone, date, time, guests) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(name, email, phone, date, time, guests);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error('Create reservation error:', error);
      res.status(500).json({ error: 'Failed to create reservation' });
    }
  });

  // Public: Send Message
  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
      stmt.run(name, email, message);
      res.json({ success: true });
    } catch (error) {
      console.error('Contact error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Public: Get Settings
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.prepare('SELECT * FROM settings').all() as any[];
      const settingsObj: any = {};
      settings.forEach(s => {
        try {
          settingsObj[s.key] = JSON.parse(s.value);
        } catch (e) {
          settingsObj[s.key] = s.value;
        }
      });
      res.json(settingsObj);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // --- Admin Routes (Protected) ---

  // Dashboard Stats
  app.get('/api/admin/stats', authenticateToken, (req, res) => {
    try {
      const totalReservations = db.prepare('SELECT count(*) as count FROM reservations').get() as any;
      const pendingReservations = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'pending'").get() as any;
      const newMessages = db.prepare('SELECT count(*) as count FROM messages WHERE is_read = 0').get() as any;
      
      res.json({
        totalReservations: totalReservations.count,
        pendingReservations: pendingReservations.count,
        newMessages: newMessages.count
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Manage Reservations
  app.get('/api/admin/reservations', authenticateToken, (req, res) => {
    try {
      const reservations = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC').all();
      res.json(reservations);
    } catch (error) {
      console.error('Get reservations error:', error);
      res.status(500).json({ error: 'Failed to fetch reservations' });
    }
  });

  app.put('/api/admin/reservations/:id', authenticateToken, (req, res) => {
    try {
      const { status } = req.body;
      db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Update reservation error:', error);
      res.status(500).json({ error: 'Failed to update reservation' });
    }
  });

  // Manage Menu
  app.post('/api/admin/menu-items', authenticateToken, (req, res) => {
    try {
      const { category_id, name, description, price, image_url, dietary_tags, is_featured } = req.body;
      const stmt = db.prepare(`
        INSERT INTO menu_items (category_id, name, description, price, image_url, dietary_tags, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(category_id, name, description, price, image_url, JSON.stringify(dietary_tags), is_featured ? 1 : 0);
      res.json({ success: true });
    } catch (error) {
      console.error('Create menu item error:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  });

  app.put('/api/admin/menu-items/:id', authenticateToken, (req, res) => {
    try {
      const { category_id, name, description, price, image_url, dietary_tags, is_featured } = req.body;
      const stmt = db.prepare(`
        UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, dietary_tags = ?, is_featured = ?
        WHERE id = ?
      `);
      stmt.run(category_id, name, description, price, image_url, JSON.stringify(dietary_tags), is_featured ? 1 : 0, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Update menu item error:', error);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  });

  app.delete('/api/admin/menu-items/:id', authenticateToken, (req, res) => {
    try {
      db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete menu item error:', error);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  });

  // Manage Settings
  app.post('/api/admin/settings', authenticateToken, (req, res) => {
    try {
      const { key, value } = req.body;
      const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      stmt.run(key, JSON.stringify(value));
      res.json({ success: true });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Manage Posts
  app.get('/api/posts', (req, res) => {
    try {
      const posts = db.prepare('SELECT * FROM posts ORDER BY date DESC').all();
      res.json(posts);
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  app.post('/api/admin/posts', authenticateToken, (req, res) => {
    try {
      const { title, content, image_url, type, date } = req.body;
      const stmt = db.prepare('INSERT INTO posts (title, content, image_url, type, date) VALUES (?, ?, ?, ?, ?)');
      stmt.run(title, content, image_url, type, date);
      res.json({ success: true });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  app.put('/api/admin/posts/:id', authenticateToken, (req, res) => {
    try {
      const { title, content, image_url, type, date } = req.body;
      const stmt = db.prepare('UPDATE posts SET title = ?, content = ?, image_url = ?, type = ?, date = ? WHERE id = ?');
      stmt.run(title, content, image_url, type, date, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  app.delete('/api/admin/posts/:id', authenticateToken, (req, res) => {
    try {
      db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving would go here
    // app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
