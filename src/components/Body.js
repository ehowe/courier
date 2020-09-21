// @flow

import React from 'react'
import AceEditor from 'react-ace'
import toUpper from 'lodash/toUpper'

import type { Element } from 'react'
import type {
  BodyT,
  BodyTypeT,
} from '../types'

import Pairs from './Pairs'

import Box from '@material-ui/core/Box'
import NativeSelect from '@material-ui/core/NativeSelect'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/webpack-resolver'

const ACE_BODY_TYPES = [
  'json',
  'xml',
  'yaml',
]

const OTHER_BODY_TYPES = [
  'x-www-form-urlencoded',
]

type PropsT = {
  addPair: Function,
  body: BodyT,
  bodyType: BodyTypeT,
  deletePair: Function,
  dispatchBody: Function,
  setBodyType: Function,
  setPair: Function,
}

function Body(props: PropsT): Element<typeof Box> {
  const {
    addPair,
    body,
    bodyType,
    deletePair,
    dispatchBody,
    setBodyType,
    setPair,
  } = props

  function changeBody(type, newBody): void {
    dispatchBody({ type, payload: newBody })
  }

  function pairSetter(newBody): void {
    changeBody('updateFormUrlEncoded', newBody)
  }

  return (
    <Box>
      <NativeSelect value={bodyType} onChange={(e) => { console.log(e); setBodyType(e.target.value) }}>
        {ACE_BODY_TYPES.concat(OTHER_BODY_TYPES).map(type => (
          <option key={type} value={type}>{toUpper(type)}</option>
        ))}
      </NativeSelect>

      { ACE_BODY_TYPES.includes(bodyType) && (
        <AceEditor
          defaultValue={body.Ace}
          mode={bodyType}
          onBlur={(e) => changeBody('updateAce', e.target.value)}
          theme="github"
        />
      )}

      { bodyType === 'x-www-form-urlencoded' && (
        <Pairs
          pairs={body.FormUrlEncoded}
          addPair={addPair}
          setPair={setPair}
          deletePair={deletePair}
          setter={pairSetter}
        />
      )}
    </Box>
  )
}

export default Body
