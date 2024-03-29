/**
 *
 * LanguageSelector
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { languages } from 'utils/index'
import messages from './messages'

const LanguageSelector = ({ id, anchorEl, intl, value, onClick, onClose }) => {
  const { formatMessage } = intl
  return (
    <Menu id={id} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {languages.map(language => (
        <MenuItem key={language.code} selected={value === language.code} onClick={() => onClick(language.code)}>
          {`${language.text} - ${formatMessage(messages[language.code])}`}
        </MenuItem>
      ))}
    </Menu>
  )
}

LanguageSelector.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  value: PropTypes.string,
  id: PropTypes.string.isRequired,
  anchorEl: PropTypes.object,
}

export default injectIntl(LanguageSelector)
