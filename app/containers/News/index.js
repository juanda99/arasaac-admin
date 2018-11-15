/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export default class News extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus ipsam
          mollitia, excepturi incidunt impedit, a nulla voluptatibus ducimus ad,
          quasi labore consectetur expedita? Consequuntur eaque natus eum
          dolore, unde eius.
        </p>
      </div>
    );
  }
}
