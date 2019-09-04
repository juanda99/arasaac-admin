import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'
import messages from './messages'

class AlertWindow extends PureComponent {
  state = {
    open: true,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    const { url, router } = this.props
    this.props.onReset()
    this.setState({ open: false })
    if (url) router.push('/marca.es')
  }

  render() {
    // const actions = [
    //   <FlatButton label={<FormattedMessage {...messages.ok} />} primary keyboardFocused onClick={this.handleClose} />,
    // ]
    // const { title, desc, onSolution, onSolutionText } = this.props

    // if (onSolution) {
    //   actions.unshift(<FlatButton label={onSolutionText} onClick={onSolution} />)
    // }
    const { title, desc, onSolution, onSolutionText } = this.props
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{desc}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {onSolution && (
            <Button onClick={onSolution} color="primary">
              {onSolutionText}
            </Button>
          )}
          <Button onClick={this.handleClose} color="primary" autoFocus>
            {<FormattedMessage {...messages.ok} />}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

AlertWindow.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  url: PropTypes.string,
  router: PropTypes.any.isRequired,
  onSolution: PropTypes.func,
  onSolutionText: PropTypes.string,
}

export default withRouter(AlertWindow)
