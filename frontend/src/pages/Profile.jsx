import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Hash, Building2, Edit3, CheckCircle2, Camera, PackageX, Search, CheckSquare } from 'lucide-react';
import { getStoredUser, saveStoredUser, getStoredItems } from '../data/mockItems';
import { authAPI, itemAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(getStoredUser());
  const [allItems, setAllItems] = useState([]);
  const [activeTab, setActiveTab] = useState('lost');
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    studentId: user?.studentId || user?.regNo || '',
    department: user?.department || 'CSE',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        studentId: user.studentId || user.regNo || '',
        department: user.department || 'CSE',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  useEffect(() => {
    async function loadProfileAndReports() {
      try {
        const userProfile = await authAPI.getProfile();
        setUser(userProfile);
        saveStoredUser(userProfile);
      } catch (err) {
        console.warn('Backend profile load notice:', err.message);
      }

      try {
        const reports = await itemAPI.getMyReports();
        if (Array.isArray(reports) && reports.length > 0) {
          setAllItems(reports);
        } else {
          setAllItems(getStoredItems());
        }
      } catch (err) {
        setAllItems(getStoredItems());
      }
    }
    loadProfileAndReports();
  }, []);

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const uploadRes = await itemAPI.uploadImage(file);
      const updatedUser = { ...user, avatar: uploadRes.imageUrl };
      await authAPI.updateProfile({ avatar: uploadRes.imageUrl });
      saveStoredUser(updatedUser);
      setUser(updatedUser);
      setEditForm((prev) => ({ ...prev, avatar: uploadRes.imageUrl }));
      setNotice('Profile photo updated!');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const updatedUser = { ...user, avatar: dataUrl };
        saveStoredUser(updatedUser);
        setUser(updatedUser);
        setEditForm((prev) => ({ ...prev, avatar: dataUrl }));
        setNotice('Profile photo updated!');
        setTimeout(() => setNotice(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedBackendUser = await authAPI.updateProfile({
        name: editForm.name,
        studentId: editForm.studentId,
        department: editForm.department,
        email: editForm.email,
        avatar: editForm.avatar
      });
      setUser(updatedBackendUser);
      saveStoredUser(updatedBackendUser);
      setIsEditing(false);
      setNotice('Profile updated successfully!');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      console.warn('Backend profile update notice, updating local storage:', err.message);
      const updated = {
        ...user,
        name: editForm.name,
        regNo: editForm.studentId,
        department: editForm.department,
        email: editForm.email,
        avatar: editForm.avatar
      };
      saveStoredUser(updated);
      setUser(updated);
      setIsEditing(false);
      setNotice('Profile updated successfully!');
      setTimeout(() => setNotice(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const myLostItems = allItems.filter((i) => i.type === 'lost');
  const myFoundItems = allItems.filter((i) => i.type === 'found');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your student credentials and view your reported items.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Student Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Edit Student Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Roll No</label>
                <input
                  type="text"
                  value={editForm.studentId}
                  onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Photo */}
            <div className="relative inline-block shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarFileSelect}
                className="hidden"
              />
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 bg-white"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Student Details Grid */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1">
                  {user?.role || 'Student'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Hash className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Student ID</span>
                    <span className="text-xs font-bold text-slate-800">{user?.studentId || user?.regNo || '211423104089'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Department</span>
                    <span className="text-xs font-bold text-slate-800">{user?.department || 'CSE'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">College Email</span>
                    <span className="text-xs font-bold text-slate-800">{user?.email || 'kumar.cse@college.edu'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs: My Lost Items vs My Found Items */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('lost')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'lost'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>My Lost Items ({myLostItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>My Found Items ({myFoundItems.length})</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        {activeTab === 'lost' ? (
          myLostItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <PackageX className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No lost items reported yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myLostItems.map((item) => (
                <ItemCard key={item.id || item._id} item={item} />
              ))}
            </div>
          )
        ) : myFoundItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <PackageX className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No found items reported yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFoundItems.map((item) => (
              <ItemCard key={item.id || item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
