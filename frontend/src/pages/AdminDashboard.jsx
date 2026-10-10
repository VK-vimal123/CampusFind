import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Search,
  CheckCircle2,
  CheckCheck,
  Clock,
  Eye,
  Check,
  X,
  Trash2,
  Filter
} from 'lucide-react';
import { getStoredItems, saveStoredItems } from '../data/mockItems';
import { Link } from 'react-router-dom';

const MOCK_USERS = [
  { id: 'u1', name: 'Kumar CSE', email: 'kumar.cse@college.edu', role: 'Student', department: 'CSE', regNo: '211423104089', status: 'Active' },
  { id: 'u2', name: 'Ananya Sharma', email: 'ananya.ece@college.edu', role: 'Student', department: 'ECE', regNo: '211423106012', status: 'Active' },
  { id: 'u3', name: 'Dr. K. Rajesh', email: 'rajesh.faculty@college.edu', role: 'Faculty', department: 'CSE', regNo: 'FAC-8042', status: 'Active' },
  { id: 'u4', name: 'Deepak Sundar', email: 'deepak.aids@college.edu', role: 'Student', department: 'AI & DS', regNo: '211423243019', status: 'Active' },
  { id: 'u5', name: 'M. Murugan', email: 'security.gate1@college.edu', role: 'Staff', department: 'Other', regNo: 'STF-102', status: 'Active' }
];

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('Reports'); // 'Reports' | 'Users'
  const [userList, setUserList] = useState(MOCK_USERS);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    setItems(getStoredItems());
  }, []);

  const handleApprove = (id) => {
    const updated = items.map((i) => (i.id === id ? { ...i, status: 'Verified' } : i));
    saveStoredItems(updated);
    setItems(updated);
    setActionMessage(`Report #${id} approved & verified!`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleReject = (id) => {
    const updated = items.map((i) => (i.id === id ? { ...i, status: 'Searching' } : i));
    saveStoredItems(updated);
    setItems(updated);
    setActionMessage(`Report #${id} rejected!`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleRemoveItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    saveStoredItems(updated);
    setItems(updated);
    setActionMessage(`Item removed from database.`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleRemoveUser = (userId) => {
    setUserList((prev) => prev.filter((u) => u.id !== userId));
    setActionMessage(`User account removed.`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const lostCount = items.filter((i) => i.type === 'lost').length;
  const foundCount = items.filter((i) => i.type === 'found').length;
  const returnedCount = items.filter((i) => i.status === 'Returned').length;
  const pendingCount = items.filter((i) => i.status === 'Reported').length;

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Administrative Access Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Moderation Console</h1>
            <p className="mt-1 text-amber-100 text-xs sm:text-sm">
              Manage campus users, moderate reported lost & found belongings, approve claims, and oversee operations.
            </p>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-amber-700 hover:text-amber-950">
            Dismiss
          </button>
        </div>
      )}

      {/* Admin Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{userList.length + 1235}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Students & Staff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Lost Reports</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{lostCount}</h3>
          <span className="text-[10px] text-rose-600 font-semibold">Logged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Found Reports</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{foundCount}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">Turned in</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Returned Items</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{returnedCount}</h3>
          <span className="text-[10px] text-sky-600 font-semibold">Resolved</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Approval</p>
          <h3 className="text-xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
          <span className="text-[10px] text-amber-600 font-semibold">Needs review</span>
        </div>
      </div>

      {/* Content Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 pt-4 rounded-t-2xl border-t border-x">
        <button
          onClick={() => setActiveTab('Reports')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'Reports' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500'
          }`}
        >
          Reports & Item Moderation ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('Users')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'Users' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500'
          }`}
        >
          User Accounts Management ({userList.length})
        </button>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-b-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {activeTab === 'Reports' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Reported By</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="truncate max-w-xs">{item.title}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        item.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5">{item.category}</td>
                    <td className="p-3.5">{item.location}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">{item.reportedBy?.name}</span>
                      <span className="block text-[10px] text-slate-400">{item.reportedBy?.email}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md border">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <Link
                        to={`/item/${item.id}`}
                        className="inline-flex items-center p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg"
                        title="Approve Report"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="inline-flex items-center p-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg"
                        title="Reject / Flag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="inline-flex items-center p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg"
                        title="Remove Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Register / ID</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{usr.name}</td>
                    <td className="p-3.5">{usr.email}</td>
                    <td className="p-3.5 font-mono">{usr.regNo}</td>
                    <td className="p-3.5">{usr.department}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded">
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleRemoveUser(usr.id)}
                        className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg"
                        title="Remove User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
