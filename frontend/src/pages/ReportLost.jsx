import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, LOCATIONS, getStoredItems, saveStoredItems, getStoredUser } from '../data/mockItems';
import { itemAPI } from '../services/api';

export default function ReportLost() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [formData, setFormData] = useState({
    title: '',
    category: 'ID Card',
    description: '',
    location: 'Central Library',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: '+91 98765 43210'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadRes = await itemAPI.uploadImage(file);
        setFormData({ ...formData, image: uploadRes.imageUrl });
      } catch (err) {
        console.warn('Backend image upload fallback to DataURL:', err.message);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await itemAPI.reportLost(formData);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/lost-items');
      }, 1500);
    } catch (err) {
      console.warn('Backend submission notice, using fallback storage:', err.message);
      const newItem = {
        id: `item-${Date.now()}`,
        title: formData.title,
        type: 'lost',
        category: formData.category,
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
        location: formData.location,
        date: formData.date,
        time: formData.time,
        status: 'Searching',
        reportedBy: {
          name: formData.contactName || user?.name || 'Kumar CSE',
          email: formData.contactEmail || user?.email || 'kumar.cse@college.edu',
          role: user?.role || 'Student',
          department: user?.department || 'CSE',
          regNo: user?.regNo || '211423104089',
          phone: formData.contactPhone || '+91 98765 43210'
        }
      };
      const currentItems = getStoredItems();
      saveStoredItems([newItem, ...currentItems]);

      setSubmitted(true);
      setTimeout(() => {
        navigate('/lost-items');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Report Lost Item</h1>
        <p className="text-xs text-slate-500 mt-1">
          Fill in the details of your lost item so other students and staff can help locate it.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-emerald-900">Report Submitted Successfully!</h2>
          <p className="text-xs text-emerald-700">
            Your lost item report has been published. Redirecting to Lost Items page...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Student ID Card, Blue Water Bottle, Black Leather Wallet"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location Lost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location Lost <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the lost item..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Lost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Lost <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
            </div>

            {/* Time Lost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Lost</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 11:30 AM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Image</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Choose Image File</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              </label>
              <span className="text-xs text-slate-500 truncate max-w-xs">
                {formData.image ? 'Image selected' : 'No image uploaded'}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="your.email@college.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Lost Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
