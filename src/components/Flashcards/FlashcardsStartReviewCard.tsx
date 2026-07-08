import React from 'react';

interface FlashcardsStartReviewCardProps {
  dueToday: number;
  cardsLength: number;
  onStartReview: () => void;
}

export default function FlashcardsStartReviewCard({
  dueToday,
  cardsLength,
  onStartReview
}: FlashcardsStartReviewCardProps): React.JSX.Element {
  return (
    <section className="card review-card">
      <div className="card-header">
        <h2>Ready to review?</h2>
        <span className="badge">{dueToday} cards due</span>
      </div>
      <p className="card-description">
        Start a focused spaced repetition session to lock in the concepts you review today.
      </p>
      <div className="card-action-zone">
        <button className="btn btn-primary" onClick={onStartReview} disabled={cardsLength === 0}>
          {cardsLength === 0 ? 'Add cards to start' : 'Start Review'}
        </button>
      </div>
    </section>
  );
}
