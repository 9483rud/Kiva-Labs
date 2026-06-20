import React from 'react';
import './App.css';

export default function App() {
  // Placeholder data for our study dashboard
  const recentNotes = [
    { id: 1, title: 'Chemistry - Acids & Bases', date: '2 hours ago' },
    { id: 2, title: 'World History - WW1 Timeline', date: 'Yesterday' }
  ];

  const flashcardsDueCount = 15;

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">K</span>
          <h1 className="logo-text">Kiva <span className="text-highlight">Labs</span></h1>
        </div>
        <p className="subtitle">Your distraction-free study space</p>
      </header>

      {/* Main Dashboard Grid */}
      <main className="dashboard-grid">
        
        {/* Flashcards Block */}
        <section className="card flashcard-card">
          <div className="card-header">
            <h2>Flashcards</h2>
            <span className="badge">{flashcardsDueCount} Due</span>
          </div>
          <p className="card-description">Master your terms with spaced repetition.</p>
          
          {/* Quick Action inside the placeholder */}
          <div className="card-action-zone">
            <button className="btn btn-primary" onClick={() => alert('Starting Quick Review!')}>
              ⚡ Quick Review
            </button>
          </div>
        </section>

        {/* Notes Block */}
        <section className="card notes-card">
          <div className="card-header">
            <h2>Notes</h2>
          </div>
          <p className="card-description">Your digital notebook.</p>
          
          {/* Preview Data List */}
          <div className="preview-list">
            <h3>Recent Notes</h3>
            <ul>
              {recentNotes.map(note => (
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