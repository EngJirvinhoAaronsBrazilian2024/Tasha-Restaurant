import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  type: 'blog' | 'event';
  date: string;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  };

  const openModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setValue('title', post.title);
      setValue('content', post.content);
      setValue('image_url', post.image_url);
      setValue('type', post.type);
      setValue('date', post.date.split('T')[0]);
    } else {
      setEditingPost(null);
      reset();
      setValue('type', 'blog');
      setValue('date', new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    const url = editingPost ? `/api/admin/posts/${editingPost.id}` : '/api/admin/posts';
    const method = editingPost ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setIsModalOpen(false);
    fetchPosts();
  };

  const deletePost = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-sm uppercase text-sm font-semibold tracking-wider transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Post</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden group flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(post)} className="bg-white text-black p-2 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => deletePost(post.id)} className="bg-white text-black p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded uppercase tracking-wide">
                {post.type}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg">{post.title}</h3>
                <span className="text-neutral-500 text-xs">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <p className="text-neutral-400 text-sm line-clamp-3 mb-4 flex-1">{post.content}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 w-full max-w-lg rounded-lg border border-neutral-800 p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
                <input {...register('title', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Type</label>
                  <select {...register('type', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white">
                    <option value="blog">Blog Post</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Date</label>
                  <input type="date" {...register('date', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Content</label>
                <textarea {...register('content', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white h-32" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Image URL</label>
                <input {...register('image_url')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
              </div>

              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-bold uppercase tracking-wide mt-4">
                Save Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
