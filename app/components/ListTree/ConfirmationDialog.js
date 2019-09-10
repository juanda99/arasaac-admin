import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

class ConfirmationDialog extends React.Component {
  handleCancel = () => {
    this.props.onClose(false)
  }

  handleOk = () => {
    this.props.onClose(true)
  }

  render() {
    const { open, ...other } = this.props

    return (
      <Dialog aria-labelledby="confirmation-dialog-title" {...other} open={open}>
        <DialogTitle id="confirmation-dialog-title">
          <FormattedMessage {...messages.confirmationTitle} />
        </DialogTitle>
        <DialogContent>
          <p>
            <FormattedMessage {...messages.confirmationText} />
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            <FormattedMessage {...messages.cancelButton} />
          </Button>
          <Button onClick={this.handleOk} color="primary">
            <FormattedMessage {...messages.okButton} />
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

export default ConfirmationDialog
