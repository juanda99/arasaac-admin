import React from 'react'
import { connect } from 'react-redux'
import View from 'components/View'
import Button from '@material-ui/core/Button'
import { FormattedMessage } from 'react-intl'
import api from 'services'
import { makeSelectHasUser } from 'containers/UsersView/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import PictogramUploader from 'components/PictogramUploader'
import messages from './messages'

class AddPictogramsView extends React.PureComponent {
  state = { loaded: false, error: false }

  handleUpload = async files => {
    const { token } = this.props
    try {
      await api.PICTOGRAMS_UPLOAD_REQUEST(files, token)
      this.setState({ error: '', loaded: true })
    } catch (e) {
      console.log(e)
      this.setState({ error: true, loaded: false })
    }
  }

  handleClick = () => {
    this.setState({ error: false, loaded: false })
  }

  render() {
    const { loaded, error } = this.state
    return (
      <View>
        {error && (
          <p>
            <FormattedMessage {...messages.errorUploading} />
          </p>
        )}
        {loaded && (
          <div>
            <p>
              <FormattedMessage {...messages.successUploading} />
            </p>

            <Button onClick={this.handleClick} variant="contained" color="primary">
              <FormattedMessage {...messages.uploadMoreFiles} />
            </Button>
          </div>
        )}
        {!loaded && <PictogramUploader onSubmit={this.handleUpload} />}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
  token: makeSelectHasUser()(state),
})

export default connect(mapStateToProps)(AddPictogramsView)
