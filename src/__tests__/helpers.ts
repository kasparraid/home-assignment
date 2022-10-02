import {Card, CardDto, CardSuit, CardValue, Deck, DeckDto, DeckType} from '../models';

export function givenDeck(deck?: Partial<Deck>) {
  return new Deck({type: DeckType.FULL, shuffled: false, ...deck});
}

export function givenCard(card?: Partial<Card>) {
  return new Card({value: CardValue.ACE, suit: CardSuit.SPADES, ...card});
}

export function givenDeckDto(deck: Deck, data?: Partial<DeckDto>) {
  return new DeckDto({
    deckId: deck.id,
    type: deck.type,
    shuffled: deck.shuffled,
    ...data
  });
}

export function givenCardDto(card: Card, data?: Partial<CardDto>) {
  return new CardDto({
    value: card.value,
    suit: card.suit,
    ...data
  });
}
