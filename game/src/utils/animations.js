/* eslint-disable import/prefer-default-export */
import { keyframes } from 'styled-components';

export const countdown = keyframes`
  from {
    transform: scale3d(1.4, 1.4, 1.4) rotate(0deg);
  }

  25% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(10deg);
  }

  to {
    transform: scale3d(1, 1, 1) rotate(0deg);
  }
`;

export const question = keyframes`
  from {
    transform: scale3d(1.4, 1.4, 1.4);
    opacity: 0;
  }
  to {
    transform: scale3d(1, 1, 1);
    opacity: 1;
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
