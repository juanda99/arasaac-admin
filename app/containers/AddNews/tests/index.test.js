import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import AddNews from '../index';
import messages from '../messages';

describe('<AddNews />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(<AddNews />);
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.header} />),
    ).toEqual(true);
  });
});
