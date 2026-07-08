import type { Flashcard } from './flashcardsData';

export interface NewCardFormState {
  front: string;
  back: string;
  dueIn: Flashcard['dueIn'];
}
