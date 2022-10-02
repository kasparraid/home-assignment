import {Entity, model, property, belongsTo} from '@loopback/repository';
import {CardValue} from './card-value.enum';
import {CardSuit} from './card-suit.enum';
import {Deck} from './deck.model';

@model({
  settings: {
    postgresql: {
      schema: 'decks',
      table: 'cards',
    },
  },
})
export class Card extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  value: CardValue;

  @property({
    type: 'string',
    required: true,
  })
  suit: CardSuit;

  @belongsTo(
    () => Deck,
    {keyFrom: 'deck_id', keyTo: 'id'},
    {postgresql: {columnName: 'deck_id'}},
  )
  deckId: string;

  constructor(data?: Partial<Card>) {
    super(data);
  }
}

export interface CardRelations {}

export type CardWithRelations = Card & CardRelations;
