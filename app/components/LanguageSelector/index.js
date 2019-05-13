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

// TODO: zh or zhs? ar or ara?

const LanguageSelector = ({ id, anchorEl, intl, value, onClick, onClose }) => {
  const { formatMessage } = intl
  return (
    <Menu id={id} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem selected={value === 'ca'} onClick={() => onClick('ca')}>
        {`Català - ${formatMessage(messages.ca)}`}
      </MenuItem>
      <MenuItem selected={value === 'de'} onClick={() => onClick('de')}>
        {`Deutsche - ${formatMessage(messages.de)}`}
      </MenuItem>
      <MenuItem selected={value === 'es'} onClick={() => onClick('es')}>
        {`Español - ${formatMessage(messages.es)}`}
      </MenuItem>
      <MenuItem selected={value === 'en'} onClick={() => onClick('en')}>
        {`English - ${formatMessage(messages.en)}`}
      </MenuItem>
      <MenuItem selected={value === 'eu'} onClick={() => onClick('eu')}>
        {`Euskal - ${formatMessage(messages.eu)}`}
      </MenuItem>
      <MenuItem selected={value === 'fr'} onClick={() => onClick('fr')}>
        {`Français - ${formatMessage(messages.fr)}`}
      </MenuItem>
      <MenuItem selected={value === 'ga'} onClick={() => onClick('ga')}>
        {`Galego - ${formatMessage(messages.gl)}`}
      </MenuItem>
      <MenuItem selected={value === 'cr'} onClick={() => onClick('cr')}>
        {`Hrvatski - ${formatMessage(messages.hr)}`}
      </MenuItem>
      <MenuItem selected={value === 'it'} onClick={() => onClick('it')}>
        {`Italiano - ${formatMessage(messages.it)}`}
      </MenuItem>
      <MenuItem selected={value === 'bt'} onClick={() => onClick('bg')}>
        {`български - ${formatMessage(messages.bg)}`}
      </MenuItem>
      <MenuItem selected={value === 'p'} onClick={() => onClick('pl')}>
        {`Polskie - ${formatMessage(messages.pl)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('pt')}>
        {`Português - ${formatMessage(messages.pt)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('br')}>
        {`Português do Brasil - ${formatMessage(messages.br)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('ro')}>
        {`Română - ${formatMessage(messages.ro)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('ru')}>
        {`Pусский - ${formatMessage(messages.ru)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('val')}>
        {`Valencia - ${formatMessage(messages.val)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('ara')}>
        {`عربى - ${formatMessage(messages.ar)}`}
      </MenuItem>
      <MenuItem selected={value === ''} onClick={() => onClick('zhs')}>
        {`简体中文） - ${formatMessage(messages.zh)}`}
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
