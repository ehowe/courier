// @flow

import React from 'react'
import './Courier.css'

import type { Element } from 'react'

import Container from '@material-ui/core/Container'

import Request from './components/Request'

function Courier(): Element<typeof Container> {
  return (
    <Container maxWidth="lg" className="Courier">
      <Request />
    </Container>
  )
}

export default Courier
