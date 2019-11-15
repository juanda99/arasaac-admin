import React from 'react'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Div from 'components/Div'
import messages from './messages'

const styles = theme => ({
  separator: {
    textAlign: 'center',
    paddingTop: 20,
    clear: 'both',
  },
  separatorText: {
    display: 'inlineBlock',
    padding: 4,
    position: 'relative',
    /* theme.palette.background acts as inherit and is no well rendered */
    backgroundColor: theme.palette.type === 'light' ? 'white' : '#424242',
  },
  separatorLine: {
    marginTop: '-10px',
  },
})

const Separator = ({ classes }) => (
  <Div className={classes.separator}>
    <span className={classes.separatorText}>{<FormattedMessage {...messages.or} />}</span>
    <hr className={classes.separatorLine} />
  </Div>
)

export default withStyles(styles, { withTheme: true })(Separator)
