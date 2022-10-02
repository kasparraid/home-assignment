CREATE SCHEMA IF NOT EXISTS decks;

CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE deck_types AS ENUM ('FULL', 'SHORT');

CREATE TABLE decks.decks
(
    id       uuid default (uuid_generate_v4()) NOT NULL,
    type     deck_types                        NOT NULL,
    shuffled boolean                           NOT NULL,
    CONSTRAINT pk_decks PRIMARY KEY (id)
);

CREATE TYPE card_suits AS ENUM ('SPADES', 'CLUBS', 'DIAMONDS', 'HEARTS');
CREATE TYPE card_values AS ENUM ('2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE');

CREATE TABLE decks.cards
(
    id      serial                           NOT NULL,
    value   card_values                      NOT NULL,
    suit    card_suits                       NOT NULL,
    deck_id uuid REFERENCES decks.decks (id) NOT NULL,
    CONSTRAINT pk_cards PRIMARY KEY (id)
);