import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { countdown } from '../utils/animations';
import FadeIn from './FadeIn';

const CountdownStyledComponent = styled.div`
  font-size: 12em;
  font-weight: bold;
  color: white;
  margin: 15px 0;
  text-shadow: 0 0 4px rgba(0, 0, 0, .4);
  text-align: center;
  animation: ${countdown} 1s ease-out 0s infinite;
`;

function Countdown(props) {
  const { time } = props;
  const [currentTime, setCurrentTime] = useState(time);

  if (currentTime > 1000) {
    setTimeout(() => {
      setCurrentTime(currentTime - 1000);
    }, 1000);
  }

  function getSeconds() {
    return Math.round(currentTime / 1000);
  }

  return (
    <FadeIn>
      <CountdownStyledComponent>
        { getSeconds() }
      </CountdownStyledComponent>
    </FadeIn>
  );
}
Countdown.propTypes = {
  time: PropTypes.number.isRequired,
};

export default Countdown;
