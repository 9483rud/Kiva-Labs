import React from 'react';

// Wrapper to ensure all your custom icons share uniform size constraints
interface SVGIconProps {
  className?: string;
}

// 🧪 YOUR SEAMLESS FLASK ICON PLACEHOLDER
export function FlaskIcon({ className = "custom-menu-svg" }: SVGIconProps): React.JSX.Element {
  return (
    /* Once you export your SVG from Photoshop, open it in a text editor, 
      copy the interior tags (<path />, <circle />, etc.), and paste them right here!
    */
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={{ filter: 'drop-shadow(0 0 4px var(--neon-cyan))' }}
    >
      {/* TEMPORARY FALLBACK PATH LOOKING LIKE A FLASK */}
      <path d="M6 3h12M10 3v6l-4 8a2 2 0 0 0 1.7 3h8.6a2 2 0 0 0 1.7-3l-4-8V3" />
      <path d="M8.5 13h7" />
    </svg>
  );
}

// 🎴 KIVA LABS "K" LOGO ICON PLACEHOLDER
export function KivaLogoIcon({ className = "logo-svg" }: SVGIconProps): React.JSX.Element {
  return (
    /* Open your "K" logo SVG text, copy it, and replace this fallback code */
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      className={className}
    >
      {/* TEMPORARY FALLBACK "K" SHAPE */}
      <path d="M4 4v16M4 12h4l6-8M8 12l7 8" />
    </svg>
  );
}