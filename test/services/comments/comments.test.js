import assert from 'assert'
import { app } from '../../../src/app.js'

describe('comments service', () => {
  it('registered the service', () => {
    const service = app.service('comments')

    assert.ok(service, 'Registered the service')
  })
})
