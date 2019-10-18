import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { FormattedMessage } from 'react-intl'
import { LIGHT_THEME, DARK_THEME } from './constants'
import LightbulbFullIcon from './LightbulbFull'
import LightbulbOutlineIcon from './LightbulbOutline'
import { changeTheme } from './actions'
import { selectTheme } from './selectors'
import messages from './messages'

export class ThemeSelector extends React.PureComponent {
  render() {
    return (
      <Tooltip title={<FormattedMessage {...messages.toggleTheme} />} enterDelay={300}>
        {this.props.theme === LIGHT_THEME ? (
          <IconButton
            aria-label={<FormattedMessage {...messages.toggleTheme} />}
            onClick={() => this.props.changeTheme(DARK_THEME)}
          >
            <LightbulbFullIcon style={{ color: 'white' }} />
          </IconButton>
        ) : (
          <IconButton
            aria-label={<FormattedMessage {...messages.toggleTheme} />}
            onClick={() => this.props.changeTheme(LIGHT_THEME)}
          >
            <LightbulbOutlineIcon style={{ color: 'white' }} />
          </IconButton>
        )}
      </Tooltip>
    )
  }
}

ThemeSelector.propTypes = {
  changeTheme: PropTypes.func,
  theme: PropTypes.string,
}

const mapStateToProps = state => ({ theme: selectTheme(state) })

export default connect(
  mapStateToProps,
  { changeTheme },
)(ThemeSelector)
