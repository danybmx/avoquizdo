import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qr-svg';
import CenterContainer from './CenterContainer';
import Loader from './Loader';
import Title from './Title';
import Player from './Player';
import Button from './Button';
import Countdown from './Countdown';
import { gameStatus } from '../utils/constants';
import FadeIn from './FadeIn';
import GameQuestion from './GameQuestion';
import Copyright from './Copyright';
import music from '../resources/music.mp3';
import Music from './Music';
import { GAME_URL } from '../env';

function GameHostView({
  game, handleStart, handleNext,
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
    case gameStatus.CREATING:
      content = <Loader />;
      break;
    case gameStatus.READY:
      content = (
        <CenterContainer fullHeight>
          <Title>Te estamos esperando!</Title>
          <QRCode
            bgColor="aquamarine"
            fgColor="#000000"
            level="L"
            style={{ width: 200 }}
            value={`${GAME_URL}/play/${game.pin}`}
          />
          <div style={{ padding: 20, fontSize: '2.5em' }}>{GAME_URL}/play/{game.pin}</div>

          <CenterContainer direction="row">
            {game.players.map((p) => (
              <Player key={p}>{p}</Player>
            ))}
          </CenterContainer>
          <Button style={{ marginTop: 40 }} onClick={handleStart}>Empezar!</Button>
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
        <FadeIn>
          <CenterContainer fullHeight>
            <Title>Proxima pregunta en...</Title>
            <Countdown time={game.countdown} />
            <Title>Top</Title>
            <CenterContainer>
              {game.scores.map((s, i) => (
                <Player key={s.name}>{i + 1} {s.name} - {s.points}</Player>
              ))}
            </CenterContainer>
          </CenterContainer>
        </FadeIn>
      );
      break;
    case gameStatus.FINISHED:
      content = (
        <CenterContainer fullHeight>
          <Title>Finalistas</Title>
          <CenterContainer>
            {game.scores.slice(0, 3).map((s, i) => (
              <Player key={s.name}>{i + 1} {s.name} - {s.points}</Player>
            ))}
          </CenterContainer>
        </CenterContainer>
      );
      break;
    case gameStatus.QUESTION:
      content = (
        <GameQuestion
          question={game.question}
          answered={game.answered}
          answers={game.answers}
          players={game.players.length}
          handleNext={handleNext}
          host
        />
      );
      break;
    default:
  }

  return (
    <CenterContainer>
      {content}
      <Music src={music} />
      <Copyright>
        <a target="_blank" rel="noopener noreferrer" href="https://icons8.com/icons/set/play">Play</a>
        {' '}and <a target="_blank" rel="noopener noreferrer" href="https://icons8.com/icons/set/pause">Pause</a>
        {' '}icons by <a target="_blank" rel="noopener noreferrer" href="https://icons8.com/">Icons8</a> <span className="sep">|</span>
        {' '}Music by <a target="_blank" rel="noopener noreferrer" href="https://www.bensound.com">https://www.bensound.com</a>
      </Copyright>
    </CenterContainer>
  );
}

GameHostView.propTypes = {
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
  handleStart: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default GameHostView;
