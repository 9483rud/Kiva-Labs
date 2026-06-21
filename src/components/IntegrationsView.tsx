import React, { useState } from 'react';
import './style/IntegrationsView.css';

interface Platform {
  id: string;
  name: string;
  logo: string;
  description: string;
  connected: boolean;
  scopes: { id: string; label: string; enabled: boolean }[];
}

export default function IntegrationsView(): React.JSX.Element {
  // Mock state for handling platform setups locally
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'google',
      name: 'Google Workspace',
      logo: '🤖', // Use a high-quality emoji placeholder or vector later
      description: 'Import Google Docs, Sheets, and Slides directly into your Notes hub.',
      connected: false,
      scopes: [
        { id: 'docs', label: 'Import Docs & Slides', enabled: true },
        { id: 'drive', label: 'Access Google Drive files', enabled: false }
      ]
    },
    {
      id: 'm365',
      name: 'Microsoft 365',
      logo: '🟦',
      description: 'Sync your school OneNote files and import PowerPoint decks.',
      connected: true,
      scopes: [
        { id: 'onenote', label: 'Sync OneNote notebooks', enabled: true },
        { id: 'powerpoint', label: 'Import PowerPoint files', enabled: true }
      ]
    },
    {
      id: 'canvas',
      name: 'Canvas LMS',
      logo: '🎨',
      description: 'Automatically pull school assignments and deadlines into your Tasks list.',
      connected: false,
      scopes: [
        { id: 'assignments', label: 'Sync Assignments & Deadlines', enabled: true },
        { id: 'grades', label: 'Track grade changes', enabled: false }
      ]
    }
  ]);

  const handleConnectionToggle = (id: string) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
  };

  const handleScopeToggle = (platformId: string, scopeId: string) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id !== platformId) return p;
      return {
        ...p,
        scopes: p.scopes.map(s => s.id === scopeId ? { ...s, enabled: !s.enabled } : s)
      };
    }));
  };

  return (
    <div className="app-container">
      <header className="view-header">
        <h2>Plugin Integrations</h2>
        <p className="subtitle">Securely connect Kiva Labs to your classroom platforms to centralize files and timelines.</p>
      </header>

      <div className="integrations-grid">
        {platforms.map((platform) => (
          <div key={platform.id} className={`integration-card ${platform.connected ? 'connected' : ''}`}>
            <div className="integration-top">
              <div className="platform-brand">
                <span className="platform-logo">{platform.logo}</span>
                <div>
                  <h3>{platform.name}</h3>
                  <span className={`status-badge ${platform.connected ? 'active' : 'inactive'}`}>
                    {platform.connected ? '🟢 Connected' : '⚪ Disconnected'}
                  </span>
                </div>
              </div>
              
              <button 
                className={`connection-btn ${platform.connected ? 'btn-danger' : 'btn-connect'}`}
                onClick={() => handleConnectionToggle(platform.id)}
              >
                {platform.connected ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>

            <p className="platform-description">{platform.description}</p>

            {platform.connected && (
              <div className="permissions-zone">
                <h4>Sync Permissions</h4>
                {platform.scopes.map((scope) => (
                  <label key={scope.id} className="permission-item">
                    <input 
                      type="checkbox" 
                      checked={scope.enabled}
                      onChange={() => handleScopeToggle(platform.id, scope.id)}
                    />
                    <span>{scope.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
