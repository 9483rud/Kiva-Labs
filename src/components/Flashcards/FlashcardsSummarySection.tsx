import React from 'react';

interface FlashcardsSummarySectionProps {
  dueToday: number;
  tomorrow: number;
  streak: number;
  totalCards: number;
}

export default function FlashcardsSummarySection({
  dueToday,
  tomorrow,
  streak,
  totalCards
}: FlashcardsSummarySectionProps): React.JSX.Element {
  return (
    <section className="flashcards-summary-grid">
      <div className="stats-card">
        <span className="stats-label">Due Today</span>
        <span className="stats-value">{dueToday}</span>
      </div>
      <div className="stats-card">
        <span className="stats-label">Due Tomorrow</span>
        <span className="stats-value">{tomorrow}</span>
      </div>
      <div className="stats-card">
        <span className="stats-label">Current Streak</span>
        <span className="stats-value">{streak}</span>
      </div>
      <div className="stats-card">
        <span className="stats-label">Total Cards</span>
        <span className="stats-value">{totalCards}</span>
      </div>
    </section>
  );
}
