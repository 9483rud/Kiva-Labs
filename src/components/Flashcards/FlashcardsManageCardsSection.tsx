import React from 'react';
import type { Flashcard } from './flashcardsData';
import type { NewCardFormState } from './flashcardsTypes';

interface FlashcardsManageCardsSectionProps {
  cards: Flashcard[];
  isAddingCard: boolean;
  newCard: NewCardFormState;
  onToggleAddCard: () => void;
  onNewCardChange: (updates: Partial<NewCardFormState>) => void;
  onCreateCard: () => void;
}

export default function FlashcardsManageCardsSection({
  cards,
  isAddingCard,
  newCard,
  onToggleAddCard,
  onNewCardChange,
  onCreateCard
}: FlashcardsManageCardsSectionProps): React.JSX.Element {
  return (
    <section className="card upcoming-card">
      <div className="card-header">
        <h2>Your cards</h2>
        <button className="btn btn-secondary btn-inline" onClick={onToggleAddCard}>
          {isAddingCard ? 'Cancel' : 'Add Card'}
        </button>
      </div>

      {isAddingCard && (
        <div className="add-card-form">
          <input
            className="card-input"
            placeholder="Question"
            value={newCard.front}
            onChange={(event) => onNewCardChange({ front: event.target.value })}
          />
          <textarea
            className="card-textarea"
            placeholder="Answer"
            value={newCard.back}
            onChange={(event) => onNewCardChange({ back: event.target.value })}
          />
          <select
            className="card-select"
            value={newCard.dueIn}
            onChange={(event) => onNewCardChange({ dueIn: event.target.value as Flashcard['dueIn'] })}
          >
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
          </select>
          <button className="btn btn-primary" onClick={onCreateCard}>
            Save Card
          </button>
        </div>
      )}

      <div className="upcoming-list">
        {cards.length === 0 ? (
          <p className="empty-state">No cards yet. Add your first flashcard to get started.</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="upcoming-item">
              <span className="upcoming-due">{card.dueIn}</span>
              <span>{card.front}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
