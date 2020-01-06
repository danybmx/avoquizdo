import styled from 'styled-components';

const Button = styled.button`
  border: 0;
  border-radius: 20px;
  background-color: #000;
  color: #FFF;
  line-height: 40px;
  height: 40px;
  padding: 0 25px;
  text-transform: uppercase;

  &:hover {
    background-color: #FFF;
    color: #000;
    cursor: pointer;
  }
`;

export default Button;
