import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Users, Camera, Radio } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  type: 'security' | 'medical' | 'fire' | 'police';
  position: { x: number; y: number };
  status: 'available' | 'busy' | 'responding';
}

interface Incident {
  id: string;
  type: 'crowd_surge' | 'medical' | 'fire' | 'security';
  position: { x: number; y: number };
  severity: 'low' | 'medium' | 'high';
  time: string;
  description: string;
}

interface MapViewProps {
  units: Unit[];
  incidents: Incident[];
  crowdHeatmap: Array<{ x: number; y: number; intensity: number }>;
  predictions: Array<{ x: number; y: number; risk: number; time: string }>;
}

export const MapView: React.FC<MapViewProps> = ({ units, incidents, crowdHeatmap, predictions }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const getUnitColor = (unit: Unit) => {
    const colors = {
      security: 'bg-blue-500',
      medical: 'bg-green-500',
      fire: 'bg-red-500',
      police: 'bg-purple-500'
    };
    return colors[unit.type];
  };

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'ring-green-400';
      case 'busy': return 'ring-yellow-400';
      case 'responding': return 'ring-red-400';
      default: return 'ring-gray-400';
    }
  };

  const getIncidentColor = (incident: Incident) => {
    const colors = {
      crowd_surge: 'bg-red-500',
      medical: 'bg-green-500',
      fire: 'bg-orange-500',
      security: 'bg-yellow-500'
    };
    return colors[incident.type];
  };

  const getSeverityRing = (severity: string) => {
    switch (severity) {
      case 'high': return 'ring-red-500 animate-pulse';
      case 'medium': return 'ring-yellow-500';
      case 'low': return 'ring-green-500';
      default: return 'ring-gray-500';
    }
  };

  return (
    <div className="relative h-full bg-slate-800 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border border-slate-600 border-opacity-30"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Crowd Heatmap */}
      {crowdHeatmap.map((point, index) => (
        <div
          key={index}
          className="absolute w-16 h-16 rounded-full pointer-events-none"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: `rgba(255, 165, 0, ${point.intensity * 0.3})`,
            boxShadow: `0 0 ${point.intensity * 20}px rgba(255, 165, 0, ${point.intensity * 0.4})`
          }}
        />
      ))}

      {/* Prediction Areas */}
      {predictions.map((prediction, index) => (
        <div
          key={index}
          className="absolute w-12 h-12 rounded-full border-2 border-red-400 border-dashed animate-pulse pointer-events-none"
          style={{
            left: `${prediction.x}%`,
            top: `${prediction.y}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: `rgba(239, 68, 68, ${prediction.risk * 0.2})`
          }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-semibold whitespace-nowrap">
            Risk {Math.round(prediction.risk * 100)}%
          </div>
        </div>
      ))}

      {/* Units */}
      {units.map((unit) => (
        <div
          key={unit.id}
          className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 ${getUnitColor(unit)} ring-2 ${getUnitStatusColor(unit.status)}`}
          style={{
            left: `${unit.position.x}%`,
            top: `${unit.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => setSelectedUnit(unit)}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            {unit.name}
          </div>
        </div>
      ))}

      {/* Incidents */}
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className={`absolute w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ${getIncidentColor(incident)} ring-4 ${getSeverityRing(incident.severity)}`}
          style={{
            left: `${incident.position.x}%`,
            top: `${incident.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => setSelectedIncident(incident)}
        >
          <AlertCircle className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-slate-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-2 space-y-2">
        <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">
          <Camera className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">
          <Radio className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">
          <Users className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Medical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Fire/Emergency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full opacity-60"></div>
            <span>Crowd Density</span>
          </div>
        </div>
      </div>

      {/* Selected Unit Info */}
      {selectedUnit && (
        <div className="absolute top-4 right-4 bg-slate-900 bg-opacity-90 backdrop-blur-sm rounded-lg p-4 text-white min-w-64">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{selectedUnit.name}</h3>
            <button 
              onClick={() => setSelectedUnit(null)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{selectedUnit.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`capitalize ${
                selectedUnit.status === 'available' ? 'text-green-400' :
                selectedUnit.status === 'busy' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {selectedUnit.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Position:</span>
              <span>{selectedUnit.position.x.toFixed(1)}, {selectedUnit.position.y.toFixed(1)}</span>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded text-sm transition-colors">
              Dispatch Unit
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded text-sm transition-colors">
              Contact Unit
            </button>
          </div>
        </div>
      )}

      {/* Selected Incident Info */}
      {selectedIncident && (
        <div className="absolute top-4 right-4 bg-slate-900 bg-opacity-90 backdrop-blur-sm rounded-lg p-4 text-white min-w-64">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Incident #{selectedIncident.id}</h3>
            <button 
              onClick={() => setSelectedIncident(null)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{selectedIncident.type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Severity:</span>
              <span className={`capitalize ${
                selectedIncident.severity === 'high' ? 'text-red-400' :
                selectedIncident.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {selectedIncident.severity}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{selectedIncident.time}</span>
            </div>
            <div className="mt-2">
              <span className="text-slate-300">Description:</span>
              <p className="text-xs text-slate-400 mt-1">{selectedIncident.description}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-3 rounded text-sm transition-colors">
              Dispatch Response
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded text-sm transition-colors">
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};