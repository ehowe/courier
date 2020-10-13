// @flow

import * as React from 'react'

import upperCase from 'lodash/upperCase'

import type { Element } from 'react'

import { ConfigContext, ConfigDispatchContext } from './ConfigProvider'
import { REQUESTS } from './Request'
import RequestLabel from './RequestLabel'

import { workspaceTemplate, requestTemplate } from '../configTemplate'
import DeleteButton from './DeleteButton'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

function Workspaces(): Element<typeof Paper> {
  const config = React.useContext(ConfigContext)
  const dispatchConfig = React.useContext(ConfigDispatchContext)

  const [createWorkspaceOpen: boolean, setCreateWorkspaceOpen: Function] = React.useState(false)
  const [createRequestOpen: boolean, setCreateRequestOpen: Function] = React.useState(false)
  const [workspaces, setWorkspaces] = React.useState([])
  const [defaultWorkspace, setDefaultWorkspace] = React.useState('')
  const [newWorkspaceName, setNewWorkspaceName] = React.useState('')
  const [newRequestName, setNewRequestName] = React.useState('')
  const [newRequestMethod, setNewRequestMethod] = React.useState(REQUESTS[0])
  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaceTemplate)
  const [activeRequest, setActiveRequest] = React.useState(requestTemplate)
  const [requests, setRequests] = React.useState([requestTemplate])

  React.useEffect(() => {
    const {
      activeWorkspace,
      defaultWorkspace,
      activeRequest,
      workspaces,
    } = config

    if (typeof workspaces === 'undefined') {
      setWorkspaces([])
    } else {
      setWorkspaces(config.workspaces)
    }

    if (typeof defaultWorkspace === 'undefined') {
      setDefaultWorkspace('')
    } else {
      setDefaultWorkspace(defaultWorkspace)
    }

    setActiveWorkspace(activeWorkspace)
    setActiveRequest(activeRequest)
    setRequests(activeWorkspace.requests)
  }, [config])

  function handleWorkspaceSelect(e) {
    if (e.target.value.length > 0) {
      dispatchConfig({ type: 'setDefaultWorkspace', payload: e.target.value, updateConfig: true })
    }
  }

  function createWorkspace() {
    dispatchConfig({ type: 'createNewWorkspace', payload: newWorkspaceName, updateConfig: true })
    setCreateWorkspaceOpen(false)
    dispatchConfig({ type: 'setDefaultWorkspace', payload: newWorkspaceName, updateConfig: true })
  }

  function createRequest() {
    dispatchConfig({ type: 'createNewRequest', payload: { name: newRequestName, method: newRequestMethod }, updateConfig: true })
    setCreateRequestOpen(false)
  }

  function deleteRequest(value: string): void {
    const [method, name] = value.split(/\s+/)

    dispatchConfig({ type: 'deleteRequest', payload: { name, method }, updateConfig: true })
  }

  function handleRequestSelect(name: string) {
    dispatchConfig({ type: 'setDefaultRequest', payload: name, updateConfig: true })
  }

  function newWorkspaceValid(): boolean {
    return workspaces.map(workspace => workspace.name).includes(newWorkspaceName)
  }

  function newRequestValid(): boolean {
    return activeWorkspace.requests.map(request => request.name).includes(newRequestName) && activeWorkspace.requests.map(request => request.method).includes(newRequestMethod)
  }

  return (
    <div style={{ height: '100%' }}>
      <Dialog open={createWorkspaceOpen} onClose={() => setCreateWorkspaceOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Workspace</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={newWorkspaceValid()}
            fullWidth
            helperText={newWorkspaceValid() && 'Name already taken'}
            label="Workspace Name"
            margin="dense"
            onChange={(e) => setNewWorkspaceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateWorkspaceOpen(false)} color="primary">
            Cancel
          </Button>
          <Button disabled={newWorkspaceValid()} onClick={createWorkspace} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createRequestOpen} onClose={() => setCreateRequestOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Request</DialogTitle>
        <DialogContent style={{ display: 'flex' }}>
          <TextField
            autoFocus
            error={newRequestValid()}
            helperText={newRequestValid() && 'Name already taken'}
            label="Request Name"
            onChange={(e) => setNewRequestName(e.target.value)}
          />
          <Select
            style={{ width: '100px' }}
            value={newRequestMethod}
            onChange={(e: SyntheticEvent<HTMLInputElement>): void => setNewRequestMethod(e.target.value)}
          >
            {REQUESTS.map((request: string): React.Element<'option'> => (
              <MenuItem key={request} value={request}>{upperCase(request)}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRequestOpen(false)} color="primary">
            Cancel
          </Button>
          <Button disabled={newRequestValid()} onClick={createRequest} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Paper className="Workspaces" style={{ height: '100%' }}>
        <Box style={{ height: '112px' }}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id="select-workspace-label">Workspace</InputLabel>
            <Select
              labelId="select-workspace-label"
              onChange={handleWorkspaceSelect}
              value={defaultWorkspace}
            >
              { workspaces.map((workspace, index) => (
                <MenuItem key={index} value={workspace.name}>{workspace.name}</MenuItem>
              ))}
              <MenuItem value="" onClick={() => setCreateWorkspaceOpen(true)}>Add workspace</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box style={{ height: 'calc(100% - 112px)' }}>
          <List>
            { requests.map((request, index) => (
              <ListItem button key={index} alignItems="flex-start" style={{ alignItems: 'center' }} selected={request.name === activeRequest.name}>
                <RequestLabel request={request.method} onClick={() => handleRequestSelect(request.name)}/>
                <ListItemText primary={request.name} onClick={() => handleRequestSelect(request.name)} style={{ marginRight: '1em' }}/>
                <DeleteButton onDelete={deleteRequest} value={request.method + ' ' + request.name}/>
              </ListItem>
            ))}
            <ListItem button alignItems="flex-start">
              <ListItemText primary="Add new request" onClick={() => setCreateRequestOpen(true)}/>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </div>
  )
}

export default Workspaces
