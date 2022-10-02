# home-assignment

## Run the application

### Prerequisite
- [Docker](https://docs.docker.com/engine/installation/) is installed.

Spin up postgres database and application docker containers:
```bash
docker-compose up -d
```

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