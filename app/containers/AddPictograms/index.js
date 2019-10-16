import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import View from 'components/View'
import api from 'services'
import PictogramUploader from './PictogramUploader'
import styles from './styles'

class AddPictogramsView extends React.PureComponent {
  state = { loaded: false, error: '' }

  handleUpload = async files => {
    try {
      await api.PICTOGRAMS_UPLOAD_REQUEST(files)
      this.setState({ error: '', loaded: true })
    } catch (e) {
      this.setState({ error: e.message, loaded: false })
    }
  }

  render() {
    const { loaded, error } = this.state
    return (
      <View>
        {error && <p>{error}</p>}
        {loaded && <p>Se han subido correctamente los ficheross</p>}
        {!loaded && <PictogramUploader onSubmit={this.handleUpload} />}
      </View>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddPictogramsView)
