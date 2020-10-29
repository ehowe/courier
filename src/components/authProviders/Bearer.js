import React, { useState } from 'react'

import type { Element } from 'react'

import type { BearerAuthT } from '../../types'

import TextField from '@material-ui/core/TextField'

type PropsT = {
  auth: BearerAuthT,
  onChange: Function,
}

function Bearer(props: PropsT): Element<'div'> {
  const {
    auth,
    onChange,
  } = props

  const [token: string, setToken: Function] = useState(auth.token)
  const [prefix: string, setPrefix: Function] = useState(auth.prefix)

  function handleTokenChange(e: SyntheticEvent<HTMLInputElement>): void {
    setToken(e.currentTarget.value)
    onChange({ type: 'Bearer', value: { prefix, token: e.currentTarget.value } })
  }

  function handlePrefixChange(e: SyntheticEvent<HTMLInputElement>): void {
    setPrefix(e.currentTarget.value)
    onChange({ type: 'Bearer', value: { token, prefix: e.currentTarget.value } })
  }

  return (
    <div>
      <TextField label="Token" defaultValue={token} onBlur={handleTokenChange} />
      <TextField label="Prefix" defaultValue={prefix} onBlur={handlePrefixChange} />
    </div>
  )
}

export default Bearer
