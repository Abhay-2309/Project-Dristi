import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { IncidentPanel } from './components/IncidentPanel';
import { UnitsPanel } from './components/UnitsPanel';
import { AlertsPanel } from './components/AlertsPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { LiveFootageViewer } from './components/LiveFootageViewer';
import { AlertMessaging } from './components/AlertMessaging';

// Mock data generation
const generateMockData = () => {
  const units = [
    { id: 'SEC-001', name: 'Security Alpha', type: 'security' as const, status: 'available' as const, position: { x: 25, y: 30 }, location: 'North Gate', lastUpdate: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: 'SEC-002', name: 'Security Beta', type: 'security' as const, status: 'responding' as const, position: { x: 45, y: 60 }, location: 'Main Stage', lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(), assignedIncident: 'INC-001' },
    { id: 'MED-001', name: 'Medical Team 1', type: 'medical' as const, status: 'available' as const, position: { x: 70, y: 40 }, location: 'Medical Tent', lastUpdate: new Date(Date.now() - 1 * 60000).toISOString() },
    { id: 'MED-002', name: 'Medical Team 2', type: 'medical' as const, status: 'busy' as const, position: { x: 35, y: 80 }, location: 'Food Court', lastUpdate: new Date(Date.now() - 3 * 60000).toISOString() },
    { id: 'FIRE-001', name: 'Fire Response', type: 'fire' as const, status: 'available' as const, position: { x: 80, y: 20 }, location: 'Emergency Station', lastUpdate: new Date(Date.now() - 4 * 60000).toISOString() },
    { id: 'POL-001', name: 'Police Unit A', type: 'police' as const, status: 'available' as const, position: { x: 60, y: 70 }, location: 'South Gate', lastUpdate: new Date().toISOString() },
  ];

  const incidents = [
    { id: 'INC-001', type: 'crowd_surge' as const, severity: 'high' as const, description: 'Crowd surge detected near main stage area', time: new Date(Date.now() - 10 * 60000).toISOString(), location: 'Main Stage', status: 'responding' as const, assignedUnits: ['SEC-002'], position: { x: 45, y: 60 } },
    { id: 'INC-002', type: 'medical' as const, severity: 'medium' as const, description: 'Medical emergency reported', time: new Date(Date.now() - 15 * 60000).toISOString(), location: 'Food Court', status: 'active' as const, assignedUnits: [], position: { x: 35, y: 80 } },
    { id: 'INC-003', type: 'security' as const, severity: 'low' as const, description: 'Minor disturbance at entrance', time: new Date(Date.now() - 30 * 60000).toISOString(), location: 'North Gate', status: 'resolved' as const, assignedUnits: ['SEC-001'], position: { x: 25, y: 30 } },
  ];

  const crowdHeatmap = [
    { x: 45, y: 60, intensity: 0.8 },
    { x: 30, y: 70, intensity: 0.6 },
    { x: 55, y: 40, intensity: 0.7 },
    { x: 70, y: 75, intensity: 0.5 },
    { x: 25, y: 30, intensity: 0.4 },
  ];

  const predictions = [
    { x: 50, y: 65, risk: 0.85, time: '15 min' },
    { x: 40, y: 45, risk: 0.65, time: '20 min' },
  ];

  const alerts = [
    { id: 'ALERT-001', type: 'prediction' as const, title: 'Crowd Surge Predicted', message: 'AI model predicts potential crowd surge at Main Stage in 15 minutes', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), severity: 'high' as const, acknowledged: false, source: 'AI Predictor' },
    { id: 'ALERT-002', type: 'system' as const, title: 'Camera Offline', message: 'CCTV Camera 12 has gone offline', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), severity: 'medium' as const, acknowledged: false, source: 'System Monitor' },
    { id: 'ALERT-003', type: 'emergency' as const, title: 'Emergency Response Required', message: 'Medical emergency requires immediate attention', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), severity: 'critical' as const, acknowledged: true, source: 'Field Report' },
  ];

  const analyticsData = {
    crowdDensity: {
      current: 72,
      trend: 'up' as const,
      prediction: 85,
      timeToMax: '15 min'
    },
    responseTime: {
      average: 4.2,
      target: 5.0,
      trend: 'down' as const
    },
    incidentTypes: [
      { type: 'crowd_surge', count: 3, percentage: 45 },
      { type: 'medical', count: 2, percentage: 30 },
      { type: 'security', count: 1, percentage: 15 },
      { type: 'fire', count: 1, percentage: 10 },
    ],
    zoneStatus: [
      { zone: 'Main Stage', riskLevel: 'high' as const, capacity: 5000, occupancy: 4200 },
      { zone: 'Food Court', riskLevel: 'medium' as const, capacity: 2000, occupancy: 1200 },
      { zone: 'North Gate', riskLevel: 'low' as const, capacity: 1000, occupancy: 300 },
      { zone: 'South Gate', riskLevel: 'low' as const, capacity: 1000, occupancy: 450 },
    ],
    predictions: [
      { location: 'Main Stage', risk: 0.85, timeframe: '15 min', confidence: 0.92 },
      { location: 'Food Court', risk: 0.65, timeframe: '20 min', confidence: 0.78 },
      { location: 'North Gate', risk: 0.35, timeframe: '30 min', confidence: 0.65 },
    ]
  };

  return { units, incidents, crowdHeatmap, predictions, alerts, analyticsData };
};

