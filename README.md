# home-assignment

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

## Run the application

### Prerequisite
- [Docker](https://docs.docker.com/engine/installation/) is installed.

Spin up postgres database and application docker containers:
```bash
docker-compose up -d
```

Open http://127.0.0.1:3000 in your browser.

## Stop the application
```bash
docker-compose down
```

## Run the test suite

### Run the test:

For mocha tests, we use
[testcontainers](https://github.com/testcontainers/testcontainers-node) to
start/stop the postgres docker container automatically.

```bash
npm test
```