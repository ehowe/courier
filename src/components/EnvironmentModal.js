import React, { useContext, useEffect, useState } from 'react'

import classNames from 'classnames'

import type { Element } from 'react'

import type { EnvironmentT } from '../types'

import EnvironmentModalEdit from './EnvironmentModalEdit'
import { environmentTemplate } from '../configTemplate'

import {
  ConfigContext,
  ConfigDispatchContext,
  PrivateConfigDispatchContext,
} from './ConfigProvider'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import LockIcon from '@material-ui/icons/Lock'

type PropsT = {
  open: boolean,
  setOpen: Function,
  environments: Array<EnvironmentT>,
}

type TabPanelPropsT = {
  index: number,
  children?: React.Node,
  private: boolean,
}

function EnvironmentModal(props: PropsT): Element<typeof Dialog> {
  const {
    publicEnvironments: publicEnvironmentsProp = [],
    privateEnvironments: privateEnvironmentsProp = [],
    open: openProp = false,
    setOpen: setOpenProp,
  } = props

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [publicEnvironments, setPublicEnvironments] = useState(publicEnvironmentsProp)
  const [privateEnvironments, setPrivateEnvironments] = useState(privateEnvironmentsProp)
  const [allEnvironments, setAllEnvironments] = useState([...publicEnvironmentsProp, ...privateEnvironmentsProp])

  const config = useContext(ConfigContext)
  // const privateConfig = useContext(PrivateConfigContext)
  const dispatchConfig = useContext(ConfigDispatchContext)
  const dispatchPrivateConfig = useContext(PrivateConfigDispatchContext)

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  useEffect(() => {
    setPublicEnvironments(publicEnvironmentsProp)
  }, [publicEnvironmentsProp])

  useEffect(() => {
    setPrivateEnvironments(privateEnvironmentsProp)
  }, [privateEnvironmentsProp])

  useEffect(() => {
    setAllEnvironments([...publicEnvironmentsProp, ...privateEnvironmentsProp])
  }, [publicEnvironmentsProp, privateEnvironmentsProp])

  function newEnvironmentName(props: { private: boolean }): string {
    let name = props.private ? 'New Private Environment' : 'New Environment'
    const environments = props.private ? privateEnvironments : publicEnvironments

    const count = environments.filter(e => e.name.match(/New.*Environment/)).length

    if (count > 0) {
      name = `${name} (${count})`
    }

    return name
  }

  function createEnvironment(): void {
    const newEnvironments = [...publicEnvironments, { ...environmentTemplate, name: newEnvironmentName({ private: false }) }]

    dispatchConfig({ type: 'setEnvironments', payload: newEnvironments, updateConfig: true })
  }

  function createPrivateEnvironment() {
    const newEnvironments = [...privateEnvironments, { ...environmentTemplate, name: newEnvironmentName({ private: true }), private: true }]

    dispatchPrivateConfig({ type: 'setEnvironments', payload: newEnvironments, publicState: config, updateConfig: true })
  }

  const TabPanel = (props: TabPanelPropsT): Element<'div'> => {
    const { index, children } = props

    return (
      <div
        hidden={index !== active}
        role="tabpanel"
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
      >
        {active === index && (
          <Box p={3} style={{ textAlign: 'right' }}>
            {children}
          </Box>
        )}
      </div>
    )
  }

  const Label = (props: { private: boolean, name: string }): Element<'div'> => (
    <div>
      { props.private && <LockIcon fontSize="inherit" style={{ paddingRight: '1em' }} /> }
      { props.name }
    </div>
  )

  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title" fullWidth maxWidth="lg">
      <DialogTitle id="form-dialog-title">Manage Environments</DialogTitle>
      <DialogContent>
        <Container className="EnvironmentsModal" disableGutters maxWidth={false}>
          <Grid container spacing={2}>
            <Grid item md={3} style={{ textAlign: 'right' }}>
              <Button onClick={createEnvironment}>Create Environment</Button>
              <Button onClick={createPrivateEnvironment}>Create Private Environment</Button>
              <Divider />
              <Tabs
                aria-label="Public Environments"
                orientation="vertical"
                value={active}
                variant="scrollable"
                style={{ float: 'right' }}
              >
                { allEnvironments.map((environment: any, index: number): Element<typeof Tab> => (
                  <Tab
                    className={classNames('environmentModal', { tabMissing: environment.missing })}
                    component="div"
                    key={index}
                    label={<Label name={environment.name} private={environment.private} />}
                    onClick={(): void => setActive(index)}
                    value={index}
                  />
                ))}
              </Tabs>
            </Grid>
            <Grid item md={9}>
              { allEnvironments.map((environment: EnvironmentT, index: number): Element<typeof TabPanel> => (
                <TabPanel value={environment.name} index={index} key={index} private={environment.private}>
                  { environment.private ? (
                    <EnvironmentModalEdit environment={environment} allEnvironments={privateEnvironments} />
                  ) : (
                    <EnvironmentModalEdit environment={environment} allEnvironments={publicEnvironments} />
                  )}
                </TabPanel>
              ))}
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenProp(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={createEnvironment} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EnvironmentModal
