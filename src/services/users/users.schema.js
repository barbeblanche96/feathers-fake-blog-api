import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../schemas/validators.js'
import { BadRequest } from '@feathersjs/errors/lib/index.js'

// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    email: Type.String({format: 'email'}),
    username: Type.String({minLength: 5}),
    password: Type.String({minLength: 6}),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
  },
  { $id: 'User', additionalProperties: false }
)
export const userResolver = resolve({
  properties: {}
})

export const userExternalResolver = resolve({
  properties: {
    // The password should never be visible externally
    password: async () => undefined
  }
})

// Schema for the basic data model (e.g. creating new entries)
export const userDataSchema = Type.Pick(userSchema, ['email', 'username', 'password'], {
  $id: 'UserData',
  additionalProperties: false
})
export const userDataValidator = getDataValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
  properties: {
    password: passwordHash({ strategy: 'local' }),
    email : async (email, user, context) => {
      let patchQuery = context.id ? {id: {$ne : context.id } } : {}
      let existUser = await context.app.service('users').find({query: {email, $limit: 0, ...patchQuery}});
      if(existUser.total > 0) {
        throw new BadRequest('This email is already exist');
      }
      return email;
    },
    username : async (username, user, context) => {
      let patchQuery = context.id ? {id: {$ne : context.id } } : {}
      let existUser = await context.app.service('users').find({query: {username, $limit: 0, ...patchQuery}});
      console.log(existUser);
      if(existUser.total > 0) {
        throw new BadRequest('This username is already exist');
      }
      return username;
    }
  }
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'username', 'email'])
export const userQuerySchema = querySyntax(userQueryProperties)
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  properties: {
    // If there is a user (e.g. with authentication), they are only allowed to see their own data
    id: async (value, user, context) => {
      if (context.params.user) {
        return context.params.user.id
      }
      return value
    }
  }
})
