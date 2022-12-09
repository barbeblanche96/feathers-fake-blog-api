import { feathers } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
const todosServiceMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

const commentsServiceMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

const postsServiceMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

export {}

const userServiceMethods = ['find', 'get', 'create', 'update', 'patch', 'remove']

/**
 * Returns a  client for the blog-backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = (connection, authenticationOptions = {}) => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))

  client.use('users', connection.service('users'), {
    methods: userServiceMethods
  })

  client.use('posts', connection.service('posts'), {
    methods: postsServiceMethods
  })

  client.use('comments', connection.service('comments'), {
    methods: commentsServiceMethods
  })

  client.use('todos', connection.service('todos'), {
    methods: todosServiceMethods
  })

  return client
}
