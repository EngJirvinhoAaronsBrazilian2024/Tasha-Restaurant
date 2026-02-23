import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  type: 'blog' | 'event';
  date: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Blog & Events</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Stay updated with the latest news, culinary insights, and upcoming events at Tasha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 group hover:border-amber-900/50 transition-colors"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={post.image_url || 'https://via.placeholder.com/800x600?text=No+Image'} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    post.type === 'event' ? 'bg-amber-600 text-white' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {post.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-xs text-neutral-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  {post.type === 'event' && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>7:00 PM</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                <button className="mt-4 text-amber-500 text-sm font-semibold uppercase tracking-wider hover:text-amber-400 transition-colors">
                  Read More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
