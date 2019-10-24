import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Div from 'components/Div'
import Button from '@material-ui/core/Button'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { FormattedMessage } from 'react-intl'
import blue from '@material-ui/core/colors/blue'
import GoogleLogin from './GoogleLogin'
import messages from './messages'
import FacebookIcon from './icons/FacebookIcon'

const styles = {
  facebookButton: {
    float: 'right',
    width: '100%',
    marginBottom: 10,
    top: -10,
    backgroundColor: blue[500],
    color: 'white',
  },
}

class SocialLogin extends PureComponent {
  /* eslint-disable no-console */
  responseFacebook = response => {
    // one we get facebook token we ask for our app token
    const token = response.accessToken
    this.props.onSuccess(token, 'facebook', this.props.locale)
  }

  success = response => {
    const token = response.accessToken
    this.props.onSuccess(token, 'google', this.props.locale)
  }

  error = response => {
    console.error(response)
  }

  render() {
    const { classes } = this.props
    return (
      <Div top={2}>
        <FacebookLogin
          appId="1687810071473822"
          autoLoad={false}
          fields="name,email,picture"
          callback={this.responseFacebook}
          render={renderProps => (
            <Button variant="contained" onClick={renderProps.onClick} className={classes.facebookButton}>
              <FacebookIcon />
              <FormattedMessage {...messages.facebook} />
            </Button>
          )}
        />
        <GoogleLogin
          clientId="856321241205-djlltqe6cpo9vm3hp392giboofdp44ha.apps.googleusercontent.com"
          onSuccess={this.success}
          onFailure={this.error}
          offline={false}
        />
      </Div>
    )
  }
}

SocialLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
}

export default withStyles(styles)(SocialLogin)
