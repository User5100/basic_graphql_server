'use strict'
require('dotenv').config()
const rp = require('request-promise')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function getTranscriptById(args) {

  return rp({
    uri: `${process.env.PROTOCOL}://${process.env.USER}:${process.env.PASS}@${process.env.HOSTNAME}:${process.env.PORT}/vrxServlet/ws/VRXService/vrxServlet/getDocument/1/1/${args.id}`
  })
  .then(transcript => JSON.parse(transcript).Item)
  .then(transcript => {
    
    let srts

    if(transcript.SRTs.words) { //If SRTs is an Object
      srts = [transcript.SRTs] //Ensure SRTs is always an iterable
    } else { //If SRTs is an Array
      // Handle if segment.words is an Object rather than an Array to prevent error
      srts = transcript.SRTs.map(segment => {
        if(segment.words.id) { //Check if words is an Object rather than an Array
          return Object.assign({}, segment, { words: [segment.words] })
        } else {
          return segment
        }
      })
    }

    return Object.assign({}, transcript, { SRTs: srts })
  })
  .then(transcript => {
    //Fix nested tags Object
    return Object.assign({}, transcript, { tags: transcript.tags.tags })
  })
}

function editTranscriptById (args) {

  let revisedSegments = []
  let previousSpeakerNo = null
  let segmentNo = -1

  args.words.map((wordObj, i) => {

		wordObj = Object.assign({}, wordObj, { speakerLabel: `Speaker ${wordObj.speakerNo}`})
          
    if (previousSpeakerNo === wordObj.speakerNo) { 
      // then push to existing words in current segment
      revisedSegments[segmentNo].words.push(wordObj)

    } else { 
      // speakerNo has changed so create a new segment or it's the first element
      segmentNo = segmentNo + 1

      revisedSegments[segmentNo] = {
        words: [wordObj]
      }

      previousSpeakerNo = wordObj.speakerNo
    }
  })

  let options = {
    method: 'POST',
    uri: `${process.env.PROTOCOL}://${process.env.USER}:${process.env.PASS}@${process.env.HOSTNAME}:${process.env.PORT}/vrxServlet/ws/VRXService/vrxServlet/transcript/edit/${args.clientID}`,
    body: {
      Item: {
        id: args.id,
        recordings: {
          id: args.id
        },
        SRTs: revisedSegments
      }
    },
    json: true
  }

  return rp(options)
    .then(function(body) {
      console.log('Success')
      return getTranscriptById({ id: args.id })	
    })
    .catch(function(err) {
      console.log('Error response from IV server from POST request', err)
    })
}

module.exports = { getTranscriptById, editTranscriptById }
