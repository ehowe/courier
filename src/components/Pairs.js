// @flow

import React, { useState, useEffect } from 'react'

import type { Element } from 'react'
import type {
  PairT,
} from '../types'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import Pair from './Pair'

type PropsT = {
  addPair: Function,
  deletePair: Function,
  pairs: Array<PairT>,
  setPair: Function,
  setter: Function,
}

function Pairs(props: PropsT): Element<'div'> {
  console.log(props)

  const {
    addPair,
    deletePair,
    pairs,
    setPair,
    setter,
  } = props

  useEffect(() => {
    setAllPairs(pairs)
  }, [pairs])

  const [allPairs, setAllPairs] = useState(pairs)

  return (
    <div className="tabPanel">
      {allPairs.map((pair, i) => (
        <Box key={i}>
          <Pair
            allPairs={allPairs}
            index={i}
            onDelete={deletePair}
            pair={pair}
            setPair={setPair}
            setter={setter}
          />
        </Box>
      ))}

      <Box>
        <Button
          variant="contained"
          onClick={() => addPair(pairs, setter)}
        >Add</Button>
      </Box>
    </div>
  )
}

export default Pairs
