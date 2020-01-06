import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TextFieldStyledComponent = styled.div`
  display: block;
  margin: 5px 0 15px;

  label {
    display: block;
    margin: 0 0 6px;
  }

  input {
    width: 200px;
    border: 0;
    border-radius: 20px;
    background-color: #FFF;
    color: #000;
    line-height: 40px;
    height: 40px;
    padding: 0 25px;
    text-align: center;
  }
`;

function TextField(props) {
  const fieldId = Math.random().toString(36).substr(-10);
  const {
    value, label, placeholder, onChange,
  } = props;

  return (
    <TextFieldStyledComponent>
      { label ? (<label htmlFor={fieldId}>{label}</label>) : '' }
      <input type="text" id={fieldId} value={value} placeholder={placeholder} onChange={onChange} />
    </TextFieldStyledComponent>
  );
}
TextField.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};
TextField.defaultProps = {
  value: '',
  label: '',
  placeholder: '',
  onChange: () => {
    console.error('onChange not set');
  },
};

export default TextField;
