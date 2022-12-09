import knex from 'knex'

export const sqlite = (app) => {
  const config = app.get('sqlite')
  const db = knex(config)

  app.set('sqliteClient', db)
}
