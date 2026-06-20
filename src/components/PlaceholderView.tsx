import React from 'react';

interface PlaceholderViewProps {
  title: string;
}

export default function PlaceholderView({ title }: PlaceholderViewProps): React.JSX.Element {
  return (
    <div className="view-placeholder">
      <h2>{title} View</h2>
      <p>This workspace module is currently under construction inside Kiva Labs.</p>
    </div>
  );
}