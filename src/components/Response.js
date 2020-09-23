import * as React from 'react'

import type {
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

  function getBodyType(): string {
    return 'json'
  }

  const [body, setBody] = React.useState(response.body)
  const [headers, setHeaders] = React.useState(response.headers)

  React.useEffect(() => {
    setBody(response.body)
  }, [response.body])

  React.useEffect(() => {
    setHeaders(response.headers)
  }, [response.headers])

  console.log(headers)

  const [activeTab: string, setActiveTab: Function] = React.useState('body')

  return (
    <Paper className="Response">
      <Toolbar>
        <Box component="span" style={{ height: '2rem' }}>
        </Box>
      </Toolbar>
      <Box>
        <AppBar position="static">
          <Tabs value={activeTab}>
            <Tab onClick={(e) => setActiveTab('body')} value="body" label="Body"></Tab>
            <Tab onClick={(e) => setActiveTab('headers')} value="headers" label="Headers"></Tab>
          </Tabs>
        </AppBar>
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
