import React, { createContext, useEffect, useReducer } from 'react'

import axios from 'axios'

export const ConfigContext = createContext({})
export const ConfigDispatchContext = createContext(undefined)

const ConfigProvider = ({ children }) => {
  const [state: any, dispatch: Function] = useReducer(configReducer, {})

  function configReducer(state: any, action: { type?: string, payload: any, updateConfig?: boolean }): any {
    let newState

    switch (action.type) {
      case 'createNewWorkspace':
        newState = { ...state, workspaces: [...state.workspaces, { name: action.payload }] }
        break
      case 'setDefaultWorkspace':
        newState = { ...state, defaultWorkspace: action.payload }
        break
      default:
        newState = { ...state, ...action.payload }
    }

    if (action.updateConfig) {
      console.log(newState)
      putConfig(newState)
    }

    return newState
  }

  async function getConfig() {
    const response = await axios.get('http://localhost:2468/config')
    return response.data
  }

  async function putConfig(newConfig) {
    const response = await axios.put('http://localhost:2468/config', newConfig)
    return response.data
  }

  useEffect(() => {
    getConfig().then(payload => dispatch({ payload }))
  }, [])

  return (
    <ConfigContext.Provider value={state}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
