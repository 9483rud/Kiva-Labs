import React from 'react';
import './Notes.css';

interface NoteEntry {
  id: number;
  title: string;
  summary: string;
  updatedAt: string;
}

const sampleNotes: NoteEntry[] = [
  {
    id: 1,
    title: 'Chemistry - Acids & Bases',
    summary: 'Review strong vs. weak acids, pH calculations, and indicator behavior.',
    updatedAt: '2 hours ago'
  },
  {
    id: 2,
    title: 'World History - WWI Timeline',
    summary: 'Summarize the causes, major battles, and the Treaty of Versailles.',
    updatedAt: 'Yesterday'
  },
  {
    id: 3,
    title: 'Biology - Cell Structure',
    summary: 'Outline organelles, membrane transport, and the difference between plant and animal cells.',
    updatedAt: '3 days ago'
  }
];

export default function NotesHomeView(): React.JSX.Element {
  return (
    <div className="app-container">
      <header className="view-header">
        <h2>Notes</h2>
        <p className="subtitle">Keep your ideas, quick summaries, and study material organized in one place.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <h2>Notebook</h2>
        </div>
        <p className="card-description">
          This dedicated notes workspace is now separated from the rest of the app so it can grow into a fuller study hub.
        </p>

        <div className="notes-grid">
          <div className="notes-panel">
            <h3>Recent notes</h3>
            <ul className="note-list">
              {sampleNotes.map((note) => (
                <li key={note.id} className="note-item">
                  <div>
                    <strong>{note.title}</strong>
                    <p>{note.summary}</p>
                  </div>
                  <span>{note.updatedAt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="notes-panel notes-panel-accent">
            <h3>Next step</h3>
            <p>Use this space to add richer editing, search, and tagging features later.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
