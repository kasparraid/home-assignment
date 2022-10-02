import {Model, model, property} from '@loopback/repository';
import {CardSuit} from './card-suit.enum';
import {CardValue} from './card-value.enum';

@model()
export class CardDto extends Model {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(CardValue),
    },
  })
  value: CardValue;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(CardSuit),
    },
  })
  suit: CardSuit;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      description: 'ACE OF SPADES - AS, KING OF HEARTS - KH ...',
    },
  })
  get code(): string {
    return (
      (this.value.length > 2 ? this.value.charAt(0) : this.value) +
      this.suit.charAt(0)
    );
  }

  constructor(data?: Partial<CardDto>) {
    super(data);
  }
}
