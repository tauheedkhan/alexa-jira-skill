const responseBuilder = require('./response')
const {req: assignRequest} = require('./assign')
const {req: whomiRequest} = require('./whoAmI')
const {req: issueCountRequest} = require('./issueCount')
const {req: issueCountDetailsRequest} = require('./issueCountDetails')

const projectKey = 'WUNJHB'

exports.handler = (event, context) => {
  var request = event.request
  var session = event.session
  if (!event.session.attributes) {
    event.session.attributes = {}
  }

  if (request.type === 'LaunchRequest') {
    const options = {
      speechText: 'Welcome to Jira skill.',
      repromptText: 'You can say for example, how many tickets are assigned to me',
      endSession: false
    }
    context.succeed(responseBuilder(options))
  } else if (request.type === 'IntentRequest') {
    if (request.intent.name === 'AssignIssue') {
      const jiraId = request.intent.slots.jiraid.value
      const assignee = request.intent.slots.name.value
      const opts = {
        projectKey,
        jiraId,
        assignee
      }
      assignRequest(opts, context)
    } else if (request.intent.name === 'WhoAMI') {
      whomiRequest(null, context)
    } else if (request.intent.name === 'IssueCount') {
      let options = {}
      options.session = session
      options.session.attributes.IssueCount = true
      options.endSession = false
      issueCountRequest(null, options, context)
    } else if (request.intent.name === 'IssueCountDetails') {
      issueCountDetailsRequest(null, context, session)
    } else context.fail('Unknown Intent')
  } else if (request.type === 'SessionEndedRequest') {

  } else {
    context.fail('Unknow intent')
  }
}
