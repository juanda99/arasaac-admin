import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PICTOGRAMS_URL } from 'services/config'
import { keywordSelector } from 'utils'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Item from './Item'
import styles from './styles'

class PictogramSnippet extends PureComponent {
  state = {
    zDepth: 1,
  }

  handleMouseEnter = () => {
    this.setState({
      zDepth: 3,
    })
  }

  handleMouseLeave = () => {
    this.setState({
      zDepth: 1,
    })
  }

  render() {
    const {
      pictogram: { _id, keywords },
      searchText,
      classes,
      pictograms,
    } = this.props
    const { keyword } = keywordSelector(searchText, keywords)
    return (
      <li
        style={{ margin: 5, width: '250px', height: '250px' }}
        key={_id}
        className="image-element-class"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Paper className={classes.paper} elevation={this.state.zDepth}>
          <Item url={`/pictograms/${_id}/${keyword}`} pictograms={pictograms}>
            <div style={{ position: 'relative' }}>
              <img className={classes.image} src={`${PICTOGRAMS_URL}/${_id}/${_id}_300.png`} alt={keyword} />
              <div className={classes.cardActions}>
                <p className={classes.cardTitle}>{keyword}</p>
              </div>
            </div>
          </Item>
        </Paper>
      </li>
    )
  }
}

PictogramSnippet.propTypes = {
  pictogram: PropTypes.object.isRequired,
  pictograms: PropTypes.array.isRequired,
  searchText: PropTypes.string,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(PictogramSnippet)
