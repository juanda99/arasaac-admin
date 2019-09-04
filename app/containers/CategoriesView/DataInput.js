/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/

import React from 'react'

export default class DataInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    const files = e.target.files
    if (files && files[0]) this.props.handleFile(files[0])
  }

  render() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <label htmlFor="file">Spreadsheet</label>
          <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
        </div>
      </form>
    )
  }
}

/* list of supported file types */
const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(x => `.${x}`)
  .join(',')
