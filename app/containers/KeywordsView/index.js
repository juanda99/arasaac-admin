import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, FormattedTime, FormattedDate } from 'react-intl'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import api from 'services'
import Button from '@material-ui/core/Button'

import { makeSelectHasUser } from './selectors'

import messages from './messages'

class KeywordsView extends React.PureComponent {
  state = {
    loading: false,
    error: '',
    keywords: [],
  }

  componentDidMount = () => {
    api.KEYWORDS_REQUEST(this.props.token).then(keywords => {
      if (keywords && keywords.length) {
        this.setState({ keywords })
      }
    })
  }

  componentDidUpdate() {
    // load Data
  }

  render() {
    const { loading } = this.props
    const { keywords } = this.state
    // const users = this.props.users.slice(0, 100)

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Language</TableCell>
            <TableCell>Number of keywords</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell>Generate keywords</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keywords.map(language => (
            <TableRow key={language}>
              <TableCell component="th" scope="row">
                {language.language}
              </TableCell>
              <TableCell component="th" scope="row">
                {language.keywords}
              </TableCell>
              <TableCell component="th" scope="row">
                <FormattedDate value={language.updated} /> <FormattedTime value={language.updated} />
              </TableCell>
              <TableCell component="th" scope="row">
                <Button size="small" variant="outlined" color="secondary">
                  Generate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}

KeywordsView.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  token: makeSelectHasUser()(state),
})

const withConnect = connect(mapStateToProps)

export default compose(withConnect)(injectIntl(KeywordsView))
