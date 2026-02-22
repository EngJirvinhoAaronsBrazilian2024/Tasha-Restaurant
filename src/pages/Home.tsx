import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronDown, Star, MapPin, Clock, Phone, Mail, ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('/api/menu/featured')
      .then(res => res.json())
      .then(data => setFeaturedItems(data.slice(0, 3)))
      .catch(err => console.error('Failed to fetch featured items', err));
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80")',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tighter"
          >
            TASHA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-200 font-light tracking-wide"
          >
            Where Elegance Meets Flavor
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link 
              to="/reservations" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-sm uppercase tracking-widest font-semibold transition-all hover:scale-105"
            >
              Book a Table
            </Link>
            <Link 
              to="/menu" 
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-sm uppercase tracking-widest font-semibold transition-all"
            >
              View Menu
            </Link>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-amber-600/20 rounded-lg transform rotate-2 group-hover:rotate-1 transition-transform duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80" 
                alt="Interior" 
                className="relative rounded-lg shadow-2xl w-full object-cover aspect-[4/5]"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Our Story</h2>
              <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
                <p>
                  At Tasha Restaurant, we believe dining is more than a meal. It is an experience. 
                  Founded with a vision to blend global culinary artistry with local ingredients, 
                  we create dishes that tell a story.
                </p>
                <p>
                  Meet <span className="text-amber-500 font-semibold">Chef Natasha K.</span>, 
                  an award-winning culinary expert trained in international fine dining kitchens. 
                  Her philosophy focuses on flavor depth, presentation artistry, and seasonal freshness.
                </p>
              </div>
              <Link 
                to="/menu" 
                className="inline-flex items-center text-amber-500 hover:text-amber-400 uppercase tracking-widest font-semibold transition-colors group"
              >
                Discover Our Menu <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Chef's Recommendations</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Curated selections that define our culinary identity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="group bg-neutral-900 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Chef's Special
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif font-bold text-white">{item.name}</h3>
                    <span className="text-amber-500 font-mono text-lg">${item.price}</span>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/reservations" 
              className="bg-white text-neutral-950 hover:bg-neutral-200 px-8 py-4 rounded-sm uppercase tracking-widest font-semibold transition-colors"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-1 text-amber-500 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}
          </div>
          <blockquote className="text-2xl md:text-4xl font-serif italic text-white leading-relaxed mb-8">
            "An unforgettable dining experience. Perfect for business dinners. The service was exceptional and the dishes were beautifully plated."
          </blockquote>
          <cite className="text-neutral-400 not-italic uppercase tracking-widest font-semibold text-sm">
            — Jonathan Reynolds, Food Critic
          </cite>
        </div>
      </section>

      {/* Location & Info */}
      <section id="contact" className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Map Placeholder */}
            <div className="bg-neutral-900 rounded-lg overflow-hidden h-[400px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.063683526616!2d-122.41941548468196!3d37.77492927975974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2sus!4v1531945648873" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
                allowFullScreen 
                loading="lazy"
              />
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-white mb-8">Visit Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-amber-500 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Opening Hours</h3>
                      <div className="text-neutral-400 space-y-1">
                        <p className="flex justify-between w-48"><span>Mon - Thu:</span> <span>12 PM - 10 PM</span></p>
                        <p className="flex justify-between w-48"><span>Fri - Sun:</span> <span>12 PM - 11 PM</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-amber-500 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Location</h3>
                      <p className="text-neutral-400">Kampala</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-amber-500 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Contact</h3>
                      <p className="text-neutral-400">+256700400063</p>
                      <p className="text-neutral-400">kisakyearon72@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion - Simplified */}
              <div>
                <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <details className="group bg-neutral-900 rounded-lg">
                    <summary className="flex justify-between items-center cursor-pointer p-4 font-medium text-neutral-200">
                      Do you offer vegetarian options?
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 text-neutral-400 text-sm">
                      Yes, we offer a curated vegetarian and vegan selection.
                    </div>
                  </details>
                  <details className="group bg-neutral-900 rounded-lg">
                    <summary className="flex justify-between items-center cursor-pointer p-4 font-medium text-neutral-200">
                      Is parking available?
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 text-neutral-400 text-sm">
                      Yes, private and street parking available.
                    </div>
                  </details>
                  <details className="group bg-neutral-900 rounded-lg">
                    <summary className="flex justify-between items-center cursor-pointer p-4 font-medium text-neutral-200">
                      Can I book for large events?
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 text-neutral-400 text-sm">
                      Yes, private dining arrangements available. Please contact us directly.
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
