import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DeckRepository} from '../repositories';
import {CardDtos, Deck, DeckDto} from '../models';
import {toCardDto, toCardDtos, toDeckDto} from '../helpers';
import {CardService} from './card.service';

@injectable({scope: BindingScope.TRANSIENT})
export class DeckService {
  constructor(
    @repository(DeckRepository)
    private deckRepository: DeckRepository,
    @service(CardService)
    private cardService: CardService,
  ) {}

  async createDeck(deckToCreate: Partial<Deck>): Promise<DeckDto> {
    const deck = await this.deckRepository.create(deckToCreate);
    const cards = await this.cardService.createCards(
      deck.id,
      deck.type,
      deck.shuffled,
    );

    return toDeckDto(deck, {remaining: cards.length});
  }

  async findDeck(id: string): Promise<DeckDto> {
    const deck = await this.deckRepository.findById(id, {
      include: [{relation: 'cards'}],
    });

    const cards = deck.cards?.map(card => toCardDto(card)) ?? [];
    return toDeckDto(deck, {remaining: cards.length, cards: cards});
  }

  async drawCards(id: string, count: number): Promise<CardDtos> {
    const deck = await this.deckRepository.findById(id);
    const cards = await this.cardService.drawCards(deck.id, count);

    return toCardDtos(cards);
  }
}
