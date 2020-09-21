// @flow

import * as React from 'react'

import type { Element } from 'react'
import type {
  BodyT,
  PairT,
  UrlPairT,
} from '../types'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import NativeSelect from '@material-ui/core/NativeSelect'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'

import Body from './Body'
import Pairs from './Pairs'

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

function Request(): Element<typeof Paper> {
  const [selectedRequest: string, setSelectedRequest: Function] = React.useState(REQUESTS[1])
  const [url: string, setUrl: Function] = React.useState('https://jsonplaceholder.typicode.com/posts')
  const [queries: Array<PairT>, setQueries: Function] = React.useState([{ key: '', value: '', enabled: false }])
  const [headers: Array<PairT>, setHeaders: Function] = React.useState([{ key: '', value: '', enabled: false }])
  const [body: BodyT, dispatchBody: Function] = React.useReducer(bodyReducer, { 'Ace': '', 'FormUrlEncoded': [] })
  const [bodyType: string, setBodyType: Function] = React.useState('json')
  const [activeTab: string, setActiveTab: Function] = React.useState('query')

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

    const client = axios.create({ baseURL: url, headers: { ...activeHeaders, 'Accept': `application/${bodyType}`, 'Content-Type': `application/${bodyType}` } })

    let data

    if (bodyType === 'x-www-form-urlencoded') {
      const pairs = body.FormUrlEncoded.filter(pairFilter).reduce(pairReducer, {})
      data = qs.stringify(pairs)
    } else {
      data = body.Ace
    }

    client.request({
      method: selectedRequest,
      params: activeQueries,
      data: data,
    }).then((res: any) => console.log(res))
      .catch((err: any) => {
        if (err.response) {
          console.log('got response')
        } else if (err.request) {
          console.log('got request')
        } else {
          console.log('catchall')
        }
      })
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
    <Paper className="Request">
      <Box component="span">
        <NativeSelect
          value={selectedRequest}
          onChange={(e: SyntheticEvent<HTMLInputElement>): void => setSelectedRequest(e.currentTarget.value)}
        >
          {REQUESTS.map((request: string): React.Element<'option'> => (
            <option key={request} value={request}>{upperCase(request)}</option>
          ))}
        </NativeSelect>
      </Box>
      <Box component="span">
        <TextField label="Enter URL" onChange={(e: SyntheticEvent<HTMLInputElement>): void => setUrl(e.currentTarget.value) } defaultValue={url}/>
      </Box>
      <Box component="span">
        <Button onClick={submitRequest}>Send</Button>
      </Box>
      <Box>
        <AppBar position="static">
          <Tabs value={activeTab}>
            <Tab onClick={(e) => setActiveTab('body')} value="body" label="Body"></Tab>
            <Tab onClick={(e) => setActiveTab('auth')} value="auth" label="Auth"></Tab>
            <Tab onClick={(e) => setActiveTab('query')} value="query" label="Query"></Tab>
            <Tab onClick={(e) => setActiveTab('headers')} value="headers" label="Headers"></Tab>
          </Tabs>
        </AppBar>
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
