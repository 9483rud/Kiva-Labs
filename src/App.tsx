import React, { useState } from 'react';
import Sidebar, { SidebarItem } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PlaceholderView from './components/PlaceholderView';
import './App.css';

export default function App(): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const sidebarOptions: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', iconType: 'text', iconValue: '🏠' },
    { id: 'flashcards', label: 'Flashcards', iconType: 'text', iconValue: '🎴' },
    { id: 'notes', label: 'Notes', iconType: 'text', iconValue: '📝' },
    { id: 'tasks', label: 'Tasks', iconType: 'text', iconValue: '✅' },
    { id: 'timer', label: 'Timer', iconType: 'text', iconValue: '⏱️' },
    { id: 'integrations', label: 'Integrations', iconType: 'image', iconValue: 'https://images.prodia.xyz/placeholder-or-your-uploaded-beaker-url' },
    { id: 'settings', label: 'Settings', iconType: 'text', iconValue: '⚙️' }
  ];

  // Conditional rendering helper to switch views cleanly
  const renderActiveView = (): React.JSX.Element => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      default: {
        const option = sidebarOptions.find(o => o.id === activeTab);
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
        options={sidebarOptions}
      />
      <div className="main-content-container">
        {renderActiveView()}
      </div>
    </div>
  );
}