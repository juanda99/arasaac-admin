import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { PICTOGRAMS_URL } from 'services/config'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { FormattedMessage } from 'react-intl'
import LanguageIcon from '@material-ui/icons/Language'
import LanguageSelector from 'components/LanguageSelector'
import messages from 'containers/LocaleSelector/messages'
import Chip from '@material-ui/core/Chip'
import ConditionalPaper from './ConditionalPaper'
import styles from './styles'

const white = '#ffffff'
const blue = '#2196f3'
const yellow = '#ffeb3b'
const orange = '#ff9800'
const pink = '#FDA1FF'
const green = '#4caf50'
const colorSet = [yellow, orange, green, blue, pink, white]

const getColor = type => (type >= 0 && type < 7 ? colorSet[type - 1] : '')

// order matters! word type for frame and background color in picto editor

class Pictogram extends PureComponent {
  static propTypes = {
    pictogram: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onChangeKeywordsLocale: PropTypes.func.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.object.isRequireds),
  }

  state = {
    languageButton: null,
  }

  handleLanguageMenu = event => {
    this.setState({ languageButton: event.currentTarget })
  }

  handleLocaleChange = locale => {
    this.setState({ languageButton: null })
    this.props.onChangeKeywordsLocale(locale)
  }

  handleLanguageClose = () => {
    this.setState({ languageButton: null })
  }

  render() {
    const { pictogram, classes, keywords } = this.props
    const { idPictogram } = pictogram
    const { languageButton } = this.state
    const idSelector = 'keywords-language'

    return (
      <div className={classes.pictoWrapper}>
        <ConditionalPaper>
          <img
            className={classes.pictogram}
            src={`${PICTOGRAMS_URL}/${idPictogram}/${idPictogram}_300.png`}
            alt="Pictograms"
          />
        </ConditionalPaper>
        <div id="keywords-language">
          <Tooltip title={<FormattedMessage {...messages.changeLanguage} />} enterDelay={300}>
            <IconButton
              aria-owns={languageButton ? idSelector : undefined}
              aria-haspopup="true"
              onClick={this.handleLanguageMenu}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <LanguageSelector
            id={idSelector}
            anchorEl={languageButton}
            value={this.props.locale}
            onClick={this.handleLocaleChange}
            onClose={this.handleLanguageClose}
          />
          {keywords.length ? (
            <>
              {keywords.map(keyword => {
                const color = getColor(keyword.type)
                return (
                  keyword.keyword && (
                    <Chip label={keyword.keyword} key={keyword.keyword} style={{ backgroundColor: color }} />
                  )
                )
              })}
            </>
          ) : (
            <span>No keywords found!</span>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Pictogram)
