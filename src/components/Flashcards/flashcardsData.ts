export type FlashcardDueIn = 'Today' | 'Tomorrow';

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  dueIn: FlashcardDueIn;
}

export const DEFAULT_FLASHCARDS: Flashcard[] = [];

function isValidFlashcards(value: unknown): value is Flashcard[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((card) => typeof card === 'object' && card !== null && typeof (card as Flashcard).id === 'number' && typeof (card as Flashcard).front === 'string' && typeof (card as Flashcard).back === 'string' && ((card as Flashcard).dueIn === 'Today' || (card as Flashcard).dueIn === 'Tomorrow'));
}

function hasElectronApi(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI);
}

export async function loadFlashcards(): Promise<Flashcard[]> {
  if (hasElectronApi()) {
    try {
      const cards = await window.electronAPI?.loadFlashcards();
      if (isValidFlashcards(cards)) {
        return cards;
      }
    } catch {
      // Fallback to local storage below.
    }
  }

  if (typeof window !== 'undefined') {
    const storedValue = window.localStorage.getItem('kiva-labs-flashcards');

    if (storedValue) {
      try {
        const parsedValue = JSON.parse(storedValue);
        if (isValidFlashcards(parsedValue)) {
          return parsedValue;
        }
      } catch {
        // Ignore invalid storage and fall back to defaults.
      }
    }
  }

  return DEFAULT_FLASHCARDS.map((card) => ({ ...card }));
}

export async function saveFlashcards(cards: Flashcard[]): Promise<void> {
  if (hasElectronApi()) {
    await window.electronAPI?.saveFlashcards(cards);
    return;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('kiva-labs-flashcards', JSON.stringify(cards));
  }
}

export function getFlashcardStats(cards: Flashcard[] = DEFAULT_FLASHCARDS) {
  return {
    dueToday: cards.filter((card) => card.dueIn === 'Today').length,
    tomorrow: cards.filter((card) => card.dueIn === 'Tomorrow').length,
    totalCards: cards.length
  };
}

export function getUpcomingCards(cards: Flashcard[] = DEFAULT_FLASHCARDS) {
  return cards.slice(0, 3);
}
