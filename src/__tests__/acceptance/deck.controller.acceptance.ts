import {Client, createRestAppClient, expect} from '@loopback/testlab';
import {HomeAssignmentApplication} from '../..';
import {givenRunningApplicationWithCustomConfiguration} from './test-helper';
import {DeckType} from '../../models';

describe('DeckController (acceptance)', function () {
  let app: HomeAssignmentApplication;
  let client: Client;

  before(async () => {
    app = await givenRunningApplicationWithCustomConfiguration();
    client = createRestAppClient(app);
  });

  after(async () => {
    await app.stop();
  });

  it('User should be able to create a new FULL Deck', async () => {
    // given
    const payload = {type: DeckType.FULL};

    // when
    const res = await client.post('/decks').send(payload).expect(200);

    // then
    expect(res.body).to.have.property('deckId');
    expect(res.body.type).to.be.eql(DeckType.FULL);
    expect(res.body.remaining).to.be.eql(52);
  });
});
