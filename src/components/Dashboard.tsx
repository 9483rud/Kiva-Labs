import './style/Dashboard.css';
import React, { useMemo } from 'react';
import integrationsUrl from '../assets/Kiva-Labs-Logo.svg';
import { flashcardsData, getFlashcardStats, getUpcomingCards } from './Flashcards/flashcardsData';

interface Note {
  id: number;
  title: string;
  date: string;
}

export default function Dashboard(): React.JSX.Element {
  const recentNotes: Note[] = [
    { id: 1, title: 'Chemistry - Acids & Bases', date: '2 hours ago' },
    { id: 2, title: 'World History - WW1 Timeline', date: 'Yesterday' }
  ];

  const cards = useMemo(() => flashcardsData, []);
  const reviewStats = useMemo(() => getFlashcardStats(cards), [cards]);
  const upcomingCards = useMemo(() => getUpcomingCards(cards), [cards]);

  const startReview = (): void => {
    alert('Starting your spaced repetition review session!');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          {/* Use the new Integrations.svg asset as the logo image */}
          <img src={integrationsUrl} alt="Kiva Labs logo" className="logo-icon" />
          <h1 className="logo-text">Kiva <span className="text-highlight">Labs</span></h1>
        </div>
        <p className="subtitle">Your distraction-free study space</p>
      </header>

      <main className="dashboard-grid">
        <section className="card review-card">
          <div className="card-header">
            <h2>Spaced Repetition</h2>
            <span className="badge">{reviewStats.dueToday} Due</span>
          </div>
          <p className="card-description">Review the cards due today and keep your learning streak alive.</p>
          <div className="review-stats-grid">
            <div className="review-stat">
              <span className="review-stat-value">{reviewStats.tomorrow}</span>
              <span className="review-stat-label">Tomorrow</span>
            </div>
            <div className="review-stat">
              <span className="review-stat-value">{reviewStats.dueToday}</span>
              <span className="review-stat-label">Due Today</span>
            </div>
            <div className="review-stat">
              <span className="review-stat-value">{reviewStats.totalCards}</span>
              <span className="review-stat-label">Total Cards</span>
            </div>
          </div>
          <div className="preview-list">
            <h3>Upcoming Cards</h3>
            <ul>
              {upcomingCards.map((card) => (
                <li key={card.id} className="preview-item">
                  <span className="note-title">🎴 {card.front}</span>
                  <span className="note-date">{card.dueIn}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-action-zone">
            <button className="btn btn-primary" onClick={startReview}>
              Start Review
            </button>
          </div>
        </section>

        <section className="card notes-card">
          <div className="card-header">
            <h2>Notes</h2>
          </div>
          <p className="card-description">Your digital notebook.</p>
          <div className="preview-list">
            <h3>Recent Notes</h3>
            <ul>
              {recentNotes.map((note) => (
                <li key={note.id} className="preview-item">
                  <span className="note-title">📝 {note.title}</span>
                  <span className="note-date">{note.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
