import {BindingScope, injectable} from '@loopback/core';
import {CardRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {DeckType} from '../models';
import {generateCards} from '../helpers';

@injectable({scope: BindingScope.TRANSIENT})
export class CardService {
  constructor(
    @repository(CardRepository)
    private cardRepository: CardRepository,
  ) {}

  async createCards(deckId: string, type: DeckType) {
    const cards = generateCards(deckId, type);

    return this.cardRepository.createAllInTransaction(cards);
  }

}
