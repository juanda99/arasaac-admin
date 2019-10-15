import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Preview from './Preview'
import styles from './styles'

class AddPictogramsView extends React.PureComponent {
  render() {
    return <Preview />
  }
}

export default withStyles(styles, { withTheme: true })(AddPictogramsView)
