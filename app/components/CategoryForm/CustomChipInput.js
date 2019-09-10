import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChipInput from 'material-ui-chip-input'

class CustomChipInput extends Component {
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
    const { input, dataSource } = this.props
    const chips = input.value || []
    if (dataSource) {
      return (
        <ChipInput
          {...this.props}
          dataSource={dataSource}
          dataSourceConfig={{ text: 'key', value: 'tag' }}
          value={chips}
          onAdd={this.handleRequestAdd}
          onDelete={this.handleRequestDelete}
        />
      )
    }
    return <ChipInput {...this.props} value={chips} onAdd={this.handleRequestAdd} onDelete={this.handleRequestDelete} />
  }
}

CustomChipInput.propTypes = {
  input: PropTypes.object.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object.isRequired),
}

export default CustomChipInput
