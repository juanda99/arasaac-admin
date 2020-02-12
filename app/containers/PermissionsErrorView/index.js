/*
 *
 * LoginView
 *
 */

import React from 'react'
import View from 'components/View'
import { FormattedMessage } from 'react-intl'
import { PICTOGRAMS_URL } from 'services/config'
import messages from './messages'

const PermissionsErrorView = () => (
  <View>
    <h2>{<FormattedMessage {...messages.forbidden} />}</h2>
    <img src={`${PICTOGRAMS_URL}/9022/9022_300.png`} alt="Forbidden" />
  </View>
)

export default PermissionsErrorView
