import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Filter } from 'lucide-react';
import { Category, MenuItem } from '../types';

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => console.error('Failed to fetch menu', err));
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? categories.flatMap(cat => cat.items || [])
    : categories.find(cat => cat.id === selectedCategory)?.items || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">Our Menu</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A culinary journey through flavors and textures.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 sticky top-24 z-30 bg-neutral-950/90 backdrop-blur-md py-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`item-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="group bg-neutral-900 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {item.is_featured && (
                  <div className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Chef's Special
                  </div>
                )}
              </div>
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-amber-500 font-mono text-lg">${item.price}</span>
                </div>
                <p className="text-neutral-400 text-sm line-clamp-2">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`item-${selectedItem.id}`}
              className="relative bg-neutral-900 rounded-lg overflow-hidden max-w-2xl w-full shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="h-80 overflow-hidden">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-serif font-bold text-white">{selectedItem.name}</h2>
                  <span className="text-amber-500 font-mono text-2xl">${selectedItem.price}</span>
                </div>
                
                <p className="text-neutral-300 text-lg leading-relaxed">
                  {selectedItem.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(selectedItem.dietary_tags || '[]').map((tag: string) => (
                    <span key={tag} className="bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
