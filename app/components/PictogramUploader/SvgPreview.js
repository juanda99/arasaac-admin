import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

const img = {
  display: 'block',
  width: '100%',
  height: 'auto',
}

const SvgPreview = ({ file, onDelete }) => {
  const [elevation, setElevation] = useState(1)

  const handleOnDelete = fileName => onDelete(fileName)

  // stopPropagation inside iconButton does not work :-(
  const handleDelete = event => event.stopPropagation()

  return (
    <Paper
      square
      style={{ padding: '30px', position: 'relative', width: '100%' }}
      elevation={elevation}
      onMouseEnter={() => {
        setElevation(3)
      }}
      onMouseLeave={() => {
        setElevation(1)
      }}
      onClick={handleDelete}
    >
      <img src={file.preview} style={img} />
      {elevation === 3 && (
        <IconButton
          aria-label="delete"
          style={{ position: 'absolute', right: '0px', top: '0px' }}
          onClick={() => handleOnDelete(file.name)}
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
