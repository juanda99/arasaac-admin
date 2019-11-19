import React from 'react'
import { connect } from 'react-redux'
import View from 'components/View'
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

  render() {
    const { loaded, error } = this.state
    return (
      <View>
        {error && (
          <p>
            <FormattedMessage {...messages.errorUploading} />
          </p>
        )}
        {loaded && <p>Se han subido correctamente los ficheross</p>}
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
