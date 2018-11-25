module.exports = (options) => {
  const response = {
    'version': '1.0',
    'sessionAttributes': {
    },
    'response': {
      'outputSpeech': {
        'type': 'SSML',
        'ssml': `<speak>${options.speechText}</speak>`
      },
      'shouldEndSession': options.endSession
    }
  }

  if (options.repromptText) {
    response.response.reprompt = {
      'outputSpeech': {
        'type': 'PlainText',
        'text': options.repromptText
      }
    }
  }

  if (options.session && options.session.attributes) {
    response.sessionAttributes = options.session.attributes
  }

  return response
}
