import React from 'react';
import loader from 'svg-loaders/svg-css-loaders/hearts.svg';
import CenterContainer from './CenterContainer';

function Loader() {
  return (
    <CenterContainer fullHeight>
      <img alt="Loading..." src={loader} />
    </CenterContainer>
  );
}

export default Loader;
