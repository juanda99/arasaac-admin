import React from 'react'
import View from 'components/View'
import { FormattedMessage } from 'react-intl'
import api from 'services'
import PictogramUploader from 'components/PictogramUploader'
import messages from './messages'

class AddPictogramsView extends React.PureComponent {
  state = { loaded: false, error: false }

  handleUpload = async files => {
    try {
      await api.PICTOGRAMS_UPLOAD_REQUEST(files)
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

export default AddPictogramsView
