// @flow

import React, { Fragment, useState } from 'react'

import type { Element } from 'react'
import type {
  PairT,
} from '../types'

import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone'

type PropsT = {
  allPairs: Array<PairT>,
  index: number,
  onDelete: Function,
  pair: PairT,
  setPair: Function,
  setter: Function,
}

function Pair(props: PropsT): Element<typeof Fragment> {
  const {
    allPairs,
    index,
    onDelete,
    pair,
    setPair,
    setter,
  } = props

  const [key, setKey] = useState(pair.key)
  const [value, setValue] = useState(pair.value)
  const [enabled, setEnabled] = useState(pair.enabled)

  function updatePair() {
    setPair(pair, setter, allPairs, index, key, value, enabled)
  }

  return (
    <Fragment>
      <TextField placeholder="Key" label="Key" defaultValue={key} onChange={(e) => setKey(e.target.value)} onBlur={updatePair}/>
      <TextField placeholder="Value" label="Value" defaultValue={value} onChange={(e) => setValue(e.target.value) } onBlur={updatePair}/>
      <Checkbox checked={enabled} onChange={(e) => setEnabled(!enabled)} onBlur={updatePair}/>
      <IconButton color="primary" aria-label="Delete" component="span" onClick={() => onDelete(allPairs, setter, index)}>
        <DeleteForeverTwoToneIcon />
      </IconButton>
    </Fragment>
  )
}

export default Pair
