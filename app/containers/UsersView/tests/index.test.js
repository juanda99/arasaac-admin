import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import Users from '../index';
import messages from '../messages';

describe('<Users />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(<Users />);
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.header} />),
    ).toEqual(true);
  });
});
