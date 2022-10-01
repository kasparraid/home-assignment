import {Model, model, property} from '@loopback/repository';
import {DeckType} from './deck-type.enum';

@model()
export class DeckDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  deckId: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(DeckType),
    },
  })
  type: DeckType;

  @property({
    type: 'number',
    required: true,
  })
  remaining: number;

  constructor(data?: Partial<DeckDto>) {
    super(data);
  }
}
