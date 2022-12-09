import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  postsDataValidator,
  postsQueryValidator,
  postsResolver,
  postsDataResolver,
  postsQueryResolver,
  postsExternalResolver
} from './posts.schema.js'
import { PostsService, getOptions } from './posts.class.js'

export * from './posts.class.js'
export * from './posts.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const posts = (app) => {
  // Register our service on the Feathers application
  app.use('posts', new PostsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('posts').hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [
        schemaHooks.validateQuery(postsQueryValidator),
        schemaHooks.validateData(postsDataValidator),
        schemaHooks.resolveQuery(postsQueryResolver),
        schemaHooks.resolveData(postsDataResolver)
      ]
    },
    after: {
      all: [schemaHooks.resolveResult(postsResolver), schemaHooks.resolveExternal(postsExternalResolver)]
    },
    error: {
      all: []
    }
  })
}
