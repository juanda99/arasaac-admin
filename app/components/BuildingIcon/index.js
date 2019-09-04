import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import BuildingIcon from '@material-ui/icons/Autorenew'

import style from './styles'

class RotateBuildingIcon extends Component {
  render() {
    const { classes } = this.props
    console.log(classes)
    console.log(classes.icon)
    return <BuildingIcon className={classes.rotateIcon} />
  }
}
export default withStyles(style)(RotateBuildingIcon)
