import { KnexService } from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class CommentsService extends KnexService {

  setup(app) {
    this.app = app;
  }

  async create(data, params) {

    const sqliteClient = this.app.get('sqliteClient');

    // createUser2 = next return value of id field, Ex : createUser = [ { id: '692600ab-0e89-4015-9e7c-79c0e76f138f' } ]
    let createComment = await sqliteClient.table('comments').insert(data).returning('id')

    return await sqliteClient.table('comments').where('id', createComment[0].id).first();
  }

}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'comments',
  }
}
