import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Volume2, VolumeX, AlertTriangle, Eye } from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  type: 'fixed' | 'ptz' | 'drone';
  priority: 'high' | 'medium' | 'low';
  hasAudio: boolean;
  hasMotionDetection: boolean;
  alertCount: number;
}

interface LiveFootageViewerProps {
  onCameraAlert: (cameraId: string, alertType: string) => void;
}

export const LiveFootageViewer: React.FC<LiveFootageViewerProps> = ({ onCameraAlert }) => {
  const [selectedCamera, setSelectedCamera] = useState<string>('CAM-001');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const [zoom, setZoom] = useState(100);

  const cameras: CameraFeed[] = [
    { id: 'CAM-001', name: 'Main Stage View', location: 'Main Stage', status: 'online', type: 'ptz', priority: 'high', hasAudio: true, hasMotionDetection: true, alertCount: 2 },
    { id: 'CAM-002', name: 'North Gate Entry', location: 'North Gate', status: 'online', type: 'fixed', priority: 'high', hasAudio: false, hasMotionDetection: true, alertCount: 0 },
    { id: 'CAM-003', name: 'Food Court Overview', location: 'Food Court', status: 'online', type: 'ptz', priority: 'medium', hasAudio: true, hasMotionDetection: true, alertCount: 1 },
    { id: 'CAM-004', name: 'Emergency Exit 1', location: 'Emergency Exit 1', status: 'offline', type: 'fixed', priority: 'high', hasAudio: false, hasMotionDetection: false, alertCount: 0 },
    { id: 'CAM-005', name: 'Parking Area', location: 'Parking Lot A', status: 'online', type: 'fixed', priority: 'low', hasAudio: false, hasMotionDetection: true, alertCount: 0 },
    { id: 'DRONE-001', name: 'Aerial Overview', location: 'Airborne', status: 'online', type: 'drone', priority: 'high', hasAudio: false, hasMotionDetection: true, alertCount: 3 },
  ];

  // Simulate AI detection alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
      if (randomCamera.status === 'online' && Math.random() > 0.85) {
        const alertTypes = ['crowd_surge_detected', 'suspicious_activity', 'abandoned_object', 'fight_detected', 'medical_emergency'];
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        onCameraAlert(randomCamera.id, alertType);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [onCameraAlert]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCameraIcon = (type: string) => {
    switch (type) {
      case 'drone': return '🚁';
      case 'ptz': return '📹';
      case 'fixed': return '📷';
      default: return '📹';
    }
  };

  const selectedCameraData = cameras.find(cam => cam.id === selectedCamera);

  return (
    <div className={`bg-slate-900 rounded-lg ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Live Footage</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Live</span>
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </button>
        </div>

        <div className={`grid ${isFullscreen ? 'grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
          {/* Main Video Feed */}
          <div className={`${isFullscreen ? 'col-span-3' : 'col-span-1'} bg-black rounded-lg relative overflow-hidden`}>
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
              {/* Simulated Video Feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  {selectedCameraData?.name} - {selectedCameraData?.location}
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCameraData?.status || 'offline')}`}></div>
                  <span className="text-white text-sm bg-black bg-opacity-60 px-2 py-1 rounded">
                    {selectedCameraData?.status?.toUpperCase()}
                  </span>
                </div>
                
                {/* AI Detection Overlays */}
                {selectedCameraData?.hasMotionDetection && (
                  <div className="absolute bottom-20 left-4 space-y-2">
                    <div className="bg-red-500 bg-opacity-80 text-white px-2 py-1 rounded text-xs animate-pulse">
                      🚨 Crowd Density: HIGH
                    </div>
                    <div className="bg-yellow-500 bg-opacity-80 text-white px-2 py-1 rounded text-xs">
                      👥 People Count: 847
                    </div>
                    <div className="bg-blue-500 bg-opacity-80 text-white px-2 py-1 rounded text-xs">
                      🎯 Motion Detected: 23 objects
                    </div>
                  </div>
                )}

                {/* Crosshair for PTZ cameras */}
                {selectedCameraData?.type === 'ptz' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 border-2 border-white border-opacity-50">
                      <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white bg-opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white bg-opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                )}

                {/* Simulated crowd visualization */}
                <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-red-500 bg-opacity-30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/2 right-1/3 w-12 h-12 bg-yellow-500 bg-opacity-30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-orange-500 bg-opacity-30 rounded-full animate-pulse"></div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 rounded p-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    onClick={() => setHasAudio(!hasAudio)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    {hasAudio ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
                  </button>
                  <span className="text-white text-sm">Zoom: {zoom}%</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setZoom(Math.min(400, zoom + 25))}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                  {selectedCameraData?.type === 'ptz' && (
                    <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                      <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Camera List */}
          <div className={`${isFullscreen ? 'col-span-1' : 'col-span-1'} space-y-2 max-h-96 overflow-y-auto`}>
            <h3 className="text-white font-medium mb-2">Camera Feeds</h3>
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className={`bg-slate-800 rounded p-3 cursor-pointer transition-all hover:bg-slate-700 ${
                  selectedCamera === camera.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCameraIcon(camera.type)}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{camera.name}</div>
                      <div className="text-slate-400 text-xs">{camera.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
                    {camera.alertCount > 0 && (
                      <div className="bg-red-500 text-white text-xs px-1 rounded-full">
                        {camera.alertCount}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`capitalize ${getPriorityColor(camera.priority)}`}>
                    {camera.priority} Priority
                  </span>
                  <div className="flex items-center space-x-1">
                    {camera.hasAudio && <Volume2 className="w-3 h-3 text-slate-400" />}
                    {camera.hasMotionDetection && <Eye className="w-3 h-3 text-slate-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Panel */}
        {!isFullscreen && (
          <div className="mt-4 bg-slate-800 rounded p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-white font-medium">AI Analysis</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Crowd Density:</span>
                <span className="text-red-400 ml-2 font-semibold">HIGH (85%)</span>
              </div>
              <div>
                <span className="text-slate-400">Anomalies:</span>
                <span className="text-yellow-400 ml-2 font-semibold">3 Detected</span>
              </div>
              <div>
                <span className="text-slate-400">Motion Objects:</span>
                <span className="text-blue-400 ml-2 font-semibold">23 Tracked</span>
              </div>
              <div>
                <span className="text-slate-400">Audio Level:</span>
                <span className="text-green-400 ml-2 font-semibold">Normal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};