function App() {
  const [mockData, setMockData] = useState(generateMockData());
  const [selectedView, setSelectedView] = useState<'incidents' | 'units' | 'alerts' | 'analytics' | 'footage' | 'messaging'>('incidents');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMockData(prevData => {
        const newData = { ...prevData };
        
        // Update crowd density
        newData.analyticsData.crowdDensity.current = Math.min(95, Math.max(30, 
          newData.analyticsData.crowdDensity.current + (Math.random() - 0.5) * 5
        ));
        
        // Update unit positions slightly
        newData.units = newData.units.map(unit => ({
          ...unit,
          position: {
            x: Math.min(90, Math.max(10, unit.position.x + (Math.random() - 0.5) * 3)),
            y: Math.min(90, Math.max(10, unit.position.y + (Math.random() - 0.5) * 3))
          }
        }));
        
        return newData;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleIncidentClick = (incident: any) => {
    console.log('Incident clicked:', incident);
  };

  const handleUnitClick = (unit: any) => {
    console.log('Unit clicked:', unit);
  };

  const handleDispatchUnit = (unitId: string) => {
    console.log('Dispatching unit:', unitId);
    // Update unit status to responding
    setMockData(prevData => ({
      ...prevData,
      units: prevData.units.map(unit => 
        unit.id === unitId ? { ...unit, status: 'responding' as const } : unit
      )
    }));
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setMockData(prevData => ({
      ...prevData,
      alerts: prevData.alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    }));
  };

  const handleClearAllAlerts = () => {
    setMockData(prevData => ({
      ...prevData,
      alerts: prevData.alerts.map(alert => ({ ...alert, acknowledged: true }))
    }));
  };

  const handleCameraAlert = (cameraId: string, alertType: string) => {
    const alertMessages = {
      'crowd_surge_detected': 'AI detected potential crowd surge in camera feed',
      'suspicious_activity': 'Suspicious activity detected by AI analysis',
      'abandoned_object': 'Abandoned object detected in monitored area',
      'fight_detected': 'Physical altercation detected by AI',
      'medical_emergency': 'Potential medical emergency detected'
    };

    const newAlert = {
      id: `ALERT-${Date.now()}`,
      type: 'prediction' as const,
      title: `Camera Alert - ${cameraId}`,
      message: alertMessages[alertType as keyof typeof alertMessages] || 'Unknown alert detected',
      timestamp: new Date().toISOString(),
      severity: 'high' as const,
      acknowledged: false,
      source: `Camera ${cameraId}`
    };

    setMockData(prevData => ({
      ...prevData,
      alerts: [newAlert, ...prevData.alerts]
    }));
  };

  const handleSendAlert = (alertData: any) => {
    console.log('Sending alert:', alertData);
    // In a real implementation, this would send the alert to the backend
  };

  const totalUnits = mockData.units.length;
  const activeIncidents = mockData.incidents.filter(inc => inc.status === 'active').length;
  const crowdDensity = mockData.analyticsData.crowdDensity.current;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header 
        totalUnits={totalUnits}
        activeIncidents={activeIncidents}
        crowdDensity={crowdDensity}
        systemStatus="online"
      />
      
      <div className="flex h-[calc(100vh-100px)]">
        {/* Main Map Area */}
        <div className="flex-1 p-4">
          <MapView 
            units={mockData.units}
            incidents={mockData.incidents}
            crowdHeatmap={mockData.crowdHeatmap}
            predictions={mockData.predictions}
          />
        </div>
        
        {/* Right Sidebar */}
        <div className="w-[28rem] p-4 space-y-4">
          {/* Navigation Tabs */}
          <div className="bg-slate-900 rounded-lg p-1 flex space-x-1">
            {(['incidents', 'units', 'alerts', 'analytics', 'footage', 'messaging'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-colors capitalize ${
                  selectedView === view 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {view === 'footage' ? 'Live Feed' : view === 'messaging' ? 'Alerts' : view}
              </button>
            ))}
          </div>
          
          {/* Content Panel */}
          <div className="h-[calc(100vh-180px)]">
            {selectedView === 'incidents' && (
              <IncidentPanel 
                incidents={mockData.incidents}
                onIncidentClick={handleIncidentClick}
              />
            )}
            {selectedView === 'units' && (
              <UnitsPanel 
                units={mockData.units}
                onUnitClick={handleUnitClick}
                onDispatchUnit={handleDispatchUnit}
              />
            )}
            {selectedView === 'alerts' && (
              <AlertsPanel 
                alerts={mockData.alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onClearAll={handleClearAllAlerts}
              />
            )}
            {selectedView === 'analytics' && (
              <AnalyticsPanel 
                data={mockData.analyticsData}
              />
            )}
            {selectedView === 'footage' && (
              <LiveFootageViewer 
                onCameraAlert={handleCameraAlert}
              />
            )}
            {selectedView === 'messaging' && (
              <AlertMessaging 
                onSendAlert={handleSendAlert}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;