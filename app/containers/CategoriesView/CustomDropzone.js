import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  dropzone: {
    width: '100%',
    maxWidth: '800px',
    minHeight: '150px',
    borderStyle: 'dashed',
    borderWidth: '2px',
    borderColor: 'red',
  },
}

class CustomDropzone extends Component {
  render() {
    const { classes } = this.props
    return (
      <Dropzone onDrop={acceptedFiles => this.props.handleFile(acceptedFiles[0])}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()} className={classes.dropzone}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop the excel file here with your translations</p>
            </div>
          </section>
        )}
      </Dropzone>
    )
  }
}

CustomDropzone.propTypes = {
  handleFile: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CustomDropzone)
