import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import ClearIcon from '@material-ui/icons/Clear'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@material-ui/core/TextField'
import styles from './styles'
import getSuggestions from './filter'
import messages from './messages'

const getSuggestionValue = suggestion => suggestion // could be an array of objects

class SearchField extends Component {
  state = {
    searchText: this.props.value,
    suggestions: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ searchText: nextProps.value })
    }
  }

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const classes = this.props
    const matches = match(suggestion, query)
    const parts = parse(suggestion, matches)
    return (
      <MenuItem className={classes.menuItem} selected={isHighlighted} component="div">
        <div>
          {parts.map(
            (part, index) =>
              part.highlight ? (
                <span key={String(index)} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              ) : (
                <strong key={String(index)} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>
              ),
          )}
        </div>
      </MenuItem>
    )
  }

  renderInputComponent = inputProps => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps
    return (
      <TextField
        fullWidth
        variant="outlined"
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused,
          },
        }}
        InputProps={{
          inputRef: node => {
            ref(node)
            inputRef(node)
          },
          classes: {
            input: classes.input,
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline,
          },
          endAdornment: (
            <InputAdornment position="end">
              {this.state.searchText && (
                <div className={classes.searchButtons}>
                  <IconButton
                    className={classes.removeIcon}
                    aria-label="Toggle password visibility"
                    onClick={this.handleRemoveSearchText}
                  >
                    <ClearIcon />
                  </IconButton>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
                    <SearchIcon />
                  </Button>
                </div>
              )}
            </InputAdornment>
          ),
        }}
        {...other}
      />
    )
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      searchText: newValue,
    })
  }

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.props.onSubmit(this.state.searchText)
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.dataSource),
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  handleClick = () => this.props.onSubmit(this.state.searchText)

  handleRemoveSearchText = () => {
    this.setState({ searchText: '' })
  }

  render() {
    const { classes, intl } = this.props
    const { formatMessage } = intl
    const { searchText } = this.state
    const autosuggestProps = {
      renderInputComponent: this.renderInputComponent,
      suggestions: this.state.suggestions.slice(0, 10),
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion: this.renderSuggestion,
    }
    return (
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          placeholder: formatMessage(messages.search),
          value: searchText,
          onChange: this.handleChange,
          onKeyDown: this.onKeyDown,
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    )
  }
}

SearchField.defaultProps = {
  dataSource: [],
}

SearchField.propTypes = {
  dataSource: PropTypes.array,
  style: PropTypes.object,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
}

export default withStyles(styles)(injectIntl(SearchField))
