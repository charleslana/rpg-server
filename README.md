## Installation

```bash
npm install
```

## Install nestjs cli

```
sudo npm i -g @nestjs/cli
```

## Create project with nestjs

```
nest new nestjs-prisma --strict
```

## Docker compose

```
docker-compose up -d
```

## Init Prisma

```
npx prisma init
```

## Migrate Prisma

```
npx prisma migrate dev --name init --skip-generate
```

## Generate Prisma

```
npx prisma generate
```

## Create NestJs module

```
nest g module modules/user
```

```
npx nest generate module modules/socket --no-spec
```

## Create NestJs controller

```
nest g controller modules/user
```

## Create NestJs service

```
nest g service modules/user
```

## Prisma

1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet,
   read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite,
   sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database
   events. Read: https://pris.ly/cli/beyond-orm

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Prisma studio

```
npx prisma studio
```
