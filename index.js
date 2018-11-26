const responseBuilder = require('./src/response')
const {req: assignRequest} = require('./src/assign')
const {req: whomiRequest} = require('./src/whoAmI')
const {req: issueCountRequest} = require('./src/issueCount')
const {req: issueCountDetailsRequest} = require('./src/issueCountDetails')
const {req: changeStatusRequest} = require('./src/changeStatus')

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
    } else if (request.intent.name === 'ChangeStatus') {
      const jiraId = request.intent.slots.ticket.value
      const status = request.intent.slots.status.value
      const opts = {
        projectKey,
        jiraId,
        status
      }
      changeStatusRequest(opts, context, session)
    } else {
      context.succeed(responseBuilder({
        speechText: 'Sorry I dont understand, can you repeat that ?',
        endSession: false
      }))
    }
  } else if (request.type === 'SessionEndedRequest') {

  } else {
    context.succeed(responseBuilder({
      speechText: 'Sorry I dont understand, can you repeat that ?',
      endSession: false
    }))
  }
}
