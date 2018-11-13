import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import Pictograms from '../index';
import messages from '../messages';

describe('<Pictograms />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(<Pictograms />);
    expect(
      renderedComponent.contains(<FormattedMessage {...messages.header} />),
    ).toEqual(true);
  });
});
