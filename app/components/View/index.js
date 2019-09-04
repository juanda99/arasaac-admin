import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

const View = ({ children, classes }) => <div className={classes.root}>{children}</div>

View.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(View)
