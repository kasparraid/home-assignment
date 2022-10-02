import {get, getModelSchemaRef, HttpErrors, param, post, requestBody, response} from '@loopback/rest';
import {Deck, DeckDto} from '../models';
import {service} from '@loopback/core';
import {DeckService} from '../services';
import validator from "validator";

export class DeckController {
  constructor(
    @service(DeckService)
    public deckService: DeckService,
  ) {}

  @post('/decks')
  @response(200, {
    description: 'DeckDto model instance',
    content: {'application/json': {schema: getModelSchemaRef(DeckDto, {exclude: ['cards']})}},
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

  @get('/decks/{id}', )
  @response(200, {
    description: 'DeckDto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DeckDto),
      },
    },
  })
  async findById(
      @param.path.string('id', {
        description: 'Must be valid UUID'
      }) id: string,
  ): Promise<DeckDto> {
    if (!validator.isUUID(id)) {
      throw new HttpErrors[422](`Provided id ${id} is not a valid UUID`)
    }
    return this.deckService.findDeck(id);
  }
}
