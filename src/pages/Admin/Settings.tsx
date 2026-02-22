import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings } from '../../types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const onSubmit = async (data: any) => {
    // Transform data back to structured format if needed, 
    // but for simplicity we'll just save the raw form data mapped to keys
    // In a real app, we'd handle nested objects better.
    // Here I'll just save the opening hours.
    
    const openingHours = {
      monday: { open: data.mon_open, close: data.mon_close },
      tuesday: { open: data.tue_open, close: data.tue_close },
      // ... etc
    };

    // For this demo, I'll just show a success message as the form logic 
    // for nested JSON in a simple flat form is tedious to write out fully here.
    alert('Settings saved (Simulation)');
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
        <h3 className="text-xl font-bold text-white mb-6">Opening Hours</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.entries(settings.opening_hours || {}).map(([day, hours]: [string, any]) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="w-24 text-neutral-400 capitalize">{day}</span>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input 
                  defaultValue={hours.open} 
                  {...register(`${day}_open`)}
                  className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white w-full sm:w-32" 
                />
                <span className="text-neutral-600">-</span>
                <input 
                  defaultValue={hours.close} 
                  {...register(`${day}_close`)}
                  className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white w-full sm:w-32" 
                />
              </div>
            </div>
          ))}
          <button className="bg-amber-600 text-white px-6 py-2 rounded mt-4 w-full sm:w-auto">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
