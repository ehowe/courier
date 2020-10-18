// @flow

import * as React from 'react'
import type { Element } from 'react'
import { getReasonPhrase } from 'http-status-codes'

import type {
  BodyTypeT,
  PairT,
  ResponseT,
} from '../types'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'

import { responseTemplate } from '../configTemplate'
import { ConfigContext } from './ConfigProvider'
import Body from './Body'
import Pairs from './Pairs'

type PropsT = {
  response: ResponseT,
}

const colorMap = {
  '2': 'green',
  '3': 'blue',
  '4': 'orange',
  '5': 'red',
}

const sizeLabels: Array<string> = [
  'Bytes',
  'KB',
  'MB',
  'GB',
  'TB',
]

const timeLabels: Array<string> = [
  'Milliseconds',
  'Second',
  'Seconds',
  'Minute',
  'Minutes',
]

const prettySize = (size: number): string => {
  const index: number = Math.floor(Math.log10(size) / 3)
  let humanReadableSize: number = size

  while (humanReadableSize / 1024 > 1) {
    humanReadableSize = humanReadableSize / 1024
  }

  return `${humanReadableSize} ${sizeLabels[index]}`
}

const prettyTimeLabel = (timeInMs) => {
  if (timeInMs < 1000) { return timeLabels[0] }
  if (timeInMs === 1000) { return timeLabels[1] }
  if (timeInMs < 60000) { return timeLabels[2] }
  if (timeInMs === 60000) { return timeLabels[3] }
  if (timeInMs < 3600000) { return timeLabels[4] }
  if (timeInMs === 3600000) { return timeLabels[5] }
}

const prettyTime = (timeInMs) => {
  let humanReadableTime = timeInMs

  while (humanReadableTime / 1000 > 1) {
    humanReadableTime = humanReadableTime / 1000
  }

  return `${humanReadableTime} ${prettyTimeLabel(timeInMs)}`
}

function Response(props: PropsT): Element<typeof Paper> {
  const {
    response: responseProp,
  } = props

  const [response, setResponse] = React.useState(responseTemplate)
  const config = React.useContext(ConfigContext)

  React.useEffect(() => {
    if (typeof config.activeRequest !== 'undefined') {
      setResponse(config.activeRequest.response)
    }
  }, [config.activeRequest])

  React.useEffect(() => {
    setResponse(responseProp)
  }, [responseProp])

  function getBodyType(): BodyTypeT {
    const contentTypeHeader: PairT = response.headers.find((header: PairT): boolean => header.key === 'content-type')

    if (!contentTypeHeader) {
      return 'json' // default to json so Ace doesn't explode
    }

    const rawValue: string = contentTypeHeader.value.split(';')[0]
    const type: string = rawValue.split('/')[1]
    return type
  }

  const [activeTab: string, setActiveTab: Function] = React.useState('body')
  const [body, setBody] = React.useState(response.body)
  const [headers: Array<PairT>, setHeaders: Function] = React.useState(response.headers)
  const [reason: string, setReason: Function] = React.useState('')
  const [codeColor: ?string, setCodeColor: Function] = React.useState()
  const [length: number, setLength: Function] = React.useState(0)
  const [time: ?string, setTime: Function] = React.useState()

  React.useEffect((): void => {
    setBody(response.body)
  }, [response.body])

  React.useEffect((): void => {
    setHeaders(response.headers)

    const responseTimeHeader = response.headers.find(header => header.key === 'response-time')
    if (responseTimeHeader) {
      setTime(responseTimeHeader.value)
    }
  }, [response.headers])

  React.useEffect((): void => {
    let reason

    try {
      reason = getReasonPhrase(response.code)
    } catch {
      reason = 'Unknown'
    }

    setReason(reason)
    if (typeof response.code !== 'undefined') {
      setCodeColor(colorMap[response.code.toString().charAt(0)] || 'grey')
    }
  }, [response.code])

  React.useEffect(() => {
    const contentLengthHeader = response.headers.find(header => header.key.toLowerCase() === 'content-length')

    if (contentLengthHeader) {
      setLength(prettySize(parseInt(contentLengthHeader.value)))
    }
  }, [response.headers])

  return (
    <Paper className="Response" style={{ height: '100%' }}>
      <Box style={{ height: '112px', width: '100%' }}>
        <Toolbar style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
          <Box component="span" style={{ height: '2rem', width: '100%', display: 'flex' }}>
            <Chip
              variant="outlined"
              label={ `${response.code} ${reason}` }
              style={{ border: `1px solid ${codeColor}`, width: '25%', color: codeColor, fontWeight: 'bolder', float: 'left' }}
            />
            { time && (
              <Chip
                variant="outlined"
                label={prettyTime(time)}
                style={{ fontWeight: 'bolder', width: '25%', margin: '0 auto' }}
              />
            )}
            { length && (
              <Chip
                variant="outlined"
                label={length}
                style={{ fontWeight: 'bolder', width: '25%', float: 'right' }}
              />
            )}
          </Box>
        </Toolbar>
        <AppBar position="static">
          <Tabs value={activeTab}>
            <Tab style={{ minWidth: '50%' }} onClick={(e) => setActiveTab('body')} value="body" label="Body"></Tab>
            <Tab style={{ minWidth: '50%' }} onClick={(e) => setActiveTab('headers')} value="headers" label="Headers"></Tab>
          </Tabs>
        </AppBar>
      </Box>
      <Box style={{ height: 'calc(100% - 112px)' }}>
        { activeTab === 'body' && (
          <Body
            body={body}
            bodyType={getBodyType()}
            readOnly
          />
        )}
        { activeTab === 'headers' && (
          <Pairs
            allPairs={headers}
            pairs={headers}
            readOnly
          />
        )}
      </Box>
    </Paper>
  )
}

export default Response
