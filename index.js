'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const graphqlExpress = require('apollo-server-express').graphqlExpress
const graphiqlExpress = require('apollo-server-express').graphiqlExpress

const addMockFunctionsToSchema = require('graphql-tools').addMockFunctionsToSchema
const graphql = require('graphql').graphql

const schema = require('./schema')
const PORT = 3000

const app = express()

//addMockFunctionsToSchema({ schema })

const query = `
	query wordsForSegment {
		segment(id: 1) { id, words { id, timestamp } }
	}
`

//graphql(schema, query).then(result => console.log('Got result', result))

//middleware
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }))
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}))

app.listen(PORT, function() {
    console.log(`Apollo server listening on port ${PORT}`)
})
