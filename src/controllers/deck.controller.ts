import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {CardDtos, Deck, DeckDto} from '../models';
import {service} from '@loopback/core';
import {DeckService} from '../services';
import validator from 'validator';

export class DeckController {
  constructor(
    @service(DeckService)
    public deckService: DeckService,
  ) {}

  @post('/decks')
  @response(200, {
    description: 'DeckDto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DeckDto, {exclude: ['cards']}),
      },
    },
  })
  @response(422, {
    content: {
      'application/json': {
        schema: {
          example: {
            error: {
              statusCode: 422,
              name: 'UnprocessableEntityError',
              message:
                'The request body is invalid. See error object `details` property for more info.',
              code: 'VALIDATION_FAILED',
            },
          },
        },
      },
    },
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

  @get('/decks/{id}')
  @response(200, {
    description: 'DeckDto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DeckDto),
      },
    },
  })
  @response(422, {
    content: {
      'application/json': {
        schema: {
          example: {
            error: {
              statusCode: 422,
              name: 'UnprocessableEntityError',
              message: 'Provided id 1 is not a valid UUID',
            },
          },
        },
      },
    },
  })
  @response(404, {
    content: {
      'application/json': {
        schema: {
          example: {
            error: {
              statusCode: 404,
              name: 'Error',
              message: 'Entity not found: Deck with id',
              code: 'ENTITY_NOT_FOUND',
            },
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id', {
      description: 'Must be valid UUID',
    })
    id: string,
  ): Promise<DeckDto> {
    this.validateId(id);
    return this.deckService.findDeck(id);
  }

  @post('/decks/{id}/draw')
  @response(200, {
    description: 'CardDtos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CardDtos),
      },
    },
  })
  @response(422, {
    content: {
      'application/json': {
        schema: {
          example: {
            error: {
              statusCode: 422,
              name: 'UnprocessableEntityError',
              message: 'Provided id 1 is not a valid UUID',
            },
          },
        },
      },
    },
  })
  @response(404, {
    content: {
      'application/json': {
        schema: {
          example: {
            error: {
              statusCode: 404,
              name: 'Error',
              message: 'Entity not found: Deck with id',
              code: 'ENTITY_NOT_FOUND',
            },
          },
        },
      },
    },
  })
  async draw(
    @param.path.string('id', {
      description: 'Must be valid UUID',
    })
    id: string,
    @param.query.number('count', {
      description:
        'Count how many cards to draw (greater than zero), default 1',
    })
    count = 1,
  ): Promise<CardDtos> {
    this.validateId(id);
    if (count <= 0) {
      throw new HttpErrors[422]('Count must be greater than zero');
    }
    return this.deckService.drawCards(id, count);
  }

  private validateId(id: string): void {
    if (!validator.isUUID(id)) {
      throw new HttpErrors[422](`Provided id ${id} is not a valid UUID`);
    }
  }
}
