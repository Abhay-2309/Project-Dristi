import React from 'react';
import { Shield, Users, AlertTriangle, Activity, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  totalUnits: number;
  activeIncidents: number;
  crowdDensity: number;
  systemStatus: 'online' | 'offline' | 'degraded';
}

export const Header: React.FC<HeaderProps> = ({
  totalUnits,
  activeIncidents,
  crowdDensity,
  systemStatus
}) => {
  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Project Drishti</h1>
              <p className="text-slate-400 text-sm">AI Situational Awareness Platform</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-semibold">{totalUnits}</p>
              <p className="text-slate-400 text-xs">Active Units</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white font-semibold">{activeIncidents}</p>
              <p className="text-slate-400 text-xs">Incidents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-semibold">{crowdDensity}%</p>
              <p className="text-slate-400 text-xs">Crowd Density</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {systemStatus === 'offline' ? (
              <WifiOff className={`w-5 h-5 ${getStatusColor()}`} />
            ) : (
              <Wifi className={`w-5 h-5 ${getStatusColor()}`} />
            )}
            <div>
              <p className={`font-semibold capitalize ${getStatusColor()}`}>
                {systemStatus}
              </p>
              <p className="text-slate-400 text-xs">System Status</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};