import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import { useIntl } from 'react-intl'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import messages from './messages'

export default function ErrorDialog({ onClose, title, message }) {
  const { formatMessage } = useIntl()

  const handleClose = () => onClose()

  return (
    <div>
      <Dialog
        open
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            {formatMessage(messages.accept)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ErrorDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
}
