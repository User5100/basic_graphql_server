'use strict'
const Word = require('./word')

const Segment = `
  type Segment {
	  	segmentUniqueID: Int
		words: [Word]
	}
`

module.exports = [Segment, Word]