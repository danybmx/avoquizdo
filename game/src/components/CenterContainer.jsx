import styled from 'styled-components';
import PropTypes from 'prop-types';

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${(props) => props.direction};
  height: ${(props) => (props.fullHeight ? '100vh' : 'auto')};
`;
CenterContainer.propTypes = {
  direction: PropTypes.string,
  fullHeight: PropTypes.bool,
};
CenterContainer.defaultProps = {
  direction: 'column',
  fullHeight: false,
};

export default CenterContainer;
