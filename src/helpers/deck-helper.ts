import {Deck, DeckDto} from '../models';

export function toDeckDto(deck: Deck, data?: Partial<DeckDto>) {
  return new DeckDto({
    deckId: deck.id,
    type: deck.type,
    shuffled: deck.shuffled,
    ...data,
  });
}
