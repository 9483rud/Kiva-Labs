import './style/SettingsView.css';
import React from 'react';
import { StudyModule } from '../App';

interface SettingsViewProps {
  modules: StudyModule[];
  onToggleModule: (id: string) => void;
}

function renderModuleIcon(mod: StudyModule): React.ReactNode {
  if (mod.iconType === 'text') {
    return mod.iconValue as string;
  }
  if (mod.iconType === 'svg') {
    return React.createElement(mod.iconValue as React.ComponentType<{ className?: string }>, {
      className: 'settings-icon'
    });
  }
  if (mod.iconType === 'image') {
    return (
      <img
        src={mod.iconValue as string}
        alt={`${mod.label} icon`}
        className="settings-icon"
      />
    );
  }
  return '🧪';
}

export default function SettingsView({ modules, onToggleModule }: SettingsViewProps): React.JSX.Element {
  return (
    <div className="app-container">
      <header className="view-header">
        <h2>Control Panel & Settings</h2>
        <p className="subtitle">Customize your workspace by activating or isolating Kiva Labs modules.</p>
      </header>

      <section className="settings-section">
        <h3>🔬 The Labs (Feature Factory)</h3>
        <p className="section-instruction">Turn off modules you don't use to keep your workspace distraction-free.</p>
        
        <div className="modules-toggle-list">
          {modules.map((mod) => {
            const isCore = mod.id === 'dashboard' || mod.id === 'settings';
            return (
              <div key={mod.id} className={`toggle-row ${!mod.enabled ? 'disabled-row' : ''}`}>
                <div className="toggle-info">
                  <span className="toggle-icon-indicator">
                    {renderModuleIcon(mod)}
                  </span>
                  <div>
                    <h4>{mod.label} {isCore && <span className="core-tag">Core</span>}</h4>
                    <p>{mod.description}</p>
                  </div>
                </div>
                
                <div className="toggle-action">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={mod.enabled} 
                      disabled={isCore}
                      onChange={() => onToggleModule(mod.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
