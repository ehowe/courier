// @flow

import * as React from 'react'

import type { Element } from 'react'
import type {
  BodyT,
  PairT,
  ResponseT,
  UrlPairT,
} from '../types'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import NativeSelect from '@material-ui/core/NativeSelect'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'

import Body from './Body'
import Pairs from './Pairs'

import { ConfigContext } from './ConfigProvider'

import './Request.css'

import axios from 'axios'
import qs from 'qs'
import upperCase from 'lodash/upperCase'

const REQUESTS: Array<string> = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
]

type PropsT = {
  dispatchResponse: Function,
}

function Request(props: PropsT): Element<typeof Paper> {
  const {
    dispatchResponse,
  } = props

  const config = React.useContext(ConfigContext)

  React.useEffect(() => {
    setUrl(config.url)
  }, [config])

  const [activeTab: string, setActiveTab: Function] = React.useState('query')
  const [body: BodyT, dispatchBody: Function] = React.useReducer(bodyReducer, { 'Ace': '', 'FormUrlEncoded': [] })
  const [bodyType: string, setBodyType: Function] = React.useState('json')
  const [headers: Array<PairT>, setHeaders: Function] = React.useState([{ key: '', value: '', enabled: false }])
  const [queries: Array<PairT>, setQueries: Function] = React.useState([{ key: '', value: '', enabled: false }])
  const [selectedRequest: string, setSelectedRequest: Function] = React.useState(REQUESTS[1])
  const [url: string, setUrl: Function] = React.useState(config.url)

  function bodyReducer(state: BodyT, action: { type: string, payload: any }): BodyT {
    switch (action.type) {
      case 'updateAce':
        return { ...state, 'Ace': action.payload }
      case 'updateFormUrlEncoded':
        return { ...state, 'FormUrlEncoded': action.payload }
      default:
        throw new Error()
    }
  }

  function submitRequest(): void {
    const pairReducer = (ac: UrlPairT, pair: PairT): UrlPairT => ({ ...ac, [pair.key]: pair.value })
    const pairFilter = (pair: PairT): boolean => pair.enabled && pair.key.length > 0
    const activeQueries = queries.filter(pairFilter).reduce(pairReducer, {})
    const activeHeaders = headers.filter(pairFilter).reduce(pairReducer, {})

    let data

    if (bodyType === 'x-www-form-urlencoded') {
      const pairs = typeof body.FormUrlEncoded !== 'undefined' && body.FormUrlEncoded.filter(pairFilter).reduce(pairReducer, {})
      data = qs.stringify(pairs)
    } else {
      data = body.Ace
    }

    axios.post('http://localhost:2468/api', {
      data: {
        data,
        url,
        method: selectedRequest,
        params: activeQueries,
        headers: {
          ...activeHeaders,
          'Accept': `application/${bodyType}`,
          'Content-Type': `application/${bodyType}`,
        },
      },
    }).then((res: any) => {
      const response: ResponseT = transformResponse(res)
      dispatchResponse({ type: 'setResponse', payload: response })
    }).catch((err: any) => {
      if (err.response) {
        console.log('got response')
      } else if (err.request) {
        console.log('got request')
      } else {
        console.log('catchall')
      }
    })
  }

  function transformResponse(res: any): ResponseT {
    const headerReducer = (array: Array<PairT>, key: string): Array<PairT> => ([...array, { key: key, value: res.headers[key], enabled: true }])
    const body = JSON.stringify(res.data, null, 2)
    const headers = Object.keys(res.headers).reduce(headerReducer, [])
    return { body: { Response: body }, code: res.status, headers: headers }
  }

  function addPair(pairs, setter): void {
    const newPairs = pairs.concat({ key: '', value: '', enabled: false })

    setter(newPairs)
  }

  function deletePair(pairs, setter, index): void {
    const newPairs = [...pairs]
    newPairs.splice(index, 1)

    setter(newPairs)
  }

  function setPair(pair, setter, allPairs, index, key, value, enabled): void {
    const newPair = { ...pair, key, value, enabled }
    const newPairs = allPairs
    newPairs[index] = newPair
    setter(newPairs)
  }

  return (
    <Paper className="Request" style={{ height: '100%' }}>
      <Box style={{ height: '112px' }}>
        <Toolbar>
          <NativeSelect
            value={selectedRequest}
            onChange={(e: SyntheticEvent<HTMLInputElement>): void => setSelectedRequest(e.currentTarget.value)}
            style={{ marginRight: '1em' }}
          >
            {REQUESTS.map((request: string): React.Element<'option'> => (
              <option key={request} value={request}>{upperCase(request)}</option>
            ))}
          </NativeSelect>
          <Box component="span" style={{ width: '75%' }}>
            <TextField
              label="URL"
              style={{ width: '100%' }}
              value={url || ''}
              InputLabelProps={{ shrink: true }}
              onChange={(e: SyntheticEvent<HTMLInputElement>): void => setUrl(e.currentTarget.value) }
            />
          </Box>
          <Box component="span" justify-self="right">
            <Button onClick={submitRequest}>Send</Button>
          </Box>
        </Toolbar>
        <AppBar position="static">
          <Tabs value={activeTab}>
            <Tab onClick={(e) => setActiveTab('body')} value="body" label="Body"></Tab>
            <Tab onClick={(e) => setActiveTab('auth')} value="auth" label="Auth"></Tab>
            <Tab onClick={(e) => setActiveTab('query')} value="query" label="Query"></Tab>
            <Tab onClick={(e) => setActiveTab('headers')} value="headers" label="Headers"></Tab>
          </Tabs>
        </AppBar>
      </Box>
      <Box style={{ height: 'calc(100% - 112px)' }}>
        { activeTab === 'body' && (
          <Body
            addPair={addPair}
            body={body}
            bodyType={bodyType}
            deletePair={deletePair}
            dispatchBody={dispatchBody}
            setBodyType={setBodyType}
            setPair={setPair}
          />
        )}
        { activeTab === 'query' && (
          <Pairs
            pairs={queries}
            addPair={addPair}
            setPair={setPair}
            deletePair={deletePair}
            setter={setQueries}
          />
        )}
        { activeTab === 'headers' && (
          <Pairs
            pairs={headers}
            addPair={addPair}
            setPair={setPair}
            deletePair={deletePair}
            setter={setHeaders}
          />
        )}
      </Box>
    </Paper>
  )
}

export default Request
