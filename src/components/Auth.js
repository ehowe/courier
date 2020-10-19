// @flow

import React, { useEffect, useContext, useState } from 'react'

import type { Element } from 'react'

import type { BasicAuthT } from '../types'

import NativeSelect from '@material-ui/core/NativeSelect'

import { authTemplate } from '../configTemplate'
import { ConfigContext, ConfigDispatchContext } from './ConfigProvider'
import * as AuthProviders from './authProviders'

const authTypes: Array<string> = [
  'None',
  'Basic',
  'Bearer',
  'Digest',
]

function Auth(): Element<'div'> {
  const config: any = useContext(ConfigContext)
  const dispatchConfig: Function = useContext(ConfigDispatchContext)
  const [activeProvider: string, setActiveProvider: Function] = useState(authTypes[0])
  const [auth, setAuth: Function] = useState(authTemplate)

  useEffect((): void => {
    setActiveProvider(config.activeRequest.activeAuthProvider)
    setAuth(config.activeRequest.auth)
  }, [config.activeRequest])

  function handleAuthTypeChange(e: SyntheticEvent<HTMLInputElement>): void {
    setActiveProvider(e.currentTarget.value)
    dispatchConfig({ type: 'updateRequestAuthProvider', payload: e.currentTarget.value, updateConfig: true })
  }

  function handleAuthChange({ type, value }: { type: string, value: BasicAuthT }): void {
    const newAuth = { ...auth, [type]: value }

    dispatchConfig({ type: 'updateRequestAuth', payload: newAuth, updateConfig: true })
  }

  return (
    <div>
      <NativeSelect
        value={activeProvider}
        onChange={handleAuthTypeChange}
      >
        { authTypes.map((type: string): Element<'option'> => (
          <option key={type} value={type}>{type}</option>
        ))}
      </NativeSelect>
      { activeProvider === 'Basic' && <AuthProviders.Basic onChange={handleAuthChange} auth={auth.Basic}/> }
      { activeProvider === 'Bearer' && <AuthProviders.Bearer onChange={handleAuthChange} auth={auth.Bearer} /> }
      { activeProvider === 'Digest' && <AuthProviders.Digest onChange={handleAuthChange} auth={auth.Digest} /> }
    </div>
  )
}

export default Auth
