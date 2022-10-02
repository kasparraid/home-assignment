import {juggler} from '@loopback/repository';
import {CardRepository, DeckRepository} from "../repositories";
import {Card} from "../models";
import {givenCard, givenDeck} from "./helpers";

export async function givenTestDataSource() {
  return new juggler.DataSource({
    name: 'pgdb',
    connector: 'postgresql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    lazyConnect: true,
  });
}

export async function givenEmptyDatabase(ds: juggler.DataSource) {
  const cardRepository: CardRepository = new CardRepository(ds, async () => deckRepository);
  const deckRepository: DeckRepository = new DeckRepository(ds, async () => cardRepository);

  await cardRepository.deleteAll();
  await deckRepository.deleteAll();
}

export async function givenCreatedDeck(deckRepository: DeckRepository) {
  return deckRepository.create(givenDeck());
}

export async function givenCreatedCard(cardRepository: CardRepository, card?: Partial<Card>) {
  return cardRepository.create(givenCard(card));
}