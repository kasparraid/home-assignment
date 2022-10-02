import {HomeAssignmentApplication} from "../../application";
import {Client, createRestAppClient, expect, toJSON} from "@loopback/testlab";
import {givenRunningApplicationWithCustomConfiguration} from "../acceptance/test-helper";
import {givenCreatedCard, givenCreatedDeck, givenEmptyDatabase, givenTestDataSource} from "../database-helpers";
import {juggler} from "@loopback/repository";
import {givenCardDto, givenDeck, givenDeckDto} from "../helpers";
import validator from "validator";
import {CardRepository, DeckRepository} from "../../repositories";
import {randomUUID} from "crypto";
import {CardValue} from "../../models";

describe('DeckController (integration)', function () {
    let app: HomeAssignmentApplication;
    let client: Client;
    let ds: juggler.DataSource;
    let deckRepository: DeckRepository;
    let cardRepository: CardRepository;

    before(async () => {
        app = await givenRunningApplicationWithCustomConfiguration();
        client = createRestAppClient(app);
        ds = givenTestDataSource();
        deckRepository = new DeckRepository(ds, async () => cardRepository);
        cardRepository = new CardRepository(ds, async () => deckRepository);
    });

    beforeEach(async () => givenEmptyDatabase(cardRepository, deckRepository));

    after(async () => {
        await ds.stop();
        await app.stop();
    });

    describe('create()', function () {
        it('should create a deck with generated uuid', async () => {
            // given
            const payload = givenDeck();

            // when
            const result = await client.post('/decks').send(payload).expect(200);

            // then
            expect(validator.isUUID(result.body.deckId)).to.true();
        });

        it('should require a valid deck type', async () => {
            // given
            const payload = {type: 'INVALID', shuffled: false};

            // when
            await client.post('/decks').send(payload).expect(422);
        });

    });

    describe('findById()', function () {
        it('should validate deck id is valid uuid', async () => {
            // given
            const deckId = '123';

            // when
            const result = await client.get(`/decks/${deckId}`).expect(422);

            // then
            expect(result.body.error.message).to.eql('Provided id 123 is not a valid UUID');
        });

        it('should validate deck exists', async () => {
            // given
            const deckId = randomUUID();

            // when
            const result = await client.get(`/decks/${deckId}`).expect(404);

            // then
            expect(result.body.error.message).to.eql(`Entity not found: Deck with id "${deckId}"`);
        });

        it('should return a deck with no cards', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);

            // when
            const result = await client.get(`/decks/${deck.id}`).expect(200);

            // then
            const expected = givenDeckDto(deck, {remaining: 0, cards: []});
            expect(toJSON(result.body)).to.eql(toJSON(expected));
        });

        it('should return a deck with some cards', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);
            const card = await givenCreatedCard(cardRepository, {deckId: deck.id});

            // when
            const result = await client.get(`/decks/${deck.id}`).expect(200);

            // then
            const expected = givenDeckDto(deck, {remaining: 1, cards: [givenCardDto(card)]});
            expect(toJSON(result.body)).to.eql(toJSON(expected));
        });

    });

    describe('draw()', function () {
        it('should validate deck id is valid uuid', async () => {
            // given
            const deckId = '123';

            // when
            const result = await client.post(`/decks/${deckId}/draw`).expect(422);

            // then
            expect(result.body.error.message).to.eql('Provided id 123 is not a valid UUID');
        });

        it('should validate deck exists', async () => {
            // given
            const deckId = randomUUID();

            // when
            const result = await client.post(`/decks/${deckId}/draw`).expect(404);

            // then
            expect(result.body.error.message).to.eql(`Entity not found: Deck with id "${deckId}"`);
        });

        it('should validate count must not be negative', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);

            // when
            const result = await client.post(`/decks/${deck.id}/draw`)
                .query({count: -1})
                .expect(422);

            // then
            expect(result.body.error.message).to.eql('Count must be greater than zero');
        });

        it('should validate count must be greater than zero', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);

            // when
            const result = await client.post(`/decks/${deck.id}/draw`)
                .query({count: 0})
                .expect(422);

            // then
            expect(result.body.error.message).to.eql('Count must be greater than zero');
        });

        it('should validate there are enough cards to draw', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);

            // when
            const result = await client.post(`/decks/${deck.id}/draw`)
                .query({count: 5})
                .expect(422);

            // then
            expect(result.body.error.message).to.eql('Invalid count 5 to draw, 0 cards remaining');
        });

        it('should draw one card', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);
            const card = await givenCreatedCard(cardRepository, {deckId: deck.id});

            // when
            const result = await client.post(`/decks/${deck.id}/draw`)
                .query({count: 1})
                .expect(200);

            // then
            const expected = [givenCardDto(card)];
            expect(toJSON(result.body)).to.eql(toJSON(expected));
        });

        it('should draw multiple cards', async () => {
            // given
            const deck = await givenCreatedDeck(deckRepository);
            const firstCard = await givenCreatedCard(cardRepository, {deckId: deck.id});
            const secondCard = await givenCreatedCard(cardRepository, {deckId: deck.id, value: CardValue.KING});

            // when
            const result = await client.post(`/decks/${deck.id}/draw`)
                .query({count: 2})
                .expect(200);

            // then
            const expected = [givenCardDto(firstCard), givenCardDto(secondCard)];
            expect(toJSON(result.body)).to.eql(toJSON(expected));
        });

    });
});