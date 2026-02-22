import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        login(result.user);
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="max-w-md w-full bg-neutral-900 p-8 rounded-lg shadow-2xl border border-neutral-800">
        <div className="text-center mb-8">
          <div className="bg-amber-600/20 p-4 rounded-full inline-block mb-4">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Admin Access</h2>
          <p className="text-neutral-400 text-sm mt-2">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Username</label>
            <input
              {...register('username', { required: 'Username is required' })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{String(errors.username.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-sm uppercase tracking-widest font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
