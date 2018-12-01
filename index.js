require('dotenv').config()
const responseBuilder = require('./src/response')
const {req: assignRequest} = require('./src/assign')
const {req: whomiRequest} = require('./src/whoAmI')
const {req: issueCountRequest} = require('./src/issueCount')
const {req: issueCountDetailsRequest} = require('./src/issueCountDetails')
const {req: changeStatusRequest} = require('./src/changeStatus')
const getAssignee = require('./src/assigneeMapper')
const {path} = require('./src/helper')

const projectKey = process.env.PROJECT_KEY

exports.handler = (event, context) => {
  console.log('EVENT :::: ', JSON.stringify(event, null, 2))
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
    if (session.attributes.intent === 'AssignIssue' || request.intent.name === 'AssignIssue') {
      const jiraId = (path(['request', 'intent', 'slots', 'jiraid', 'value'])) || session.attributes.jiraid
      const assignee = (path(['request', 'intent', 'slots', 'name', 'value'])) || session.attributes.assignee
      session.attributes.jiraid = jiraId
      if (!getAssignee[assignee]) {
        session.attributes.intent = 'AssignIssue'
        const options = {
          speechText: 'I didnt get the assignee name. Can you repeat the name ?',
          endSession: false,
          session
        }
        context.succeed(responseBuilder(options))
      }
      session.attributes.assignee = assignee
      const opts = {
        projectKey,
        jiraId,
        assignee
      }
      assignRequest(opts, context, session)
    } else if (request.intent.name === 'WhoAMI') {
      whomiRequest(null, context)
    } else if (request.intent.name === 'AMAZON.StopIntent') {
      context.succeed(responseBuilder({
        speechText: 'Good Bye !!',
        endSession: true
      }))
    } else if (request.type === 'AMAZON.FallbackIntent') {
      context.succeed(responseBuilder({
        speechText: 'Sorry I dont understand, can you repeat that ?',
        endSession: false
      }))
    } else if (request.intent.name === 'IssueCount') {
      let options = {}
      options.session = session
      options.session.attributes.IssueCount = true
      options.endSession = false
      issueCountRequest(null, options, context)
    } else if (request.intent.name === 'IssueCountDetails') {
      issueCountDetailsRequest(null, context, session)
    } else if (request.intent.name === 'ChangeStatus') {
      const jiraId = (request.intent.slots.ticket.value) || session.attributes.jiraid
      session.attributes.jiraid = jiraId
      const status = request.intent.slots.status.value
      const opts = {
        projectKey,
        jiraId,
        status
      }
      changeStatusRequest(opts, context, session)
    } else {
      const text = (session.attributes.jiraid) ? `do you want to do something with jira id ${session.attributes.jiraid}` : `Can you repeat that ?`
      context.succeed(responseBuilder({
        speechText: `Sorry I dont understand, ${text}`,
        endSession: false,
        session
      }))
    }
  } else if (request.type === 'SessionEndedRequest') {
    context.succeed(responseBuilder({
      speechText: 'Good Bye !!',
      endSession: true
    }))
  }
  // else {
  //   context.succeed(responseBuilder({
  //     speechText: 'Sorry I dont understand, can you repeat that ?',
  //     endSession: false
  //   }))
  // }
}
