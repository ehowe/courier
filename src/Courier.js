// @flow

import React, { useReducer } from 'react'
import './Courier.css'

import type { Element } from 'react'
import type { ResponseT } from './types'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import Request from './components/Request'
import Response from './components/Response'

function Courier(): Element<typeof Container> {
  const [response: ResponseT, dispatchResponse: Function] = useReducer(responseReducer, { body: { Response: '' }, headers: [] })

  function responseReducer(state: ResponseT, action: { type: string, payload: any }): ResponseT {
    switch (action.type) {
      case 'setResponse':
        return { ...state, body: action.payload.body, headers: action.payload.headers }
      default:
        throw new Error()
    }
  }

  return (
    <Container maxWidth="lg" className="Courier">
      <Grid container direction="row" spacing={2}>
        <Grid item md={6}>
          <Request dispatchResponse={dispatchResponse}/>
        </Grid>
        <Grid item md={6}>
          <Response response={response}/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Courier
