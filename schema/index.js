'use strict'
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const Transcript = require('./transcript')
const Segment = require('./segment')
const Tag = require('./tag')
const connectors = require('../connectors')

const RootQuery = `
  input WordsInput {
    word: String
    speakerNo: Int
  }
	type Query {
		transcript(id: Int): Transcript
	}
	type Mutation {
		editTranscript (id: Int!, words: [WordsInput], clientID: Int): Transcript
	}
`

const SchemaDefinition = `
	schema {
    query: Query,
    mutation: Mutation
	}
`

const resolverMap = {
	Query: {
		transcript(root, args) {
			return connectors.getTranscriptById(args)
		}
	},
	Mutation: {
		editTranscript: (root, args) => {
			return connectors.editTranscriptById(args)
		}
	}
}

module.exports = makeExecutableSchema({
	typeDefs: [SchemaDefinition, RootQuery, ...Segment, ...Tag, Transcript],
	resolvers: resolverMap
})