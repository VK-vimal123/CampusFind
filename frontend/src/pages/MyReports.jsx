import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Calendar, CheckCircle2, Eye, Tag, AlertCircle } from 'lucide-react';
import { getStoredItems, saveStoredItems, getStoredUser } from '../data/mockItems';

export default function MyReports() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const user = getStoredUser();

  useEffect(() => {
    setItems(getStoredItems());
  }, []);

  // Filter reports reported by current logged in user (or fallback to top items for demonstration if name matches)
  const myReportsList = items.filter((item) => {
    if (!item.reportedBy) return true;
    return item.reportedBy.name === user?.name || item.reportedBy.email === user?.email;
  });

  const filteredReports = myReportsList.filter((item) => {
    if (activeTab === 'Lost') return item.type === 'lost';
    if (activeTab === 'Found') return item.type === 'found';
    if (activeTab === 'Returned') return item.status === 'Returned';
    return true;
  });

  const handleStatusChange = (itemId, newStatus) => {
    const updated = items.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i));
    saveStoredItems(updated);
    setItems(updated);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Returned':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Verified':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Possible Match':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Searching':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" /> My Reported Items
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your submitted lost & found reports, track claim statuses, or mark items as returned.
        </p>

        {/* Tab Filters */}
        <div className="flex gap-2 mt-6 border-b border-slate-200 pb-px">
          {['All', 'Lost', 'Found', 'Returned'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab} Reports
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-2xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No reports found under "{activeTab}"</h3>
          <p className="text-xs text-slate-500 mt-1">You haven't submitted any reports matching this filter yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={report.image}
                  alt={report.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                        report.type === 'lost' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {report.type}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${getStatusBadgeStyle(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">{report.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {report.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {report.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Updater & View Details */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <select
                  value={report.status}
                  onChange={(e) => handleStatusChange(report.id, e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Reported">Reported</option>
                  <option value="Searching">Searching</option>
                  <option value="Possible Match">Possible Match</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Verified">Verified</option>
                  <option value="Returned">Returned</option>
                </select>

                <Link
                  to={`/item/${report.id}`}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs rounded-lg inline-flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
