import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Incident {
  id: string;
  type: 'crowd_surge' | 'medical' | 'fire' | 'security';
  severity: 'low' | 'medium' | 'high';
  description: string;
  time: string;
  location: string;
  status: 'active' | 'responding' | 'resolved';
  assignedUnits: string[];
}

interface IncidentPanelProps {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
}

export const IncidentPanel: React.FC<IncidentPanelProps> = ({ incidents, onIncidentClick }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crowd_surge': return '🏃‍♂️';
      case 'medical': return '🏥';
      case 'fire': return '🔥';
      case 'security': return '🚨';
      default: return '⚠️';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'responding': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Active Incidents</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="bg-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-700 transition-colors border-l-4 border-transparent hover:border-blue-500"
            onClick={() => onIncidentClick(incident)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(incident.type)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">
                      {incident.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{incident.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(incident.status)}
                <span className="text-xs text-slate-400">{formatTime(incident.time)}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-2">{incident.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Assigned:</span>
                <div className="flex space-x-1">
                  {incident.assignedUnits.map((unit, index) => (
                    <span key={index} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      {unit}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400 capitalize">
                {incident.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {incidents.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
          <p className="text-slate-400">No active incidents</p>
        </div>
      )}
    </div>
  );
};