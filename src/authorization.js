const base = require('base-64')

const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD

module.exports = base.encode(`${USERNAME}:${PASSWORD}`)
