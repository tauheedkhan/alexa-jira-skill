const responseBuilder = require('./response')
const {req: assignRequest} = require('./assign')
const {req: whomiRequest} = require('./whoAmI')
const {req: issueCountRequest} = require('./assignedToUser')

const projectKey = 'WUNJHB'

exports.handler = (event, context) => {
  const request = event.request

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
      issueCountRequest(null, context)
    } else context.fail('Unknown Intent')
  } else if (request.type === 'SessionEndedRequest') {

  } else {
    context.fail('Unknow intent')
  }
}
