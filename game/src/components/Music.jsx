import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import play from '../resources/play.png';
import pause from '../resources/pause.png';
import TextButton from './TextButton';

const MusicStyledComponent = styled.div`
  position: fixed;
  top: 15px;
  left: 15px;
`;

function Music({ src }) {
  const [playing, setPlaying] = useState(true);
  const player = useRef();

  const handleToggle = () => {
    if (player.current.paused) {
      setPlaying(true);
      player.current.play();
    } else {
      setPlaying(false);
      player.current.pause();
    }
  };

  const icon = playing ? pause : play;

  return (
    <MusicStyledComponent>
      <audio loop autoPlay src={src} ref={(ref) => { player.current = ref; }} />
      <TextButton onClick={handleToggle}>
        <img src={icon} style={{ with: 48, height: 48 }} alt="Play/Pause" />
      </TextButton>
    </MusicStyledComponent>
  );
}
Music.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Music;
