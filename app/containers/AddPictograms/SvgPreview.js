import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
}

const SvgPreview = ({ file, onDelete }) => {
  const [elevation, setElevation] = useState(1)
  return (
    <Paper
      square
      style={{ padding: '30px', position: 'relative' }}
      elevation={elevation}
      onMouseEnter={() => {
        setElevation(3)
      }}
      onMouseLeave={() => {
        setElevation(1)
      }}
    >
      <img src={file.preview} style={img} />
      {elevation === 3 && (
        <IconButton
          aria-label="delete"
          style={{ position: 'absolute', right: '0px', top: '0px' }}
          onClick={() => onDelete(file.name)}
        >
          <DeleteIcon fontSize="large" color="secondary" />
        </IconButton>
      )}
    </Paper>
  )
}

SvgPreview.propTypes = {
  file: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default SvgPreview
