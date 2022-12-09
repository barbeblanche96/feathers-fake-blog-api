import { BadRequest } from '@feathersjs/errors/lib/index.js'
import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../schemas/validators.js'

// Main data model schema
export const postsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    content: Type.String(),
    title: Type.String(),
    user_id: Type.String({ format: 'uuid' }),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
  },
  { $id: 'Posts', additionalProperties: false }
)
export const postsResolver = resolve({
  properties: {
    user : async (value, post, context) => {
      return await context.app.service('users').get(post.user_id);
    }
  }
})

export const postsExternalResolver = resolve({
  properties: {}
})

// Schema for creating new entries
export const postsDataSchema = Type.Pick(postsSchema, ['content', 'title'], {
  $id: 'PostsData',
  additionalProperties: false
})
export const postsDataValidator = getDataValidator(postsDataSchema, dataValidator)
export const postsDataResolver = resolve({
  properties: {
    user_id : async (user_id, obj, context) => context.params.user.id,
    title : async (title, post, context) => {
      let patchQuery = context.id ? {id: {$ne : context.id } } : {}
      let existPost = await context.app.service('posts').find({query: {title: title, $limit: 0, ...patchQuery}});
      if(existPost.total > 0) {
        throw new BadRequest('This post is already exist');
      }
      return title;
    }
  }
})

// Schema for allowed query properties
export const postsQueryProperties = Type.Pick(postsSchema, ['title', 'user_id', 'created_at'], { additionalProperties: false })
export const postsQuerySchema = querySyntax(postsQueryProperties)
export const postsQueryValidator = getValidator(postsQuerySchema, queryValidator)
export const postsQueryResolver = resolve({
  properties: {}
})
