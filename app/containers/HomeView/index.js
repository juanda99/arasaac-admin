/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react'
import { FormattedMessage } from 'react-intl'
import View from 'components/View'
import { connect } from 'react-redux'
import { makeSelectUserRole, makeSelectTargetLanguages } from 'containers/App/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import { Typography } from '@material-ui/core'
import TranslationStatus from 'containers/TranslationStatus'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { languages } from 'utils/index'
import langMessages from 'components/LanguageSelector/messages'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */
class HomeView extends React.PureComponent {
  state = {
    locale: this.props.locale,
  }

  handleLanguageChange = event => this.setState({ locale: event.target.value })

  render() {
    const { locale, role } = this.state
    const languageItems = languages.filter(language => language.code !== 'en')
    return (
      <View>
        <Typography color="primary" variant="h3">
          <FormattedMessage {...messages.translationStatus} />
        </Typography>
        <Select
          style={{ width: '300px', marginBottom: '20px', marginTop: '30px' }}
          value={locale}
          onChange={this.handleLanguageChange}
        >
          {languageItems.map(language => (
            <MenuItem key={language.code} value={language.code}>
              <FormattedMessage {...langMessages[language.code]} />
            </MenuItem>
          ))}
        </Select>
        <TranslationStatus language={locale} />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
  targetLanguages: makeSelectTargetLanguages()(state),
  role: makeSelectUserRole()(state),
})

const withConnect = connect(mapStateToProps)

export default withConnect(HomeView)
