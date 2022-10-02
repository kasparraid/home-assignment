import {Model, model, property} from '@loopback/repository';
import {CardDto} from './card-dto.model';

@model()
export class CardDtos extends Model {
  @property({
    type: 'array',
    required: true,
    itemType: CardDto,
  })
  cards: CardDto[];

  constructor(data?: Partial<CardDtos>) {
    super(data);
  }
}
