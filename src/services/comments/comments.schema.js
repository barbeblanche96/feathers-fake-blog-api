import { BadRequest } from '@feathersjs/errors/lib/index.js'
import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../schemas/validators.js'

// Main data model schema
export const commentsSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    content: Type.String(),
    user_id: Type.String({ format: 'uuid' }),
    post_id: Type.String({ format: 'uuid' }),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
  },
  { $id: 'Comments', additionalProperties: false }
)
export const commentsResolver = resolve({
  properties: {
    user : async (value, comment, context) => {
      return await context.app.service('users').get(comment.user_id);
    }
  }
})

export const commentsExternalResolver = resolve({
  properties: {}
})

// Schema for creating new entries
export const commentsDataSchema = Type.Pick(commentsSchema, ['content', 'post_id'], {
  $id: 'CommentsData',
  additionalProperties: false
})
export const commentsDataValidator = getDataValidator(commentsDataSchema, dataValidator)
export const commentsDataResolver = resolve({
  properties: {
    user_id : async (user_id, comment, context) => context.params.user.id,
    post_id : async (post_id, comment, context) => {
      if (post_id) {
        let existPost = await context.app.service('posts').find({query : {id: post_id, $limit: 0}});
        if(existPost.total < 1) {
          throw new BadRequest('This post not exist')
        }
      }
      return post_id
    }
  }
})

// Schema for allowed query properties
export const commentsQueryProperties = Type.Pick(commentsSchema, ['user_id', 'post_id'], {
  additionalProperties: false
})
export const commentsQuerySchema = querySyntax(commentsQueryProperties)
export const commentsQueryValidator = getValidator(commentsQuerySchema, queryValidator)
export const commentsQueryResolver = resolve({
  properties: {}
})
