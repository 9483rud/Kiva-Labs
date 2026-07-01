import React from 'react';
import './style/Sidebar.css';
import { KivaLogoIcon } from './Icons'; // Importing your logo

export interface SidebarItem {
  id: string;
  label: string;
  iconType: 'text' | 'svg' | 'image';
  iconValue: string | React.ComponentType<{ className?: string }>;
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
        {!isCollapsed ? (
          <div className="sidebar-brand-container">
            {/* Your native SVG logo component standing tall! */}
            <KivaLogoIcon className="sidebar-logo-svg" />
            <span className="sidebar-brand">Kiva Labs</span>
          </div>
        ) : (
          <div className="sidebar-logo-collapsed">
            <KivaLogoIcon className="sidebar-logo-svg" />
          </div>
        )}
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <ul className="sidebar-menu">
        {options.map((option) => {
          return (
            <li key={option.id}>
              <button 
                className={`menu-item ${activeTab === option.id ? 'active' : ''}`}
                onClick={() => setActiveTab(option.id)}
                title={option.label}
              >
                <span className="menu-icon-container">
                  {option.iconType === 'svg' ? (
                    (() => {
                      const IconComponent = option.iconValue as React.ComponentType<{ className?: string }>;
                      return <IconComponent className="custom-menu-svg" />;
                    })()
                  ) : option.iconType === 'image' ? (
                    <img src={option.iconValue as string} alt={`${option.label} icon`} className="custom-menu-img" />
                  ) : (
                    <span className="menu-emoji">{option.iconValue as string}</span>
                  )}
                </span>
                {!isCollapsed && <span className="menu-label">{option.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
