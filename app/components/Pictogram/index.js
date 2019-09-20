import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { PICTOGRAMS_URL } from 'services/config'
import ConditionalPaper from './ConditionalPaper'
import styles from './styles'

class Pictogram extends PureComponent {
  static propTypes = {
    pictogram: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { pictogram, classes } = this.props
    const { idPictogram } = pictogram

    return (
      <div className={classes.pictoWrapper}>
        <ConditionalPaper>
          <img
            className={classes.pictogram}
            src={`${PICTOGRAMS_URL}/${idPictogram}/${idPictogram}_300.png`}
            alt="Pictograms"
          />
        </ConditionalPaper>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Pictogram)
