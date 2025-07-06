import React from 'react';
import { Bell, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'prediction' | 'system' | 'emergency' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  source: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onClearAll: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledgeAlert, onClearAll }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="w-4 h-4" />;
      case 'system': return <Bell className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
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

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="bg-slate-900 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-white">Alerts</h2>
          {unacknowledgedAlerts.length > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unacknowledgedAlerts.length}
            </div>
          )}
        </div>
        <button
          onClick={onClearAll}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-slate-800 rounded-lg p-3 transition-all duration-200 ${
              alert.acknowledged ? 'opacity-60' : ''
            } ${
              alert.severity === 'critical' ? 'ring-2 ring-red-500 animate-pulse' :
              alert.severity === 'high' ? 'ring-1 ring-orange-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{alert.title}</span>
                    {alert.acknowledged && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="capitalize">{alert.type}</span>
                    <span>•</span>
                    <span>{alert.source}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{formatTime(alert.timestamp)}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-3">{alert.message}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded capitalize ${
                  alert.severity === 'critical' ? 'bg-red-600 text-white' :
                  alert.severity === 'high' ? 'bg-orange-600 text-white' :
                  alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {alert.severity}
                </span>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => onAcknowledgeAlert(alert.id)}
                  className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition-colors"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400">No alerts at this time</p>
        </div>
      )}
    </div>
  );
};