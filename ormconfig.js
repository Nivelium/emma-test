const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
   "type": "postgres",
   "host": "localhost",
   "username": "postgres",
   "database": "postgres",
   "password": "postgres",
   "port": 5434,
   "logging": false,
   "namingStrategy": new SnakeNamingStrategy(),
   "entities": [
      "src/**/*.entity.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}