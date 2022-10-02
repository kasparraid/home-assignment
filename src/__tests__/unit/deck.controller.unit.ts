import {DeckController} from "../../controllers";
import {DeckService} from "../../services";
import {createStubInstance, expect, sinon, StubbedInstanceWithSinonAccessor} from "@loopback/testlab";
import {givenCardDto, givenDeckDto} from "../helpers";
import {randomUUID} from "crypto";

describe('DeckController (unit)', function () {
    let deckService: StubbedInstanceWithSinonAccessor<DeckService>;
    let deckController: DeckController;

    beforeEach(reset);

    describe('findById()', function () {
        it('should validate id to be valid uuid', async () => {
            // given
            const invalidUUID = '123';

            // when
            try {
                await deckController.findById(invalidUUID);
            } catch (e) {
                // then
                expect(e.message).to.eql(`Provided id ${invalidUUID} is not a valid UUID`);
            }
        });

        it('should retrieve a deck with cards', async () => {
            // given
            const aDeckWithId = givenDeckDto({deckId: randomUUID(), cards: [givenCardDto()]});
            const findDeck = deckService.stubs.findDeck;
            findDeck.resolves(aDeckWithId);

            // when
            const result = await deckController.findById(aDeckWithId.deckId);

            // then
            expect(result).to.eql(aDeckWithId);
            sinon.assert.calledWith(findDeck, aDeckWithId.deckId);
        });

    });

    describe('draw()', function () {
        it('should validate id to be valid uuid', async () => {
            // given
            const invalidUUID = '123';

            // when
            try {
                await deckController.draw(invalidUUID);
            } catch (e) {
                // then
                expect(e.message).to.eql(`Provided id ${invalidUUID} is not a valid UUID`);
            }
        });

    });

    function reset() {
        deckService = createStubInstance(DeckService);
        deckController = new DeckController(deckService);
    }

});