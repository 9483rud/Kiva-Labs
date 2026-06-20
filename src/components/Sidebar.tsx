import './Sidebar.css';
import React from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  iconType: 'text' | 'image';
  iconValue: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  options: SidebarItem[];
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  options
}: SidebarProps): React.JSX.Element {
  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <span className="sidebar-brand">Kiva Labs</span>}
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <ul className="sidebar-menu">
        {options.map((option) => (
          <li key={option.id}>
            <button 
              className={`menu-item ${activeTab === option.id ? 'active' : ''}`}
              onClick={() => setActiveTab(option.id)}
              title={option.label}
            >
              <span className="menu-icon-container">
                {option.iconType === 'image' ? (
                  <img 
                    src={option.iconValue} 
                    alt={`${option.label} icon`} 
                    className="custom-menu-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = '🧪' }} 
                  />
                ) : (
                  <span className="menu-emoji">{option.iconValue}</span>
                )}
              </span>
              {!isCollapsed && <span className="menu-label">{option.label}</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}