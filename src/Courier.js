// @flow

import React, { useReducer } from 'react'
import './Courier.css'

import type { Element } from 'react'
import type { ResponseT } from './types'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import ConfigProvider from './components/ConfigProvider'
import Request from './components/Request'
import Response from './components/Response'
import Workspaces from './components/Workspaces'

import { responseTemplate } from './configTemplate'

function Courier(): Element<typeof ConfigProvider> {
  const [response: ResponseT, dispatchResponse: Function] = useReducer(responseReducer, responseTemplate)

  function responseReducer(state: ResponseT, action: { type: string, payload: any }): ResponseT {
    switch (action.type) {
      case 'setResponse':
        return { ...state, body: action.payload.body, headers: action.payload.headers }
      default:
        throw new Error()
    }
  }

  return (
    <ConfigProvider>
      <Container className="Courier" disableGutters maxWidth={false} style={{ flex: '1 1 auto', height: '100%' }}>
        <Grid container direction="row" spacing={2} wrap="nowrap" style={{ height: '100%' }}>
          <Grid item md={2} style={{ height: '100%' }}>
            <Workspaces />
          </Grid>
          <Grid item md={5} style={{ height: '100%' }}>
            <Request dispatchResponse={dispatchResponse}/>
          </Grid>
          <Grid item md={5} style={{ height: '100%' }}>
            <Response response={response} />
          </Grid>
        </Grid>
      </Container>
    </ConfigProvider>
  )
}

export default Courier
