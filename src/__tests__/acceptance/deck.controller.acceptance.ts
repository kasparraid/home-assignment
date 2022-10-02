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
    const payload = {type: DeckType.FULL, shuffled: false};

    // when
    const res = await client.post('/decks').send(payload).expect(200);

    // then
    expect(res.body).to.have.property('deckId');
    expect(res.body.type).to.be.eql(DeckType.FULL);
    expect(res.body.shuffled).to.be.false();
    expect(res.body.remaining).to.be.eql(52);
  });

  it('User should be able to create a new SHORT Deck', async () => {
    // given
    const payload = {type: DeckType.SHORT, shuffled: false};

    // when
    const res = await client.post('/decks').send(payload).expect(200);

    // then
    expect(res.body).to.have.property('deckId');
    expect(res.body.type).to.be.eql(DeckType.SHORT);
    expect(res.body.shuffled).to.be.false();
    expect(res.body.remaining).to.be.eql(36);
  });

  it('User should be able to create a new shuffled Deck', async () => {
    // given
    const payload = {type: DeckType.FULL, shuffled: true};

    // when
    const res = await client.post('/decks').send(payload).expect(200);

    // then
    expect(res.body).to.have.property('deckId');
    expect(res.body.type).to.be.eql(DeckType.FULL);
    expect(res.body.shuffled).to.be.true();
    expect(res.body.remaining).to.be.eql(52);
  });

  it('User should be able to create a new Deck and retrieve it', async () => {
    // given
    const payload = {type: DeckType.FULL, shuffled: true};

    // when
    const res = await client.post('/decks').send(payload).expect(200);

    const deckId = res.body.deckId;
    const deck = await client.get(`/decks/${deckId}`).expect(200);

    // then
    expect(deck.body.deckId).to.be.eql(deckId);
    expect(deck.body.type).to.be.eql(DeckType.FULL)
    expect(deck.body.remaining).to.be.eql(52);
    expect(deck.body.cards).to.have.length(52);
    expect(deck.body.shuffled).to.be.true();
  });

});
