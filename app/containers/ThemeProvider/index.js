/*
 *
 * ThemeProvider
 *
 * this component connects the redux state theme to the
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { selectTheme } from 'containers/ThemeSelector/selectors'
import getTheme from './themes'

export class ThemeProvider extends React.PureComponent {
  render() {
    const theme = getTheme(this.props.theme)
    return <MuiThemeProvider theme={theme}>{React.Children.only(this.props.children)}</MuiThemeProvider>
  }
}

ThemeProvider.propTypes = {
  theme: PropTypes.string,
  children: PropTypes.element.isRequired,
}

const mapStateToProps = state => ({ theme: selectTheme(state) })

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeProvider)
