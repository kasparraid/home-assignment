import {BindingScope, injectable} from '@loopback/core';
import {CardRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {DeckType} from '../models';
import {generateCards, shuffleCards} from '../helpers';

@injectable({scope: BindingScope.TRANSIENT})
export class CardService {
  constructor(
    @repository(CardRepository)
    private cardRepository: CardRepository,
  ) {}

  async createCards(deckId: string, type: DeckType, shuffled: boolean) {
    let cards = generateCards(deckId, type);
    cards = shuffled ? shuffleCards(cards) : cards;

    return this.cardRepository.createAllInTransaction(cards);
  }

}
