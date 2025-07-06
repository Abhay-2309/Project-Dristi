import React, { useState } from 'react';
import { Users, MapPin, Radio, Clock, Filter } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  type: 'security' | 'medical' | 'fire' | 'police';
  status: 'available' | 'busy' | 'responding';
  location: string;
  lastUpdate: string;
  assignedIncident?: string;
}

interface UnitsPanelProps {
  units: Unit[];
  onUnitClick: (unit: Unit) => void;
  onDispatchUnit: (unitId: string) => void;
}

export const UnitsPanel: React.FC<UnitsPanelProps> = ({ units, onUnitClick, onDispatchUnit }) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'busy' | 'responding'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'security' | 'medical' | 'fire' | 'police'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'responding': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-blue-500';
      case 'medical': return 'bg-green-500';
      case 'fire': return 'bg-red-500';
      case 'police': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return '🛡️';
      case 'medical': return '🏥';
      case 'fire': return '🚒';
      case 'police': return '👮';
      default: return '👤';
    }
  };

  const filteredUnits = units.filter(unit => {
    const statusMatch = filter === 'all' || unit.status === filter;
    const typeMatch = typeFilter === 'all' || unit.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffMinutes / 60)}h ago`;
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Units</h2>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-slate-400">{filteredUnits.length} units</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Status:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-slate-800 text-white rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="responding">Responding</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Type:</span>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-slate-800 text-white rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="security">Security</option>
            <option value="medical">Medical</option>
            <option value="fire">Fire</option>
            <option value="police">Police</option>
          </select>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-700 transition-colors"
            onClick={() => onUnitClick(unit)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(unit.type)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{unit.name}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(unit.status)}`}></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(unit.type)}`}></div>
                    <span className="capitalize">{unit.type}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTime(unit.lastUpdate)}
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-sm text-slate-300">{unit.location}</span>
            </div>

            {unit.assignedIncident && (
              <div className="text-xs text-blue-400 mb-2">
                Assigned to: {unit.assignedIncident}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded capitalize ${
                  unit.status === 'available' ? 'bg-green-600 text-white' :
                  unit.status === 'busy' ? 'bg-yellow-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {unit.status}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDispatchUnit(unit.id);
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors"
                  disabled={unit.status !== 'available'}
                >
                  Dispatch
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded transition-colors"
                >
                  <Radio className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400">No units match the current filter</p>
        </div>
      )}
    </div>
  );
};