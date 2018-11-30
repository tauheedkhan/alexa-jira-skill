const request = require('request-promise')
require('request-promise').debug = true
const responseBuilder = require('./response')
const auth = require('./authorization')

const DOMAIN = process.env.DOMAIN

const options = () => ({
  method: 'GET',
  uri: `https://${DOMAIN}/rest/api/3/myself`,
  json: true,
  resolveWithFullResponse: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  }
})
console.log('WHO AM I OPTIONS :: ', options)
const alexaResponse = (opts) => ({
  speechText: `Your display name is ${opts.displayName}. and email id is ${opts.emailAddress}`,
  endSession: true
})

const req = (opts, context) => {
  request(options())
    .then(response => {
      context.succeed(responseBuilder(alexaResponse(response.body)))
    })
    .catch(err => {
      const alexaRes = {
        speechText: err.errors.assignee,
        endSession: true
      }
      context.fail(responseBuilder(alexaRes))
    })
}

module.exports = {
  req
}
