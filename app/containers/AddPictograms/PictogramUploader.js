import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from '@material-ui/core/Button'
import { useIntl } from 'react-intl'
import { useTheme } from '@material-ui/core/styles'
import messages from './messages'
import SvgPreview from './SvgPreview'

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
}

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 200,
  height: 200,
  padding: 4,
  boxSizing: 'border-box',
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
}

const PictogramUploader = ({ onSubmit }) => {
  const [files, setFiles] = useState([])
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/svg+xml',
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      )
      const oldFiles = files.map(file => file)
      const allFiles = [...oldFiles, ...newFiles]
      const uniqueFiles = removeDuplicates(allFiles, 'name')
      setFiles(uniqueFiles)
    },
  })

  const removeDuplicates = (array, key) => {
    const lookup = {}
    return array.filter(obj => {
      const isNewValue = !lookup[obj[key]]
      lookup[obj[key]] = true
      return isNewValue
    })
  }
  const handleDelete = fileName => {
    const newFiles = files.filter(file => file.name !== fileName)
    setFiles(newFiles)
    return false
  }

  const handleSend = event => {
    event.stopPropagation()
    onSubmit(files)
  }
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <SvgPreview file={file} onDelete={handleDelete} />
      </div>
    </div>
  ))

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview))
    },
    [files],
  )

  return (
    <>
      <section
        {...getRootProps()}
        style={{
          borderWidth: '2px',
          maxWidth: '850px',
          minHeight: '100px',
          borderStyle: 'dashed',
          borderColor: theme.palette.primary.main,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
        }}
      >
        <input {...getInputProps()} />
        <p style={{ margin: '20px', textAlign: 'center' }}>{formatMessage(messages.addFiles)}</p>
        <aside style={thumbsContainer}>{thumbs}</aside>
        {!!files.length && (
          <Button variant="contained" color="primary" style={{ margin: '20px' }} onClick={handleSend}>
            {formatMessage(messages.uploadPictograms)}
          </Button>
        )}
      </section>
    </>
  )
}

export default PictogramUploader
