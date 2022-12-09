import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../schemas/validators.js'

// Main data model schema
export const todosSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    description: Type.String(),
    title: Type.String(),
    user_id: Type.String({ format: 'uuid' }),
    priority: Type.Enum({low : 'low', medium: 'medium', high: 'high'}),
    begined_at: Type.String({ format: 'date-time' }),
    finished_at: Type.String({ format: 'date-time' }),
    deadline_at: Type.String({ format: 'date-time' }),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
  },
  { $id: 'Todos', additionalProperties: false }
)
export const todosResolver = resolve({
  properties: {}
})

export const todosExternalResolver = resolve({
  properties: {}
})

// Schema for creating new entries
export const todosDataSchema = Type.Pick(todosSchema, ['title', 'description', 'priority', 'deadline_at', 'begined_at', 'finished_at'], {
  $id: 'TodosData',
  additionalProperties: false
})
export const todosDataValidator = getDataValidator(todosDataSchema, dataValidator)
export const todosDataResolver = resolve({
  properties: {
    user_id : async (user_id, obj, context) => context.params.user.id,
  }
})

// Schema for allowed query properties
export const todosQueryProperties = Type.Pick(todosSchema, ['id', 'priority', 'deadline_at', 'begined_at', 'finished_at', 'user_id', 'created_at'], { additionalProperties: false })
export const todosQuerySchema = querySyntax(todosQueryProperties)
export const todosQueryValidator = getValidator(todosQuerySchema, queryValidator)
export const todosQueryResolver = resolve({
  properties: {
    user_id: async (value, user, context) => {
      if (context.params.user) {
        return context.params.user.id
      }
      return value
    }
  }
})
