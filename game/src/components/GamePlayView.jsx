import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CenterContainer from './CenterContainer';
import Title from './Title';
import Button from './Button';
import Countdown from './Countdown';
import { gameStatus } from '../utils/constants';
import FadeIn from './FadeIn';
import GameQuestion from './GameQuestion';

function GamePlayView({
  game, handleAnswer,
}) {
  let content = '';
  switch (game.status) {
    case gameStatus.ERROR:
      content = (
        <CenterContainer fullHeight>
          <Title>Ha ocurrido un error</Title>
          <p>{game.error}</p>
          <Link to="/"><Button>Volver</Button></Link>
        </CenterContainer>
      );
      break;
    case gameStatus.WAITING:
      content = (
        <CenterContainer fullHeight>
          <Title>Esperando a otros jugadores</Title>
        </CenterContainer>
      );
      break;
    case gameStatus.STARTING:
      content = (
        <CenterContainer fullHeight>
          <Title>Empezando en...</Title>
          <Countdown time={game.countdown} />
        </CenterContainer>
      );
      break;
    case gameStatus.RESUME:
      content = (
        <CenterContainer fullHeight>
          <Title>Proxima pregunta en...</Title>
          <Countdown time={game.countdown} />
        </CenterContainer>
      );
      break;
    case gameStatus.FINISHED:
      content = (
        <CenterContainer fullHeight>
          <Title>FIN!!</Title>
        </CenterContainer>
      );
      break;
    case gameStatus.QUESTION:
      content = (
        <GameQuestion
          question={game.question}
          answered={game.answered}
          answers={game.answers}
          handleAnswer={handleAnswer}
        />
      );
      break;
    default:
  }

  return (
    <CenterContainer>
      <FadeIn>
        {content}
      </FadeIn>
    </CenterContainer>
  );
}

GamePlayView.propTypes = {
  game: PropTypes.shape({
    status: PropTypes.string,
    pin: PropTypes.string,
    error: PropTypes.string,
    players: PropTypes.arrayOf(String),
    countdown: PropTypes.number,
    scores: PropTypes.arrayOf(Object),
    question: PropTypes.string,
    answers: PropTypes.arrayOf(String),
    answered: PropTypes.number,
  }).isRequired,
  handleAnswer: PropTypes.func.isRequired,
};

export default GamePlayView;
