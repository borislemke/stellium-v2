import * as sinon from 'sinon'

const nodemon = require('../nodemon.json')

process.env = {
  ...process.env,
  ...nodemon.env
}

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
})

afterEach(function () {
  this.sandbox.restore()
})
