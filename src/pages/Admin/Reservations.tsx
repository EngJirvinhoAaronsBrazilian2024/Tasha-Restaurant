import { useEffect, useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Reservation } from '../../types';
import { api } from '../../lib/api';

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    api.getReservations()
      .then(data => setReservations(data))
      .catch(err => console.error(err));
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.updateReservation(id, status);
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Guest</th>
            <th className="px-6 py-4">Date & Time</th>
            <th className="px-6 py-4">Party Size</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {reservations.map((res) => (
            <tr key={res.id} className="hover:bg-neutral-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{res.name}</td>
              <td className="px-6 py-4 text-neutral-300">
                {res.date} at {res.time}
              </td>
              <td className="px-6 py-4 text-neutral-300">{res.guests} ppl</td>
              <td className="px-6 py-4 text-neutral-300 text-sm">
                <div>{res.email}</div>
                <div>{res.phone}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  res.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                  res.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                  'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {res.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {res.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(res.id, 'confirmed')}
                      className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-full transition-colors"
                      title="Confirm"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(res.id, 'cancelled')}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-full transition-colors"
                      title="Decline"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
