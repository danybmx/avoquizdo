import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import Title from '../components/Title';
import Button from '../components/Button';
import CenterContainer from '../components/CenterContainer';
import TextField from '../components/TextField';

const GameSelectStyledComponent = styled(CenterContainer)`
  height: 100vh;
`;

function GameSelect({ join }) {
  const history = useHistory();
  const { pin } = useParams();
  const [quizID, setQuizID] = useState('');
  const [gamePin, setGamePin] = useState('');
  const [nickname, setNickname] = useState('');

  function handleQuizIDChange(e) {
    setQuizID(e.target.value);
  }

  function handleGamePinChange(e) {
    setGamePin(e.target.value);
  }

  function handleNicknameChange(e) {
    setNickname(e.target.value);
  }

  function handleCreate() {
    if (quizID) {
      history.push(`/host/${quizID}`);
    }
  }

  function handlePlay() {
    if (gamePin && nickname) {
      history.push(`/play/${gamePin}/${nickname}`);
    }
  }

  useEffect(() => {
    setGamePin(pin);
  }, [pin]);

  return (
    <GameSelectStyledComponent>
      { !join ? (
        <div>
          <Title>Crear una nueva partida</Title>
          <CenterContainer>
            <TextField placeholder="Quiz" value={quizID} onChange={handleQuizIDChange} />
            <Button onClick={handleCreate}>Crear</Button>
          </CenterContainer>
        </div>
      ) : ''}
      <Title>Unirse a una partida</Title>
      <CenterContainer>
        <TextField placeholder="PIN" value={gamePin} onChange={handleGamePinChange} />
        <TextField placeholder="Nickname" value={nickname} onChange={handleNicknameChange} />
        <Button onClick={handlePlay}>Jugar</Button>
      </CenterContainer>
    </GameSelectStyledComponent>
  );
}

GameSelect.propTypes = {
  join: PropTypes.bool,
};
GameSelect.defaultProps = {
  join: false,
};

export default GameSelect;
