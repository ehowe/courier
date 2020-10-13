// @flow

import React, { Fragment, useState } from 'react'
import classNames from 'classnames'

import type { Element } from 'react'
import type {
  PairT,
} from '../types'

import DeleteButton from './DeleteButton'

import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

type PropsT = {
  allPairs: Array<PairT>,
  index: number,
  onDelete?: Function,
  pair: PairT,
  readOnly?: boolean,
  setPair?: Function,
  setter?: Function,
}

function Pair(props: PropsT): Element<typeof Fragment> {
  const {
    allPairs,
    index,
    onDelete,
    pair,
    readOnly = false,
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
      <TextField className={classNames('pairText', { disabled: readOnly })} disabled={readOnly} placeholder="Key" label="Key" defaultValue={key} onChange={(e) => setKey(e.target.value)} onBlur={updatePair}/>
      <TextField className={classNames('pairText', { disabled: readOnly })}disabled={readOnly} placeholder="Value" label="Value" defaultValue={value} onChange={(e) => setValue(e.target.value) } onBlur={updatePair}/>
      { !readOnly && (
        <Fragment>
          <Checkbox className={classNames('pairAction')} checked={enabled} onChange={(e) => setEnabled(!enabled)} onBlur={updatePair}/>
          <DeleteButton className={classNames('pairAction')} onDelete={() => onDelete(allPairs, setter, index)} value={key + '/' + value} Element="span"/>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Pair
