import { Ajv, addFormats } from '@feathersjs/schema'

const formats = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex'
]

export const dataValidator = addFormats(new Ajv({allErrors: true, useDefaults:true}), formats)

export const queryValidator = addFormats(
  new Ajv({
    coerceTypes: true
  }),
  formats
)
