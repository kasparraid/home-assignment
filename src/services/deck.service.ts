import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DeckRepository} from '../repositories';
import {Deck} from '../models';
import {toDeckDto} from '../helpers';
import {CardService} from './card.service';

@injectable({scope: BindingScope.TRANSIENT})
export class DeckService {
  constructor(
    @repository(DeckRepository)
    private deckRepository: DeckRepository,
    @service(CardService)
    private cardService: CardService,
  ) {}

  async createDeck(deckToCreate: Partial<Deck>) {
    const deck = await this.deckRepository.create(deckToCreate);
    const cards = await this.cardService.createCards(deck.id, deck.type, deck.shuffled);

    return toDeckDto(deck, {remaining: cards.length});
  }
}
