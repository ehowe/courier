// @flow

import React, { useEffect, useState } from 'react'

import type { Element } from 'react'

import type { BasicAuthT } from '../../types'

import TextField from '@material-ui/core/TextField'

type PropsT = {
  auth: BasicAuthT,
  onChange: Function,
}

function Basic(props: PropsT): Element<'div'> {
  const {
    auth,
    onChange,
  } = props

  const [username: string, setUsername: Function] = useState(auth.username)
  const [password: string, setPassword: Function] = useState(auth.password)

  useEffect(() => {
    setUsername(auth.username)
    setPassword(auth.password)
  }, [auth])

  function handleUsernameChange(e: SyntheticEvent<HTMLInputElement>): void {
    setUsername(e.currentTarget.value)
    onChange({ type: 'Basic', value: { password, username: e.currentTarget.value } })
  }

  function handlePasswordChange(e: SyntheticEvent<HTMLInputElement>): void {
    setPassword(e.currentTarget.value)
    onChange({ type: 'Basic', value: { username, password: e.currentTarget.value } })
  }

  return (
    <div>
      <TextField label="Username" defaultValue={username} onBlur={handleUsernameChange} />
      <TextField label="Password" defaultValue={password} onBlur={handlePasswordChange} type="password"/>
    </div>
  )
}

export default Basic
