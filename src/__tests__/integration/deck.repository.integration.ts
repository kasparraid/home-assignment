import {DeckRepository} from '../../repositories';
import {givenDeck} from '../helpers';
import {expect} from '@loopback/testlab';
import validator from 'validator';
import {givenTestDataSource} from '../database-helpers';
import {juggler} from '@loopback/repository';

describe('DeckRepository (integration)', function () {
  let deckRepository: DeckRepository;
  let ds: juggler.DataSource;

  before(async () => {
    ds = await givenTestDataSource();
    deckRepository = new DeckRepository(ds);
  });

  after(async () => {
    await ds.stop();
  });

  describe('create()', function () {
    it('should create a Deck with generated uuid', async () => {
      // given
      const aDeckToCreate = givenDeck();

      // when
      const result = await deckRepository.create(aDeckToCreate);

      // then
      expect(validator.isUUID(result.id)).to.true();
    });
  });
});
