import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (data: ContactForm) => {
    setStatus('loading');
    try {
      // 1. Save to Local Database
      const localResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!localResponse.ok) {
        throw new Error('Failed to save message locally');
      }

      // 2. Send to Formspree
      await fetch('https://formspree.io/f/xpqjyejk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      setStatus('success');
      reset();
    } catch (error) {
      console.error('Contact error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Contact Us</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our menu, 
            want to plan a private event, or just want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800">
              <h2 className="text-2xl font-serif font-bold text-white mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-neutral-800 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Visit Us</h3>
                    <p className="text-neutral-400">Kampala</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-neutral-800 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Call Us</h3>
                    <p className="text-neutral-400">+256700400063</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-neutral-800 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Email Us</h3>
                    <p className="text-neutral-400">kisakyearon72@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-neutral-800 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold uppercase tracking-wider mb-2">Opening Hours</h3>
                    <div className="text-neutral-400 space-y-1">
                      <p className="flex justify-between w-48"><span>Mon - Thu:</span> <span>12 PM - 10 PM</span></p>
                      <p className="flex justify-between w-48"><span>Fri - Sun:</span> <span>12 PM - 11 PM</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-neutral-900 rounded-lg overflow-hidden h-[300px] border border-neutral-800">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.063683526616!2d-122.41941548468196!3d37.77492927975974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2sus!4v1531945648873" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
                allowFullScreen 
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-900 p-8 lg:p-12 rounded-lg border border-neutral-800">
            <h2 className="text-2xl font-serif font-bold text-white mb-2">Send a Message</h2>
            <p className="text-neutral-400 text-sm mb-8">We usually respond within 24 hours.</p>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-800 rounded-lg p-8 text-center space-y-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="text-neutral-300">
                  Thank you for contacting us. We will get back to you shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-amber-500 hover:text-amber-400 font-semibold underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Email</label>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Subject</label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Message</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors h-32 resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-sm uppercase tracking-widest font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {status === 'loading' ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
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
    </div>
  );
}
