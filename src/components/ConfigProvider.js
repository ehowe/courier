import React, { createContext, useEffect, useReducer } from 'react'

import axios from 'axios'
import omit from 'lodash/omit'

import { configTemplate, workspaceTemplate, requestTemplate, environmentTemplate } from '../configTemplate'

export const ConfigContext = createContext({})
export const PrivateConfigContext = createContext({})
export const ConfigDispatchContext = createContext(undefined)
export const PrivateConfigDispatchContext = createContext(undefined)

async function getConfig() {
  const response = await axios.get('http://localhost:2468/config')
  return response.data
}

async function getPrivateConfig() {
  const response = await axios.get('http://localhost:2468/privateConfig')
  return response.data
}

async function putConfig(newConfig) {
  const response = await axios.put('http://localhost:2468/config', newConfig)
  return response.data
}

async function putPrivateConfig(newConfig) {
  const response = await axios.put('http://localhost:2468/privateConfig', newConfig)
  return response.data
}

function getCurrentWorkspaceIndex(currentState: any): number {
  return currentState.workspaces.findIndex(workspace => workspace.name === currentState.activeWorkspace.name)
}

function getCurrentRequestIndex(currentState: any): number {
  const workspace = currentState.workspaces[getCurrentWorkspaceIndex(currentState)]
  return workspace.requests.findIndex(request => request.name === currentState.activeRequest.name && request.method === currentState.activeRequest.method)
}

function updateWorkspace(currentState: any, attribute: string, payload: any): any {
  const newState = { ...currentState }
  const attributes = { ...newState.activeWorkspace, [attribute]: payload }

  newState.workspaces[getCurrentWorkspaceIndex(currentState)] = attributes
  newState.activeWorkspace = attributes

  return newState
}

function updatePrivateWorkspace(publicState: any, currentState: any, attribute: string, payload: any): any {
  const newState = { ...currentState }
  const workspaceName = publicState.activeWorkspace.name

  if (!newState.workspaces) {
    newState.workspaces = []
  }

  let workspaceIndex = newState.workspaces.findIndex(workspace => workspace.name === workspaceName)

  if (workspaceIndex === -1) {
    newState.workspaces.push({
      name: workspaceName,
      environments: [],
    })

    workspaceIndex = newState.workspaces.findIndex(workspace => workspace.name === workspaceName)
  }

  const workspace = { ...newState.workspaces[workspaceIndex], [attribute]: payload }

  newState.workspaces[workspaceIndex] = workspace

  return newState
}

function updateRequest(currentState: any, attribute: string, payload: any): any {
  const workspace = { ...currentState.workspaces[getCurrentWorkspaceIndex(currentState)] }
  const requests = [...workspace.requests]
  requests[getCurrentRequestIndex(currentState)] = { ...currentState.activeRequest, [attribute]: payload }

  return updateWorkspace(currentState, 'requests', requests)
}

function addRequestToWorkspace(currentState: any, payload: { name: string, method: string }): any {
  const workspace = currentState.workspaces[getCurrentWorkspaceIndex(currentState)]

  const requests = [...workspace.requests, { ...requestTemplate, name: payload.name, method: payload.method }]

  const newState = updateWorkspace(currentState, 'defaultRequest', payload.name)
  return updateWorkspace(newState, 'requests', requests)
}

