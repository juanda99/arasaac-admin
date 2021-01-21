/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react'
import { FormattedMessage } from 'react-intl'
import View from 'components/View'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import { makeSelectUserRole, makeSelectTargetLanguages } from 'containers/App/selectors'
import { makeSelectLocale } from 'containers/LanguageProvider/selectors'
import { Typography } from '@material-ui/core'
import TranslationStatus from 'containers/TranslationStatus'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { languages } from 'utils/index'
import langMessages from 'components/LanguageSelector/messages'
import { DOCS_URL } from 'services/config'
import ArchiveIcon from '@material-ui/icons/CloudDownload'
import messages from './messages'

/* eslint-disable react/prefer-stateless-function */
class HomeView extends React.PureComponent {
  state = {
    locale: this.props.locale,
  }

  handleLanguageChange = event => this.setState({ locale: event.target.value })

  render() {
    const { locale, role } = this.state
    const languageItems = languages.filter(language => language.code !== 'en')
    return (
      <View>
        <div style={{ marginBottom: '30px' }}>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button
              onClick={() => {
                this.props.history.push('pictograms/?tab=2')
              }}
            >
              <FormattedMessage {...messages.validate} />
            </Button>
            <Button
              onClick={() => {
                window.open('https://translate.arasaac.org', '_blank')
              }}
            >
              <FormattedMessage {...messages.translateArasaac} />
            </Button>
            <Button
              onClick={() => {
                window.open('https://translate.admin.arasaac.org', '_blank')
              }}
            >
              <FormattedMessage {...messages.translateAdmin} />
            </Button>
          </ButtonGroup>
        </div>

        <Typography color="primary" variant="h5">
          <FormattedMessage {...messages.translationStatus} />
        </Typography>
        <Select
          style={{ width: '300px', marginBottom: '20px', marginTop: '30px' }}
          value={locale}
          onChange={this.handleLanguageChange}
        >
          {languageItems.map(language => (
            <MenuItem key={language.code} value={language.code}>
              <FormattedMessage {...langMessages[language.code]} />
            </MenuItem>
          ))}
        </Select>
        <TranslationStatus language={locale} />
        <div style={{ marginTop: '30px' }}>
          <Typography color="primary" variant="h5">
            <FormattedMessage {...messages.translatorDocs} />
          </Typography>

          <TableContainer component={Paper} style={{ maxWidth: '950px', marginTop: '20px' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage {...messages.documentation} />
                  </TableCell>
                  <TableCell align="right">
                    <FormattedMessage {...langMessages.en} />
                  </TableCell>
                  <TableCell align="right">
                    <FormattedMessage {...langMessages.es} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key="pictosRow">
                  <TableCell component="th" scope="row">
                    <FormattedMessage {...messages.pictosTranslation} />
                  </TableCell>
                  <TableCell align="right">
                    <a href={`${DOCS_URL}/PICTOGRAMS_TRANSLATOR_MANUAL_EN.pdf`} target="_blank">
                      <IconButton aria-label="download" color="secondary">
                        <ArchiveIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <a href={`${DOCS_URL}/MANUAL_TRADUCTOR_PICTOGRAMAS_ES.pdf`} target="_blank">
                      <IconButton aria-label="download" color="secondary">
                        <ArchiveIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow key="webRow">
                  <TableCell component="th" scope="row">
                    <FormattedMessage {...messages.webTranslation} />
                  </TableCell>
                  <TableCell align="right">
                    <a href={`${DOCS_URL}/WEB_TRANSLATOR_MANUAL_EN.pdf`} target="_blank">
                      <IconButton aria-label="download" color="secondary">
                        <ArchiveIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <a href={`${DOCS_URL}/MANUAL_TRADUCTOR_WEB_ES.pdf`} target="_blank">
                      <IconButton aria-label="download" color="secondary">
                        <ArchiveIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow key="webRow">
                  <TableCell component="th" scope="row">
                    <FormattedMessage {...messages.categoryTreeTranslation} />
                  </TableCell>
                  <TableCell align="right">
                    <a href={`${DOCS_URL}/CATEGORY_TREE_TRANSLATOR_MANUAL_EN.pdf`} target="_blank">
                      <IconButton aria-label="download" color="secondary">
                        <ArchiveIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <a href={`${DOCS_URL}/MANUAL_TRADUCTOR_ARBOL_CATEGORIAS_ES.pdf`} target="_blank">
                      <IconButton aria-label="download" color="secondary">
                        <ArchiveIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  locale: makeSelectLocale()(state),
  targetLanguages: makeSelectTargetLanguages()(state),
  role: makeSelectUserRole()(state),
})

const withConnect = connect(mapStateToProps)

export default withConnect(withRouter(HomeView))
