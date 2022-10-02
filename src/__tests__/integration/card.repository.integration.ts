import {CardRepository, DeckRepository} from '../../repositories';
import {expect} from '@loopback/testlab';
import {givenCreatedCard, givenCreatedDeck, givenEmptyDatabase, givenTestDataSource} from '../database-helpers';
import {juggler} from '@loopback/repository';

describe('CardRepository (integration)', function () {
  let cardRepository: CardRepository;
  let deckRepository: DeckRepository;
  let ds: juggler.DataSource;

  before(async () => {
    ds = await givenTestDataSource();
    cardRepository = new CardRepository(ds, async () => deckRepository);
    deckRepository = new DeckRepository(ds, async () => cardRepository);
  });

  beforeEach(async () => givenEmptyDatabase(ds))

  after(async () => {
    await ds.stop();
  });

  describe('findByDeckId()', function () {
    it('should find 1 card', async () => {
      // given
      const deck = await givenCreatedDeck(deckRepository);
      const cards = [await givenCreatedCard(cardRepository, {deckId: deck.id})];

      // when
      const result = await cardRepository.findByDeckId(deck.id, 1);

      // then
      expect(result).to.containDeepOrdered(cards);
    });

    it('should find 0 cards', async () => {
      // given
      const deck = await givenCreatedDeck(deckRepository);

      // when
      const result = await cardRepository.findByDeckId(deck.id, 1);

      // then
      expect(result.length).to.eql(0);
    });

  });

});
