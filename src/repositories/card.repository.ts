import {inject, Getter} from '@loopback/core';
import {DefaultTransactionalRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Card, CardRelations, Deck} from '../models';
import {DeckRepository} from './deck.repository';

export class CardRepository extends DefaultTransactionalRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
> {

  public readonly deck: BelongsToAccessor<Deck, typeof Card.prototype.id>;

  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource, @repository.getter('DeckRepository') protected deckRepositoryGetter: Getter<DeckRepository>,) {
    super(Card, dataSource);
    this.deck = this.createBelongsToAccessorFor('deck', deckRepositoryGetter,);
    this.registerInclusionResolver('deck', this.deck.inclusionResolver);
  }

  /**
   * createAll() is wrapped in a transaction since regular createAll() does not guarantee to maintain order
   * @param cards
   */
  async createAllInTransaction(cards: Card[]) {
    const tx = await this.beginTransaction();
    const created = await this.createAll(cards, {transaction: tx})
    await tx.commit();
    return created;
  }

}
