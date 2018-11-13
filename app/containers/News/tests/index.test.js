import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import News from '../index';
import messages from '../messages';

describe('<News />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(<News />);
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.header} />),
    ).toEqual(true);
  });
});
