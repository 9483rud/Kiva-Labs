import React, { useEffect, useState } from 'react';
import './Notes.css';

interface NoteEntry {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

type AddNoteMode = 'choice' | 'text' | 'file' | 'cloud';

const STORAGE_KEY = 'kiva-labs-notes';
const CLOUD_SERVICE_AVAILABLE = false;
const CLOUD_SERVICE_ONLINE = false;

function formatUpdatedAt(date: Date): string {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export default function NotesHomeView(): React.JSX.Element {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modalMode, setModalMode] = useState<AddNoteMode>('choice');
  const [cloudEnabled, setCloudEnabled] = useState(CLOUD_SERVICE_AVAILABLE && CLOUD_SERVICE_ONLINE);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    try {
      const storedNotes = window.localStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes) as NoteEntry[]);
      }
    } catch {
      // Ignore storage errors and continue with an empty list.
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, hasLoaded]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) return;

    const newNote: NoteEntry = {
      id: Date.now(),
      title: trimmedTitle,
      content: trimmedContent,
      updatedAt: formatUpdatedAt(new Date())
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);
    setTitle('');
    setContent('');
    setModalMode('choice');
  };

  const handleCloseModal = (): void => {
    setModalMode('choice');
    setTitle('');
    setContent('');
    setSelectedFileName('');
    setSelectedFileContent('');
    setFileError('');
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFileName('');
      setSelectedFileContent('');
      setFileError('');
      return;
    }

    setFileError('');
    const reader = new FileReader();

    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setSelectedFileName(file.name);
      setSelectedFileContent(text);
    };

    reader.onerror = () => {
      setSelectedFileName(file.name);
      setSelectedFileContent('');
      setFileError('This file could not be read. Try a text file instead.');
    };

    reader.readAsText(file);
  };

  const handleCreateFileNote = (): void => {
    const trimmedTitle = selectedFileName
      ? selectedFileName.replace(/\.[^/.]+$/, '')
      : 'Imported file note';
    const trimmedContent = selectedFileContent.trim() || fileError || 'No readable content was found in the selected file.';

    const fileNote: NoteEntry = {
      id: Date.now(),
      title: trimmedTitle,
      content: trimmedContent,
      updatedAt: formatUpdatedAt(new Date())
    };

    setNotes((previousNotes) => [fileNote, ...previousNotes]);
    setSelectedFileName('');
    setSelectedFileContent('');
    setFileError('');
    setModalMode('choice');
  };

  const handleCreateCloudNote = (): void => {
    const cloudNote: NoteEntry = {
      id: Date.now(),
      title: 'Cloud note',
      content: 'A cloud-connected note placeholder was added. Connect a service to enable real syncing.',
      updatedAt: formatUpdatedAt(new Date())
    };

    setNotes((previousNotes) => [cloudNote, ...previousNotes]);
    setModalMode('choice');
  };

  return (
    <div className="app-container">
      <header className="view-header">
        <h2>Notes</h2>
        <p className="subtitle">Capture ideas, quick summaries, and study material in your own personal notebook.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <h2>Notebook</h2>
        </div>
        <p className="card-description">
          Add your own notes below. They stay here locally in this browser so you can build your study hub over time.
        </p>

        <button className="btn notes-submit" type="button" onClick={() => setModalMode('choice')}>
          Add note
        </button>

        <div className="notes-grid">
          <div className="notes-panel">
            <h3>Recent notes</h3>
            {notes.length === 0 ? (
              <div className="empty-state">
                <p>No notes yet. Add your first one above.</p>
              </div>
            ) : (
              <ul className="note-list">
                {notes.map((note) => (
                  <li key={note.id} className="note-item">
                    <div className="note-item-content">
                      <strong>{note.title}</strong>
                      <p>{note.content}</p>
                    </div>
                    <span>{note.updatedAt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="notes-panel notes-panel-accent">
            <h3>Next step</h3>
            <p>Use this space to add richer editing, search, and tagging features later.</p>
            <div className="note-tip-list">
              <span className="note-pill">Local saving</span>
              <span className="note-pill">Easy to add</span>
              <span className="note-pill">Wraps long text</span>
            </div>
          </div>
        </div>
      </section>

      {modalMode !== 'choice' && (
        <div className="notes-modal-overlay" onClick={handleCloseModal}>
          <div className="notes-modal" onClick={(event) => event.stopPropagation()}>
            <div className="notes-modal-header">
              <h3>
                {modalMode === 'text' && 'Create a text note'}
                {modalMode === 'file' && 'Create a file note'}
                {modalMode === 'cloud' && 'Create a cloud note'}
              </h3>
              <button className="notes-modal-close" type="button" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            {modalMode === 'text' ? (
              <form className="notes-form notes-modal-form" onSubmit={handleSubmit}>
                <input
                  className="notes-input"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Note title"
                  aria-label="Note title"
                />
                <textarea
                  className="notes-textarea"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write your note here..."
                  aria-label="Note content"
                />
                <div className="notes-modal-actions">
                  <button className="btn notes-submit" type="submit">
                    Save note
                  </button>
                </div>
              </form>
            ) : modalMode === 'file' ? (
              <div className="notes-modal-body">
                <p>Select a file to turn it into a note entry.</p>
                <label className="notes-file-picker">
                  <span>Choose file</span>
                  <input type="file" onChange={handleFileSelection} />
                </label>
                {selectedFileName ? (
                  <p className="notes-file-name">Selected: {selectedFileName}</p>
                ) : (
                  <p className="notes-file-hint">Text files work best for quick import.</p>
                )}
                {fileError ? <p className="notes-file-error">{fileError}</p> : null}
                {selectedFileContent ? (
                  <div className="notes-file-preview">
                    <strong>Preview</strong>
                    <p>{selectedFileContent.slice(0, 220)}{selectedFileContent.length > 220 ? '…' : ''}</p>
                  </div>
                ) : null}
                <button
                  className="btn notes-submit"
                  type="button"
                  onClick={handleCreateFileNote}
                  disabled={!selectedFileName || Boolean(fileError)}
                >
                  Add file note
                </button>
              </div>
            ) : (
              <div className="notes-modal-body">
                <p>
                  {cloudEnabled
                    ? 'Connect your cloud service to sync notes online.'
                    : 'Cloud notes are unavailable until a cloud service is connected and online.'}
                </p>
                <button
                  className="btn notes-submit"
                  type="button"
                  onClick={handleCreateCloudNote}
                  disabled={!cloudEnabled}
                >
                  {cloudEnabled ? 'Add cloud note' : 'Unavailable'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalMode === 'choice' && (
        <div className="notes-modal-overlay" onClick={handleCloseModal}>
          <div className="notes-modal" onClick={(event) => event.stopPropagation()}>
            <div className="notes-modal-header">
              <h3>Add note</h3>
              <button className="notes-modal-close" type="button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="notes-choice-grid">
              <button className="notes-choice-card" type="button" onClick={() => setModalMode('text')}>
                <strong>Text</strong>
                <span>Create a note from scratch</span>
              </button>
              <button className="notes-choice-card" type="button" onClick={() => setModalMode('file')}>
                <strong>File</strong>
                <span>Import a file as a note</span>
              </button>
              {cloudEnabled && (
                <button className="notes-choice-card" type="button" onClick={() => setModalMode('cloud')}>
                  <strong>Cloud service</strong>
                  <span>Sync from an online service</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
