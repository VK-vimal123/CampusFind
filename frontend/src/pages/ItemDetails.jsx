import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Mail,
  Phone,
  CheckCircle2,
  Send
} from 'lucide-react';
import { getStoredItems, saveStoredItems } from '../data/mockItems';
import { itemAPI } from '../services/api';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [actionNotice, setActionNotice] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await itemAPI.getItemById(id);
        setItem(data);
      } catch (err) {
        console.warn('Backend item detail notice, using local storage:', err.message);
        const list = getStoredItems();
        setItems(list);
        const found = list.find((i) => i.id === id || i._id === id) || list[0];
        setItem(found);
      }
    }
    fetchDetails();
  }, [id]);

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Loading Item Details...</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isLost = item.type === 'lost';

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await itemAPI.claimItem(item._id || item.id, claimMessage);
      setItem({ ...item, status: 'Contacted' });
      setClaimModalOpen(false);
      setActionNotice('Your claim message has been sent to the reporter via API!');
    } catch (err) {
      console.warn('Backend claim notice, using fallback state:', err.message);
      const list = getStoredItems();
      const updatedItems = list.map((i) =>
        i.id === item.id || i._id === item.id ? { ...i, status: 'Contacted' } : i
      );
      saveStoredItems(updatedItems);
      setItem({ ...item, status: 'Contacted' });
      setClaimModalOpen(false);
      setActionNotice('Your claim message has been recorded!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <span
          className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
            isLost ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          {isLost ? 'Lost Item' : 'Found Item'}
        </span>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-emerald-700 hover:underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left: Large Item Image */}
        <div className="md:col-span-6 bg-slate-100 relative min-h-[300px] flex items-center justify-center p-4">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full max-h-[380px] object-cover rounded-lg border border-slate-200"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
              Status: {item.status}
            </span>
          </div>
        </div>

        {/* Right: Detailed Info */}
        <div className="md:col-span-6 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <Tag className="w-4 h-4" />
              <span>{item.category}</span>
            </div>

            {/* Item Name */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {item.title}
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {item.description}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Location</span>
                  <span className="font-semibold text-slate-800">{item.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Date Lost/Found</span>
                  <span className="font-semibold text-slate-800">{item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Time</span>
                  <span className="font-semibold text-slate-800">{item.time || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posted By Information */}
          {item.reportedBy && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Posted By</span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {(item.reportedBy.name || item.contactName || 'U').charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.reportedBy.name || item.contactName} ({item.reportedBy.role || 'Student'})</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {item.reportedBy.email || item.contactEmail}
                    </span>
                    {(item.reportedBy.phone || item.contactPhone) && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {item.reportedBy.phone || item.contactPhone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact / Claim Item Button */}
          <div className="pt-2">
            <button
              onClick={() => setClaimModalOpen(true)}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Contact / Claim Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Claim / Contact Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-slate-900">Claim / Contact Reporter</h3>
            <p className="text-xs text-slate-600">
              Send a claim message for <strong>{item.title}</strong>.
            </p>
            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message / Proof of Ownership</label>
                <textarea
                  rows={4}
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  placeholder="Describe distinguishing features or proof that this item belongs to you..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Claim Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
