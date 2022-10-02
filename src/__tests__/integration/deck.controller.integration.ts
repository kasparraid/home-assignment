import {DeckController} from '../../controllers';
import {givenDeck} from '../helpers';
import {expect} from '@loopback/testlab';
import {CardService, DeckService} from '../../services';
import {CardRepository, DeckRepository} from '../../repositories';
import {juggler} from '@loopback/repository';
import {givenTestDataSource} from '../database-helpers';
import {DeckType} from "../../models";

describe('DeckController (integration)', function () {
  let deckController: DeckController;
  let ds: juggler.DataSource;

  before(async () => {
    ds = await givenTestDataSource();
    const deckRepository = new DeckRepository(ds);
    const cardRepository = new CardRepository(ds);
    const cardService = new CardService(cardRepository);
    const deckService = new DeckService(deckRepository, cardService);
    deckController = new DeckController(deckService);
  });

  after(async () => {
    await ds.stop();
  });

  describe('create()', function () {
    it('should return a FULL Deck', async () => {
      // given
      const aDeckToCreate = givenDeck();

      // when
      const result = await deckController.create(aDeckToCreate);

      // then
      expect(result.type).to.eql(aDeckToCreate.type);
      expect(result.remaining).to.eql(52);
      expect(result.shuffled).to.eql(aDeckToCreate.shuffled);
    });

    it('should return a SHORT Deck', async () => {
      // given
      const aDeckToCreate = givenDeck({type: DeckType.SHORT});

      // when
      const result = await deckController.create(aDeckToCreate);

      // then
      expect(result.type).to.eql(aDeckToCreate.type);
      expect(result.remaining).to.eql(36);
      expect(result.shuffled).to.eql(aDeckToCreate.shuffled);
    });

    it('should return a shuffled Deck', async () => {
      // given
      const aDeckToCreate = givenDeck({shuffled: true});

      // when
      const result = await deckController.create(aDeckToCreate);

      // then
      expect(result.type).to.eql(aDeckToCreate.type);
      expect(result.remaining).to.eql(52);
      expect(result.shuffled).to.eql(aDeckToCreate.shuffled);
    });
  });
});
