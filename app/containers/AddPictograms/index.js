import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import View from 'components/View'
import Preview from './Preview'
import styles from './styles'

class AddPictogramsView extends React.PureComponent {
  render() {
    return (
      <View>
        <Preview />
      </View>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AddPictogramsView)
