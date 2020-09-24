// @flow

import * as React from 'react'
import type { Element } from 'react'

import type {
  BodyTypeT,
  PairT,
  ResponseT,
} from '../types'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'

import Body from './Body'
import Pairs from './Pairs'

type PropsT = {
  response: ResponseT,
}

function Response(props: PropsT): Element<typeof Paper> {
  const {
    response,
  } = props

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

  React.useEffect((): void => {
    setBody(response.body)
  }, [response.body])

  React.useEffect((): void => {
    setHeaders(response.headers)
  }, [response.headers])

  return (
    <Paper className="Response" style={{ height: '100%' }}>
      <Box style={{ height: '112px' }}>
        <Toolbar>
          <Box component="span" style={{ height: '2rem' }}>
          </Box>
        </Toolbar>
        <AppBar position="static">
          <Tabs value={activeTab}>
            <Tab onClick={(e) => setActiveTab('body')} value="body" label="Body"></Tab>
            <Tab onClick={(e) => setActiveTab('headers')} value="headers" label="Headers"></Tab>
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
