import './style/Dashboard.css';
import React from 'react';
import integrationsUrl from '../../arc/assets/Integrations.svg?url';

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

  const flashcardsDueCount: number = 15;

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
        <section className="card flashcard-card">
          <div className="card-header">
            <h2>Flashcards</h2>
            <span className="badge">{flashcardsDueCount} Due</span>
          </div>
          <p className="card-description">Master your terms with spaced repetition.</p>
          <div className="card-action-zone">
            <button className="btn btn-primary" onClick={() => alert('Starting Quick Review!')}>
              ⚡ Quick Review
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
