import React, { useState } from 'react';
import Sidebar, { SidebarItem } from './components/Sidebar';
import IntegrationsView from './components/IntegrationsView';
import Dashboard from './components/Dashboard';
import PlaceholderView from './components/PlaceholderView';
import SettingsView from './components/SettingsView'; 
import { FlaskIcon } from './components/Icons'; // 1. Imported your brand new custom SVG file!
import settingsIconUrl from './assets/Settings.svg?url';
import './App.css';

// Define the shape of our modular system
export interface SidebarItem {
  id: string;
  label: string;
  iconType: 'text' | 'svg' | 'image';
  iconValue: string | React.ComponentType<{ className?: string }>;
}

export default function App(): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Master module state registry
  const [modules, setModules] = useState<StudyModule[]>([
    { id: 'dashboard', label: 'Dashboard', iconType: 'text', iconValue: '🏠', enabled: true, description: 'Your main control center.' },
    { id: 'flashcards', label: 'Flashcards', iconType: 'text', iconValue: '🎴', enabled: true, description: 'Spaced-repetition study cards.' },
    { id: 'notes', label: 'Notes', iconType: 'text', iconValue: '📝', enabled: true, description: 'Rich text notebook.' },
    { id: 'tasks', label: 'Tasks', iconType: 'text', iconValue: '✅', enabled: true, description: 'To-do item tracker.' },
    { id: 'timer', label: 'Timer', iconType: 'text', iconValue: '⏱️', enabled: true, description: 'Focus and Pomodoro interval timer.' },
    // 3. Replaced your old placeholder image with the clean native vector!
    { id: 'integrations', label: 'Integrations', iconType: 'svg', iconValue: FlaskIcon, enabled: true, description: 'External API plugins.' },
    { id: 'settings', label: 'Settings', iconType: 'image', iconValue: settingsIconUrl, enabled: true, description: 'Configure app features.' }
  ]);

  // Filter our options dynamically based on what's enabled
  const visibleSidebarOptions: SidebarItem[] = modules
    .filter(mod => mod.enabled)
    .map(mod => ({
      id: mod.id,
      label: mod.label,
      iconType: mod.iconType,
      iconValue: mod.iconValue
    }));

  // Toggle function passed down to SettingsView
  const toggleModule = (id: string): void => {
    setModules(prevModules =>
      prevModules.map(mod => {
        if (mod.id === 'dashboard' || mod.id === 'settings') return mod;
        if (mod.id === id) {
          if (activeTab === id && mod.enabled) {
            setActiveTab('dashboard');
          }
          return { ...mod, enabled: !mod.enabled };
        }
        return mod;
      })
    );
  };

const renderActiveView = (): React.JSX.Element => {
  switch (activeTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'settings':
      return <SettingsView modules={modules} onToggleModule={toggleModule} />;
    case 'integrations':
      return <IntegrationsView />; // <-- Added this route line!
    default: {
      const option = modules.find(o => o.id === activeTab);
      return <PlaceholderView title={option ? option.label : 'Unknown'} />;
    }
  }
};

  return (
    <div className="app-workspace">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        options={visibleSidebarOptions}
      />
      <div className="main-content-container">
        {renderActiveView()}
      </div>
    </div>
  );
}