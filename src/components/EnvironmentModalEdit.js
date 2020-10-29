import React, { useContext, useEffect, useState } from 'react'

import type { Element } from 'react'

import type { EnvironmentT } from '../types'

import Pairs from './Pairs'

import {
  ConfigContext,
  ConfigDispatchContext,
  PrivateConfigDispatchContext,
} from './ConfigProvider'

type PropsT = {
  allEnvironments: Array<EnvironmentT>,
  environment: EnvironmentT
}

function EnvironmentModalEdit(props: PropsT): Element<'div'> {
  const {
    allEnvironments,
    environment,
  } = props

  const config = useContext(ConfigContext)
  const dispatchConfig = useContext(ConfigDispatchContext)
  const dispatchPrivateConfig = useContext(PrivateConfigDispatchContext)

  const [pairs, setPairs] = useState(environment.configuration)
  const [index, setIndex] = useState(allEnvironments.findIndex(e => e.name === environment.name))

  useEffect(() => {
    setPairs(environment.configuration)
  }, [environment.configuration])

  useEffect(() => {
    setIndex(allEnvironments.findIndex(e => e.name === environment.name))
  }, [allEnvironments, environment.name])

  function setPublicEnvironments(newPairs): void {
    const newEnvironments = [...allEnvironments]
    newEnvironments[index].configuration = newPairs
    dispatchConfig({ type: 'setEnvironments', payload: newEnvironments, updateConfig: true })
  }

  function setPrivateEnvironments(newPairs): void {
    const newEnvironments = [...allEnvironments]
    newEnvironments[index].configuration = newPairs
    dispatchPrivateConfig({ type: 'setEnvironments', payload: newEnvironments, updateConfig: true, publicState: config })
  }

  function addPair(pairs, setter, isPrivate): void {
    const newPairs = pairs.concat({ key: '', value: '', enabled: false })

    if (isPrivate) {
      setPrivateEnvironments(newPairs)
    } else {
      setPublicEnvironments(newPairs)
    }

    setter(newPairs)
  }

  function deletePair(pairs, setter, index, isPrivate): void {
    const newPairs = [...pairs]

    newPairs.splice(index, 1)

    if (isPrivate) {
      setPrivateEnvironments(newPairs)
    } else {
      setPublicEnvironments(newPairs)
    }

    setter(newPairs)
  }

  function setPair(pair, setter, allPairs, index, key, value, enabled, isPrivate): void {
    const newPair = { ...pair, key, value, enabled }
    const newPairs = [...allPairs]
    newPairs[index] = newPair

    if (isPrivate) {
      setPrivateEnvironments(newPairs)
    } else {
      setPublicEnvironments(newPairs)
    }

    setter(newPairs)
  }

  return (
    <div>
      <Pairs
        addPair={(pairs, setter) => addPair(pairs, setter, environment.private)}
        deletePair={(pairs, setter, index) => deletePair(pairs, setter, index, environment.private)}
        pairs={pairs}
        placeholder="No environment variables found. Add one below."
        setPair={(pair, setter, allPairs, index, key, value, enabled) => setPair(pair, setter, allPairs, index, key, value, enabled, environment.private)}
        setter={setPairs}
        styles={{ textAlign: 'right' }}
      />
    </div>
  )
}

export default EnvironmentModalEdit
