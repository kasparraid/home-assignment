import {BindingScope, injectable} from '@loopback/core';
import {CardRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {Card, CardDto, DeckType} from '../models';
import {generateCards, shuffleCards, toCardDto} from '../helpers';
import {HttpErrors} from "@loopback/rest";

@injectable({scope: BindingScope.TRANSIENT})
export class CardService {
  constructor(
    @repository(CardRepository)
    private cardRepository: CardRepository,
  ) {}

  async createCards(deckId: string, type: DeckType, shuffled: boolean): Promise<Card[]> {
    let cards = generateCards(deckId, type);
    cards = shuffled ? shuffleCards(cards) : cards;

    return this.cardRepository.createAllInTransaction(cards);
  }

  async drawCards(id: string, count: number): Promise<CardDto[]> {
    const drawnCards = await this.cardRepository.find({where: {deckId: id}, limit: count});
    if (count > drawnCards.length) {
      throw new HttpErrors[422](`Invalid count ${count} to draw, ${drawnCards.length} cards remaining`);
    }

    await this.deleteCards(drawnCards);

    return drawnCards?.map(card => toCardDto(card));
  }

  private async deleteCards(cards: Card[]): Promise<void> {
    const cardIds = cards.map(card => card.id);
    await this.cardRepository.deleteAll({id: {inq: cardIds}});
  }
}
