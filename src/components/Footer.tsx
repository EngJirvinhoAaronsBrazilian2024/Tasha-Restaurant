import { useState } from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    try {
      const response = await fetch('https://formspree.io/f/xpqjyejk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'newsletter_subscription' }),
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white tracking-wider">TASHA</h3>
            <p className="text-sm leading-relaxed">
              Where elegance meets flavor. Experience refined dining crafted with passion and precision.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-widest mb-6 text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-amber-500 transition-colors">Menu</Link></li>
              <li><Link to="/reservations" className="hover:text-amber-500 transition-colors">Reservations</Link></li>
              <li><Link to="/admin/login" className="hover:text-amber-500 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-widest mb-6 text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Kampala</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <span>+256700400063</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <span>kisakyearon72@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-widest mb-6 text-sm">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe for seasonal updates and exclusive events.</p>
            {status === 'success' ? (
              <div className="flex items-center space-x-2 text-green-500 bg-green-900/20 p-3 rounded-sm">
                <Check className="h-4 w-4" />
                <span className="text-sm">Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-sm text-sm font-semibold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-xs">Failed to subscribe. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-16 pt-8 text-center text-xs tracking-wider">
          <p>&copy; {new Date().getFullYear()} Tasha Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
