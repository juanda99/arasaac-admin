import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { PICTOGRAMS_URL } from 'services/config'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import DeleteIcon from '@material-ui/icons/Delete'
import { FormattedMessage } from 'react-intl'
import LanguageIcon from '@material-ui/icons/Language'
import LanguageSelector from 'components/LanguageSelector'
import messages from 'containers/LocaleSelector/messages'
import ConfirmationDialog from 'components/ConfirmationDialog'
import Chip from '@material-ui/core/Chip'
import ConditionalPaper from './ConditionalPaper'
import ownMessages from './messages'
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
    keywords: PropTypes.arrayOf(PropTypes.object.isRequired),
    onDelete: PropTypes.func.isRequired,
    onBeforeDelete: PropTypes.func.isRequired,
    confirmationBoxOpen: PropTypes.bool.isRequired,
    canDelete: PropTypes.bool.isRequired,
    pictograms: PropTypes.array,
  }

  state = {
    languageButton: null,
  }

  handleDelete = accept => this.props.onDelete(accept)

  handleClickDelete = () => this.props.onBeforeDelete()

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

  handleClick = idPictogram => {
    const { pictograms, history } = this.props
    history.push(`/pictograms/${idPictogram}`, { pictograms })
  }

  render() {
    const { pictogram, classes, keywords, canDelete, confirmationBoxOpen, theme, pictograms } = this.props
    const { _id } = pictogram
    const { languageButton } = this.state
    const idSelector = 'keywords-language'
    const currentItem = pictograms ? pictograms.indexOf(_id) + 1 : null
    const totalItems = pictograms ? pictograms.length : 0

    return (
      <div className={classes.pictoWrapper}>
        <ConfirmationDialog
          onClose={this.handleDelete}
          open={confirmationBoxOpen}
          confirmationTitle={<FormattedMessage {...ownMessages.confirmationTitle} />}
          confirmationInfoText={<FormattedMessage {...ownMessages.confirmationInfoText} />}
        />
        <ConditionalPaper style={{ position: 'relative' }}>
          {pictograms && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.palette.accent1Color,
              }}
            >
              <IconButton
                disabled={currentItem === 1}
                aria-label="previous"
                onClick={() => this.handleClick(pictograms[currentItem - 2])}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <div>
                {' '}
                <FormattedMessage {...ownMessages.pictogramPosition} values={{ currentItem, totalItems }} />
              </div>
              <IconButton
                disabled={currentItem === totalItems}
                aria-label="next"
                onClick={() => this.handleClick(pictograms[currentItem])}
              >
                <NavigateNextIcon />
              </IconButton>
            </div>
          )}
          <img className={classes.pictogram} src={`${PICTOGRAMS_URL}/${_id}/${_id}_300.png`} alt="Pictograms" />
          {canDelete && (
            <Tooltip title={<FormattedMessage {...ownMessages.deletePictogram} />} enterDelay={300}>
              <IconButton onClick={this.handleClickDelete} style={{ position: 'absolute', bottom: 10, left: 230 }}>
                <DeleteIcon color="primary" style={{ fontSize: 40 }} />
              </IconButton>
            </Tooltip>
          )}
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
                const style = { backgroundColor: color, color: 'white', marginRight: '2px' }
                if (color === white || color === yellow) style.color = 'black'
                return (
                  keyword.keyword && (
                    <Chip variant="outlined" label={keyword.keyword} key={keyword.keyword} style={style} />
                  )
                )
              })}
            </>
          ) : (
            <span>{<FormattedMessage {...ownMessages.noKeywords} />}</span>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Pictogram))
