import React, { useMemo, useState } from 'react';
import FlashcardsReviewView from './FlashcardsReviewView';
import './Flashcards.css';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  dueIn: 'Today' | 'Tomorrow';
}

export default function FlashcardsHomeView(): React.JSX.Element {
  const cards = useMemo<Flashcard[]>(
    () => [
      {
        id: 1,
        front: 'What is spaced repetition?',
        back: 'A learning technique that reviews cards at increasing intervals to improve long-term memory.',
        dueIn: 'Today'
      },
      {
        id: 2,
        front: 'What is active recall?',
        back: 'Actively retrieving information from memory instead of just rereading notes.',
        dueIn: 'Today'
      },
      {
        id: 3,
        front: 'When should you review a forgotten card?',
        back: 'Review it again sooner and repeat it in shorter intervals until it sticks.',
        dueIn: 'Tomorrow'
      },
      {
        id: 4,
        front: 'How can small daily sessions help?',
        back: 'Frequent short reviews build consistency and prevent overload.',
        dueIn: 'Tomorrow'
      }
    ],
    []
  );

  const [isReviewing, setIsReviewing] = useState(false);
  const [completedReview, setCompletedReview] = useState<number | null>(null);

  const dueToday = cards.filter((card) => card.dueIn === 'Today').length;
  const tomorrow = cards.filter((card) => card.dueIn === 'Tomorrow').length;
  const totalCards = cards.length;

  const startReview = (): void => {
    setCompletedReview(null);
    setIsReviewing(true);
  };

  const finishReview = (correctCount: number): void => {
    setCompletedReview(correctCount);
    setIsReviewing(false);
  };

  return (
    <div className="flashcards-page app-container">
      <header className="view-header">
        <h2>Flashcards</h2>
        <p className="subtitle">Practice the cards due today with spaced repetition.</p>
      </header>

      {!isReviewing ? (
        <>
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
              <span className="stats-label">Total Cards</span>
              <span className="stats-value">{totalCards}</span>
            </div>
          </section>

          <section className="card review-card">
            <div className="card-header">
              <h2>Ready to review?</h2>
              <span className="badge">{dueToday} cards due</span>
            </div>
            <p className="card-description">
              Start a focused spaced repetition session to lock in the concepts you review today.
            </p>
            <div className="card-action-zone">
              <button className="btn btn-primary" onClick={startReview}>
                Start Review
              </button>
            </div>
          </section>

          <section className="card upcoming-card">
            <div className="card-header">
              <h2>Next cards</h2>
            </div>
            <div className="upcoming-list">
              {cards.slice(0, 4).map((card) => (
                <div key={card.id} className="upcoming-item">
                  <span className="upcoming-due">{card.dueIn}</span>
                  <span>{card.front}</span>
                </div>
              ))}
            </div>
          </section>

          {completedReview !== null && (
            <section className="card summary-card">
              <div className="card-header">
                <h2>Last review</h2>
              </div>
              <p className="card-description">
                You answered {completedReview} out of {cards.length} cards correctly.
              </p>
            </section>
          )}
        </>
      ) : (
        <FlashcardsReviewView cards={cards} onComplete={finishReview} onCancel={() => setIsReviewing(false)} />
      )}
    </div>
  );
}
