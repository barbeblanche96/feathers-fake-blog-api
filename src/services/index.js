import { comments } from './comments/comments.js'

import { posts } from './posts/posts.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(comments)

  app.configure(posts)

  app.configure(user)

  // All services will be registered here
}
