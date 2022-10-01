import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Deck, DeckDto} from '../models';
import {service} from '@loopback/core';
import {DeckService} from '../services';

export class DeckController {
  constructor(
    @service(DeckService)
    public deckService: DeckService,
  ) {}

  @post('/decks')
  @response(200, {
    description: 'DeckDto model instance',
    content: {'application/json': {schema: getModelSchemaRef(DeckDto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deck, {
            title: 'NewDeckDto',
            exclude: ['id'],
          }),
        },
      },
    })
    deck: Omit<Deck, 'id'>,
  ): Promise<DeckDto> {
    return this.deckService.createDeck(deck);
  }
}
