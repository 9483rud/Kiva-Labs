import React, { useEffect, useMemo, useState } from 'react';
import FlashcardsReviewView from './FlashcardsReviewView';
import { DEFAULT_FLASHCARDS, Flashcard, getFlashcardStats, getUpcomingCards, loadFlashcards, saveFlashcards } from './flashcardsData';
import './Flashcards.css';

interface NewCardFormState {
  front: string;
  back: string;
  dueIn: Flashcard['dueIn'];
}

const STREAK_STORAGE_KEY = 'flashcards-streak';
const STUDY_HISTORY_STORAGE_KEY = 'flashcards-study-history';

type StudyHistory = Record<string, number>;

interface FlashcardStreakState {
  streak: number;
  lastReviewDate: string | null;
}

export default function FlashcardsHomeView(): React.JSX.Element {
  const [cards, setCards] = useState<Flashcard[]>(DEFAULT_FLASHCARDS);

  const [isReviewing, setIsReviewing] = useState(false);
  const [completedReview, setCompletedReview] = useState<number | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState<NewCardFormState>({ front: '', back: '', dueIn: 'Today' });
  const [studyHistory, setStudyHistory] = useState<StudyHistory>(() => {
    if (typeof window === 'undefined') {
      return {};
    }

    const storedValue = window.localStorage.getItem(STUDY_HISTORY_STORAGE_KEY);

    if (!storedValue) {
      return {};
    }

    try {
      const parsedValue = JSON.parse(storedValue) as Partial<StudyHistory>;
      return Object.fromEntries(Object.entries(parsedValue).filter(([, value]) => typeof value === 'number')) as StudyHistory;
    } catch {
      return {};
    }
  });
  const [streakState, setStreakState] = useState<FlashcardStreakState>(() => {
    if (typeof window === 'undefined') {
      return { streak: 0, lastReviewDate: null };
    }

    const storedValue = window.localStorage.getItem(STREAK_STORAGE_KEY);

    if (!storedValue) {
      return { streak: 0, lastReviewDate: null };
    }

    try {
      const parsedValue = JSON.parse(storedValue) as Partial<FlashcardStreakState>;
      const parsedStreak = Number(parsedValue.streak);
      const parsedLastReviewDate = typeof parsedValue.lastReviewDate === 'string' ? parsedValue.lastReviewDate : null;

      return {
        streak: Number.isFinite(parsedStreak) ? parsedStreak : 0,
        lastReviewDate: parsedLastReviewDate
      };
    } catch {
      return { streak: 0, lastReviewDate: null };
    }
  });

  useEffect(() => {
    let isMounted = true;

    loadFlashcards().then((loadedCards) => {
      if (isMounted) {
        setCards(loadedCards);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    void saveFlashcards(cards);
  }, [cards]);

  const { dueToday, tomorrow, totalCards } = getFlashcardStats(cards);
  const upcomingCards = getUpcomingCards(cards);
  const { streak } = streakState;

  useEffect(() => {
    window.localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakState));
  }, [streakState]);

  useEffect(() => {
    window.localStorage.setItem(STUDY_HISTORY_STORAGE_KEY, JSON.stringify(studyHistory));
  }, [studyHistory]);

  const weeklyStudyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toISOString().slice(0, 10);
    });

    const maxValue = Math.max(1, ...days.map((day) => studyHistory[day] ?? 0));

    return days.map((day) => {
      const count = studyHistory[day] ?? 0;
      const label = new Date(day).toLocaleDateString(undefined, { weekday: 'short' });
      return {
        day,
        label,
        count,
        height: count === 0 ? 8 : Math.max(18, Math.round((count / maxValue) * 100))
      };
    });
  }, [studyHistory]);

  const startReview = (): void => {
    if (cards.length === 0) {
      return;
    }

    setCompletedReview(null);
    setIsReviewing(true);
  };

  const handleCreateCard = (): void => {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      return;
    }

    const nextCard: Flashcard = {
      id: Date.now(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      dueIn: newCard.dueIn
    };

    setCards((currentCards) => [...currentCards, nextCard]);
    setNewCard({ front: '', back: '', dueIn: 'Today' });
    setIsAddingCard(false);
  };

  const finishReview = (correctCount: number): void => {
    const today = new Date().toISOString().slice(0, 10);

    setCompletedReview(correctCount);
    setStudyHistory((currentHistory) => ({
      ...currentHistory,
      [today]: (currentHistory[today] ?? 0) + cards.length
    }));
    setStreakState((currentState) => {
      if (currentState.lastReviewDate === today) {
        return currentState;
      }

      if (currentState.lastReviewDate === null) {
        return {
          streak: 1,
          lastReviewDate: today
        };
      }

      if (currentState.streak >= 2) {
        return {
          streak: 0,
          lastReviewDate: today
        };
      }

      return {
        streak: currentState.streak + 1,
        lastReviewDate: today
      };
    });
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
              <span className="stats-label">Current Streak</span>
              <span className="stats-value">{streak}</span>
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
              <button className="btn btn-primary" onClick={startReview} disabled={cards.length === 0}>
                {cards.length === 0 ? 'Add cards to start' : 'Start Review'}
              </button>
            </div>
          </section>

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

          <section className="card upcoming-card">
            <div className="card-header">
              <h2>Your cards</h2>
              <button className="btn btn-secondary btn-inline" onClick={() => setIsAddingCard((value) => !value)}>
                {isAddingCard ? 'Cancel' : 'Add Card'}
              </button>
            </div>

            {isAddingCard && (
              <div className="add-card-form">
                <input
                  className="card-input"
                  placeholder="Question"
                  value={newCard.front}
                  onChange={(event) => setNewCard((current) => ({ ...current, front: event.target.value }))}
                />
                <textarea
                  className="card-textarea"
                  placeholder="Answer"
                  value={newCard.back}
                  onChange={(event) => setNewCard((current) => ({ ...current, back: event.target.value }))}
                />
                <select
                  className="card-select"
                  value={newCard.dueIn}
                  onChange={(event) => setNewCard((current) => ({ ...current, dueIn: event.target.value as Flashcard['dueIn'] }))}
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </select>
                <button className="btn btn-primary" onClick={handleCreateCard}>
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
