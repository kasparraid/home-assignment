import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Deck, DeckRelations, Card, DeckWithRelations} from '../models';
import {CardRepository} from './card.repository';

export class DeckRepository extends DefaultCrudRepository<
  Deck,
  typeof Deck.prototype.id,
  DeckRelations
> {

  public readonly cards: HasManyRepositoryFactory<Card, typeof Deck.prototype.id>;

  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource, @repository.getter('CardRepository') protected cardRepositoryGetter: Getter<CardRepository>,) {
    super(Deck, dataSource);
    this.cards = this.createHasManyRepositoryFactoryFor('cards', cardRepositoryGetter,);
    this.registerInclusionResolver('cards', this.cards.inclusionResolver);
  }

  async findByIdWithCards(id: string): Promise<DeckWithRelations> {
    return this.findById(id, {include: [{relation: 'cards'}]});
  }
}
