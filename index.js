require('dotenv').config()
const responseBuilder = require('./src/response')
const {req: assignRequest} = require('./src/assign')
const {req: whomiRequest} = require('./src/whoAmI')
const {req: issueCountRequest} = require('./src/issueCount')
const {req: issueCountDetailsRequest} = require('./src/issueCountDetails')
const {req: changeStatusRequest} = require('./src/changeStatus')
const getAssignee = require('./src/assigneeMapper')

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
      speechText: 'Welcome to Jeera.',
      repromptText: 'You can say for example, how many tickets are assigned to me',
      endSession: false
    }
    context.succeed(responseBuilder(options))
  } else if (request.type === 'IntentRequest') {
    if (request.intent.name === 'AMAZON.StopIntent') {
      context.succeed(responseBuilder({
        speechText: 'Good Bye !!, All the best for your presentation !!',
        endSession: true
      }))
    } else if (!session.attributes.intent && request.intent.name === 'AMAZON.FallbackIntent') {
      delete session.attributes.intent
      context.succeed(responseBuilder({
        speechText: 'Sorry I dont understand, can you repeat that ?',
        endSession: false
      }))
    } else if (session.attributes.intent === 'AssignIssue' || request.intent.name === 'AssignIssue' || request.intent.name === 'AssignRepeat') {
      if (!request.intent.slots.jiraid) {
        request.intent.slots.jiraid = {}
      }
      if (!request.intent.slots.name) {
        request.intent.slots.name = {}
      }
      const jiraId = (request.intent.slots.jiraid.value) || session.attributes.jiraid
      const assignee = (request.intent.slots.name.value) || session.attributes.assignee
      session.attributes.jiraid = jiraId
      console.log('assignee', assignee)
      console.log('getAssignee', getAssignee[assignee])
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
    } else if (request.intent.name === 'IssueCount') {
      // let options = {}
      // options.session = session
      // options.session.attributes.IssueCount = true
      // options.endSession = false
      issueCountRequest(context, session)
    } else if (request.intent.name === 'IssueCountDetails') {
      issueCountDetailsRequest(null, context, session)
    } else if (session.attributes.intent === 'ChangeStatus' || request.intent.name === 'ChangeStatus') {
      if (!request.intent.slots.jiraid) {
        request.intent.slots.jiraid = {}
      }
      if (!request.intent.slots.status) {
        request.intent.slots.status = {}
      }
      const jiraId = (request.intent.slots.jiraid.value) || session.attributes.jiraid
      const status = (request.intent.slots.status.value) || session.attributes.status
      session.attributes.jiraid = jiraId
      session.attributes.status = status
      const opts = {
        projectKey,
        jiraId,
        status
      }
      changeStatusRequest(opts, context, session)
    }
  } else if (request.type === 'SessionEndedRequest') {
    context.succeed(responseBuilder({
      speechText: 'Good Bye !!, All the best for your presentation !!',
      endSession: true
    }))
  }
}
