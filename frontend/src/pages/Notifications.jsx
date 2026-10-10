import React, { useState } from 'react';
import { Bell, Sparkles, CheckCircle2, MapPin, Check, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Possible Match Found!',
    message: 'Possible match found for your lost ID card near Central Library.',
    time: '10 minutes ago',
    read: false,
    type: 'match',
    link: '/item/item-1'
  },
  {
    id: 'n2',
    title: 'New Found Item Reported',
    message: 'Someone reported a found wallet near the library canteen area.',
    time: '1 hour ago',
    read: false,
    type: 'found',
    link: '/found-items'
  },
  {
    id: 'n3',
    title: 'Item Marked as Returned',
    message: 'Your item "Fastrack Mesh Strap Watch" has been marked as returned to owner.',
    time: 'Yesterday',
    read: true,
    type: 'returned',
    link: '/my-reports'
  },
  {
    id: 'n4',
    title: 'Security Desk Update',
    message: 'Gate 1 security desk turned in a set of house keys matching your description.',
    time: '2 days ago',
    read: true,
    type: 'security',
    link: '/item/item-8'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" /> Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">Stay updated on match alerts, claim responses, and item returns</p>
        </div>

        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-2xs">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No notifications</h3>
          <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200/80'
                  : 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'match'
                      ? 'bg-purple-100 text-purple-700'
                      : notif.type === 'returned'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {notif.type === 'match' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : notif.type === 'returned' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px]">
                    <span className="text-slate-400">{notif.time}</span>
                    <Link to={notif.link} className="font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                      View details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <button
                onClick={() => clearNotification(notif.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                title="Remove Notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
