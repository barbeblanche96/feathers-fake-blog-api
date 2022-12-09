import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  todosDataValidator,
  todosQueryValidator,
  todosResolver,
  todosDataResolver,
  todosQueryResolver,
  todosExternalResolver
} from './todos.schema.js'
import { TodosService, getOptions } from './todos.class.js'

export * from './todos.class.js'
export * from './todos.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const todos = (app) => {
  // Register our service on the Feathers application
  app.use('todos', new TodosService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('todos').hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [
        schemaHooks.validateQuery(todosQueryValidator),
        schemaHooks.validateData(todosDataValidator),
        schemaHooks.resolveQuery(todosQueryResolver),
        schemaHooks.resolveData(todosDataResolver)
      ],
      create: [
        (context) => {
          delete context.data.begined_at;
          delete context.data.finished_at;
        }
      ]
    },
    after: {
      all: [schemaHooks.resolveResult(todosResolver), schemaHooks.resolveExternal(todosExternalResolver)]
    },
    error: {
      all: []
    }
  })
}
