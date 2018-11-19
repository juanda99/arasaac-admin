/**
 *
 * LanguageSelector
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import messages from './messages'

const LanguageSelector = ({ id, anchorEl, intl, value, onClick, onClose }) => {
  const { formatMessage } = intl
  return (
    <Menu id={id} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem selected={value === 'ca'} onClick={() => onClick('ca')}>
        {`Català - ${formatMessage(messages.catalan)}`}
      </MenuItem>
      <MenuItem selected={value === 'de'} onClick={() => onClick('de')}>
        {`Deutsche - ${formatMessage(messages.german)}`}
      </MenuItem>
      <MenuItem selected={value === 'es'} onClick={() => onClick('es')}>
        {`Español - ${formatMessage(messages.spanish)}`}
      </MenuItem>
      <MenuItem selected={value === 'en'} onClick={() => onClick('en')}>
        {`English - ${formatMessage(messages.english)}`}
      </MenuItem>
      <MenuItem selected={value === 'eu'} onClick={() => onClick('eu')}>
        {`Euskal - ${formatMessage(messages.basque)}`}
      </MenuItem>
      <MenuItem selected={value === 'fr'} onClick={() => onClick('fr')}>
        {`Français - ${formatMessage(messages.french)}`}
      </MenuItem>
      <MenuItem selected={value === 'ga'} onClick={() => onClick('ga')}>
        {`Galego - ${formatMessage(messages.galician)}`}
      </MenuItem>
      <MenuItem selected={value === 'cr'} onClick={() => onClick('cr')}>
        {`Hrvatski - ${formatMessage(messages.croatian)}`}
      </MenuItem>
      <MenuItem selected={value === 'it'} onClick={() => onClick('it')}>
        {`Italiano - ${formatMessage(messages.italian)}`}
      </MenuItem>
      <MenuItem selected={value === 'bt'} onClick={() => onClick('bg')}>
        {`български - ${formatMessage(messages.bulgarian)}`}
      </MenuItem>
      <MenuItem selected={value === 'p'} onClick={() => onClick('pl')}>
        {`Polskie - ${formatMessage(messages.polish)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('pt')}>
        {`Português - ${formatMessage(messages.portuguese)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('br')}>
        {`Português do Brasil - ${formatMessage(messages.brazilian)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('ro')}>
        {`Română - ${formatMessage(messages.romanian)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('ru')}>
        {`Pусский - ${formatMessage(messages.russian)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('val')}>
        {`Valencia - ${formatMessage(messages.valencian)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('ara')}>
        {`عربى - ${formatMessage(messages.arabic)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('zhs')}>
        {`简体中文） - ${formatMessage(messages.chineseSimplified)}`}
      </MenuItem>
    </Menu>
  )
}

LanguageSelector.propTypes = {
  intl: intlShape.isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  value: PropTypes.string,
  id: PropTypes.string.isRequired,
  anchorEl: PropTypes.object,
}

export default injectIntl(LanguageSelector)
