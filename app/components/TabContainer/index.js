import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const TabContainer = props => (
  <Typography component="div" style={{ padding: 8 * 3 }}>
    {props.children}
  </Typography>
)

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TabContainer
