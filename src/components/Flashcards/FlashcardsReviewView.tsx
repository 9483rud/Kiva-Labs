import React, { useState } from 'react';
import { Flashcard } from './flashcardsData';
import './Flashcards.css';

interface FlashcardsReviewViewProps {
  cards: Flashcard[];
  onComplete: (correctCount: number) => void;
  onCancel: () => void;
}

export default function FlashcardsReviewView({ cards, onComplete, onCancel }: FlashcardsReviewViewProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const card = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  const handleAnswer = (correct: boolean): void => {
    if (correct) {
      setCorrectCount((count) => count + 1);
    }

    if (isLastCard) {
      onComplete(correct ? correctCount + 1 : correctCount);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setShowBack(false);
  };

  return (
    <section className="card review-session-card">
      <div className="card-header">
        <h2>Review Session</h2>
        <span className="badge">{currentIndex + 1}/{cards.length}</span>
      </div>

      <div className="review-card-body">
        <div className="review-card-status">
          <span>{card.dueIn} • Card {currentIndex + 1}</span>
        </div>

        <div className="review-card-content">
          <p className="review-card-label">{showBack ? 'Answer' : 'Question'}</p>
          <h3>{showBack ? card.back : card.front}</h3>
        </div>

        {!showBack ? (
          <button className="btn btn-secondary" onClick={() => setShowBack(true)}>
            Show Answer
          </button>
        ) : (
          <div className="review-actions">
            <button className="btn btn-secondary" onClick={() => handleAnswer(false)}>
              Again
            </button>
            <button className="btn btn-primary" onClick={() => handleAnswer(true)}>
              Got It
            </button>
          </div>
        )}

        <button className="btn btn-link" onClick={onCancel}>
          Exit Review
        </button>
      </div>
    </section>
  );
}
