import {inject} from '@loopback/core';
import {DefaultTransactionalRepository} from '@loopback/repository';
import {PgdbDataSource} from '../datasources';
import {Card, CardRelations} from '../models';

export class CardRepository extends DefaultTransactionalRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(Card, dataSource);
  }

  async createAllInTransaction(cards: Card[]) {
    const tx = await this.beginTransaction();
    const created = await this.createAll(cards, {transaction: tx})
    await tx.commit();
    return created;
  }
}
