import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChipInputSource from 'material-ui-chip-input'

class ChipInput extends Component {
  handleRequestAdd = chip => {
    const { value, onChange } = this.props.input
    let chips = value || []
    const duplicated = false
    // if its already present, we don't add it
    // const duplicated = chips.some(item => item.text === chip.text)
    // if its already entered, we don't put it again
    if (!duplicated) {
      chips = [...chips, chip]
      onChange(chips)
    }
  }

  handleRequestDelete = deletedChip => {
    const { value, onChange } = this.props.input
    let chips = value || []
    chips = chips.filter(c => c !== deletedChip)
    onChange(chips)
  }

  render() {
    const { input } = this.props
    const chips = input.value || []
    return (
      <ChipInputSource
        fullWidth
        {...this.props}
        value={chips}
        onAdd={this.handleRequestAdd}
        onDelete={this.handleRequestDelete}
      />
    )
  }
}

ChipInput.propTypes = {
  input: PropTypes.object.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object.isRequired),
}

export default ChipInput
