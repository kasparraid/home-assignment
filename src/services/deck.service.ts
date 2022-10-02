import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DeckRepository} from '../repositories';
import {Deck} from '../models';
import {toCardDto, toDeckDto} from '../helpers';
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

  async findDeck(id: string) {
    const deck = await this.deckRepository.findById(id, {include: [{relation: 'cards'}]});

    const cards = deck.cards?.map(card => toCardDto(card)) ?? [];
    return toDeckDto(deck,{remaining: cards.length, cards: cards})
  }

  async drawCards(id: string, count: number) {
    const deck = await this.deckRepository.findById(id);

    return this.cardService.drawCards(deck.id, count);
  }
}
