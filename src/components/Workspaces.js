// @flow

import * as React from 'react'

import type { Element } from 'react'

import { ConfigContext, ConfigDispatchContext } from './ConfigProvider'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

function Workspaces(): Element<typeof Paper> {
  const config = React.useContext(ConfigContext)
  const dispatchConfig = React.useContext(ConfigDispatchContext)

  const [createWorkspaceOpen: boolean, setCreateWorkspaceOpen: Function] = React.useState(false)
  const [workspaces, setWorkspaces] = React.useState([])
  const [defaultWorkspace, setDefaultWorkspace] = React.useState('')
  const [newWorkspaceName, setNewWorkspaceName] = React.useState('')

  React.useEffect(() => {
    const {
      defaultWorkspace,
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
  }, [config])

  function handleWorkspaceSelect(e) {
    if (e.target.value.length > 0) {
      dispatchConfig({ type: 'setDefaultWorkspace', payload: e.target.value, updateConfig: true })
    }
  }

  function createWorkspace() {
    dispatchConfig({ type: 'createNewWorkspace', payload: newWorkspaceName, updateConfig: true })
    setCreateWorkspaceOpen(false)
    dispatchConfig({ type: 'setDefaultWorkspace', payload: newWorkspaceName })
  }

  function newWorkspaceValid(): boolean {
    return workspaces.map(workspace => workspace.name).includes(newWorkspaceName)
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

        </Box>
      </Paper>
    </div>
  )
}

export default Workspaces
