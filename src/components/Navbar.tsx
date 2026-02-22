import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-neutral-950/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <ChefHat className="h-8 w-8 text-amber-500 transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-serif font-bold text-white tracking-wider">
              TASHA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-widest hover:text-amber-500 transition-colors ${
                  location.pathname === link.path ? 'text-amber-500' : 'text-neutral-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/reservations"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-sm uppercase text-xs tracking-widest font-semibold transition-colors"
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-500 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-900 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-8 space-y-4 flex flex-col items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-300 hover:text-amber-500 text-lg uppercase tracking-widest py-2"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/reservations"
                onClick={() => setIsOpen(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-sm uppercase text-sm tracking-widest font-semibold mt-4"
              >
                Book a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