function removeRequestFromWorkspace(currentState: any, payload: { name: string, method: string }): any {
  const workspace = currentState.workspaces[getCurrentWorkspaceIndex(currentState)]
  const active = currentState.activeRequest.name === payload.name && currentState.activeRequest.method === payload.method
  const requests = workspace.requests.filter(request => !(request.name === payload.name && request.method === payload.method))

  let newState = updateWorkspace(currentState, 'requests', requests)

  if (active && requests.length > 0) {
    newState.activeRequest = requests[0]
    newState = updateWorkspace(newState, 'defaultRequest', newState.activeRequest.name)
  } else if (active && requests.length === 0) {
    newState = updateWorkspace(newState, 'defaultRequest', '')
  }

  return newState
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
      newState = addRequestToWorkspace(newState, action.payload)
      break
    case 'deleteRequest':
      newState = removeRequestFromWorkspace(newState, action.payload)
      break
    case 'setActiveEnvironment':
      newState = { ...newState, activeEnvironment: action.payload }
      break
    case 'setActiveRequest':
      newState = { ...newState, activeRequest: action.payload }
      break
    case 'setActiveWorkspace':
      newState = { ...newState, activeWorkspace: action.payload }
      break
    case 'setDefaultEnvironment':
      newState = updateWorkspace(newState, 'defaultEnvironment', action.payload)
      break
    case 'setDefaultRequest':
      newState = setDefaultRequest(newState, action.payload)
      break
    case 'setDefaultWorkspace':
      newState = { ...newState, defaultWorkspace: action.payload }
      break
    case 'setEnvironments':
      newState = updateWorkspace(newState, 'environments', action.payload)
      console.log(newState)
      break
    case 'updateRequestAuth':
      newState = updateRequest(newState, 'auth', action.payload)
      break
    case 'updateRequestAuthProvider':
      newState = updateRequest(newState, 'activeAuthProvider', action.payload)
      break
    case 'updateRequestBody':
      newState = updateRequest(newState, 'body', action.payload)
      break
    case 'updateRequestBodyType':
      newState = updateRequest(newState, 'bodyType', action.payload)
      break
    case 'updateRequestHeaders':
      newState = updateRequest(newState, 'headers', action.payload)
      break
    case 'updateRequestQueries':
      newState = updateRequest(newState, 'queries', action.payload)
      break
    case 'updateRequestResponse':
      newState = updateRequest(newState, 'response', action.payload)
      break
    case 'updateRequestUrl':
      newState = updateRequest(newState, 'url', action.payload)
      break
    case 'updateRequestMethod':
      newState = updateRequest(newState, 'method', action.payload)
      break
    default:
      newState = { ...newState, ...action.payload, activeWorkspace: workspaceTemplate, activeRequest: requestTemplate, activeEnvironment: environmentTemplate }
  }

  if (action.updateConfig) {
    putConfig(omit(newState, ['activeWorkspace', 'activeRequest']))
  }

  return newState
}

function privateConfigReducer(state: any, action: { type?: string, payload: any, updateConfig?: boolean, publicState: any }): any {
  let newState = { ...getPrivateConfig() }

  switch (action.type) {
    case 'setEnvironments':
      newState = updatePrivateWorkspace(action.publicState, newState, 'environments', action.payload)
      break
    default:
      newState = { ...newState, ...action.payload }
  }

  if (action.updateConfig) {
    putPrivateConfig(newState)
  }

  return newState
}

const ConfigProvider = ({ children }) => {
  const [state: any, dispatch: Function] = useReducer(configReducer, { ...configTemplate, activeWorkspace: workspaceTemplate, activeRequest: requestTemplate })
  const [privateState :any, dispatchPrivate: Function] = useReducer(privateConfigReducer, {})

  useEffect(() => {
    getConfig().then(payload => dispatch({ payload }))
  }, [])

  useEffect(() => {
    getPrivateConfig().then(payload => dispatchPrivate({ payload }))
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

    let environment

    if (workspace.defaultEnvironment.length > 0) {
      environment = workspace.environments.find(environment => environment.name === workspace.defaultEnvironment)
    } else if (workspace.environments.length > 0) {
      environment = environment.workspaces[0]
    } else {
      environment = environmentTemplate
    }

    dispatch({ type: 'setActiveEnvironment', payload: environment })

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
  }, [state.defaultWorkspace, state.workspaces, state.activeWorkspace, state.activeRequest, state.activeEnvironment])

  return (
    <ConfigDispatchContext.Provider value={dispatch}>
      <PrivateConfigDispatchContext.Provider value={dispatchPrivate}>
        <ConfigContext.Provider value={state}>
          <PrivateConfigContext.Provider value={privateState}>
            {children}
          </PrivateConfigContext.Provider>
        </ConfigContext.Provider>
      </PrivateConfigDispatchContext.Provider>
    </ConfigDispatchContext.Provider>
  )
}

export default ConfigProvider
