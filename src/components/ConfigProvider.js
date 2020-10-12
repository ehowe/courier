import React, { createContext, useEffect, useReducer } from 'react'

import axios from 'axios'
import omit from 'lodash/omit'

import { configTemplate, workspaceTemplate, requestTemplate } from '../configTemplate'

export const ConfigContext = createContext({})
export const ConfigDispatchContext = createContext(undefined)

async function getConfig() {
  const response = await axios.get('http://localhost:2468/config')
  return response.data
}

async function putConfig(newConfig) {
  const response = await axios.put('http://localhost:2468/config', newConfig)
  return response.data
}

function getCurrentWorkspaceIndex(currentState: any): number {
  return currentState.workspaces.findIndex(workspace => workspace.name === currentState.activeWorkspace.name)
}

function updateWorkspace(currentState: any, attribute: string, payload: any): any {
  const newState = currentState
  const attributes = { ...newState.activeWorkspace, [attribute]: payload }

  newState.workspaces[getCurrentWorkspaceIndex(currentState)] = attributes
  newState.activeWorkspace = attributes

  return newState
}

function addRequestToWorkspace(currentState: any, payload: { name: string, method: string }): any {
  const workspace = currentState.workspaces[getCurrentWorkspaceIndex(currentState)]

  const requests = [...workspace.requests, { ...requestTemplate, name: payload.name, method: payload.method }]

  const newState = updateWorkspace(currentState, 'defaultRequest', payload.name)
  return updateWorkspace(newState, 'requests', requests)
}

function setDefaultRequest(currentState: any, payload: string): any {
  const newState = updateWorkspace(currentState, 'defaultRequest', payload)
  const workspace = newState.workspaces[getCurrentWorkspaceIndex(newState)]

  newState.activeRequest = workspace.requests.find(request => request.name === workspace.defaultRequest)

  return newState
}

function configReducer(state: any, action: { type?: string, payload: any, updateConfig?: boolean }): any {
  let newState = { ...state }

  switch (action.type) {
    case 'createNewWorkspace':
      newState = { ...newState, workspaces: [...state.workspaces, { ...workspaceTemplate, name: action.payload }] }
      break
    case 'createNewRequest':
      console.log('creating request')
      newState = addRequestToWorkspace(newState, action.payload)
      break
    case 'setActiveRequest':
      newState = { ...newState, activeRequest: action.payload }
      break
    case 'setActiveWorkspace':
      newState = { ...newState, activeWorkspace: action.payload }
      break
    case 'setDefaultRequest':
      newState = setDefaultRequest(newState, action.payload)
      break
    case 'setDefaultWorkspace':
      newState = { ...newState, defaultWorkspace: action.payload }
      break
    case 'updateWorkspaceHeaders':
      newState = updateWorkspace(newState, 'headers', action.payload)
      break
    case 'updateWorkspaceQueries':
      newState = updateWorkspace(newState, 'queries', action.payload)
      break
    case 'updateWorkspaceUrl':
      newState = updateWorkspace(newState, 'url', action.payload)
      break
    default:
      newState = { ...newState, ...action.payload, activeWorkspace: workspaceTemplate, activeRequest: requestTemplate }
  }

  if (action.updateConfig) {
    console.log('updating config', newState)
    putConfig(omit(newState, ['activeWorkspace', 'activeRequest']))
  }

  console.log('exiting reducer', newState)
  return newState
}

const ConfigProvider = ({ children }) => {
  const [state: any, dispatch: Function] = useReducer(configReducer, { ...configTemplate, activeWorkspace: workspaceTemplate, activeRequest: requestTemplate })

  useEffect(() => {
    getConfig().then(payload => dispatch({ payload }))
  }, [])

  useEffect(() => {
    let workspace

    if (state.defaultWorkspace.length > 0) {
      workspace = state.workspaces.find(workspace => workspace.name === state.defaultWorkspace)
    } else if (state.workspaces.length > 0) {
      workspace = state.workspaces[0]
    } else {
      workspace = workspaceTemplate
    }

    state.activeWorkspace = workspace
    dispatch({ type: 'setActiveWorkspace', payload: workspace })

    let request

    if (workspace.defaultRequest.length > 0) {
      request = workspace.requests.find(request => request.name === workspace.defaultRequest)
    } else if (workspace.requests.length > 0) {
      request = workspace.requests[0]
    } else {
      request = requestTemplate
    }

    state.activeRequest = request

    dispatch({ type: 'setActiveRequest', payload: request })
  }, [state.defaultWorkspace, state.workspaces, state.activeWorkspace, state.activeRequest])

  console.log('provider state', state)

  return (
    <ConfigDispatchContext.Provider value={dispatch}>
      <ConfigContext.Provider value={state}>
        {children}
      </ConfigContext.Provider>
    </ConfigDispatchContext.Provider>
  )
}

export default ConfigProvider