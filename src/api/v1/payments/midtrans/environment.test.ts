import * as assert from 'assert'
import { ServerSymbolKey } from './globals'
import { MidtransEnv, SetEnvironment, SetServerKey } from './environment'

describe('Environment', () => {
  it('should set the server key', () => {
    SetServerKey('blah')
    assert.equal('blah', global[ServerSymbolKey])
  })

  it('should set the environment to production', () => {
    SetEnvironment(MidtransEnv.Production)
  })

  it('should set the environment to sandbox', () => {
    SetEnvironment(MidtransEnv.Sandbox)
  })
})
