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
  addPair?: Function,
  deletePair?: Function,
  pairs: Array<PairT>,
  readOnly?: boolean,
  setPair?: Function,
  setter?: Function,
}

function Pairs(props: PropsT): Element<'div'> {
  const {
    addPair,
    deletePair,
    pairs: pairsParam,
    readOnly = false,
    setPair,
    setter,
  } = props

  useEffect(() => {
    setAllPairs(pairsParam)
  }, [pairsParam])

  const [pairs, setAllPairs] = useState(pairsParam)

  console.log(pairs)

  return (
    <div className="tabPanel" style={{ maxWidth: '100%' }}>
      {pairs.map((pair, i) => (
        <Box key={i}>
          <Pair
            allPairs={pairs}
            index={i}
            onDelete={deletePair}
            pair={pair}
            readOnly={readOnly}
            setPair={setPair}
            setter={setter}
          />
        </Box>
      ))}

      { !readOnly && (
        <Box>
          <Button variant="contained" onClick={() => typeof addPair !== 'undefined' && addPair(pairs, setter)}>Add</Button>
        </Box>
      )}
    </div>
  )
}

export default Pairs
