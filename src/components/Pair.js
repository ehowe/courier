// @flow

import React, { Fragment, useCallback, useReducer, useState } from 'react'
import classNames from 'classnames'
import debounce from 'lodash/debounce'

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

  const debouncedSave = useCallback(debounce((key, value, enabled) => {
    if (setPair) {
      console.log('key, value, enabled', key, value, enabled)
      setPair(pair, setter, allPairs, index, key, value, enabled)
    }
  }, 1000), [])

  const reducer = (state: PairT, action: { type: string, payload: string | boolean }): PairT => {
    switch (action.type) {
      case 'setKey':
        debouncedSave(action.payload, state.value, state.enabled)
        // $FlowExpectedError
        return { ...state, key: action.payload }
      case 'setValue':
        debouncedSave(state.key, action.payload, state.enabled)
        // $FlowExpectedError
        return { ...state, value: action.payload }
      case 'setEnabled':
        debouncedSave(state.key, state.value, action.payload)
        // $FlowExpectedError
        return { ...state, enabled: action.payload }
      default:
        throw new Error()
    }
  }

  const { key, value, enabled } = pair

  const [state, dispatch] = useReducer(reducer, { key, value, enabled })
  const [valid, setValid] = useState(true)

  const updatePair = ({ type, payload }: { type: string, payload: string | boolean }) => {
    let pairValid = true

    if (type === 'setKey') {
      pairValid = !allPairs.some(pair => pair.key !== state.key && pair.key === payload)

      setValid(pairValid)
    }

    if (pairValid) {
      dispatch({ type, payload })
    }
  }

  return (
    <Fragment>
      <TextField
        className={classNames('pairText', { disabled: readOnly })}
        defaultValue={state.key}
        disabled={readOnly}
        error={!valid}
        label="Key"
        onChange={(e) => updatePair({ type: 'setKey', payload: e.currentTarget.value })}
        placeholder="Key"
      />
      <TextField
        className={classNames('pairText', { disabled: readOnly })}
        defaultValue={state.value}
        disabled={readOnly}
        label="Value"
        onChange={(e) => updatePair({ type: 'setValue', payload: e.currentTarget.value })}
        placeholder="Value"
      />
      { !readOnly && (
        <Fragment>
          <Checkbox
            checked={state.enabled}
            className={classNames('pairAction')}
            onChange={(e) => updatePair({ type: 'setEnabled', payload: !state.enabled })}
          />
          <DeleteButton
            Element="span"
            className={classNames('pairAction')}
            onDelete={() => onDelete && onDelete(allPairs, setter, index)}
            value={state.key + '/' + state.value}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

export default Pair
