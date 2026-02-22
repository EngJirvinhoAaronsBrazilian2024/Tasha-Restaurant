import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { MenuItem, Category } from '../../types';

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    fetch('/api/menu')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch menu');
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setItems(data.flatMap((cat: any) => cat.items || []));
      })
      .catch(err => console.error(err));
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setValue('name', item.name);
      setValue('description', item.description);
      setValue('price', item.price);
      setValue('category_id', item.category_id);
      setValue('image_url', item.image_url);
      setValue('is_featured', item.is_featured);
      setValue('dietary_tags', JSON.parse(item.dietary_tags || '[]').join(', '));
    } else {
      setEditingItem(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      dietary_tags: data.dietary_tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };

    const url = editingItem ? `/api/admin/menu-items/${editingItem.id}` : '/api/admin/menu-items';
    const method = editingItem ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setIsModalOpen(false);
    fetchMenu();
  };

  const deleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await fetch(`/api/admin/menu-items/${id}`, { method: 'DELETE' });
      fetchMenu();
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
          <span>Add New Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(item)} className="bg-white text-black p-2 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => deleteItem(item.id)} className="bg-white text-black p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{item.name}</h3>
                <span className="text-amber-500 font-mono">${item.price}</span>
              </div>
              <p className="text-neutral-400 text-sm line-clamp-2">{item.description}</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                <input {...register('name', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Price</label>
                  <input type="number" step="0.01" {...register('price', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Category</label>
                  <select {...register('category_id', { required: true })} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white">
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                <textarea {...register('description')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white h-24" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Image URL</label>
                <input {...register('image_url')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
                {/* Image Preview */}
                <div className="mt-2 h-32 bg-neutral-950 rounded border border-neutral-800 flex items-center justify-center overflow-hidden">
                  <img 
                    src={watch('image_url') || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL'; }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Dietary Tags (comma separated)</label>
                <input {...register('dietary_tags')} placeholder="Vegan, Gluten-Free" className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" {...register('is_featured')} className="rounded bg-neutral-950 border-neutral-800 text-amber-600" />
                <label className="text-sm font-medium text-neutral-300">Feature on Homepage</label>
              </div>

              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-bold uppercase tracking-wide mt-4">
                Save Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
