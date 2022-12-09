import { KnexService } from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TodosService extends KnexService {
  setup(app) {
    this.app = app;
  }

  async create(data, params) {

    const sqliteClient = this.app.get('sqliteClient');

    let createTodo = await sqliteClient.table('todos').insert(data).returning('id')

    return await sqliteClient.table('todos').where('id', createTodo[0].id).first();
  }
}

export const getOptions = (app) => {
  return {
    paginate: false,
    Model: app.get('sqliteClient'),
    name: 'todos'
  }
}
