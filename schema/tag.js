'use strict'
const Position = require('./position')

const Tag = `
  type Tag {
		id: Int!
		length: Float
		occurrence: Int
		position: Position
		seekTime: Float
		tag: String
		tagID: Int
  }
`

module.exports = [Tag, Position]