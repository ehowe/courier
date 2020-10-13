// @flow

import React, { useState } from 'react'

import type { Element } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

type PropsT = {
  className?: string,
  Element?: string,
  onDelete: Function,
  value: string,
}

function DeleteButton(props: PropsT): Element<'div'|'span'> {
  const {
    className,
    Element = 'div',
    onDelete,
    value,
  } = props

  const [open: boolean, setOpen: Function] = useState(false)

  function handleDelete(): void {
    setOpen(false)
    onDelete(value)
  }

  return (
    <Element className={className}>
      <Dialog
        open={open}
        keepMounted
        onClose={(): void => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Confirm Delete?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete <b>{value}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => setOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton color="primary" aria-label="delete" onClick={(): void => setOpen(true)} size="small">
        <RemoveCircleIcon fontSize="small"/>
      </IconButton>
    </Element>
  )
}

export default DeleteButton
