import {Entity, model, property} from '@loopback/repository';
import {DeckType} from './deck-type.enum';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'decks',
      table: 'decks',
    },
  },
})
export class Deck extends Entity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    generated: true,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'type',
      dataType: 'string',
      enum: ['FULL', 'SHORT'],
    },
    jsonSchema: {
      enum: Object.values(DeckType),
    },
  })
  type: DeckType;

  @property({
    type: 'boolean',
    required: true,
  })
  shuffled: boolean;

  constructor(data?: Partial<Deck>) {
    super(data);
  }
}

export interface DeckRelations {
  // describe navigational properties here
}

export type DeckWithRelations = Deck & DeckRelations;
