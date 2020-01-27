import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import LinearProgress from '@material-ui/core/LinearProgress'
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import api from 'services'
import messages from './messages'

class TranslationStatus extends PureComponent {
  state = {
    pictogramsValidated: 0,
    totalPictograms: 0,
    arasaacPhrases: 0,
    adminPhrases: 0,
    arasaacTranslated: 0,
    adminTranslated: 0,
    statisticsAvailable: false,
    updated: null,
  }

  componentDidMount() {
    const { language, locale } = this.props
    // we use userLocale if given by props (ProfileView), otherwise locale
    this.updateData(language || locale)
  }

  componentDidUpdate(prevProps) {
    const { language, locale } = this.props
    if (prevProps.userLocale !== language) {
      // we use userLocale if given by props (ProfileView), otherwise locale
      this.updateData(language || locale)
    }
  }

  updateData = async language => {
    const { showProgressBar, hideProgressBar } = this.props
    showProgressBar()
    try {
      const translationData = await api.TRANSLATIONS_STATUS(language)
      const {
        pictogramsValidated,
        totalPictograms,
        arasaacPhrases,
        adminPhrases,
        arasaacTranslated,
        adminTranslated,
        updated,
      } = translationData
      this.setState({
        statisticsAvailable: true,
        pictogramsValidated,
        totalPictograms,
        arasaacPhrases,
        adminPhrases,
        arasaacTranslated,
        adminTranslated,
        updated,
      })
      hideProgressBar()
    } catch (error) {
      this.setState({ statisticsAvailable: false })
      hideProgressBar()
    }
  }

  render() {
    const {
      pictogramsValidated,
      totalPictograms,
      arasaacPhrases,
      adminPhrases,
      arasaacTranslated,
      adminTranslated,
      statisticsAvailable,
      updated,
    } = this.state
    const webTranslated = ((arasaacTranslated / arasaacPhrases) * 100).toFixed(2)
    const adminWebTranslated = ((adminTranslated / adminPhrases) * 100).toFixed(2)
    const pictosValidated = ((pictogramsValidated / totalPictograms) * 100).toFixed(2)
    const webTranslatedString = webTranslated.toString()
    const adminWebTranslatedString = adminWebTranslated.toString()
    const pictosValidatedString = pictosValidated.toString()

    return (
      <div>
        {statisticsAvailable ? (
          <div>
            <Typography variant="body1" style={{ marginBottom: '15px' }}>
              <em>
                <FormattedMessage {...messages.updatedInfo} /> <FormattedDate value={new Date(updated)} />{' '}
                <FormattedTime value={new Date(updated)} />
              </em>
            </Typography>

            <Typography variant="caption">
              <FormattedMessage
                {...messages.webTransStatus}
                values={{ webTranslatedString, arasaacTranslated, arasaacPhrases }}
              />
            </Typography>

            <LinearProgress
              style={{ height: '7px', maxWidth: '700px', marginBottom: '20px' }}
              variant="determinate"
              value={parseFloat(webTranslated)}
            />

            <Typography variant="caption">
              <FormattedMessage
                {...messages.adminWebTransStatus}
                values={{ adminWebTranslatedString, adminTranslated, adminPhrases }}
              />
            </Typography>
            <LinearProgress
              style={{ height: '7px', maxWidth: '700px', marginBottom: '20px' }}
              variant="determinate"
              value={parseFloat(adminWebTranslated)}
            />

            <Typography variant="caption">
              <FormattedMessage
                {...messages.pictosTransStatus}
                values={{ pictosValidatedString, totalPictograms, pictogramsValidated }}
              />
            </Typography>

            <LinearProgress
              style={{ height: '7px', maxWidth: '700px' }}
              variant="determinate"
              value={parseFloat(pictosValidated)}
            />
            <Typography variant="caption">
              <em>
                <FormattedMessage {...messages.pictosTransWarning} />
              </em>
            </Typography>
          </div>
        ) : (
            <Typography variant="body1">
              <FormattedMessage {...messages.noDataAvailable} />
            </Typography>
          )}
      </div>
    )
  }
}

TranslationStatus.propTypes = {
  showProgressBar: PropTypes.func.isRequired,
  hideProgressBar: PropTypes.func.isRequired,
  language: PropTypes.string,
  locale: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
})

const mapDispatchToProps = dispatch => ({
  showProgressBar: () => dispatch(showLoading()),
  hideProgressBar: () => dispatch(hideLoading()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslationStatus)
