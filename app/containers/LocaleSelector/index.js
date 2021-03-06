import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import LanguageSelector from 'components/LanguageSelector'
import LanguageIcon from '@material-ui/icons/Language'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { FormattedMessage } from 'react-intl'
import { changeLocale } from '../LanguageProvider/actions'
import { makeSelectLocale } from '../LanguageProvider/selectors'
import messages from './messages'

export class LocaleSelector extends React.PureComponent {
  state = {
    languageButton: null,
  }

  handleLanguageMenu = event => {
    this.setState({ languageButton: event.currentTarget })
  }

  handleLanguageClose = () => {
    this.setState({ languageButton: null })
  }

  render() {
    const { languageButton } = this.state
    const idSelector = 'language-menu'
    return (
      <React.Fragment>
        <Tooltip title={<FormattedMessage {...messages.changeLanguage} />} enterDelay={300}>
          <IconButton
            aria-owns={languageButton ? idSelector : undefined}
            aria-haspopup="true"
            onClick={this.handleLanguageMenu}
          >
            <LanguageIcon style={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
        <LanguageSelector
          id={idSelector}
          anchorEl={languageButton}
          value={this.props.locale}
          onClick={this.props.changeLocale}
          onClose={this.handleLanguageClose}
        />
      </React.Fragment>
    )
  }
}

LocaleSelector.propTypes = {
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
}

const mapStateToProps = createSelector(makeSelectLocale(), locale => ({ locale }))

export default connect(
  mapStateToProps,
  { changeLocale },
)(LocaleSelector)
