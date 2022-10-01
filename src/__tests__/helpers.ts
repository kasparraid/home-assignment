import {Deck, DeckType} from '../models';

export function givenDeck(deck?: Partial<Deck>) {
  return new Deck({type: DeckType.FULL, ...deck});
}
