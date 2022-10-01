import {Card, CardSuit, CardValue, DeckType} from '../models';

export function generateCards(deckId: string, type: DeckType) {
  return Object.values(CardSuit).flatMap(suit => {
    return Object.values(CardValue)
        .slice(DeckType.FULL === type ? 0 : 5)
        .map(value => {
      return new Card({
        deckId: deckId,
        value: value,
        suit: suit,
      });
    });
  });
}
