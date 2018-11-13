import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import AddPictograms from '../index';
import messages from '../messages';

describe('<AddPictograms />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(<AddPictograms />);
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.header} />),
    ).toEqual(true);
  });
});
