import React from 'react';
import { TrendingUp, Users, AlertTriangle, Clock, Activity, MapPin } from 'lucide-react';

interface AnalyticsData {
  crowdDensity: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    prediction: number;
    timeToMax: string;
  };
  responseTime: {
    average: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
  incidentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  zoneStatus: Array<{
    zone: string;
    riskLevel: 'low' | 'medium' | 'high';
    capacity: number;
    occupancy: number;
  }>;
  predictions: Array<{
    location: string;
    risk: number;
    timeframe: string;
    confidence: number;
  }>;
}

interface AnalyticsPanelProps {
  data: AnalyticsData;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ data }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getIncidentColor = (type: string) => {
    const colors = {
      'crowd_surge': 'bg-red-500',
      'medical': 'bg-green-500',
      'fire': 'bg-orange-500',
      'security': 'bg-blue-500',
      'other': 'bg-gray-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Analytics & Predictions</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Live Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Crowd Density */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Crowd Density</span>
            </div>
            {getTrendIcon(data.crowdDensity.trend)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">{data.crowdDensity.current}%</span>
              <span className="text-sm text-slate-400">Current</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.crowdDensity.current}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Predicted: {data.crowdDensity.prediction}%</span>
              <span>Max in: {data.crowdDensity.timeToMax}</span>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Response Time</span>
            </div>
            {getTrendIcon(data.responseTime.trend)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">{data.responseTime.average}m</span>
              <span className="text-sm text-slate-400">Average</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  data.responseTime.average <= data.responseTime.target ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${(data.responseTime.average / (data.responseTime.target * 2)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Target: {data.responseTime.target}m</span>
              <span className={data.responseTime.average <= data.responseTime.target ? 'text-green-400' : 'text-red-400'}>
                {data.responseTime.average <= data.responseTime.target ? 'On Target' : 'Above Target'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Types */}
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Incident Breakdown</span>
        </div>
        <div className="space-y-2">
          {data.incidentTypes.map((incident, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getIncidentColor(incident.type)}`}></div>
                <span className="text-sm text-slate-300 capitalize">{incident.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white">{incident.count}</span>
                <span className="text-xs text-slate-400">({incident.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Status */}
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">Zone Status</span>
        </div>
        <div className="space-y-3">
          {data.zoneStatus.map((zone, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">{zone.zone}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getRiskColor(zone.riskLevel)}`}></div>
                  <span className="text-xs text-slate-400 capitalize">{zone.riskLevel}</span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    zone.occupancy / zone.capacity > 0.8 ? 'bg-red-500' :
                    zone.occupancy / zone.capacity > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(zone.occupancy / zone.capacity) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{zone.occupancy} / {zone.capacity}</span>
                <span>{Math.round((zone.occupancy / zone.capacity) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <span className="text-white font-medium">AI Predictions</span>
        </div>
        <div className="space-y-3">
          {data.predictions.map((prediction, index) => (
            <div key={index} className="bg-slate-700 rounded p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">{prediction.location}</span>
                </div>
                <span className="text-xs text-slate-400">{prediction.timeframe}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Risk Level</span>
                  <span className={`text-xs font-medium ${
                    prediction.risk > 0.7 ? 'text-red-400' :
                    prediction.risk > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.round(prediction.risk * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      prediction.risk > 0.7 ? 'bg-red-500' :
                      prediction.risk > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${prediction.risk * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Confidence: {Math.round(prediction.confidence * 100)}%</span>
                  <span className={prediction.risk > 0.7 ? 'text-red-400' : 'text-slate-400'}>
                    {prediction.risk > 0.7 ? 'High Risk' : 'Monitor'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};