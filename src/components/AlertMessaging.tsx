import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, AlertTriangle, CheckCircle, Clock, Radio, Megaphone, X } from 'lucide-react';

interface AlertMessage {
  id: string;
  type: 'dispatch' | 'emergency' | 'update' | 'broadcast' | 'medical' | 'security';
  title: string;
  message: string;
  sender: string;
  recipients: string[];
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'sent' | 'delivered' | 'acknowledged' | 'failed';
  requiresAcknowledgment: boolean;
  acknowledgedBy: string[];
}

interface AlertMessagingProps {
  onSendAlert: (message: Omit<AlertMessage, 'id' | 'timestamp' | 'status' | 'acknowledgedBy'>) => void;
}

export const AlertMessaging: React.FC<AlertMessagingProps> = ({ onSendAlert }) => {
  const [messages, setMessages] = useState<AlertMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedType, setSelectedType] = useState<AlertMessage['type']>('dispatch');
  const [selectedPriority, setSelectedPriority] = useState<AlertMessage['priority']>('medium');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['all-units']);
  const [isComposing, setIsComposing] = useState(false);

  const messageTypes = [
    { value: 'dispatch', label: 'Unit Dispatch', icon: '🚨', color: 'bg-blue-500' },
    { value: 'emergency', label: 'Emergency Alert', icon: '🚨', color: 'bg-red-500' },
    { value: 'medical', label: 'Medical Alert', icon: '🏥', color: 'bg-green-500' },
    { value: 'security', label: 'Security Alert', icon: '🛡️', color: 'bg-yellow-500' },
    { value: 'update', label: 'Status Update', icon: '📢', color: 'bg-purple-500' },
    { value: 'broadcast', label: 'General Broadcast', icon: '📻', color: 'bg-gray-500' },
  ];

  const recipients = [
    { value: 'all-units', label: 'All Units', count: 12 },
    { value: 'security-team', label: 'Security Team', count: 6 },
    { value: 'medical-team', label: 'Medical Team', count: 3 },
    { value: 'fire-team', label: 'Fire Team', count: 2 },
    { value: 'command-center', label: 'Command Center', count: 1 },
    { value: 'field-supervisors', label: 'Field Supervisors', count: 4 },
  ];

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const sampleMessages = [
          {
            type: 'medical' as const,
            title: 'Medical Team Dispatched',
            message: 'Medical Team 1 dispatched to Food Court for reported injury. ETA 3 minutes.',
            sender: 'AI Dispatch System',
            recipients: ['medical-team', 'command-center'],
            priority: 'high' as const,
            requiresAcknowledgment: true,
          },
          {
            type: 'security' as const,
            title: 'Security Alert',
            message: 'Suspicious activity detected at North Gate. Security Team Alpha responding.',
            sender: 'AI Detection System',
            recipients: ['security-team'],
            priority: 'medium' as const,
            requiresAcknowledgment: false,
          },
          {
            type: 'update' as const,
            title: 'Crowd Density Update',
            message: 'Main Stage area reaching 80% capacity. Consider crowd flow management.',
            sender: 'Crowd Analytics AI',
            recipients: ['all-units'],
            priority: 'medium' as const,
            requiresAcknowledgment: false,
          },
        ];

        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const newMsg: AlertMessage = {
          ...randomMessage,
          id: `MSG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          acknowledgedBy: [],
        };

        setMessages(prev => [newMsg, ...prev].slice(0, 50));
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageTypeData = messageTypes.find(t => t.value === selectedType);
    const message: Omit<AlertMessage, 'id' | 'timestamp' | 'status' | 'acknowledgedBy'> = {
      type: selectedType,
      title: `${messageTypeData?.label} - ${selectedPriority.toUpperCase()}`,
      message: newMessage,
      sender: 'Command Center',
      recipients: selectedRecipients,
      priority: selectedPriority,
      requiresAcknowledgment: selectedPriority === 'high' || selectedPriority === 'critical',
    };

    onSendAlert(message);

    const newMsg: AlertMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'sent',
      acknowledgedBy: [],
    };

    setMessages(prev => [newMsg, ...prev]);
    setNewMessage('');
    setIsComposing(false);
  };

  const handleAcknowledge = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, acknowledgedBy: [...msg.acknowledgedBy, 'Current User'] }
        : msg
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'delivered': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'acknowledged': return <CheckCircle className="w-3 h-3 text-blue-400" />;
      case 'failed': return <X className="w-3 h-3 text-red-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Alert Messaging</h2>
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {messages.filter(m => m.requiresAcknowledgment && m.acknowledgedBy.length === 0).length} pending
          </div>
        </div>
        <button
          onClick={() => setIsComposing(!isComposing)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors flex items-center space-x-1"
        >
          <Megaphone className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Compose Message */}
      {isComposing && (
        <div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Message Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AlertMessage['type'])}
                className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as AlertMessage['priority'])}
                className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Recipients</label>
            <div className="grid grid-cols-2 gap-2">
              {recipients.map(recipient => (
                <label key={recipient.value} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(recipient.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecipients(prev => [...prev, recipient.value]);
                      } else {
                        setSelectedRecipients(prev => prev.filter(r => r !== recipient.value));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-white">{recipient.label}</span>
                  <span className="text-slate-400">({recipient.count})</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Message</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your alert message..."
              className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm h-20 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsComposing(false)}
              className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
              <span>Send Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => {
          const messageType = messageTypes.find(t => t.value === message.type);
          const isAcknowledged = message.acknowledgedBy.length > 0;
          const needsAcknowledgment = message.requiresAcknowledgment && !isAcknowledged;

          return (
            <div
              key={message.id}
              className={`bg-slate-800 rounded-lg p-3 transition-all ${
                needsAcknowledgment ? 'ring-2 ring-orange-500 animate-pulse' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${messageType?.color}`}>
                    <span className="text-white text-sm">{messageType?.icon}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{message.title}</div>
                    <div className="text-slate-400 text-xs">From: {message.sender}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-xs text-white ${getPriorityColor(message.priority)}`}>
                    {message.priority.toUpperCase()}
                  </div>
                  {getStatusIcon(message.status)}
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-3">{message.message}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Users className="w-3 h-3" />
                  <span>To: {message.recipients.join(', ')}</span>
                  <span>•</span>
                  <span>{formatTime(message.timestamp)}</span>
                </div>
                
                {needsAcknowledgment && (
                  <button
                    onClick={() => handleAcknowledge(message.id)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                
                {isAcknowledged && (
                  <div className="text-xs text-green-400 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Acknowledged</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Radio className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">No messages yet</p>
          </div>
        </div>
      )}
    </div>
  );
};