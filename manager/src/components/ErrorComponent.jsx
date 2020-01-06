import React from 'react';
import PropTypes from 'prop-types';

function ErrorComponent({ title }) {
  return (<div role="alert">{title}</div>);
}
ErrorComponent.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ErrorComponent;
