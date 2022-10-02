import {Model, model, property} from '@loopback/repository';
import {DeckType} from './deck-type.enum';
import {CardDto} from "./card-dto.model";

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
    type: 'boolean',
    required: true,
  })
  shuffled: boolean;

  @property({
    type: 'number',
    required: true,
  })
  remaining: number;

  @property({
    type: 'array',
    required: true,
    itemType: CardDto
  })
  cards: CardDto[];

  constructor(data?: Partial<DeckDto>) {
    super(data);
  }
}
