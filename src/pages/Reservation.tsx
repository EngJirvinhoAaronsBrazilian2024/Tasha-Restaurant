import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
}

export default function Reservation() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationForm>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (data: ReservationForm) => {
    setStatus('loading');
    try {
      // 1. Save to Local Database (for Admin Panel)
      const localResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!localResponse.ok) {
        throw new Error('Failed to save reservation locally');
      }

      // 2. Send to Formspree (for Email Notification)
      await fetch('https://formspree.io/f/xpqjyejk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      setStatus('success');
      reset();
    } catch (error) {
      console.error('Reservation error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
        {/* Left Side - Image & Info */}
        <div className="relative hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=800&q=80" 
            alt="Dining Atmosphere" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-serif font-bold mb-4">Reserve Your Table</h2>
            <p className="text-neutral-300 text-lg leading-relaxed">
              Secure your seat for an unforgettable dining experience. 
              Whether it's a romantic dinner or a business meeting, we ensure perfection.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-12 space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Book a Table</h1>
            <p className="text-neutral-400 text-sm">Please fill in the details below.</p>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/20 border border-green-800 rounded-lg p-8 text-center space-y-4"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold text-white">Reservation Confirmed!</h3>
              <p className="text-neutral-300">
                Thank you for booking with us. We have sent a confirmation email to your inbox.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 text-amber-500 hover:text-amber-400 font-semibold underline"
              >
                Make another reservation
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder=""
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Email</label>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder=""
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Phone</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder=""
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <select
                      {...register('guests', { required: true })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-sm pl-12 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} People</option>
                      ))}
                      <option value="9+">9+ (Contact us)</option>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-sm pl-12 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <select
                      {...register('time', { required: 'Time is required' })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-sm pl-12 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                    >
                      <option value="">Select Time</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="17:30">5:30 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="18:30">6:30 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="19:30">7:30 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="20:30">8:30 PM</option>
                      <option value="21:00">9:00 PM</option>
                    </select>
                  </div>
                  {errors.time && <p className="text-red-500 text-xs">{errors.time.message}</p>}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Special Requests / Special Order</label>
                <textarea
                  {...register('special_requests')}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors h-32 resize-none"
                  placeholder="Any dietary restrictions, special occasions, or specific menu items you'd like to pre-order?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-sm uppercase tracking-widest font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Processing...' : 'Confirm Reservation'}
              </button>

              {status === 'error' && (
                <div className="flex items-center space-x-2 text-red-500 bg-red-900/20 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
