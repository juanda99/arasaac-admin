import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { selectTheme } from 'containers/ThemeSelector/selectors'
import getTheme from './themes'

// eslint-disable-next-line react/prefer-stateless-function
export class ThemeProvider extends React.Component {
  render() {
    const theme = getTheme(this.props.theme, this.props.direction)
    return <MuiThemeProvider theme={theme}>{React.Children.only(this.props.children)}</MuiThemeProvider>
  }
}

ThemeProvider.propTypes = {
  theme: PropTypes.string,
  children: PropTypes.element.isRequired,
  direction: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({ theme: selectTheme(state), direction: state.getIn(['language', 'direction']) })

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeProvider)
