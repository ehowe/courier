// @flow

import * as React from 'react'
import './Environments.css'

import capitalize from 'lodash/capitalize'
import classNames from 'classnames'

import type { Element } from 'react'
import type { EnvironmentT } from '../types'

import {
  ConfigContext,
  ConfigDispatchContext,
  PrivateConfigContext,
} from './ConfigProvider'

import EnvironmentModal from './EnvironmentModal'

import InputLabel from '@material-ui/core/InputLabel'
import ListSubheader from '@material-ui/core/ListSubheader'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

type PropsT = {}

function Environments(props: PropsT): Element<'div'> {
  const [open: boolean, setOpen: Function] = React.useState(false)
  const [defaultEnvironment, setDefaultEnvironment] = React.useState('')
  const [environments, setEnvironments] = React.useState([])
  const [privateEnvironments, setPrivateEnvironments] = React.useState([])
  const [defaultEnvironmentMissing: boolean, setDefaultEnvironmentMissing: Function] = React.useState(false)
  const config = React.useContext(ConfigContext)
  const privateConfig = React.useContext(PrivateConfigContext)
  const dispatchConfig = React.useContext(ConfigDispatchContext)

  const allEnvironments = React.useCallback((): Array<EnvironmentT> => {
    const joinedEnvironments = [...environments, ...privateEnvironments]
    const names = joinedEnvironments.map((environment: any): EnvironmentT => {
      return { name: environment.name, missing: false, private: environment.private, configuration: environment.configuration }
    })

    const defaultEnvironment = names.find(environment => environment.name === config.activeWorkspace.defaultEnvironment)

    if (!defaultEnvironment) {
      names.push({ name: config.activeWorkspace.defaultEnvironment, missing: true, private: true, configuration: [] })
    }

    return names
  }, [config.activeWorkspace, environments, privateEnvironments])

  const getDefaultEnvironmentMissing = React.useCallback((): boolean => {
    const defaultEnvironmentObject = allEnvironments().find((environment: EnvironmentT) => environment.name === defaultEnvironment)

    if (!defaultEnvironmentObject) {
      return true
    }

    if (Object.prototype.hasOwnProperty.call(defaultEnvironmentObject, 'missing')) {
      // $FlowExpectedError
      return defaultEnvironmentObject.missing
    }

    return true
  }, [allEnvironments, defaultEnvironment])

  React.useEffect(() => {
    setDefaultEnvironment(config.activeWorkspace.defaultEnvironment)
    setEnvironments(config.activeWorkspace.environments)
  }, [config.activeWorkspace])

  React.useEffect(() => {
    setDefaultEnvironmentMissing(getDefaultEnvironmentMissing())
  }, [getDefaultEnvironmentMissing])

  React.useEffect(() => {
    if (!privateConfig.workspaces) {
      return
    }

    if (!config.activeWorkspace.name) {
      return
    }

    const privateWorkspace = privateConfig.workspaces.find(workspace => workspace.name === config.activeWorkspace.name)

    setPrivateEnvironments(privateWorkspace.environments)
  }, [config.activeWorkspace, privateConfig])

  function handleEnvironmentSelect(e: SyntheticEvent<HTMLInputElement>): void {
    if (e.currentTarget.dataset.value) {
      dispatchConfig({ type: 'setDefaultEnvironment', payload: e.currentTarget.dataset.value, updateConfig: true })
    }
  }

  return (
    <div>
      <EnvironmentModal
        open={open}
        privateEnvironments={allEnvironments().filter(environment => environment.private)}
        publicEnvironments={allEnvironments().filter(environment => !environment.private)}
        setOpen={setOpen}
      />
      <InputLabel id="select-environment-label">Active Environment</InputLabel>
      <Select
        labelId="select-environment-label"
        onChange={handleEnvironmentSelect}
        value={defaultEnvironment}
        className={classNames('EnvironmentDropdown', { defaultOptionMissing: defaultEnvironmentMissing })}
      >
        <ListSubheader>Select Environment</ListSubheader>
        { allEnvironments().map((environment: EnvironmentT, index: number): Element<'MenuItem'> => (
          <MenuItem
            key={index}
            value={environment.name}
            className={classNames('EnvironmentDropdown', { missing: environment.missing })}
          >{capitalize(environment.name)}</MenuItem>
        ))}
        <ListSubheader>General</ListSubheader>
        <MenuItem onClick={() => setOpen(true)}>Manage Environments</MenuItem>
      </Select>
    </div>
  )
}

export default Environments
