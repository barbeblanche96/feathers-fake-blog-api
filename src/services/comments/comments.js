import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  commentsDataValidator,
  commentsQueryValidator,
  commentsResolver,
  commentsDataResolver,
  commentsQueryResolver,
  commentsExternalResolver
} from './comments.schema.js'
import { CommentsService, getOptions } from './comments.class.js'

export * from './comments.class.js'
export * from './comments.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const comments = (app) => {
  // Register our service on the Feathers application
  app.use('comments', new CommentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('comments').hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [
        schemaHooks.validateQuery(commentsQueryValidator),
        schemaHooks.validateData(commentsDataValidator),
        schemaHooks.resolveQuery(commentsQueryResolver),
        schemaHooks.resolveData(commentsDataResolver)
      ]
    },
    after: {
      all: [
        schemaHooks.resolveResult(commentsResolver),
        schemaHooks.resolveExternal(commentsExternalResolver)
      ]
    },
    error: {
      all: []
    }
  })
}
