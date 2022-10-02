import {CardRepository, DeckRepository} from '../../repositories';
import {givenDeck} from '../helpers';
import {expect} from '@loopback/testlab';
import validator from 'validator';
import {givenCreatedCard, givenCreatedDeck, givenEmptyDatabase, givenTestDataSource} from '../database-helpers';
import {juggler} from '@loopback/repository';

describe('DeckRepository (integration)', function () {
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

  describe('findByIdWithCards()', function () {
    it('should retrieve deck with 1 card', async () => {
      // given
      const deck = await givenCreatedDeck(deckRepository);
      const cards = [await givenCreatedCard(cardRepository, {deckId: deck.id})]

      // when
      const result = await deckRepository.findByIdWithCards(deck.id);

      // then
      const expected = Object.assign(deck, {cards: cards})
      expect(result).to.containEql(expected);
    });

    it('should retrieve deck with 0 cards', async () => {
      // given
      const deck = await givenCreatedDeck(deckRepository);

      // when
      const result = await deckRepository.findByIdWithCards(deck.id);

      // then
      expect(result).to.containEql(deck);
    });
  });
});
