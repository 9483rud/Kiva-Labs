import React, { useEffect, useMemo, useState } from 'react';
import FlashcardsReviewView from './FlashcardsReviewView';
import FlashcardsSummarySection from './FlashcardsSummarySection';
import FlashcardsStartReviewCard from './FlashcardsStartReviewCard';
import FlashcardsWeeklyChart from './FlashcardsWeeklyChart';
import FlashcardsManageCardsSection from './FlashcardsManageCardsSection';
import { DEFAULT_FLASHCARDS, Flashcard, getFlashcardStats, loadFlashcards, saveFlashcards } from './flashcardsData';
import type { NewCardFormState } from './flashcardsTypes';
import './Flashcards.css';

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
          <FlashcardsSummarySection dueToday={dueToday} tomorrow={tomorrow} streak={streak} totalCards={totalCards} />

          <FlashcardsStartReviewCard dueToday={dueToday} cardsLength={cards.length} onStartReview={startReview} />

          <FlashcardsWeeklyChart weeklyStudyData={weeklyStudyData} />

          <FlashcardsManageCardsSection
            cards={cards}
            isAddingCard={isAddingCard}
            newCard={newCard}
            onToggleAddCard={() => setIsAddingCard((value) => !value)}
            onNewCardChange={(updates) => setNewCard((current) => ({ ...current, ...updates }))}
            onCreateCard={handleCreateCard}
          />

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
