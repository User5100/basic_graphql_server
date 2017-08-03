'use strict'
const Segment = require('./segment')
const Tag = require('./tag')

const Transcript = `
  type Transcript {
        id: Int!
        allText: String
        docID: Int
        tags: [Tag]
        title: String
        SRTs: [Segment]
	}
`

module.exports = Transcript