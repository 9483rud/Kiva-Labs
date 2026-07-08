export type FlashcardDueIn = 'Today' | 'Tomorrow';

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  dueIn: FlashcardDueIn;
}

export const flashcardsData: Flashcard[] = [
  {
    id: 1,
    front: 'What is spaced repetition?',
    back: 'A learning technique that reviews cards at increasing intervals to improve long-term memory.',
    dueIn: 'Today'
  },
  {
    id: 2,
    front: 'What is active recall?',
    back: 'Actively retrieving information from memory instead of just rereading notes.',
    dueIn: 'Today'
  },
  {
    id: 3,
    front: 'When should you review a forgotten card?',
    back: 'Review it again sooner and repeat it in shorter intervals until it sticks.',
    dueIn: 'Tomorrow'
  },
  {
    id: 4,
    front: 'How can small daily sessions help?',
    back: 'Frequent short reviews build consistency and prevent overload.',
    dueIn: 'Tomorrow'
  }
];

export function getFlashcardStats(cards: Flashcard[] = flashcardsData) {
  return {
    dueToday: cards.filter((card) => card.dueIn === 'Today').length,
    tomorrow: cards.filter((card) => card.dueIn === 'Tomorrow').length,
    totalCards: cards.length
  };
}

export function getUpcomingCards(cards: Flashcard[] = flashcardsData) {
  return cards.slice(0, 3);
}
