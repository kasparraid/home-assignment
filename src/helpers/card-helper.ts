import {
  Card,
  CardDto,
  CardDtos,
  CardSuit,
  CardValue,
  DeckType,
} from '../models';

export function toCardDto(card: Card): CardDto {
  return new CardDto({
    value: card.value,
    suit: card.suit,
  });
}
export function toCardDtos(cards: CardDto[]): CardDtos {
  return new CardDtos({cards: cards});
}

export function generateCards(deckId: string, type: DeckType): Card[] {
  return Object.values(CardSuit).flatMap(suit => {
    return Object.values(CardValue)
      .slice(DeckType.FULL === type ? 0 : 4)
      .map(value => {
        return new Card({
          deckId: deckId,
          value: value,
          suit: suit,
        });
      });
  });
}

export function shuffleCards(cards: Card[]): Card[] {
  const shuffledCards = [...cards];

  let m = shuffledCards.length;

  while (m) {
    const i = Math.floor(Math.random() * m--);

    [shuffledCards[m], shuffledCards[i]] = [shuffledCards[i], shuffledCards[m]];
  }

  return shuffledCards;
}
