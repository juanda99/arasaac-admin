import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export default class Users extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore
          magnam repudiandae enim ducimus nihil excepturi cum dolorum nulla
          officia assumenda voluptates doloremque, ipsum vero impedit officiis
          soluta similique explicabo a!
        </p>
      </div>
    );
  }
}
