import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@material-ui/core/TextField'
import styles from './styles'
import getSuggestions from './filter'

const renderInputComponent = inputProps => {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
}

const getSuggestionValue = suggestion => suggestion // could be an array of objectsç

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)
  return (
    <MenuItem selected={isHighlighted} component="div">
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

  handleChange = (event, { newValue }) => {
    this.setState({
      searchText: newValue,
      suggestions: getSuggestions(newValue, this.props.dataSource),
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

  handleClick = () => {
    this.props.onSubmit(this.state.searchText)
  }

  render() {
    const { classes } = this.props
    const { searchText } = this.state
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions.slice(0, 5),
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    }
    return (
      <div style={this.props.style}>
        <div style={{ display: 'flex', wrap: 'nowrap' }}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              classes,
              placeholder: 'prueba',
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
          {searchText ? (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
              <SearchIcon className={classes.icon} />
            </Button>
          ) : null}
        </div>
      </div>
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
}

export default withStyles(styles)(SearchField)
