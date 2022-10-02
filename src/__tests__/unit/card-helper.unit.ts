import {generateCards, shuffleCards} from '../../helpers';
import {DeckType} from '../../models';
import {expect} from '@loopback/testlab';

describe('CardHelper (unit)', function () {
  describe('generateCards()', function () {
    it('should generate 52 cards', async () => {
      // given
      const deckId = '123';

      // when
      const cards = generateCards(deckId, DeckType.FULL);

      // then
      expect(cards.length).to.eql(52);
    });

    it('should generate 36 cards', async () => {
      // given
      const deckId = '123';

      // when
      const cards = generateCards(deckId, DeckType.SHORT);

      // then
      expect(cards.length).to.eql(36);
    });
  });

  describe('shuffleCards()', function () {
    it('should shuffle cards', async () => {
      // given
      const deckId = '123';

      // when
      const cards = generateCards(deckId, DeckType.FULL);
      const shuffledCards = shuffleCards(cards);

      // then
      expect(shuffledCards).not.containDeepOrdered(cards);
    });
  });
});
