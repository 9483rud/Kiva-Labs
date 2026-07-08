import React from 'react';

interface WeeklyStudyEntry {
  day: string;
  label: string;
  count: number;
  height: number;
}

interface FlashcardsWeeklyChartProps {
  weeklyStudyData: WeeklyStudyEntry[];
}

export default function FlashcardsWeeklyChart({ weeklyStudyData }: FlashcardsWeeklyChartProps): React.JSX.Element {
  return (
    <section className="card weekly-chart-card">
      <div className="card-header">
        <h2>Weekly study graph</h2>
      </div>
      <div className="weekly-chart" aria-label="Weekly study chart">
        {weeklyStudyData.map((entry) => (
          <div key={entry.day} className="weekly-chart-column">
            <div className="weekly-chart-bar-wrapper">
              <div className="weekly-chart-bar" style={{ height: `${entry.height}%` }} />
            </div>
            <span className="weekly-chart-label">{entry.label}</span>
            <span className="weekly-chart-value">{entry.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
