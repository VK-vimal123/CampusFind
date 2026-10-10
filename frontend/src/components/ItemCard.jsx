import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Eye, User } from 'lucide-react';

export default function ItemCard({ item }) {
  const isLost = item.type === 'lost';

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
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Image Container & Badges */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80";
          }}
        />
        
        {/* Type Badge (Lost vs Found) */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-xs uppercase tracking-wider ${
              isLost
                ? 'bg-red-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border shadow-xs ${getStatusBadgeStyle(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{item.category}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base line-clamp-1">
            {item.title}
          </h3>

          <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Meta info & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {item.location}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {item.date}
            </span>
          </div>

          {item.reportedBy && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {item.reportedBy.name}
              </span>
              <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                {item.reportedBy.role}
              </span>
            </div>
          )}

          <Link
            to={`/item/${item.id}`}
            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
