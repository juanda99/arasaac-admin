import React from 'react'
import { FormattedMessage } from 'react-intl'
import { shallow } from 'enzyme'

import User from '../index'
import messages from '../messages'

describe('<User />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(<User />)
    expect(renderedComponent.contains(<FormattedMessage {...messages.header} />)).toEqual(true)
  })
})
